# Translation Bake-off (Step 1)

Answers one question before any Teams/Azure work: **does an LLM actually translate our
Chinese ↔ English messages better than what Teams already gives us?**

No Azure, no bot, no Teams app. Just Node.js and an OpenAI API key.

## What it does

1. Reads a list of real messages (and, if you have it, Teams' native translation of each)
   from `messages.json`.
2. Sends each message to the OpenAI API with a translation prompt tuned for a corporate
   Chinese/English workplace (handles Mandarin, Cantonese, formal and casual register,
   mixed-language text).
3. Writes a clean side-by-side comparison to `results.md` — original, Teams' translation,
   and the LLM's translation — ready to show reviewers for a blind ranking.

---

## Setup

**1. Get a Gemini API key (free, no credit card).**
Go to <https://aistudio.google.com/apikey>, sign in with a Google account, and click
**"Create API key."** No billing setup needed for free-tier usage — this is genuinely
free, unlike OpenAI's pay-per-use billing. Copy the key.

**2. Install dependencies.**
```bash
cd translation-bakeoff
npm install
```

**3. Configure.**
```bash
cp .env.example .env      # Windows: copy .env.example .env
```
Open `.env` and paste in your key:
```
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash
CHINESE_SCRIPT=Traditional
```

> Note: Google's free-tier model lineup and rate limits shift fairly often. If
> `gemini-2.5-flash` errors out or gets deprecated, check
> <https://aistudio.google.com> (your project's available models) or
> <https://ai.google.dev/gemini-api/docs/models> for the current free-capable list,
> and update `GEMINI_MODEL` accordingly.

---

## Add your real messages

Open `messages.json`. It's a plain array — replace the samples with real messages your
execs flagged (sanitize anything sensitive — swap out real names/numbers if needed, the
*translation difficulty* is what matters, not the specific content).

```json
[
  {
    "id": "sample-1",
    "text": "三送飯鐵粉",
    "teams_native_translation": "Third, sending rice with iron fans"
  }
]
```

- `id` — any short label, just for your own reference in the report.
- `text` — the original message, exactly as written.
- `teams_native_translation` — paste in what Teams' built-in translation gave you for
  that message. **This is optional but important**: if you leave it blank, the report
  will just show the LLM's output with no baseline to compare against. Go grab the
  Teams translation for each message first if you can (hover the message → Translate),
  since that's the whole baseline you're trying to beat.

Add as many messages as you want — aim for 15-20 covering the range you care about:
some casual chat, some formal/exec, some legal or financial phrasing, some technical.

---

## Run it

```bash
npm start
```

You'll see progress in the terminal, then:
```
Done. Report written to results.md
```

Open `results.md` — it has each message with its original text, Teams' translation, and
the LLM's translation stacked for easy comparison.

---

## Using the results

**Blind review is the whole point.** Don't just eyeball it yourself and declare a winner
— hand `results.md` (or reformat it) to the bilingual execs who flagged the problem,
with the "Teams Native" and "LLM" labels hidden or randomized, and have them rank each
pair without knowing which is which. That removes bias toward whichever they expect to
be better.

**What you're looking for:**
- Does the LLM clearly win on the messages that were originally flagged as bad?
- Does it hold up on formal/legal/financial phrasing, not just casual chat?
- Are there any messages where Teams' native translation was actually fine, or where the
  LLM introduced a new error? (LLMs can occasionally "over-translate" or add tone that
  wasn't there — worth watching for.)

**If the LLM wins clearly** — you have your evidence, and you move to Step 2: building
the Teams shell (bot registration + message extension) using the project we scaffolded
earlier, with `translateText()` using this same prompt.

**If it's mixed or unclear** — that's valuable too. It might mean you need a glossary of
company terms (there's a `glossary.json` mechanism in the Teams project for this), or
that the win is concentrated in one type of content (e.g. casual chat) but not others,
which should narrow the scope of what you actually build.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `GEMINI_API_KEY is not set` | Check `.env` exists (not just `.env.example`) and the key is pasted in |
| `Gemini API 400` | Check the model name in `.env` is current — see the note in Setup step 3 |
| `Gemini API 403` | Key is invalid, or Gemini API access isn't available in your region — verify at aistudio.google.com |
| `Gemini API 429` | Free-tier rate limit hit — wait a bit and rerun, or reduce how many messages you test at once |
| Gemini returned an empty response (finishReason: ...) | The message likely tripped a safety filter — check the flagged text isn't triggering that, or try rephrasing |
| Script hangs on one message | Network issue — check your connection and retry |
