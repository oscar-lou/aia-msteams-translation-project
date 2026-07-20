# Translation Bake-off Results

Generated 2026-07-20T08:06:20.677Z

**Run mode:** `SINGLE_MESSAGE_MODE=false` — multi-message batching enabled (`BATCH_SIZE=4`) for Gemini/Qwen/DeepSeek. See the cost warning in the Token &amp; Cost Summary below before quoting any per-message figure.

Blind-review tip: cover the engine-name headers ("Teams Native", "Gemini",
"DeepL", "Azure OpenAI", "Foundry (model)") when showing this to reviewers,
so the ranking isn't biased by knowing which engine is which. (Qwen/DeepSeek
columns are currently disabled — see comments in bakeoff.js.)

## Foundry Model Screening Summary

Deployment names are whatever you named them in your Foundry resource's Deployments tab — a "failed" row below is often just a naming mismatch, not a real capability problem. Full per-message output for each model is further down, under its own `**Foundry (model):**` heading.

| Model | Status | OK | Failed | Mean latency ms | Total tokens |
|---|---|---|---|---|---|
| gpt-5-mini | ❌ | 0 | 16 | — | — |
| gpt-5-nano | ❌ | 0 | 16 | — | — |
| gpt-5-chat | ❌ | 0 | 16 | — | — |
| gpt-5.1 | ❌ | 0 | 16 | — | — |
| gpt-4.1 | ❌ | 0 | 16 | — | — |
| gpt-4.1-nano | ❌ | 0 | 16 | — | — |
| DeepSeek-V4-Flash | ❌ | 0 | 16 | — | — |
| DeepSeek-V4-Pro | ❌ | 0 | 16 | — | — |
| Kimi-K2.6 | ❌ | 0 | 16 | — | — |
| Kimi-K2.5 | ❌ | 0 | 16 | — | — |
| o3 | ❌ | 0 | 16 | — | — |

---

### sample-1

**Original:**
> 三送飯鐵粉

**Teams Native:**
> Third, sending rice with iron fans

**Gemini (gemini-3.5-flash):**
> A die-hard fan of 3-dish rice.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> Three Meals for the Die-Hard Fans

---

### sample-2

**Original:**
> 麻煩你哋盡快覆返個報價,客戶今日要決定

**Teams Native:**
> Please reply with the quote as soon as possible; the client needs to decide today

**Gemini (gemini-3.5-flash):**
> Could you please reply with the quote as soon as possible? The client needs to make a decision today.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> Please get back to us with a quote as soon as possible; the client needs to make a decision today.

---

### sample-3

**Original:**
> Please confirm receipt of the signed NDA by EOD.

**Teams Native:**
> 請確認於 EOD 前已收到簽署的保密協議

**Gemini (gemini-3.5-flash):**
> 請於今日下班前確認已收到簽署的保密協議。

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 請於今日收市前確認已收到經簽署的保密協議。

**DeepL (Cantonese):**
> 請於收市前確認已收到簽署嘅保密協議。

---

### sample-4 — Corporate Idioms (English)

**Original:**
> I honestly don't have the bandwidth to take this offline right now. Can we put a pin in it until Q3?

**Teams Native:**
> 說實話，我現在真的沒精力把它關掉。我們能先擱置到第三季嗎？

**Gemini (gemini-3.5-flash):**
> 老實說，我目前真的沒有心力私底下討論這件事。我們可以先把它擱置到第三季嗎？

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 老實說，我現在實在沒空把這件事移到私下討論。我們能不能先擱置一下，等到第三季再說？

**DeepL (Cantonese):**
> 我真係而家冇能力將呢件事 offline 處理。可唔可以等到第三季先再傾?

---

### sample-5 — Tech/Business Jargon (English)

**Original:**
> Before we finalize the vendor, let's do a quick bake-off between the two platforms. We also need to make sure we're dogfooding our own API in staging.

**Teams Native:**
> 在確定提供商之前，先來個快速的烘焙大賽。我們也必須確保在 Stage 上對自己的 API 進行過度優化

**Gemini (gemini-3.5-flash):**
> 在我們最終確定供應商之前，先對這兩個平台進行一次快速的對比測試吧。另外，我們也需要確保在 staging 環境中內部試用我們自己的 API。

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 在確定供應商之前，讓我們先對這兩套平台進行一次快速比對測試。此外，我們還需確保在預生產環境中實際使用我們自己的 API。

**DeepL (Cantonese):**
> 喺我哋落實供應商之前,先喺兩個平台做個快速對決。我哋仲要確保喺測試環境入面用緊自己嘅API。

