require("dotenv").config();
const fs = require("fs");
const path = require("path");

// --- Config ------------------------------------------------------------
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const OUTPUT_FILE = path.join(__dirname, "results.md");
const CACHE_FILE = path.join(__dirname, ".translations-cache.json");
const PRICING_FILE = path.join(__dirname, "pricing.json");

let pricing = {};
try {
  pricing = JSON.parse(fs.readFileSync(PRICING_FILE, "utf8"));
} catch {
  pricing = {};
}

// --- Token/cost/latency capture ------------------------------------------
// Populated by every engine call (batch or single), read back in main() to
// build the Token & Cost Summary section of results.md. Cache hits never
// reach a recordUsage() call, so totals only reflect API calls actually made
// in this run — expected, not a bug, on a mostly-cached rerun.
const usageLog = [];
function recordUsage(entry) {
  usageLog.push(entry);
}

function median(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mean(nums) {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Returns a cost in USD, or null if pricing.json has no usable rate for this
// entry — callers must treat null as "unknown", never as $0.
function costForUsage(entry, rates) {
  if (!rates) return null;
  if (entry.unit === "characters") {
    if (typeof rates.perMillionChars !== "number") return null;
    return ((entry.characters || 0) / 1_000_000) * rates.perMillionChars;
  }
  if (typeof rates.inputPer1M !== "number" || typeof rates.outputPer1M !== "number") return null;
  const input = entry.inputTokens || 0;
  const output = entry.outputTokens || 0;
  // cachedTokens is a SUBSET of inputTokens (the portion served from cache at
  // a discount), not additive — regularInput is what's left after removing it.
  const cached = entry.cachedTokens || 0;
  const regularInput = Math.max(input - cached, 0);
  const cachedRate = typeof rates.cachedInputPer1M === "number" ? rates.cachedInputPer1M : rates.inputPer1M;
  return (
    (regularInput / 1_000_000) * rates.inputPer1M +
    (cached / 1_000_000) * cachedRate +
    (output / 1_000_000) * rates.outputPer1M
  );
}

function summarizeUsage() {
  const groups = new Map();
  for (const entry of usageLog) {
    const key = `${entry.engine}::${entry.model}`;
    if (!groups.has(key)) {
      groups.set(key, {
        engine: entry.engine,
        model: entry.model,
        mode: entry.mode,
        unit: entry.unit,
        calls: 0,
        messageCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
        characters: 0,
        totalCost: 0,
        costKnown: true,
        latencies: [],
      });
    }
    const g = groups.get(key);
    g.calls += 1;
    g.messageCount += entry.messageCount || 1;
    g.inputTokens += entry.inputTokens || 0;
    g.outputTokens += entry.outputTokens || 0;
    g.cachedTokens += entry.cachedTokens || 0;
    g.characters += entry.characters || 0;
    g.latencies.push(entry.latencyMs);

    const cost = costForUsage(entry, pricing[entry.pricingKey]);
    if (cost === null) {
      g.costKnown = false;
    } else {
      g.totalCost += cost;
    }
  }
  return [...groups.values()];
}

// singleMessage drops the [[[n]]] numbered-batch protocol section (meaningless
// for one message) but keeps every translation instruction word-for-word
// identical, so the two modes stay a fair comparison.
function buildBatchSystemPrompt(singleMessage = false) {
  const script = (process.env.CHINESE_SCRIPT || "Traditional").trim();

  let p = `You are a professional translator for a corporate Microsoft Teams workspace ` +
    `where colleagues write in both Chinese and English. `;

  if (singleMessage) {
    p += `For this message: detect its language. If it is any form of Chinese — Mandarin or ` +
      `Cantonese, Simplified or Traditional, formal or colloquial, including messages that ` +
      `mix Chinese and English — translate it into natural, professional English. ` +
      `If it is in English, translate it into Standard Written Chinese using ${script} characters. `;
  } else {
    p += `You will receive several numbered messages, each wrapped like:\n` +
      `[[[1]]]\n<message text>\n[[[/1]]]\n\n` +
      `For EACH numbered message, independently: detect its language. If it is any form ` +
      `of Chinese — Mandarin or Cantonese, Simplified or Traditional, formal or colloquial, ` +
      `including messages that mix Chinese and English — translate it into natural, ` +
      `professional English. If it is in English, translate it into Standard Written ` +
      `Chinese using ${script} characters. `;
  }

  p += `Preserve the original tone and register per message: keep formal messages formal ` +
    `and casual messages casual, but always produce clear, workplace-appropriate output. ` +
    `Translate slang, abbreviations, and idioms by their intended meaning — never ` +
    `word-for-word. Preserve names, @mentions, numbers, URLs, and product names exactly. `;

  if (!singleMessage) {
    p += `Treat every numbered message completely independently — do not let one message's ` +
      `content or context influence another's translation.\n\n`;
  }

  if (singleMessage) {
    p += `Output ONLY the translation, with no quotes, labels, or explanation.`;
  } else {
    p += `Respond with ONLY the translations, each wrapped in the SAME numbered markers as ` +
      `the input, in the same order, with no extra commentary:\n` +
      `[[[1]]]\n<translation of message 1>\n[[[/1]]]\n[[[2]]]\n<translation of message 2>\n[[[/2]]]\n...`;
  }

  return p;
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
//
// singleMessage bypasses batching entirely: raw text in, raw text out, no
// [[[n]]] wrapping — matching production behaviour. Returns usage alongside
// translations rather than recording it directly, since this function doesn't
// know its own engine label ("Qwen" vs "DeepSeek") — the caller does.
async function translateBatchOpenAICompatible(msgs, baseUrl, apiKey, model, singleMessage = false) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const userContent = singleMessage ? msgs[0].text : buildBatchUserContent(msgs);
  const startedAt = Date.now();

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: buildBatchSystemPrompt(singleMessage) },
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
  const translations = singleMessage ? [rawText.trim()] : parseBatchResponse(rawText, msgs.length);
  const latencyMs = Date.now() - startedAt;
  const usage = {
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    cachedTokens: data.usage?.prompt_tokens_details?.cached_tokens ?? null,
    latencyMs,
  };
  return { translations, usage };
}

// --- Gemini (optional engine, for private/VPN validation only) ----------
// Gemini's request/response shape is NOT OpenAI-compatible (systemInstruction/
// contents/parts, not messages/choices), so it needs its own function — but it
// shares buildBatchSystemPrompt()/buildBatchUserContent()/parseBatchResponse()
// with every other engine, for a fair apples-to-apples comparison.
//
// singleMessage bypasses batching entirely: raw text in, raw text out, no
// [[[n]]] wrapping — matching production behaviour.
async function translateBatchGemini(msgs, apiKey, model, singleMessage = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userContent = singleMessage ? msgs[0].text : buildBatchUserContent(msgs);
  const startedAt = Date.now();

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildBatchSystemPrompt(singleMessage) }] },
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
  const translations = singleMessage ? [rawText.trim()] : parseBatchResponse(rawText, msgs.length);
  const latencyMs = Date.now() - startedAt;
  const usage = {
    inputTokens: data.usageMetadata?.promptTokenCount ?? null,
    outputTokens: data.usageMetadata?.candidatesTokenCount ?? null,
    cachedTokens: data.usageMetadata?.cachedContentTokenCount ?? null,
    latencyMs,
  };
  return { translations, usage };
}

