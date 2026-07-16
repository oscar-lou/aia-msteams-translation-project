const { TeamsActivityHandler, CardFactory } = require("botbuilder");

// --- Translation engine (DeepL) ---------------------------------------------
// One swappable function. Uses DeepL (validated against Gemini/Qwen/DeepSeek in
// the bake-off). To swap engines later, replace the body of translateText() —
// nothing else in the app needs to change.
//
// Note: glossary.json's "preferred term equivalences" mechanism was a prompt
// injected into an LLM call and has no equivalent here — DeepL has its own
// separate Glossary API (create a glossary via POST /v2/glossaries, then pass
// glossary_id on /v2/translate) that isn't wired up yet. House terms in
// glossary.json are NOT currently applied while DeepL is the active engine.

const CJK_RE = /[一-鿿㐀-䶿]/;
function isChineseText(text) {
  return CJK_RE.test(text);
}

// Direction is decided here from the input script, since DeepL (unlike an
// LLM) has no prompt to describe bidirectional auto-detection to.
function deeplTargetLangFor(text) {
  const forceTarget = (process.env.FORCE_TARGET_LANG || "").trim();
  if (forceTarget) {
    // Pinned mode: must now be a valid DeepL target_lang code (e.g. "EN-US",
    // "ZH-HANT") rather than a freeform language name — DeepL requires an
    // exact code, unlike the previous Gemini prompt which accepted any name.
    return forceTarget;
  }
  if (isChineseText(text)) return "EN-US";
  const script = (process.env.CHINESE_SCRIPT || "Traditional").trim().toLowerCase();
  return script === "simplified" ? "ZH-HANS" : "ZH-HANT";
}

async function callDeepL(text, targetLang) {
  if (!process.env.DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY is not set");
  }
  const resp = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [text], target_lang: targetLang }),
  });
  if (!resp.ok) throw new Error(`DeepL API ${resp.status}: ${await resp.text()}`);

  const data = await resp.json();
  const translation = data.translations?.[0];
  if (!translation) throw new Error(`DeepL returned no translation: ${JSON.stringify(data)}`);
  return translation.text;
}

async function translateText(text) {
  const targetLang = deeplTargetLangFor(text);
  const translated = await callDeepL(text, targetLang);
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