---

### sample-6 — Passive-Aggressive / Diplomatic (English)

**Original:**
> As per my last email, going forward I would appreciate it if we could avoid working in silos. Please loop me in on all client-facing comms.

**Teams Native:**
> 根據我上封信，未來我希望能避免各自為政。請把所有面向客戶的溝通都通知我。

**Gemini (gemini-3.5-flash):**
> 正如我上一封郵件所述，希望我們今後能避免各自為政。所有面對客戶的溝通，還請務必讓我知悉。

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 如我上一封電子郵件所述，今後若能避免各自為政，我將不勝感激。請將所有與客戶相關的溝通內容都抄送給我。

**DeepL (Cantonese):**
> 根據我上一封電郵,往後我好希望我哋可以避免各自為政。請將所有面向客戶嘅溝通都抄送我。

---

### sample-7 — Workplace Slang (Traditional Chinese)

**Original:**
> 這個專案大家都在內卷，主管又整天畫大餅，最後出了事還不是我們基層要背黑鍋。

**Teams Native:**
> Everyone is fiercely competitive on this project, the supervisor keeps making empty promises, and in the end, when something goes wrong, it's us frontline staff who have to take the blame.

**Gemini (gemini-3.5-flash):**
> Everyone is burning themselves out on this project, and the manager does nothing but make empty promises. If things go south, it's us junior staff who will end up taking the fall.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> Everyone on this project is caught up in the rat race, and our manager spends all day making empty promises—but when things go wrong, it’s still us on the front lines who end up taking the fall.

---

### sample-8 — High-Context Nuance (Traditional Chinese)

**Original:**
> 客戶那邊好像有點微詞，我們最好先超前部署，免得到時候被殺個措手不及。

**Teams Native:**
> It seems the client has some better complaints. We'd better plan ahead to avoid being caught off guard when the time comes.

**Gemini (gemini-3.5-flash):**
> The client seems to have some complaints. We'd better be proactive so we don't get caught off guard.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> The client seems to have some reservations, so we’d better take proactive measures to avoid being caught off guard later.

---

### sample-9 — Legal (Traditional Chinese)

**Original:**
> 若乙方未能履行付款義務，甲方及擔保人須負連帶責任，且不得以不可抗力為由主張免責。

**Teams Native:**
> If Party B fails to perform its payment obligations, Party A and the guarantor shall bear joint responsibility, and may not claim exemption on the grounds of force majeure.

**Gemini (gemini-3.5-flash):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability, and shall not claim exemption from liability on the grounds of force majeure.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall be jointly and severally liable and may not claim exemption from liability on the grounds of force majeure.

---

### sample-10 — Financial Jargon (English)

**Original:**
> Given the current burn rate, we only have about four months of runway left, and the lender is now asking for a bigger haircut on the collateral.

**Teams Native:**
> 鑑於目前的燃燒率，我們只剩下大約四個月的跑道，貸款人現在要求對抵押品進行更大的理髮。

**Gemini (gemini-3.5-flash):**
> 以目前的資金消耗率來看，我們的資金大約只能再撐四個月，而且貸款機構現在要求對抵押品進行更大的折價。

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 以目前的資金消耗速度來看，我們只剩下大約四個月的營運資金，而貸款方現在要求對抵押品進行更大的減值。

**DeepL (Cantonese):**
> 以而家嘅燒錢速度,我哋淨係得大約四個月嘅 runway,而家貸款人要我哋對抵押品做更大嘅減值。

---

### sample-11 — Financial Jargon (English)

**Original:**
> She threw him under the bus because he dropped the ball on the merger.

**Teams Native:**
> 她因為他在合併案上失職，把他推到車上。

**Gemini (gemini-3.5-flash):**
> 她把責任推到他身上，因為他搞砸了這次的合併案。

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 她把他當替罪羊，因為他在這樁合併案中搞砸了。

**DeepL (Cantonese):**
> 佢因為佢搞砸咗合併,就將佢賣咗。

---

### sample-12 — Casual Slang (English)

**Original:**
> Sup man, you down to grab some grub later?

**Teams Native:**
> 兄弟，你待會想一起吃點東西嗎？

**Gemini (gemini-3.5-flash):**
> 嗨老兄，等一下要不要一起去吃點東西？

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 嗨老兄，待會兒要一起吃點東西嗎？

**DeepL (Cantonese):**
> 喂兄弟,你今晚有冇興趣去食嘢?

---

### sample-13 — Corporate Slang (English)

