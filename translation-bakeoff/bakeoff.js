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

async function translateBatch(msgs) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Copy .env.example to .env and fill it in.");
  }
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const userContent = msgs
    .map((m, i) => `[[[${i + 1}]]]\n${m.text}\n[[[/${i + 1}]]]`)
    .join("\n\n");

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
    throw new Error(`Gemini API ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();
  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error(`Gemini returned no candidate: ${JSON.stringify(data)}`);
  }
  const parts = candidate.content?.parts;
  if (!parts || !parts.length) {
    throw new Error(
      `Gemini returned an empty response (finishReason: ${candidate.finishReason || "unknown"})`
    );
  }
  const rawText = parts.map((p) => p.text || "").join("");
  return parseBatchResponse(rawText, msgs.length);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  const cachedRows = [];
  const pending = [];
  for (const msg of messages) {
    const cached = cache[msg.id];
    if (cached && cached.text === msg.text && cached.llm_translation) {
      cachedRows.push({ ...msg, llm_translation: cached.llm_translation, error: null });
    } else {
      pending.push(msg);
    }
  }
  if (cachedRows.length) {
    console.log(`Skipping ${cachedRows.length} already-translated message(s) (cached).`);
  }

  // BATCH_SIZE messages per API call, to conserve free-tier request quota.
  // Free tier limits are mostly per-request, so batching N messages into 1 call
  // uses 1/N of the requests compared to translating one at a time.
  const batchSize = Math.max(1, parseInt(process.env.BATCH_SIZE || "4", 10));
  const batches = chunk(pending, batchSize);

  console.log(
    `Running ${pending.length} message(s) in ${batches.length} batch(es) of up to ${batchSize}...\n`
  );

  const rows = [];
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    process.stdout.write(`- Batch ${b + 1}/${batches.length} (${batch.map((m) => m.id).join(", ")})... `);
    try {
      const translations = await translateBatch(batch);
      console.log("done");
      batch.forEach((msg, i) => {
        const t = translations[i];
        if (t === null) {
          rows.push({
            ...msg,
            llm_translation: null,
            error: "Could not parse this message's translation out of the batch response.",
          });
        } else {
          rows.push({ ...msg, llm_translation: t, error: null });
          cache[msg.id] = { text: msg.text, llm_translation: t };
        }
      });
    } catch (err) {
      console.log("FAILED");
      batch.forEach((msg) => {
        rows.push({ ...msg, llm_translation: null, error: String(err.message || err) });
      });
    }
    // Small pause between batches to stay comfortably under per-minute rate limits.
    if (b < batches.length - 1) await sleep(2000);
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");

  // Reassemble in original message order for the report.
  const rowsById = new Map([...cachedRows, ...rows].map((r) => [r.id, r]));
  rows.length = 0;
  rows.push(...messages.map((m) => rowsById.get(m.id)));

  // --- Write a clean side-by-side Markdown report ------------------------
  let md = `# Translation Bake-off Results\n\n`;
  md += `Generated ${new Date().toISOString()}\n\n`;
  md += `Blind-review tip: cover the "Teams Native" and "LLM" column headers when showing\n`;
  md += `this to reviewers, so the ranking isn't biased by knowing which engine is which.\n\n`;

  for (const row of rows) {
    md += `---\n\n`;
    md += row.category ? `### ${row.id} — ${row.category}\n\n` : `### ${row.id}\n\n`;
    md += `**Original:**\n> ${row.text}\n\n`;
    md += `**Teams Native:**\n> ${row.teams_native_translation || "_(not filled in — paste Teams' translation into messages.json)_"}\n\n`;
    if (row.error) {
      md += `**LLM:** _Error: ${row.error}_\n\n`;
    } else {
      md += `**LLM:**\n> ${row.llm_translation}\n\n`;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, md, "utf8");
  console.log(`\nDone. Report written to ${OUTPUT_FILE}`);
}

main();