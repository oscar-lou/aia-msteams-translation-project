# Teams "Translate" Message Extension

Adds a right-click **Translate** action to any Microsoft Teams message. Click it and a
pop-up shows the translation. The translation engine is **Google Gemini**, tuned for
**Chinese ↔ English** in a corporate setting: it handles Mandarin and Cantonese,
Simplified and Traditional, formal and colloquial, and mixed Chinese/English, in both
directions — and lets you enforce house terminology via a glossary. It's built this way
because generic machine translation (including Teams' built-in feature) handles slang,
idiom, and jargon poorly — confirmed against real flagged messages in a separate
bake-off before this was built (see `translation-bakeoff/` in this repo).

## How it works

```
You right-click a message → Teams POSTs it to your bot's /api/messages endpoint →
the server strips the HTML → sends the text to the LLM with a translation prompt →
returns an Adaptive Card → Teams shows it in a pop-up.
```

The "bot" is just an HTTPS web service registered with Azure Bot Service so Teams trusts
it. There is no conversational AI — the registration is only the secure pipe Teams uses
to reach your code.

## Project structure

```
teams-translate/
├─ index.js              Express server + Bot Framework adapter
├─ translatorBot.js      Bot logic + the LLM translation engine (swappable)
├─ glossary.json         Optional house terms / slang the translator should respect
├─ package.json
├─ .env.example          Copy to .env and fill in
├─ .gitignore
├─ appManifest/
│  ├─ manifest.json      Declares the "Translate" message action
│  ├─ color.png          192×192 icon
│  └─ outline.png        32×32 transparent icon
├─ .vscode/              Run/debug config (F5), tasks, settings
└─ translation-bakeoff/  Standalone engine-comparison script (Gemini vs DeepL vs
                         Teams native) — the evidence step that preceded this bot.
                         Has its own README, .env, and npm install; not part of
                         the running Teams app.
```

---

## Prerequisites

- Node.js 18+ (`node -v`)
- An Azure account with rights to create resources and manage app registrations on it
  (the bot registration itself is free, F0 tier)
- A Microsoft Teams client where you can sideload a custom app for yourself — check
  **Apps → Manage your apps** for an **"Upload a custom app"** option (personal, not
  "Upload for org"). Corporate/school tenants often restrict this differently than they
  restrict Azure resource creation, so test it separately — don't assume one implies the
  other.
  > The **Microsoft 365 Developer Program** free sandbox is commonly suggested for this,
  > but as of 2026 it requires a qualifying work/school account via specific paths
  > (Visual Studio subscription, partner programs, etc.) — personal and many student
  > accounts are now denied. Don't rely on it without confirming you qualify first.
- A **Gemini API key** — free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey),
  no credit card required for the free tier
- The **dev tunnel** CLI for local testing:
  - macOS: `brew install --cask devtunnel`
  - Windows: `winget install Microsoft.devtunnel`