**Original:**
> Our team got flamed on the presentation last week, I don't want to see any sloppy formatting errors on an executive proposal ever again, you understand?

**Teams Native:**
> 我們團隊上週的簡報被罵了，我不想再看到任何行政提案格式混亂，你懂嗎？

**Gemini (gemini-3.5-flash):**
> 我們團隊上週的簡報被痛批了一頓。我不希望以後在給高層的提案中再看到任何粗心的排版錯誤，明白了嗎？

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL (Traditional Chinese):**
> 上週我們的團隊在簡報中遭到猛烈抨擊，我今後再也不想在高層提案中看到任何粗心的排版錯誤，明白嗎？

**DeepL (Cantonese):**
> 我哋團隊上星期嘅簡報畀人鬧到好慘,我唔想再見到任何粗疏嘅格式錯誤喺高層提案度,明唔明?

---

### sample-14 — Corporate Slang (Cantonese)

**Original:**
> 喂，尋晚單p1又要我幫手執手尾。大佬，真係頂唔順，佢又射波比我。下晝個meeting你幫手hold住個客先，我仲要嘔緊個deck。

**Teams Native:**
> _(not filled in — paste Teams' translation into messages.json)_

**Gemini (gemini-3.5-flash):**
> Hey, I had to clean up the mess for that P1 issue again last night. Seriously, I can't stand this anymore—he passed the buck to me again. Can you help hold off the client during this afternoon's meeting first? I'm still struggling to crank out the deck.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> Hey, last night that P1 guy made me clean up after him again. Dude, I really can't take it—he even shot the ball at me. In the afternoon meeting, you handle the client for me; I'm still working on the deck.

---

### sample-15 — Corporate Slang (Taiwanese)

**Original:**
> 關於這次的專案，大家可能要再接地氣一點。之前的規劃有點不痛不癢，客群完全沒有感。主管現在在敲碗等新方向，我們不能再互推皮球、瘋狂甩鍋了，這次一定要做出亮點。

**Teams Native:**
> _(not filled in — paste Teams' translation into messages.json)_

**Gemini (gemini-3.5-flash):**
> Regarding this project, we probably need to be a bit more down-to-earth. The previous plan was a bit lackluster, and it didn't resonate with our target audience at all. The manager is eagerly waiting for a new direction now. We can't keep passing the buck and shifting blame anymore; we must deliver a real highlight this time.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> When it comes to this project, we all need to be a bit more down-to-earth. The previous plan was a bit half-hearted, and the target audience didn’t connect with it at all. Our managers are now clamoring for a new direction—we can’t keep passing the buck and shifting blame anymore. This time, we absolutely have to come up with something that stands out.

---

### sample-16 — Corporate Slang (Taiwanese)

**Original:**
> 頭先個會真係多餘，老細又係度畫大餅，講埋啲模稜兩可嘅嘢。佢仲要塞錢入我袋咁款，叫我哋要『有溫度』。我都費事同佢詏，唯有扮聽話，唯唯諾諾算數。

**Teams Native:**
> _(not filled in — paste Teams' translation into messages.json)_

**Gemini (gemini-3.5-flash):**
> That meeting just now was a total waste of time. The boss was making empty promises again and saying all these vague things. He even acted like he was giving me invaluable advice, telling us to "show some warmth." I didn't even bother arguing with him, so I just pretended to agree and nodded along to get it over with.

**Foundry (gpt-5-mini):** _Error: Foundry (gpt-5-mini) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-nano):** _Error: Foundry (gpt-5-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5-chat):** _Error: Foundry (gpt-5-chat) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-5.1):** _Error: Foundry (gpt-5.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1):** _Error: Foundry (gpt-4.1) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (gpt-4.1-nano):** _Error: Foundry (gpt-4.1-nano) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Flash):** _Error: Foundry (DeepSeek-V4-Flash) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (DeepSeek-V4-Pro):** _Error: Foundry (DeepSeek-V4-Pro) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.6):** _Error: Foundry (Kimi-K2.6) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (Kimi-K2.5):** _Error: Foundry (Kimi-K2.5) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**Foundry (o3):** _Error: Foundry (o3) API 403: {"error":{"code":"403","message": "Public access is disabled. Please configure private endpoint."}}_

**DeepL:**
> That meeting earlier was totally pointless. The boss was just out there painting a rosy picture, spouting vague nonsense. He even went so far as to shove money into my pocket as if to say we need to be "warm-hearted." I didn't bother arguing with him; I just played along, nodding and saying "yes, sir."