// --- Azure AI Foundry (broad multi-model screening) ---------------------
// One endpoint + one key, many deployments (FOUNDRY_MODELS, comma-separated) —
// that's what makes this a configurable screening list rather than a second
// hardcoded single-deployment integration like translateWithAzureOpenAI below,
// which targets exactly one fixed AZURE_OPENAI_DEPLOYMENT and is left untouched.
//
// URL/body corrected 2026-07 after live testing (Microsoft's own reference
// docs were inconsistent on this exact point): Azure's data-plane inference
// API moved off the old dated api-version scheme (2024-10-21 etc.) to a new
// "v1" API with NO per-deployment URL segment — POST
// {endpoint}/openai/v1/chat/completions, model in the JSON body. That's why
// every model failed identically at first regardless of vendor — never a
// per-model issue. A second live error then confirmed the /v1 path rejects
// an "api-version" query param outright ("not allowed when using /v1 path"),
// so there's deliberately no FOUNDRY_API_VERSION knob — nothing to put there
// currently has any effect on this path.
//
// Keeps its own function (not a reuse of translateBatchOpenAICompatible)
// to use the "api-key" header explicitly, though the v1 API also documents
// accepting "Authorization: Bearer". Shares buildBatchSystemPrompt()/
// buildBatchUserContent()/parseBatchResponse(), and honours singleMessage
// identically to Gemini: raw text in/out, no [[[n]]] wrapping, when true.
async function translateBatchAzureFoundry(msgs, endpoint, apiKey, deployment, singleMessage = false) {
  const url = `${endpoint.replace(/\/+$/, "")}/openai/v1/chat/completions`;

  const userContent = singleMessage ? msgs[0].text : buildBatchUserContent(msgs);
  const startedAt = Date.now();

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      model: deployment,
      messages: [
        { role: "system", content: buildBatchSystemPrompt(singleMessage) },
        { role: "user", content: userContent },
      ],
      // Foundry model deployments (across this whole screening list, not just
      // reasoning models like o3) only support the default temperature of 1.0
      // — sending any other value 400s. Every other engine in this file keeps
      // its own temperature setting; this constraint is specific to Foundry.
      temperature: 1.0,
    }),
  });
  if (!resp.ok) {
    // Deliberately includes the full status + body — at screening scale, one
    // bad deployment name or unsupported-parameter error needs to be
    // diagnosable without re-running just that model.
    throw new Error(`Foundry (${deployment}) API ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error(`Foundry (${deployment}) returned no choices: ${JSON.stringify(data)}`);
  }
  const rawText = choice.message?.content || "";
  const translations = singleMessage ? [rawText.trim()] : parseBatchResponse(rawText, msgs.length);
  const latencyMs = Date.now() - startedAt;
  const usage = {
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    cachedTokens: data.usage?.prompt_tokens_details?.cached_tokens ?? null,
    latencyMs,
  };
  return { translations, usage };
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
  const startedAt = Date.now();
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
  const latencyMs = Date.now() - startedAt;
  // DeepL bills per source character, not per token — recorded under its own
  // unit so the report never implies characters and tokens are comparable.
  recordUsage({
    engine: "DeepL",
    model: null,
    pricingKey: "deepl",
    mode: "single",
    unit: "characters",
    messageCount: 1,
    characters: text.length,
    latencyMs,
  });
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
  const startedAt = Date.now();

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
  const latencyMs = Date.now() - startedAt;
  recordUsage({
    engine: "Azure OpenAI",
    model: deployment,
    pricingKey: "azure-openai",
    mode: "single",
    unit: "tokens",
    messageCount: 1,
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    cachedTokens: data.usage?.prompt_tokens_details?.cached_tokens ?? null,
    latencyMs,
  });
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
//
// mode ("batch" | "single") is stamped onto every usage record AND folded
// into the persistent cache key. Without that second part, switching
// SINGLE_MESSAGE_MODE between runs would silently serve a translation cached
// under the other mode as if it were this mode's output — corrupting the
// exact comparison this toggle exists to produce. The in-memory row[cacheKey]
// used for this run's report doesn't need the same treatment: mode is fixed
// for the whole run, so there's no same-run collision to guard against.
async function runBatchEnginePass({
  rows,
  cache,
  cacheKey,
  models,
  batchSize,
  label,
  mode,
  translateFn,
}) {
  for (const model of models) {
    const cacheModelKey = `${model}#${mode}`;
    const pendingForModel = [];
    for (const row of rows) {
      const cached = cache[row.id];
      const cachedTranslation =
        cached && cached.text === row.text && cached[cacheKey] && cached[cacheKey][cacheModelKey];
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
        const { translations, usage } = await translateFn(batch, model);
        console.log("done");
        recordUsage({
          engine: label,
          model,
          pricingKey: model,
          mode,
          unit: "tokens",
          messageCount: batch.length,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          cachedTokens: usage.cachedTokens,
          latencyMs: usage.latencyMs,
        });
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
              [cacheKey]: { ...((cache[row.id] || {})[cacheKey] || {}), [cacheModelKey]: t },
            };
          }
        });
      } catch (err) {
        const errText = String(err.message || err);
        // Printed in full (not just "FAILED") so a wide multi-model screen can
        // be triaged from the terminal alone — deployment-name typos, unsupported
        // parameters, and auth issues all need to be diagnosable without
        // re-running just that one model.
        console.log(`FAILED — ${errText}`);
        batch.forEach((row) => {
          row[cacheKey][model] = { translation: null, error: errText };
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

  // SINGLE_MESSAGE_MODE=true bypasses batching entirely (one message per API
  // call, matching production) for every batch-capable engine below. Default
  // false keeps the existing multi-message batching, [[[n]]] protocol,
  // BATCH_SIZE, and inter-batch pause exactly as they were.
  const SINGLE_MESSAGE_MODE = /^true$/i.test((process.env.SINGLE_MESSAGE_MODE || "").trim());

  // BATCH_SIZE messages per API call, to conserve quota — shared by every
  // batch-capable engine below (each *_MODELS/model entry gets its own full
  // pass of batches). Forced to 1 in single-message mode, where BATCH_SIZE
  // has no effect by design.
  const configuredBatchSize = Math.max(1, parseInt(process.env.BATCH_SIZE || "4", 10));
  const batchSize = SINGLE_MESSAGE_MODE ? 1 : configuredBatchSize;

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
  //     mode: SINGLE_MESSAGE_MODE ? "single" : "batch",
  //     translateFn: (batch, model) =>
  //       translateBatchOpenAICompatible(batch, process.env.QWEN_BASE_URL, process.env.QWEN_API_KEY, model, SINGLE_MESSAGE_MODE),
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
  //     mode: SINGLE_MESSAGE_MODE ? "single" : "batch",
  //     translateFn: (batch, model) =>
  //       translateBatchOpenAICompatible(batch, process.env.DEEPSEEK_BASE_URL, process.env.DEEPSEEK_API_KEY, model, SINGLE_MESSAGE_MODE),
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
      mode: SINGLE_MESSAGE_MODE ? "single" : "batch",
      translateFn: (batch, model) =>
        translateBatchGemini(batch, process.env.GEMINI_API_KEY, model, SINGLE_MESSAGE_MODE),
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log("\nGEMINI_API_KEY not set — skipping the Gemini column.");
  }

  // --- Azure AI Foundry pass (broad multi-model screening) -----------------
  // Skipped entirely, with every other engine's results untouched, if not
  // fully configured. FOUNDRY_MODELS is comma-separated; each deployment gets
  // its own full pass and its own column, cached independently so one bad
  // deployment name can't affect another model's cached results. Deployment
  // failures (typos, unsupported params, auth) are expected at this scale —
  // runBatchEnginePass's per-batch try/catch isolates them and keeps going.
  const foundryModels = (process.env.FOUNDRY_MODELS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const foundryEnabled = !!(
    process.env.FOUNDRY_ENDPOINT &&
    process.env.FOUNDRY_API_KEY &&
    foundryModels.length
  );
  if (foundryEnabled) {
    await runBatchEnginePass({
      rows,
      cache,
      cacheKey: "foundry",
      models: foundryModels,
      batchSize,
      label: "Foundry",
      mode: SINGLE_MESSAGE_MODE ? "single" : "batch",
      translateFn: (batch, model) =>
        translateBatchAzureFoundry(
          batch,
          process.env.FOUNDRY_ENDPOINT,
          process.env.FOUNDRY_API_KEY,
          model,
          SINGLE_MESSAGE_MODE
        ),
    });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } else {
    console.log(
      "\nFOUNDRY_ENDPOINT/FOUNDRY_API_KEY/FOUNDRY_MODELS not fully set — skipping the Foundry screen."
    );
  }

  // Computed once, before building any report section, so both the early
  // Model Screening Summary and the later Token & Cost Summary can use it.
  const usageSummary = summarizeUsage();

  // --- Write a clean side-by-side Markdown report ------------------------
  let md = `# Translation Bake-off Results\n\n`;
  md += `Generated ${new Date().toISOString()}\n\n`;
  md += `**Run mode:** \`SINGLE_MESSAGE_MODE=${SINGLE_MESSAGE_MODE}\` — `;
  md += SINGLE_MESSAGE_MODE
    ? `one message per API call for every batch-capable engine, matching production behaviour.\n\n`
    : `multi-message batching enabled (\`BATCH_SIZE=${configuredBatchSize}\`) for Gemini/Qwen/DeepSeek. ` +
      `See the cost warning in the Token &amp; Cost Summary below before quoting any per-message figure.\n\n`;
  md += `Blind-review tip: cover the engine-name headers ("Teams Native", "Gemini",\n`;
  md += `"DeepL", "Azure OpenAI", "Foundry (model)") when showing this to reviewers,\n`;
  md += `so the ranking isn't biased by knowing which engine is which. (Qwen/DeepSeek\n`;
  md += `columns are currently disabled — see comments in bakeoff.js.)\n\n`;

  // --- Model screening summary (Foundry) -----------------------------------
  // One row per deployment, so a wide multi-model run can be triaged for
  // success/failure and rough latency/cost BEFORE reading any of the full
  // per-message translation columns below — the whole point at this scale.
  if (foundryEnabled) {
    md += `## Foundry Model Screening Summary\n\n`;
    md += `Deployment names are whatever you named them in your Foundry resource's ` +
      `Deployments tab — a "failed" row below is often just a naming mismatch, not ` +
      `a real capability problem. Full per-message output for each model is further ` +
      `down, under its own \`**Foundry (model):**\` heading.\n\n`;
    md += `| Model | Status | OK | Failed | Mean latency ms | Total tokens |\n`;
    md += `|---|---|---|---|---|---|\n`;
    for (const model of foundryModels) {
      let ok = 0;
      let failed = 0;
      for (const row of rows) {
        const result = row.foundry && row.foundry[model];
        if (!result) continue;
        if (result.error) failed++;
        else ok++;
      }
      const usageEntry = usageSummary.find((g) => g.engine === "Foundry" && g.model === model);
      const meanLatency = usageEntry && usageEntry.latencies.length ? Math.round(mean(usageEntry.latencies)) : null;
      const totalTokens = usageEntry ? usageEntry.inputTokens + usageEntry.outputTokens : null;
      const status = ok > 0 && failed === 0 ? "✅" : ok > 0 && failed > 0 ? "⚠️ partial" : "❌";
      md +=
        `| ${model} | ${status} | ${ok} | ${failed} | ${meanLatency ?? "—"} | ${totalTokens ?? "—"} |\n`;
    }
    md += `\n`;
  }

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
    if (foundryEnabled) {
      for (const model of foundryModels) {
        const result = row.foundry && row.foundry[model];
        if (result && result.error) {
          md += `**Foundry (${model}):** _Error: ${result.error}_\n\n`;
        } else if (result) {
          md += `**Foundry (${model}):**\n> ${result.translation}\n\n`;
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

  // --- Token & cost summary ------------------------------------------------
  // Figures reflect only API calls actually made THIS run — cache hits are
  // free and correctly contribute nothing here.
  if (usageSummary.length) {
    md += `---\n\n## Token &amp; Cost Summary\n\n`;
    if (!SINGLE_MESSAGE_MODE) {
      md += `> ⚠️ **Batched-mode cost warning:** Gemini/Qwen/DeepSeek figures below came from ` +
        `calls bundling multiple messages together. Each call's fixed system-prompt overhead ` +
        `is divided across every message in that batch, so "cost/message" here ` +
        `*understates* real production cost, where every message pays that overhead alone. ` +
        `Re-run with \`SINGLE_MESSAGE_MODE=true\` for a number that matches production. ` +
        `(DeepL and Azure OpenAI are unaffected — they always send one message per call, ` +
        `in either mode.)\n\n`;
    }
    md += `Rates come from \`pricing.json\` and must be kept in sync with each vendor's current ` +
      `pricing page — see the comment at the top of that file. "rate not set" means ` +
      `\`pricing.json\` has no usable rate for that engine/model, not that it's free.\n\n`;
    md += `| Engine | Model | Mode | Calls | Messages | Input tok | Output tok | Cached tok | Chars | Cost/message | Latency ms (median/min/max) |\n`;
    md += `|---|---|---|---|---|---|---|---|---|---|---|\n`;
    for (const g of usageSummary) {
      const costPerMsg = g.costKnown && g.messageCount ? g.totalCost / g.messageCount : null;
      const costCell = g.costKnown ? `$${costPerMsg.toFixed(6)}` : "_rate not set_";
      const lat = g.latencies;
      md +=
        `| ${g.engine} | ${g.model || "—"} | ${g.mode} | ${g.calls} | ${g.messageCount} | ` +
        `${g.unit === "tokens" ? g.inputTokens : "—"} | ` +
        `${g.unit === "tokens" ? g.outputTokens : "—"} | ` +
        `${g.unit === "tokens" ? g.cachedTokens : "—"} | ` +
        `${g.unit === "characters" ? g.characters : "—"} | ` +
        `${costCell} | ` +
        `${Math.round(median(lat))} / ${Math.min(...lat)} / ${Math.max(...lat)} |\n`;
    }
    md += `\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, md, "utf8");
  console.log(`\nDone. Report written to ${OUTPUT_FILE}`);
}

main();