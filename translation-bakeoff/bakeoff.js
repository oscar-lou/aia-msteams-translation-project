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

// --- OpenAI-compatible batch engines (Qwen, DeepSeek, ...) --------------
// Fully provider-agnostic: only base URL, key, and model name differ between
// providers, so this one function serves all of them — no forking. Replaces
// Gemini as the batching-capable engine (Gemini is geo-blocked in Hong Kong).
// Reuses buildBatchSystemPrompt()/parseBatchResponse() as-is, and keeps
// genuine multi-message batching since each provider's *_MODELS can list
// several models, each requiring its own full pass over every message.
async function translateBatchOpenAICompatible(msgs, baseUrl, apiKey, model) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const userContent = msgs
    .map((m, i) => `[[[${i + 1}]]]\n${m.text}\n[[[/${i + 1}]]]`)
    .join("\n\n");

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

// Runs one OpenAI-compatible provider (Qwen, DeepSeek, ...) across all of its
// configured models. Shared by every such provider so the batching/caching/
// per-model error isolation logic isn't duplicated per provider.
async function runOpenAICompatibleEnginePass({
  rows,
  cache,
  cacheKey,
  models,
  baseUrl,
  apiKey,
  batchSize,
  label,
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
        const translations = await translateBatchOpenAICompatible(batch, baseUrl, apiKey, model);
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

  // BATCH_SIZE messages per API call, to conserve quota — shared by the Qwen
  // pass below, since it's the one engine that still batches multiple
  // messages per request (each QWEN_MODELS entry gets its own full pass).
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
  // Skipped entirely, with existing DeepL/Azure OpenAI results untouched, if
  // not fully configured. QWEN_MODELS is comma-separated; each model gets its
  // own full batched pass and its own column, cached independently so a
  // failure on one model doesn't affect another's cached results.
  const qwenModels = (process.env.QWEN_MODELS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const qwenEnabled = !!(
    process.env.QWEN_API_KEY &&
    process.env.QWEN_BASE_URL &&
    qwenModels.length
  );
  if (qwenEnabled) {
    await runOpenAICompatibleEnginePass({
      rows,
      cache,
      cacheKey: "qwen",
      models: qwenModels,
      baseUrl: process.env.QWEN_BASE_URL,
      apiKey: process.env.QWEN_API_KEY,
      batchSize,
      label: "Qwen",
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log(
      "\nQWEN_API_KEY/QWEN_BASE_URL/QWEN_MODELS not fully set — skipping Qwen columns."
    );
  }

  // --- DeepSeek pass --------------------------------------------------------
  // Skipped entirely, with existing DeepL/Azure OpenAI/Qwen results untouched,
  // if not fully configured. Same shape as the Qwen pass above (comma-separated
  // *_MODELS, one column per model) since both share translateBatchOpenAICompatible.
  const deepseekModels = (process.env.DEEPSEEK_MODELS || "deepseek-v4-flash")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const deepseekEnabled = !!(
    process.env.DEEPSEEK_API_KEY &&
    process.env.DEEPSEEK_BASE_URL &&
    deepseekModels.length
  );
  if (deepseekEnabled) {
    await runOpenAICompatibleEnginePass({
      rows,
      cache,
      cacheKey: "deepseek",
      models: deepseekModels,
      baseUrl: process.env.DEEPSEEK_BASE_URL,
      apiKey: process.env.DEEPSEEK_API_KEY,
      batchSize,
      label: "DeepSeek",
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log(
      "\nDEEPSEEK_API_KEY/DEEPSEEK_BASE_URL/DEEPSEEK_MODELS not fully set — skipping DeepSeek columns."
    );
  }

  // --- Write a clean side-by-side Markdown report ------------------------
  let md = `# Translation Bake-off Results\n\n`;
  md += `Generated ${new Date().toISOString()}\n\n`;
  md += `Blind-review tip: cover the engine-name headers ("Teams Native", "Qwen",\n`;
  md += `"DeepSeek", "DeepL", "Azure OpenAI") when showing this to reviewers, so the\n`;
  md += `ranking isn't biased by knowing which engine is which.\n\n`;

  for (const row of rows) {
    md += `---\n\n`;
    md += row.category ? `### ${row.id} — ${row.category}\n\n` : `### ${row.id}\n\n`;
    md += `**Original:**\n> ${row.text}\n\n`;
    md += `**Teams Native:**\n> ${row.teams_native_translation || "_(not filled in — paste Teams' translation into messages.json)_"}\n\n`;
    if (qwenEnabled) {
      for (const model of qwenModels) {
        const result = row.qwen && row.qwen[model];
        if (result && result.error) {
          md += `**Qwen (${model}):** _Error: ${result.error}_\n\n`;
        } else if (result) {
          md += `**Qwen (${model}):**\n> ${result.translation}\n\n`;
        }
      }
    }
    if (deepseekEnabled) {
      for (const model of deepseekModels) {
        const result = row.deepseek && row.deepseek[model];
        if (result && result.error) {
          md += `**DeepSeek (${model}):** _Error: ${result.error}_\n\n`;
        } else if (result) {
          md += `**DeepSeek (${model}):**\n> ${result.translation}\n\n`;
        }
      }
    }
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