- **Azure CLI** (`brew install azure-cli` / [docs](https://learn.microsoft.com/cli/azure/install-azure-cli))
  — not always required, but a useful fallback if the Azure portal blocks you from
  managing an app registration's secrets directly (see Step 2's note).

---

## Step 1 — Install

```bash
cd teams-translate
cp .env.example .env      # Windows: copy .env.example .env
npm install
```

## Step 2 — Register the bot in Azure

1. [Azure portal](https://portal.azure.com) → **Create a resource** → search **Azure Bot** → **Create**.
2. Set: **Bot handle** (any unique name), **Pricing tier F0 (Free)**, **Type of App**
   (pick **Single Tenant** if that's what's offered — some subscriptions no longer show
   Multi Tenant as an option), **Creation type = Create new Microsoft App ID** →
   **Review + create** → **Create**.
3. Open the resource → **Settings → Configuration**:
   - Note the **Microsoft App ID** (this is your `<<YOUR-BOT-APP-ID>>`).
   - You'll set the **Messaging endpoint** in the Launch step, once you have a tunnel URL.
4. Get the **client secret**. Click **Manage** next to the App ID → **Certificates &
   secrets → New client secret** → copy the **Value** immediately.
   > **If that page flashes and denies access ("no access"), or App registrations
   > 401s elsewhere in the portal:** some tenants (student/education tenants in
   > particular) block managing app-registration credentials through the portal UI even
   > when they allow creating the bot resource itself. If so, use the Azure CLI instead —
   > it sometimes succeeds where the portal blade doesn't:
   > ```bash
   > az login --use-device-code   # if normal az login fails with a localhost connection error
   > az ad app list --display-name "<your bot handle>" --query "[].appId" -o tsv
   > az ad app credential reset --id <app-id-from-above> --display-name "poc-secret"
   > ```
   > The `password` field in the output is your client secret.
5. If you used **Single Tenant**, also grab the **Directory (tenant) ID** from the app
   registration's Overview page (or `az account show --query tenantId -o tsv`) — you'll
   need it in `.env`.
6. Back in the bot resource → **Channels** → add **Microsoft Teams** → **Apply**.

Fill these into `.env`:

```
MicrosoftAppId=<Microsoft App ID from step 3>
MicrosoftAppPassword=<secret Value from step 4>
MicrosoftAppType=SingleTenant
MicrosoftAppTenantId=<tenant ID from step 5 — required for SingleTenant>
```
(If you registered as Multi Tenant instead, set `MicrosoftAppType=MultiTenant` and you
can leave `MicrosoftAppTenantId` blank.)

## Step 3 — Configure the translation engine

```
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash
CHINESE_SCRIPT=Traditional
```

Get your key free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) —
no credit card needed for the free tier. Note: Google's free-tier model names and rate
limits shift fairly often; if `gemini-2.5-flash` errors out, check
[aistudio.google.com](https://aistudio.google.com) for what's currently available and
update `GEMINI_MODEL`.

**Language behaviour:** by default the translator auto-detects and goes Chinese ↔ English
both ways. Set `CHINESE_SCRIPT` to `Traditional` (Hong Kong / Taiwan) or `Simplified`
(mainland) to control the script used when translating *into* Chinese. To force a single
output language regardless of input (e.g. always English for execs), set
`FORCE_TARGET_LANG=English` and leave `CHINESE_SCRIPT` unused.

**Tune the translator** by editing `glossary.json` — add your company names, product
names, and any terms with a fixed house translation. Entries are treated as equivalences
and applied in both directions.

> Swapping engines later is a one-function change: replace the body of `callGemini()`
> in `translatorBot.js`. The rest of the app doesn't care which API is behind it.

## Step 4 — Set the bot App ID in the manifest

Open `appManifest/manifest.json` and replace **all three** occurrences of
`<<YOUR-BOT-APP-ID>>` (in `id`, `bots[0].botId`, and `composeExtensions[0].botId`)
with your Microsoft App ID from Step 2.

---

## Step 5 — Launch it

You need two things running at once: your code, and an HTTPS tunnel so Teams can reach it.

### A. Start the tunnel
In VS Code: **Terminal → Run Task → "Start dev tunnel"** (or run
`devtunnel user login` then `devtunnel host -p 3978 --allow-anonymous` in a terminal).
Copy the HTTPS URL it prints, e.g. `https://abcd1234-3978.usw2.devtunnels.ms`. **Leave
this running.**

### B. Point the bot at the tunnel
In the Azure portal → your bot → **Settings → Configuration** → set **Messaging endpoint**
to the tunnel URL + `/api/messages`
(e.g. `https://abcd1234-3978.usw2.devtunnels.ms/api/messages`) → **Apply**.
(Redo this whenever the tunnel URL changes.)

### C. Run the code
- **In VS Code:** press **F5** (runs `index.js` under the debugger, loads `.env`, lets you
  set breakpoints). You should see `Listening on http://localhost:3978`.
- **Or from a terminal:** `npm start`

### D. Build the app package and sideload into Teams
1. **Terminal → Run Task → "Package Teams app"** (or
   `cd appManifest && zip ../translate-app.zip manifest.json color.png outline.png`).
2. In Teams: **Apps → Manage your apps → Upload an app → Upload a custom app** (the
   *personal* option — installs just for you, no admin approval needed. Don't use
   "Upload for org", which routes to IT approval) → choose `translate-app.zip` → **Add**.
   > If "Upload a custom app" isn't offered at all (only "Upload for org," or nothing),
   > that tenant has personal sideloading disabled. You'll need a different Teams client
   > where it is enabled — a work laptop with a separate corporate tenant that allows it,
   > for instance. The bot itself doesn't care which Teams client sideloads it; only the
   > messaging endpoint (your tunnel) needs to be reachable from wherever you're testing.

### E. Try it
Hover any message → **... (More actions) → Translate**. A pop-up shows the translation
and the original. Keep the tunnel and the server running while you test.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Action spins / "couldn't reach app" | Tunnel or server stopped, or messaging endpoint URL is stale |
| 401 in server logs | `MicrosoftAppId`/`MicrosoftAppPassword` mismatch, expired secret, or `MicrosoftAppType`/`MicrosoftAppTenantId` don't match how the app was actually registered (Single vs Multi Tenant) |
| "Translation failed" card | `GEMINI_API_KEY` wrong/missing, model name outdated (check aistudio.google.com), or free-tier rate limit hit |
| Portal blocks Certificates & secrets, or App registrations 401s | Some tenants restrict app-credential management even when they allow resource creation — use the `az ad app credential reset` CLI fallback in Step 2 |
| Can't upload the app (only "Upload for org" shown, or nothing) | Personal custom app upload disabled for that tenant — sideload from a different Teams client instead (see Step 5D) |
| Translate missing from the menu | botId placeholders not replaced, or `context` doesn't include `"message"` |

## Notes for later

- **Validate the engine before relying on it.** Run real flagged messages through this vs.
  the current Teams translation and confirm it's actually better for your language pairs
  and content before rolling it out widely.
- **Production hosting:** replace the dev tunnel with a real HTTPS host (Azure App
  Service, etc.), set the same env vars there, and point the bot's messaging endpoint at
  it instead of the tunnel.
- **SDK:** this uses the Bot Framework SDK (`botbuilder`), which is stable and
  well-documented but now legacy; Microsoft's forward path is the Microsoft 365 Agents
  SDK. The message-extension structure here ports over if/when you migrate.
