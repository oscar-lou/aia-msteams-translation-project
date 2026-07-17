require("dotenv").config();
const fs = require("fs");
const path = require("path");

// --- Config ------------------------------------------------------------
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const OUTPUT_FILE = path.join(__dirname, "results.md");
const CACHE_FILE = path.join(__dirname, ".translations-cache.json");

function buildBatchSystemPrompt() {
  const script = (process.env.CHINESE_SCRIPT || "Traditional").trim();
  return (
    `You are a professional translator for a corporate Microsoft Teams workspace ` +
    `where colleagues write in both Chinese and English. ` +
    `You will receive several numbered messages, each wrapped like:\n` +
    `[[[1]]]\n<message text>\n[[[/1]]]\n\n` +
    `For EACH numbered message, independently: detect its language. If it is any form ` +
    `of Chinese — Mandarin or Cantonese, Simplified or Traditional, formal or colloquial, ` +
    `including messages that mix Chinese and English — translate it into natural, ` +
    `professional English. If it is in English, translate it into Standard Written ` +
    `Chinese using ${script} characters. ` +
    `Preserve the original tone and register per message: keep formal messages formal ` +
    `and casual messages casual, but always produce clear, workplace-appropriate output. ` +
    `Translate slang, abbreviations, and idioms by their intended meaning — never ` +
    `word-for-word. Preserve names, @mentions, numbers, URLs, and product names exactly. ` +
    `Treat every numbered message completely independently — do not let one message's ` +
    `content or context influence another's translation.\n\n` +
    `Respond with ONLY the translations, each wrapped in the SAME numbered markers as ` +
    `the input, in the same order, with no extra commentary:\n` +
    `[[[1]]]\n<translation of message 1>\n[[[/1]]]\n[[[2]]]\n<translation of message 2>\n[[[/2]]]\n...`
  );
}

function parseBatchResponse(rawText, count) {
  const results = new Array(count).fill(null);
  for (let i = 1; i <= count; i++) {
    const re = new RegExp(`\\[\\[\\[${i}\\]\\]\\]\\s*([\\s\\S]*?)\\s*\\[\\[\\[/${i}\\]\\]\\]`);
    const match = rawText.match(re);
    results[i - 1] = match ? match[1].trim() : null;
  }
  return results;
}

// Shared by every batch-capable engine below (OpenAI-compatible or not), so
// the [[[n]]] wrapping never forks between providers.
function buildBatchUserContent(msgs) {
  return msgs.map((m, i) => `[[[${i + 1}]]]\n${m.text}\n[[[/${i + 1}]]]`).join("\n\n");
}

