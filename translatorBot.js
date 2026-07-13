const { TeamsActivityHandler, CardFactory } = require("botbuilder");

// --- Optional terminology glossary -----------------------------------------
// glossary.json is a list of { source, target, note } entries. It teaches the
// translator your house terms and slang so it doesn't guess. Safe to leave empty.
let GLOSSARY = [];
try {
  GLOSSARY = require("./glossary.json");
} catch {
  GLOSSARY = [];
}

// --- Translation engine (LLM) ----------------------------------------------
// One swappable function. Uses Google's Gemini API (validated in the bake-off).
// To swap engines later, replace the body of translateText() — nothing else in
// the app needs to change.

async function callGemini(systemPrompt, userText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });
  if (!resp.ok) throw new Error(`Gemini API ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error(`Gemini returned no candidate: ${JSON.stringify(data)}`);
  const parts = candidate.content?.parts;
  if (!parts || !parts.length) {
    throw new Error(
      `Gemini returned an empty response (finishReason: ${candidate.finishReason || "unknown"})`
    );
  }
  return parts.map((p) => p.text || "").join("").trim();
}

function buildSystemPrompt(glossary) {
  const script = (process.env.CHINESE_SCRIPT || "Traditional").trim();
  const forceTarget = (process.env.FORCE_TARGET_LANG || "").trim();

  let p;
  if (forceTarget) {
    // Pinned mode: always translate into one language (e.g. always English).
    p =
      `You are a professional translator for a corporate Microsoft Teams workspace. ` +
      `Translate the user's message into ${forceTarget}, whatever language it is written in. `;
  } else {
    // Default: auto bidirectional Chinese <-> English.
    p =
      `You are a professional translator for a corporate Microsoft Teams workspace ` +
      `where colleagues write in both Chinese and English. ` +
      `Detect the language of the message. If it is in any form of Chinese — Mandarin or ` +
      `Cantonese, Simplified or Traditional, formal or colloquial, including messages that ` +
      `mix Chinese and English — translate it into natural, professional English. ` +
      `If it is in English, translate it into Standard Written Chinese using ${script} characters. `;
  }

  p +=
    `Preserve the original tone and register: keep formal messages formal and casual ` +
    `messages casual, but always produce clear, workplace-appropriate output. ` +
    `Translate slang, abbreviations, and idioms by their intended meaning — never word-for-word. ` +
    `Preserve names, @mentions, numbers, URLs, and product names exactly. ` +
    `If the message is already in the target language, return it unchanged. ` +
    `Output ONLY the translation, with no quotes, labels, or explanation.`;

  if (glossary && glossary.length) {
    p += `\n\nUse these preferred term equivalences in either direction:\n`;
    for (const g of glossary) {
      p += `- "${g.source}" = "${g.target}"`;
      if (g.note) p += ` (${g.note})`;
      p += `\n`;
    }
  }
  return p;
}

async function translateText(text) {
  const systemPrompt = buildSystemPrompt(GLOSSARY);
  const translated = await callGemini(systemPrompt, text);
  return { text: translated };
}

// --- Helpers ----------------------------------------------------------------
// Teams message bodies arrive as HTML; strip tags to get plain text.
function htmlToPlainText(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Adaptive Cards render TextBlock "text" with a light markdown subset, so
// characters like *, _, and # in message content could trigger unintended
// formatting. Escape them so the text always displays literally.
function escapeCardText(text) {
  if (!text) return text;
  return String(text).replace(/[\\*_#]/g, (ch) => `\\${ch}`);
}

function infoCard(message, subtle) {
  return CardFactory.adaptiveCard({
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.4",
    body: [{ type: "TextBlock", text: message, wrap: true, isSubtle: !!subtle }],
  });
}

function resultCard(original, translated) {
  return CardFactory.adaptiveCard({
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.4",
    body: [
      {
        type: "TextBlock",
        text: "Translation",
        weight: "Bolder",
        size: "Medium",
        wrap: true,
      },
      { type: "TextBlock", text: escapeCardText(translated), wrap: true, spacing: "Medium" },
      {
        type: "TextBlock",
        text: "Original",
        weight: "Bolder",
        spacing: "Large",
        isSubtle: true,
      },
      { type: "TextBlock", text: escapeCardText(original), wrap: true, isSubtle: true },
    ],
  });
}

// --- Bot --------------------------------------------------------------------
class TranslatorBot extends TeamsActivityHandler {
  constructor() {
    super();
    // Fired if someone DMs or @-mentions the bot directly instead of using
    // the right-click Translate action.
    this.onMessage(async (context, next) => {
      await context.sendActivity(
        "Hi! To translate a message, hover over it in a chat or channel, click " +
          "More actions (...), and select Translate."
      );
      await next();
    });
  }

  // Fired when the user right-clicks a message and chooses "Translate"
  // (manifest sets "fetchTask": true on the command).
  async handleTeamsMessagingExtensionFetchTask(context, action) {
    const original = htmlToPlainText(action?.messagePayload?.body?.content || "");

    let card;
    if (!original) {
      card = infoCard("No text found in this message.");
    } else {
      try {
        const { text } = await translateText(original);
        card = resultCard(original, text);
      } catch (err) {
        console.error("[translate error]", err);
        card = CardFactory.adaptiveCard({
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              text: "Translation temporarily unavailable",
              weight: "Bolder",
              wrap: true,
            },
            {
              type: "TextBlock",
              text: "The translation service is busy or briefly unreachable. Please try again in a moment.",
              wrap: true,
              isSubtle: true,
            },
          ],
        });
      }
    }

    return {
      task: {
        type: "continue",
        value: { title: "Translate", height: "medium", width: "medium", card },
      },
    };
  }
}

module.exports.TranslatorBot = TranslatorBot;