// --- OpenAI-compatible batch engines (Qwen, DeepSeek, ...) --------------
// Fully provider-agnostic: only base URL, key, and model name differ between
// providers, so this one function serves all of them — no forking. Reuses
// buildBatchSystemPrompt()/buildBatchUserContent()/parseBatchResponse() as-is,
// and keeps genuine multi-message batching since each provider's *_MODELS can
// list several models, each requiring its own full pass over every message.
async function translateBatchOpenAICompatible(msgs, baseUrl, apiKey, model) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const userContent = buildBatchUserContent(msgs);

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: buildBatchSystemPrompt() },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
    }),
  });
  if (!resp.ok) {
    throw new Error(`${model} API ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error(`${model} returned no choices: ${JSON.stringify(data)}`);
  }
  const rawText = choice.message?.content || "";
  return parseBatchResponse(rawText, msgs.length);
}

// --- Gemini (optional engine, for private/VPN validation only) ----------
// Gemini's request/response shape is NOT OpenAI-compatible (systemInstruction/
// contents/parts, not messages/choices), so it needs its own function — but it
// shares buildBatchSystemPrompt()/buildBatchUserContent()/parseBatchResponse()
// with every other engine, for a fair apples-to-apples comparison.
async function translateBatchGemini(msgs, apiKey, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userContent = buildBatchUserContent(msgs);

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildBatchSystemPrompt() }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gemini (${model}) API ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error(`Gemini (${model}) returned no candidate: ${JSON.stringify(data)}`);
  }
  const parts = candidate.content?.parts;
  if (!parts || !parts.length) {
    // Empty parts commonly means a safety-filter block — report per-batch
    // rather than crashing the run.
    throw new Error(
      `Gemini (${model}) returned an empty response (finishReason: ${candidate.finishReason || "unknown"})`
    );
  }
  const rawText = parts.map((p) => p.text || "").join("");
  return parseBatchResponse(rawText, msgs.length);
}

// --- DeepL (optional second engine, for side-by-side comparison) -------
const CJK_RE = /[一-鿿㐀-䶿]/;

// DeepL has no per-message auto language-detection prompt like the batch engine
// above, so direction is decided here from the input script instead.
function isChineseText(text) {
  return CJK_RE.test(text);
}

async function translateWithDeepL(text, targetLang) {
  if (!process.env.DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY is not set.");
  }
  const resp = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [text], target_lang: targetLang }),
  });
  if (!resp.ok) {
    throw new Error(`DeepL API ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const translation = data.translations?.[0];
  if (!translation) {
    throw new Error(`DeepL returned no translation: ${JSON.stringify(data)}`);
  }
  return translation.text;
}

// --- Azure OpenAI (optional engine) -------------------------------------
// Reuses the exact same batch prompt/parser the engines above use, just run
// as a "batch of one" — so translation instructions never fork per engine.
function azureOpenAIErrorReason(status) {
  switch (status) {
    case 401:
      return "invalid API key";
    case 403:
      return "access forbidden (check resource region/permissions)";
    case 404:
      return "deployment not found (check AZURE_OPENAI_DEPLOYMENT and endpoint)";
    case 429:
      return "rate limit or quota exceeded";
    default:
      return `HTTP ${status}`;
  }
}

async function translateWithAzureOpenAI(text) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
  if (!endpoint || !apiKey || !deployment) {
    throw new Error("Azure OpenAI is not fully configured.");
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const userContent = `[[[1]]]\n${text}\n[[[/1]]]`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: buildBatchSystemPrompt() },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
    }),
  });
  if (!resp.ok) {
    const reason = azureOpenAIErrorReason(resp.status);
    throw new Error(`Azure OpenAI ${reason}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error(`Azure OpenAI returned no choices: ${JSON.stringify(data)}`);
  }
  const rawText = choice.message?.content || "";
  const [translation] = parseBatchResponse(rawText, 1);
  if (translation === null) {
    throw new Error("Azure OpenAI response could not be parsed for the expected marker format.");
  }
  return translation;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Runs one batch-capable engine (Qwen, DeepSeek, Gemini, ...) across all of
// its configured models. translateFn(batch, model) does the actual API call —
// everything else (batching, caching, per-model error isolation) is shared,
// so this logic isn't duplicated per provider regardless of request shape.
async function runBatchEnginePass({
  rows,
  cache,
  cacheKey,
  models,
  batchSize,
  label,
  translateFn,
}) {
  for (const model of models) {
    const pendingForModel = [];
    for (const row of rows) {
      const cached = cache[row.id];
      const cachedTranslation =
        cached && cached.text === row.text && cached[cacheKey] && cached[cacheKey][model];
      row[cacheKey] = row[cacheKey] || {};
      if (cachedTranslation) {
        row[cacheKey][model] = { translation: cachedTranslation, error: null };
      } else {
        pendingForModel.push(row);
      }
    }

    const modelBatches = chunk(pendingForModel, batchSize);
    console.log(
      `\nRunning ${label} (${model}) on ${pendingForModel.length} message(s) in ` +
        `${modelBatches.length} batch(es) of up to ${batchSize} ` +
        `(${rows.length - pendingForModel.length} cached)...`
    );
    for (let b = 0; b < modelBatches.length; b++) {
      const batch = modelBatches[b];
      process.stdout.write(
        `- Batch ${b + 1}/${modelBatches.length} (${batch.map((r) => r.id).join(", ")})... `
      );
      try {
        const translations = await translateFn(batch, model);
        console.log("done");
        batch.forEach((row, i) => {
          const t = translations[i];
          if (t === null) {
            row[cacheKey][model] = {
              translation: null,
              error: "Could not parse this message's translation out of the batch response.",
            };
          } else {
            row[cacheKey][model] = { translation: t, error: null };
            cache[row.id] = {
              ...(cache[row.id] || {}),
              text: row.text,
              [cacheKey]: { ...((cache[row.id] || {})[cacheKey] || {}), [model]: t },
            };
          }
        });
      } catch (err) {
        console.log("FAILED");
        batch.forEach((row) => {
          row[cacheKey][model] = { translation: null, error: String(err.message || err) };
        });
      }
      if (b < modelBatches.length - 1) await sleep(2000);
    }
  }
}

async function main() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    console.error(`Missing ${MESSAGES_FILE}. Create it first (see messages.json example).`);
    process.exit(1);
  }

  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
  if (!Array.isArray(messages) || messages.length === 0) {
    console.error("messages.json is empty. Add at least one message to test.");
    process.exit(1);
  }

  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  }

  // BATCH_SIZE messages per API call, to conserve quota — shared by every
  // batch-capable engine below (each *_MODELS/model entry gets its own full
  // pass of batches).
  const batchSize = Math.max(1, parseInt(process.env.BATCH_SIZE || "4", 10));

  const rows = messages.map((m) => ({ ...m }));

  // --- DeepL pass (optional engine) ----------------------------------------
  // Skipped entirely, with existing translation results untouched, if no key is set.
  // Chinese -> English input only needs one DeepL target (EN-US). English ->
  // Chinese input is tested against BOTH ZH-HANT (Traditional, standard written
  // Chinese) and YUE (Cantonese) so the two registers can be compared directly.
  const deeplEnabled = !!process.env.DEEPL_API_KEY;
  if (deeplEnabled) {
    console.log(`\nRunning ${rows.length} message(s) through DeepL...`);
    for (const row of rows) {
      const cached = cache[row.id];
      const cacheHit = cached && cached.text === row.text ? cached : null;

      if (isChineseText(row.text)) {
        if (cacheHit && cacheHit.deepl_translation) {
          row.deepl_translation = cacheHit.deepl_translation;
        } else {
          try {
            row.deepl_translation = await translateWithDeepL(row.text, "EN-US");
            cache[row.id] = { ...(cache[row.id] || {}), text: row.text, deepl_translation: row.deepl_translation };
          } catch (err) {
            row.deepl_error = String(err.message || err);
          }
          await sleep(300);
        }
      } else {
        if (cacheHit && cacheHit.deepl_zh_hant) {
          row.deepl_zh_hant = cacheHit.deepl_zh_hant;
        } else {
          try {
            row.deepl_zh_hant = await translateWithDeepL(row.text, "ZH-HANT");
            cache[row.id] = { ...(cache[row.id] || {}), text: row.text, deepl_zh_hant: row.deepl_zh_hant };
          } catch (err) {
            row.deepl_zh_hant_error = String(err.message || err);
          }
          await sleep(300);
        }

        if (cacheHit && cacheHit.deepl_yue) {
          row.deepl_yue = cacheHit.deepl_yue;
        } else {
          try {
            row.deepl_yue = await translateWithDeepL(row.text, "YUE");
            cache[row.id] = { ...(cache[row.id] || {}), text: row.text, deepl_yue: row.deepl_yue };
          } catch (err) {
            row.deepl_yue_error = String(err.message || err);
          }
          await sleep(300);
        }
      }
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log("\nDEEPL_API_KEY not set — skipping the DeepL column.");
  }

  // --- Azure OpenAI pass (optional engine) ---------------------------------
  // Skipped entirely, with existing Qwen/DeepL results untouched, if the
  // resource isn't fully configured. Uses the same buildBatchSystemPrompt()
  // instructions as the Qwen engine, so it's a fair like-for-like comparison.
  const azureEnabled = !!(
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_OPENAI_API_KEY &&
    process.env.AZURE_OPENAI_DEPLOYMENT
  );
  if (azureEnabled) {
    console.log(`\nRunning ${rows.length} message(s) through Azure OpenAI...`);
    for (const row of rows) {
      const cached = cache[row.id];
      const cacheHit = cached && cached.text === row.text ? cached : null;

      if (cacheHit && cacheHit.azure_openai_translation) {
        row.azure_openai_translation = cacheHit.azure_openai_translation;
        continue;
      }
      try {
        row.azure_openai_translation = await translateWithAzureOpenAI(row.text);
        cache[row.id] = {
          ...(cache[row.id] || {}),
          text: row.text,
          azure_openai_translation: row.azure_openai_translation,
        };
      } catch (err) {
        row.azure_openai_error = String(err.message || err);
      }
      await sleep(300);
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log(
      "\nAzure OpenAI env vars not fully set — skipping the Azure OpenAI column."
    );
  }

  // --- Qwen pass (via Alibaba Cloud Model Studio) --------------------------
  // Commented out — Qwen access currently returns AccessDenied.Unpurchased
  // for both models tried. Uncomment once model access is activated in the
  // Model Studio console.
  // // Skipped entirely, with existing DeepL/Azure OpenAI results untouched, if
  // // not fully configured. QWEN_MODELS is comma-separated; each model gets its
  // // own full batched pass and its own column, cached independently so a
  // // failure on one model doesn't affect another's cached results.
  // const qwenModels = (process.env.QWEN_MODELS || "")
  //   .split(",")
  //   .map((s) => s.trim())
  //   .filter(Boolean);
  // const qwenEnabled = !!(
  //   process.env.QWEN_API_KEY &&
  //   process.env.QWEN_BASE_URL &&
  //   qwenModels.length
  // );
  // if (qwenEnabled) {
  //   await runBatchEnginePass({
  //     rows,
  //     cache,
  //     cacheKey: "qwen",
  //     models: qwenModels,
  //     batchSize,
  //     label: "Qwen",
  //     translateFn: (batch, model) =>
  //       translateBatchOpenAICompatible(batch, process.env.QWEN_BASE_URL, process.env.QWEN_API_KEY, model),
  //   });
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  // } else {
  //   console.log(
  //     "\nQWEN_API_KEY/QWEN_BASE_URL/QWEN_MODELS not fully set — skipping Qwen columns."
  //   );
  // }
  const qwenEnabled = false;

  // --- DeepSeek pass --------------------------------------------------------
  // Commented out — DeepSeek currently returns Insufficient Balance. Uncomment
  // once the account has balance/an active free-trial grant.
  // // Skipped entirely, with existing DeepL/Azure OpenAI/Qwen results untouched,
  // // if not fully configured. Same shape as the Qwen pass above (comma-separated
  // // *_MODELS, one column per model) since both share translateBatchOpenAICompatible.
  // const deepseekModels = (process.env.DEEPSEEK_MODELS || "deepseek-v4-flash")
  //   .split(",")
  //   .map((s) => s.trim())
  //   .filter(Boolean);
  // const deepseekEnabled = !!(
  //   process.env.DEEPSEEK_API_KEY &&
  //   process.env.DEEPSEEK_BASE_URL &&
  //   deepseekModels.length
  // );
  // if (deepseekEnabled) {
  //   await runBatchEnginePass({
  //     rows,
  //     cache,
  //     cacheKey: "deepseek",
  //     models: deepseekModels,
  //     batchSize,
  //     label: "DeepSeek",
  //     translateFn: (batch, model) =>
  //       translateBatchOpenAICompatible(batch, process.env.DEEPSEEK_BASE_URL, process.env.DEEPSEEK_API_KEY, model),
  //   });
  //   fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  // } else {
  //   console.log(
  //     "\nDEEPSEEK_API_KEY/DEEPSEEK_BASE_URL/DEEPSEEK_MODELS not fully set — skipping DeepSeek columns."
  //   );
  // }
  const deepseekEnabled = false;

  // --- Gemini pass (optional, private/VPN validation only) ----------------
  // Gemini's API is geo-blocked in Hong Kong for normal use — this exists so
  // a stronger model (e.g. gemini-2.5-pro) can be validated against DeepL
  // over VPN, not as a deployment candidate. Skipped entirely, with existing
  // DeepL/Azure OpenAI/Qwen/DeepSeek results untouched, if no key is set.
  const geminiModels = [(process.env.GEMINI_MODEL || "gemini-2.5-pro").trim()];
  const geminiEnabled = !!process.env.GEMINI_API_KEY;
  if (geminiEnabled) {
    await runBatchEnginePass({
      rows,
      cache,
      cacheKey: "gemini",
      models: geminiModels,
      batchSize,
      label: "Gemini",
      translateFn: (batch, model) => translateBatchGemini(batch, process.env.GEMINI_API_KEY, model),
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log("\nGEMINI_API_KEY not set — skipping the Gemini column.");
  }

  // --- Write a clean side-by-side Markdown report ------------------------
  let md = `# Translation Bake-off Results\n\n`;
  md += `Generated ${new Date().toISOString()}\n\n`;
  md += `Blind-review tip: cover the engine-name headers ("Teams Native", "Gemini",\n`;
  md += `"DeepL", "Azure OpenAI") when showing this to reviewers, so the ranking\n`;
  md += `isn't biased by knowing which engine is which. (Qwen/DeepSeek columns are\n`;
  md += `currently disabled — see comments in bakeoff.js.)\n\n`;

  for (const row of rows) {
    md += `---\n\n`;
    md += row.category ? `### ${row.id} — ${row.category}\n\n` : `### ${row.id}\n\n`;
    md += `**Original:**\n> ${row.text}\n\n`;
    md += `**Teams Native:**\n> ${row.teams_native_translation || "_(not filled in — paste Teams' translation into messages.json)_"}\n\n`;
    if (geminiEnabled) {
      for (const model of geminiModels) {
        const result = row.gemini && row.gemini[model];
        if (result && result.error) {
          md += `**Gemini (${model}):** _Error: ${result.error}_\n\n`;
        } else if (result) {
          md += `**Gemini (${model}):**\n> ${result.translation}\n\n`;
        }
      }
    }
    // Qwen column commented out along with the pass above.
    // if (qwenEnabled) {
    //   for (const model of qwenModels) {
    //     const result = row.qwen && row.qwen[model];
    //     if (result && result.error) {
    //       md += `**Qwen (${model}):** _Error: ${result.error}_\n\n`;
    //     } else if (result) {
    //       md += `**Qwen (${model}):**\n> ${result.translation}\n\n`;
    //     }
    //   }
    // }
    // DeepSeek column commented out along with the pass above.
    // if (deepseekEnabled) {
    //   for (const model of deepseekModels) {
    //     const result = row.deepseek && row.deepseek[model];
    //     if (result && result.error) {
    //       md += `**DeepSeek (${model}):** _Error: ${result.error}_\n\n`;
    //     } else if (result) {
    //       md += `**DeepSeek (${model}):**\n> ${result.translation}\n\n`;
    //     }
    //   }
    // }
    if (deeplEnabled) {
      if (isChineseText(row.text)) {
        if (row.deepl_error) {
          md += `**DeepL:** _Error: ${row.deepl_error}_\n\n`;
        } else {
          md += `**DeepL:**\n> ${row.deepl_translation}\n\n`;
        }
      } else {
        if (row.deepl_zh_hant_error) {
          md += `**DeepL (Traditional Chinese):** _Error: ${row.deepl_zh_hant_error}_\n\n`;
        } else {
          md += `**DeepL (Traditional Chinese):**\n> ${row.deepl_zh_hant}\n\n`;
        }
        if (row.deepl_yue_error) {
          md += `**DeepL (Cantonese):** _Error: ${row.deepl_yue_error}_\n\n`;
        } else {
          md += `**DeepL (Cantonese):**\n> ${row.deepl_yue}\n\n`;
        }
      }
    }
    if (azureEnabled) {
      if (row.azure_openai_error) {
        md += `**Azure OpenAI:** _Error: ${row.azure_openai_error}_\n\n`;
      } else {
        md += `**Azure OpenAI:**\n> ${row.azure_openai_translation}\n\n`;
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, md, "utf8");
  console.log(`\nDone. Report written to ${OUTPUT_FILE}`);
}

main();