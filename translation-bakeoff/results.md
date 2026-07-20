# Translation Bake-off Results

Generated 2026-07-20T08:30:57.137Z

**Run mode:** `SINGLE_MESSAGE_MODE=false` — multi-message batching enabled (`BATCH_SIZE=4`) for Gemini/Qwen/DeepSeek. See the cost warning in the Token &amp; Cost Summary below before quoting any per-message figure.

Blind-review tip: cover the engine-name headers ("Teams Native", "Gemini",
"DeepL", "Azure OpenAI", "Foundry (model)") when showing this to reviewers,
so the ranking isn't biased by knowing which engine is which. (Qwen/DeepSeek
columns are currently disabled — see comments in bakeoff.js.)

## Foundry Model Screening Summary

Deployment names are whatever you named them in your Foundry resource's Deployments tab — a "failed" row below is often just a naming mismatch, not a real capability problem. Full per-message output for each model is further down, under its own `**Foundry (model):**` heading.

| Model | Status | OK | Failed | Mean latency ms | Total tokens |
|---|---|---|---|---|---|
| gpt-5-mini | ✅ | 16 | 0 | 15069 | 7806 |
| gpt-5-nano | ✅ | 16 | 0 | 18609 | 11667 |
| gpt-5-chat | ✅ | 16 | 0 | 4522 | 2510 |
| gpt-5.1 | ⚠️ partial | 14 | 2 | 4788 | 2592 |
| gpt-4.1 | ✅ | 16 | 0 | 2530 | 2492 |
| gpt-4.1-nano | ⚠️ partial | 15 | 1 | 1489 | 2497 |
| DeepSeek-V4-Flash | ✅ | 16 | 0 | 9503 | 2361 |
| DeepSeek-V4-Pro | ✅ | 16 | 0 | 3775 | 2398 |
| Kimi-K2.6 | ✅ | 16 | 0 | 38077 | 19122 |
| Kimi-K2.5 | ✅ | 16 | 0 | 18616 | 11318 |
| o3 | ⚠️ partial | 15 | 1 | 8406 | 4440 |

---

### sample-1

**Original:**
> 三送飯鐵粉

**Teams Native:**
> Third, sending rice with iron fans


_

**Foundry (gpt-5-mini):**
> a superfan who has brought food three times

**Foundry (gpt-5-nano):**
> Three Meal-Delivery Die-Hard Fans

**Foundry (gpt-5-chat):**
> Die-hard fan of meal delivery

**Foundry (gpt-5.1):**
> Three-Time Meal Delivery Superfan

**Foundry (gpt-4.1):**
> Loyal fan of San Song Fan

**Foundry (gpt-4.1-nano):**
> Dedicated fan of Three-send Rice Iron Fans

**Foundry (DeepSeek-V4-Flash):**
> Long-time admirer of Three Delivery Meals

**Foundry (DeepSeek-V4-Pro):**
> A die-hard fan of three-dish rice meals

**Foundry (Kimi-K2.6):**
> Hardcore fan of three-dish rice

**Foundry (Kimi-K2.5):**
> Die-hard fan of the three-dish rice meal

**Foundry (o3):**
> I’m a die-hard fan of “San Song Fan.”

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535673 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-2

**Original:**
> 麻煩你哋盡快覆返個報價,客戶今日要決定

**Teams Native:**
> Please reply with the quote as soon as possible; the client needs to decide today


_

**Foundry (gpt-5-mini):**
> Please respond with the quotation as soon as possible; the client needs to decide today.

**Foundry (gpt-5-nano):**
> Please get back to us with the quotation as soon as possible; the client needs to decide today.

**Foundry (gpt-5-chat):**
> Please get back to us with the quotation as soon as possible; the client needs to make a decision today.

**Foundry (gpt-5.1):**
> Please get back to us with the quotation as soon as possible; the client needs to make a decision today.

**Foundry (gpt-4.1):**
> Please get back to us with the quotation as soon as possible; the customer needs to make a decision today.

**Foundry (gpt-4.1-nano):**
> 請你們盡快回覆報價，客戶今天需要做出決定

**Foundry (DeepSeek-V4-Flash):**
> Please reply with the quotation as soon as possible; the client needs to make a decision today.

**Foundry (DeepSeek-V4-Pro):**
> Please get back to us with the quotation as soon as possible—the client needs to decide today.

**Foundry (Kimi-K2.6):**
> Please get back to us with the quotation as soon as possible—the client needs to make a decision today.

**Foundry (Kimi-K2.5):**
> Please get back to us with the quotation as soon as possible—the client needs to make a decision today.

**Foundry (o3):**
> Please get back to us with the quotation as soon as possible; the client needs to make a decision today.

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535673 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-3

**Original:**
> Please confirm receipt of the signed NDA by EOD.

**Teams Native:**
> 請確認於 EOD 前已收到簽署的保密協議


_

**Foundry (gpt-5-mini):**
> 請於今日下班前確認已收到已簽署的NDA。

**Foundry (gpt-5-nano):**
> 請於今天結束前確認已收到簽署的 NDA。

**Foundry (gpt-5-chat):**
> 請於今日下班前確認已收到簽署完成的 NDA。

**Foundry (gpt-5.1):**
> 請在今日下班前確認已收到簽署好的 NDA。

**Foundry (gpt-4.1):**
> 請於今天結束前確認已收到已簽署的NDA。

**Foundry (gpt-4.1-nano):**
> 請於今日結束前確認已收到簽署的保密協議。

**Foundry (DeepSeek-V4-Flash):**
> 請於今日下班前確認收到已簽署的保密協議。

**Foundry (DeepSeek-V4-Pro):**
> 請喺今日結束前確認收到已簽署嘅保密協議。

**Foundry (Kimi-K2.6):**
> 請於今日下班前確認已收到簽署完成的NDA。

**Foundry (Kimi-K2.5):**
> 請於今日下班前確認是否已收到簽署完成的保密協議。

**Foundry (o3):**
> 請在今天結束前確認已收到已簽署的保密協議。

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535673 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535674 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-4 — Corporate Idioms (English)

**Original:**
> I honestly don't have the bandwidth to take this offline right now. Can we put a pin in it until Q3?

**Teams Native:**
> 說實話，我現在真的沒精力把它關掉。我們能先擱置到第三季嗎？


_

**Foundry (gpt-5-mini):**
> 老實說，我現在沒有餘力把這件事移到私下討論。我們可以把它擱到 Q3 再處理嗎？

**Foundry (gpt-5-nano):**
> 我現在確實沒有精力把這件事私下處理。可以先把它暫時擱置，等到第3季度再討論嗎？

**Foundry (gpt-5-chat):**
> 我現在確實沒有餘力私下處理這件事。我們可以先暫時擱置，到第三季再討論嗎？

**Foundry (gpt-5.1):** _Error: Could not parse this message's translation out of the batch response._

**Foundry (gpt-4.1):**
> 我目前真的沒有餘力私下討論這個議題。我們可以延後到第三季再處理嗎？

**Foundry (gpt-4.1-nano):** _Error: Could not parse this message's translation out of the batch response._

**Foundry (DeepSeek-V4-Flash):**
> 我現在真的沒有餘力處理這個話題。能不能先擱置，等到第三季度再討論？

**Foundry (DeepSeek-V4-Pro):**
> 老實講，我而家真係冇精力再同你深入傾呢件事。可唔可以暫時放低，等到第三季先再講？

**Foundry (Kimi-K2.6):**
> 老實說，我現在真的沒有時間另外處理這件事。我們可以先暫時擱置到Q3嗎？

**Foundry (Kimi-K2.5):**
> 老實說，我現在沒有餘力私下處理此事。我們能否先暫時擱置，延到第三季再談？

**Foundry (o3):** _Error: Could not parse this message's translation out of the batch response._

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535674 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535675 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-5 — Tech/Business Jargon (English)

**Original:**
> Before we finalize the vendor, let's do a quick bake-off between the two platforms. We also need to make sure we're dogfooding our own API in staging.

**Teams Native:**
> 在確定提供商之前，先來個快速的烘焙大賽。我們也必須確保在 Stage 上對自己的 API 進行過度優化


_

**Foundry (gpt-5-mini):**
> 在確定供應商之前，先在兩個平台之間做一次快速評測。我們也要確保在 staging（測試）環境中實際內部使用我們自己的 API。

**Foundry (gpt-5-nano):**
> 在最終確定供應商之前，讓我們對兩個平台進行快速的比對測試。也需要確保在 staging 環境中實際使用我們自己的 API 進行內部驗證。

**Foundry (gpt-5-chat):**
> 在我們最終確定供應商之前，先快速比較一下這兩個平台。我們也需要確保在測試環境中實際使用我們自己的 API。

**Foundry (gpt-5.1):**
> 在我們敲定供應商之前，先對這兩個平台做一次簡單的比較測試。另外，我們也需要確保在測試環境中實際使用我們自己的 API。

**Foundry (gpt-4.1):**
> 在我們確定供應商之前，讓我們對這兩個平台做個簡單的比評測。我們也需要確保在測試環境中使用自己的API進行實際驗證。

**Foundry (gpt-4.1-nano):**
> 在我們最終確定供應商之前，讓我們快速比較一下這兩個平台。我們還需要確保在測試環境中進行我們自己的API測試。

**Foundry (DeepSeek-V4-Flash):**
> 在我們確定供應商之前，先對兩個平台做一次快速的對比測試。另外，我們也需要確保在測試環境中自發性地使用我們自己的 API。

**Foundry (DeepSeek-V4-Pro):**
> 在最終確定廠商之前，我們先快速比較一下這兩個平台。我們也需要確保在預發環境中使用自家的 API 進行內部測試。

**Foundry (Kimi-K2.6):**
> 在敲定供應商之前，讓我們針對這兩個平台快速進行一次比較測試。另外，我們也要確保在 staging 環境中實際使用自己的 API。

**Foundry (Kimi-K2.5):**
> 在我們確定廠商之前，先針對這兩個平台進行快速實測比較。另外，我們也要確保在測試環境中優先採用自家的 API。

**Foundry (o3):**
> 在最終確認供應商之前，我們先對這兩個平台進行一次快速評比。另外，也要確保我們在 staging 環境中使用自家的 API 進行內部測試。

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535675 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535675 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-6 — Passive-Aggressive / Diplomatic (English)

**Original:**
> As per my last email, going forward I would appreciate it if we could avoid working in silos. Please loop me in on all client-facing comms.

**Teams Native:**
> 根據我上封信，未來我希望能避免各自為政。請把所有面向客戶的溝通都通知我。


_

**Foundry (gpt-5-mini):**
> 如我上封郵件所述，往後請避免各自為政，並請在所有對客戶的對外溝通中抄送我。

**Foundry (gpt-5-nano):**
> 依照我上封郵件所述，往後希望避免各部門各自為政。請把我納入所有面向客戶的溝通。

**Foundry (gpt-5-chat):**
> 如我上一封電子郵件所述，未來我希望我們能避免各自為政。請將所有面向客戶的溝通都讓我知悉。

**Foundry (gpt-5.1):**
> 如我上一封電郵所述，之後若能避免各自為政，我將不勝感激。請將我一併加入所有面向客戶的溝通中。

**Foundry (gpt-4.1):**
> 根據我之前的電子郵件，未來我希望我們能避免各自為政。請將我加入所有與客戶相關的溝通中。

**Foundry (gpt-4.1-nano):**
> 根據我上封郵件的內容，今後如果可以的話，請避免各自為政。請將我加入所有面向客戶的溝通中。

**Foundry (DeepSeek-V4-Flash):**
> 根據我上一封郵件，未來我希望我們能夠避免各自為政的情況。請將所有對外客戶的溝通副本寄給我。

**Foundry (DeepSeek-V4-Pro):**
> 承上封電郵，今後希望我們能盡量避免各自為政。所有與客戶的溝通，請讓我知道。

**Foundry (Kimi-K2.6):**
> 如我先前郵件所述，往後請避免各自為政。所有面對客戶的溝通，都請讓我參與。

**Foundry (Kimi-K2.5):**
> 如同我上封郵件所述，往後請避免各自為政。所有與客戶相關的溝通，請務必讓我知情。

**Foundry (o3):**
> 如我在上一封郵件所提，未來請避免各自為政。所有對客戶的溝通請務必將我納入收件人。

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535676 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535676 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-7 — Workplace Slang (Traditional Chinese)

**Original:**
> 這個專案大家都在內卷，主管又整天畫大餅，最後出了事還不是我們基層要背黑鍋。

**Teams Native:**
> Everyone is fiercely competitive on this project, the supervisor keeps making empty promises, and in the end, when something goes wrong, it's us frontline staff who have to take the blame.


_

**Foundry (gpt-5-mini):**
> Everyone on this project is getting caught up in internal competition; the managers keep making pie-in-the-sky promises, and if something goes wrong it’ll be us frontline staff who end up taking the blame.

**Foundry (gpt-5-nano):**
> This project has everyone caught in an internal competition; the supervisor keeps promising grand plans, and when something goes wrong, it's us on the front lines who end up taking the blame.

**Foundry (gpt-5-chat):**
> Everyone on this project is caught up in unhealthy internal competition, and management keeps making grand promises all day. When something goes wrong in the end, it’s still us on the front lines who have to take the blame.

**Foundry (gpt-5.1):**
> Everyone on this project is stuck in unhealthy internal competition, and management keeps making empty promises. When something goes wrong, it’s still us on the front line who end up taking the blame.

**Foundry (gpt-4.1):**
> Everyone on this project is caught up in internal competition, and management keeps making grand promises. But in the end, if something goes wrong, it’s the frontline staff like us who take the blame.

**Foundry (gpt-4.1-nano):**
> 這個專案大家都在內卷，主管又整天畫大餅，最後出了事還不是我們基層要背黑鍋。

**Foundry (DeepSeek-V4-Flash):**
> Everyone on this project is hustling excessively, and the manager keeps painting rosy pictures. In the end, if something goes wrong, we're the ones on the ground who have to take the blame.

**Foundry (DeepSeek-V4-Pro):**
> Everyone on this project is caught up in rat-racing, and the higher-ups just keep selling pipe dreams. If things go south, it's us frontline staff who end up taking the fall anyway.

**Foundry (Kimi-K2.6):**
> Everyone on this project is caught in a rat race, while management is constantly selling pipe dreams. When things eventually go south, it'll be us rank-and-file staff who take the fall.

**Foundry (Kimi-K2.5):**
> Everyone on this project is caught in a rat race, and management keeps making empty promises. When things go wrong, it's always us junior staff who end up taking the blame.

**Foundry (o3):**
> Everyone on this project is stuck in endless internal infighting, the boss keeps making grandiose promises, and when things go wrong it’s us frontline employees who’ll end up taking the blame.

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535676 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-8 — High-Context Nuance (Traditional Chinese)

**Original:**
> 客戶那邊好像有點微詞，我們最好先超前部署，免得到時候被殺個措手不及。

**Teams Native:**
> It seems the client has some better complaints. We'd better plan ahead to avoid being caught off guard when the time comes.


_

**Foundry (gpt-5-mini):**
> The client seems to have some concerns. We should take proactive measures now so we aren’t caught off guard later.

**Foundry (gpt-5-nano):**
> It seems the client has some objections; we’d better get ahead of it and implement proactive measures to avoid being caught off guard later.

**Foundry (gpt-5-chat):**
> It seems like the client may have some concerns. We should prepare proactively in advance so we don’t get caught off guard later.

**Foundry (gpt-5.1):**
> It seems the client has some concerns, so we’d better take proactive measures now to avoid being caught off guard later.

**Foundry (gpt-4.1):**
> It seems the client has some concerns. We should proactively prepare to avoid being caught off guard later.

**Foundry (gpt-4.1-nano):**
> 客戶那邊似乎有些微詞，我們最好提前做好部署，免得到時被措手不及。

**Foundry (DeepSeek-V4-Flash):**
> The client seems to have some complaints. We'd better proactively prepare in advance, so we won't get caught off guard later.

**Foundry (DeepSeek-V4-Pro):**
> The client seems to have some misgivings. We'd better be proactive and plan ahead, so we're not caught off guard.

**Foundry (Kimi-K2.6):**
> The client seems to have some reservations. We'd better take preemptive action so we don't get caught off guard.

**Foundry (Kimi-K2.5):**
> The client seems to have some reservations. We'd better prepare proactively so we don't get blindsided later.

**Foundry (o3):**
> It sounds like the client has some concerns, so we should take proactive steps now to avoid being caught off guard later.

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535677 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-9 — Legal (Traditional Chinese)

**Original:**
> 若乙方未能履行付款義務，甲方及擔保人須負連帶責任，且不得以不可抗力為由主張免責。

**Teams Native:**
> If Party B fails to perform its payment obligations, Party A and the guarantor shall bear joint responsibility, and may not claim exemption on the grounds of force majeure.


_

**Foundry (gpt-5-mini):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability and may not invoke force majeure to claim exemption.

**Foundry (gpt-5-nano):**
> Should Party B fail to perform its payment obligations, Party A and the guarantor shall bear joint and several liability, and may not rely on force majeure as a basis for exemption from liability.

**Foundry (gpt-5-chat):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability and may not claim exemption on the grounds of force majeure.

**Foundry (gpt-5.1):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability, and may not claim exemption from liability on the grounds of force majeure.

**Foundry (gpt-4.1):**
> If Party B fails to fulfill its payment obligations, both Party A and the guarantor shall be jointly and severally liable, and may not claim exemption from liability on the grounds of force majeure.

**Foundry (gpt-4.1-nano):**
> If Party B fails to fulfill the payment obligation, Party A and the guarantor shall bear joint and several liability, and cannot claim exemption on the grounds of force majeure.

**Foundry (DeepSeek-V4-Flash):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability and may not claim exemption on the grounds of force majeure.

**Foundry (DeepSeek-V4-Pro):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability, and shall not claim exemption from liability on the grounds of force majeure.

**Foundry (Kimi-K2.6):**
> If Party B fails to perform its payment obligations, Party A and the guarantor shall bear joint and several liability, and may not claim exemption on the grounds of force majeure.

**Foundry (Kimi-K2.5):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall bear joint and several liability, and may not claim exemption on the grounds of force majeure.

**Foundry (o3):**
> If Party B fails to fulfill its payment obligations, Party A and the guarantor shall be jointly and severally liable and may not invoke force majeure as a defense.

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535677 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-10 — Financial Jargon (English)

**Original:**
> Given the current burn rate, we only have about four months of runway left, and the lender is now asking for a bigger haircut on the collateral.

**Teams Native:**
> 鑑於目前的燃燒率，我們只剩下大約四個月的跑道，貸款人現在要求對抵押品進行更大的理髮。


_

**Foundry (gpt-5-mini):**
> 以目前的燒錢速度，我們大約還有四個月的現金跑道，貸方現在要求對擔保品提高折讓幅度。

**Foundry (gpt-5-nano):**
> 根據目前的燒錢速度，我們大約只剩下四個月的資金跑道，且貸方現在要求對抵押品給出更大的折讓。

**Foundry (gpt-5-chat):**
> 考量目前的資金消耗速度，我們的現金流大約只剩四個月可支撐，而且貸方現在要求對擔保品進行更大幅度的減記。

**Foundry (gpt-5.1):**
> 以目前的燒錢速度來看，我們僅剩約四個月的資金可運作，而且貸方現在要求對擔保品進行更大幅度的折價。

**Foundry (gpt-4.1):**
> 根據目前的資金消耗速度，我們大約只剩下四個月的資金可以運作，而且貸方現在要求對抵押品作出更大的減值。

**Foundry (gpt-4.1-nano):**
> 鑑於目前的資金消耗速度，我們的資金只剩大約四個月的運營時間，而貸方現在要求對抵押品進行更大幅度的減讓。

**Foundry (DeepSeek-V4-Flash):**
> 根據目前的燒錢速度，我們的資金僅剩下約四個月的週轉期，而貸款方現在要求對抵押品進行更大比例的減值。

**Foundry (DeepSeek-V4-Pro):**
> 以目前嘅燒錢速度，我哋剩返大約四個月嘅跑道，貸款人而家仲要求對抵押品削更多嘅價值。

**Foundry (Kimi-K2.6):**
> 以目前的資金消耗速度，我們僅剩下約四個月的營運資金，且貸方現在要求對抵押品提供更大的折價。

**Foundry (Kimi-K2.5):**
> 鑒於目前的資金消耗速度，我們僅剩約四個月的營運週轉期，而放款人現正要求對擔保品提高減計幅度。

**Foundry (o3):**
> 以目前的資金燒耗速度來看，我們的現金流只能再維持大約四個月，而且貸款方現在要求對擔保品給予更大的折價。

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535678 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535678 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-11 — Financial Jargon (English)

**Original:**
> She threw him under the bus because he dropped the ball on the merger.

**Teams Native:**
> 她因為他在合併案上失職，把他推到車上。


_

**Foundry (gpt-5-mini):**
> 她為了推卸責任而出賣了他，因為他在合併案中失職。

**Foundry (gpt-5-nano):**
> 她因他在合併案上失職而把他推下水。

**Foundry (gpt-5-chat):**
> 她把他推出去背黑鍋，因為他把那場併購案搞砸了。

**Foundry (gpt-5.1):**
> 她為了這件事把他推出去當替罪羊，因為他在併購案上沒有處理好。

**Foundry (gpt-4.1):**
> 她把責任全推到他身上，因為他在合併案上沒有做好本分。

**Foundry (gpt-4.1-nano):**
> 她把他推下了戰車，因為他在合併案中搞砸了。

**Foundry (DeepSeek-V4-Flash):**
> 她把他推出來當代罪羔羊，因為他在併購案上搞砸了。

**Foundry (DeepSeek-V4-Pro):**
> 佢將佢推出去做替死鬼，因為佢搞衰咗個合併。

**Foundry (Kimi-K2.6):**
> 因為他在併購案上搞砸了，她就把責任推就把責任推給他，讓他去背黑鍋。

**Foundry (Kimi-K2.5):**
> 她讓他背了黑鍋，因為他在這宗併購案中搞砸了。

**Foundry (o3):**
> 她為了撇清責任，把所有過錯都推到他身上，因為他在併購案中失職。

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535678 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535679 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-12 — Casual Slang (English)

**Original:**
> Sup man, you down to grab some grub later?

**Teams Native:**
> 兄弟，你待會想一起吃點東西嗎？


_

**Foundry (gpt-5-mini):**
> 欸，兄弟，等一下要不要去吃點東西？

**Foundry (gpt-5-nano):**
> 嗨，兄弟，晚點想不想一起去吃點東西？

**Foundry (gpt-5-chat):**
> 嘿哥們，等等要不要一起去吃點東西？

**Foundry (gpt-5.1):** _Error: Could not parse this message's translation out of the batch response._

**Foundry (gpt-4.1):**
> 嗨，你等一下想一起去吃點東西嗎？

**Foundry (gpt-4.1-nano):**
> 嗨，兄弟，你晚上想去吃點東西嗎？

**Foundry (DeepSeek-V4-Flash):**
> 嘿，老兄，你晚點有空一起去吃點東西嗎？

**Foundry (DeepSeek-V4-Pro):**
> 嘿兄弟，等陣得唔得閒去食啲嘢？

**Foundry (Kimi-K2.6):**
> 兄弟，晚點要不要一起去吃點東西？

**Foundry (Kimi-K2.5):**
> 嘿兄弟，晚點要不要一起去吃點東西？

**Foundry (o3):**
> 嘿，哥們兒，等等要不要一起去吃點東西？

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535679 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535679 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-13 — Corporate Slang (English)

**Original:**
> Our team got flamed on the presentation last week, I don't want to see any sloppy formatting errors on an executive proposal ever again, you understand?

**Teams Native:**
> 我們團隊上週的簡報被罵了，我不想再看到任何行政提案格式混亂，你懂嗎？


_

**Foundry (gpt-5-mini):**
> 我們團隊上週的簡報受到嚴厲批評，我不想在任何給高層的提案中再看到任何馬虎的格式錯誤，明白嗎？

**Foundry (gpt-5-nano):**
> Our team was harshly criticized for the presentation last week, and I don’t want to see any sloppy formatting errors on an executive proposal ever again. Do you understand?

**Foundry (gpt-5-chat):**
> 我們的團隊上週在簡報上被狠狠批評了，我不想再看到任何高階主管提案裡出現草率的格式錯誤，明白嗎？

**Foundry (gpt-5.1):**
> 我們團隊上週在簡報中被狠狠批評了一頓，我不想再在任何給高層的提案裡看到潦草的格式錯誤，你明白嗎？

**Foundry (gpt-4.1):**
> 我們團隊上週的簡報被狠狠批評了一番，我不想再看到任何執行報告出現馬虎的格式錯誤，你明白嗎？

**Foundry (gpt-4.1-nano):**
> 我們團隊上週的演示遭到嚴厲批評，我不希望再看到任何潦草的格式錯誤在高層提案中出現，你明白嗎？

**Foundry (DeepSeek-V4-Flash):**
> 我們團隊在上週的簡報中被批評得很慘，我絕不希望再看到任何格式上的草率錯誤出現在呈交給高層的提案中，你明白了嗎？

**Foundry (DeepSeek-V4-Pro):**
> Our team was heavily criticized for the presentation last week. I don’t want to see any careless formatting errors in an executive proposal ever again. Do you understand?

**Foundry (Kimi-K2.6):**
> 我們團隊上週的簡報被砲轟得體無完膚，往後我絕不想再看到任何高層提案出現這種亂七八糟的格式錯誤，聽懂了嗎？

**Foundry (Kimi-K2.5):**
> 我們團隊上週的簡報被嚴厲批評，我不希望再在主管級提案中看到任何草率的格式錯誤，明白了嗎？

**Foundry (o3):**
> 我們團隊上週的簡報被狠狠批評，我再也不想在送交高層的提案上看到任何草率的格式錯誤，明白嗎？

**DeepL (Traditional Chinese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535680 132 https://api-free.deepl.com/v2/translate -->_

**DeepL (Cantonese):** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535680 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-14 — Corporate Slang (Cantonese)

**Original:**
> 喂，尋晚單p1又要我幫手執手尾。大佬，真係頂唔順，佢又射波比我。下晝個meeting你幫手hold住個客先，我仲要嘔緊個deck。

**Teams Native:**
> Hey, last night, single p1 asked me to help clean up the aftermath. Big brother, I really couldn't take it anymore, and he shot the ball at me again. In the afternoon meeting, you help hold the guest first, and I'm still throwing up.
 

**Foundry (gpt-5-mini):**
> Hey — I had to tidy up the P1 again last night. Honestly, I can’t take it; they keep passing the work to me. Can you hold the client in this afternoon’s meeting? I’m still finishing the deck.

**Foundry (gpt-5-nano):**
> Hey, last night on the P1 task you asked me to help tidy up again. Boss, I’m really at my limit; he keeps throwing shade at me. For the afternoon meeting, could you hold the client for me first? I’m still scrambling with the deck.

**Foundry (gpt-5-chat):**
> Hey, I had to clean up another P1 issue last night. Seriously, I can’t take it anymore — they dumped the problem on me again. Can you hold the client for this afternoon’s meeting first? I’m still scrambling to finish the deck.

**Foundry (gpt-5.1):**
> 喂，昨晚那張 p1 又要我幫忙收拾爛攤子。拜託，真的受不了，他又把問題丟給我。下午那個 meeting 你先幫忙穩住客戶，我這邊還得把那份 deck 趕出來。

**Foundry (gpt-4.1):**
> Hey, last night p1 needed me to clean up the aftermath again. Seriously, I can’t take it — once again he dumped all the work on me. Can you help handle the client during the meeting this afternoon? I’m still working on the deck and about to throw up.

**Foundry (gpt-4.1-nano):**
> 喂，昨晚單p1又要我幫忙整理尾巴。大佬，真的頂不順，他又在背後射波比我。下午的會議你幫忙控制住客戶，我還在趕那個簡報。

**Foundry (DeepSeek-V4-Flash):**
> 喂，昨晚那個P1問題又要我收拾爛攤子。老兄，我真的受不了了，他又把工作推給我。下午的會議你先幫我應付客戶，我還在趕著完成那份簡報。

**Foundry (DeepSeek-V4-Pro):**
> Hey, that P1 from last night needs me to clean up the mess again. Seriously, I can’t take it anymore — he just passed the buck to me. For the afternoon meeting, can you hold the client’s fort for now? I’m still grinding out the deck.

**Foundry (Kimi-K2.6):**
> Hey, I had to clean up the mess on yesterday's P1 again. Dude, I really can't take it anymore—he dumped it on me again. Cover the client in this afternoon's meeting for me first; I'm still grinding away at the deck.

**Foundry (Kimi-K2.5):**
> Hey, last night's P1 had me cleaning up the mess again. Seriously, I can't take it anymore—he dumped it on me again. Help me hold down the client in this afternoon's meeting first, I'm still grinding out the deck.

**Foundry (o3):**
> Hey, I had to clean up the aftermath of that P1 again last night. Honestly, I’m fed up—he passed the buck to me yet again. Could you handle the client in the afternoon meeting for now? I’m still cranking out the deck.

**DeepL:** _Error: DeepL API 403: <!--# 8j54S4Zq5stD5StSrvt11VRW0PqSnkS40R7SM7qd-->

<!-- 119539 1 2 0 1784535681 132 https://api-free.deepl.com/v2/translate -->_

---

### sample-15 — Corporate Slang (Taiwanese)

**Original:**
> 關於這次的專案，大家可能要再接地氣一點。之前的規劃有點不痛不癢，客群完全沒有感。主管現在在敲碗等新方向，我們不能再互推皮球、瘋狂甩鍋了，這次一定要做出亮點。

**Teams Native:**
> Regarding this project, people might want to be a bit more down-to-earth. The previous plan was rather indifferent, with no customer base at all. Supervisors are now eagerly waiting for new directions. We can't keep passing the buck or passing the buck—this time we must create something highlight.

**Foundry (gpt-5-mini):**
> For this project we need to be more grounded. The previous plan was bland and didn’t resonate with our target audience at all. Management is eagerly waiting for a new direction — we can’t keep passing the buck or blaming each other. This time we must deliver something that truly stands out.

**Foundry (gpt-5-nano):**
> Regarding this project, we probably need to be more grounded. The previous plan was a bit lukewarm, and the target audience didn’t feel it at all. The supervisor is now pressing for a new direction; we can’t keep passing the buck or blaming each other. This time we must deliver a standout.

**Foundry (gpt-5-chat):**
> Regarding this project, we probably need to be more grounded and relatable. The previous planning felt a bit toothless, and the target audience had zero connection to it. Management is already pushing for a new direction, so we can’t keep passing the buck and shifting blame. We need to deliver something that truly stands out this time.

**Foundry (gpt-5.1):**
> 關於這次的專案，大家可能要再貼近實際一點。之前的規劃有點虛，客群完全沒感覺。主管現在在緊盯著等新方向，我們不能再互相踢皮球、瘋狂甩鍋了，這次一定要做出亮點。

**Foundry (gpt-4.1):**
> Regarding this project, everyone needs to be more grounded and practical. The previous plan was too vague and didn’t resonate with our target audience at all. The supervisor is now impatiently waiting for a new direction, and we can’t keep passing the buck or shirking responsibility. This time, we must deliver something outstanding.

**Foundry (gpt-4.1-nano):**
> 關於這次的專案，大家可能需要更貼近市場。之前的規劃有點空洞，完全沒有引起客群的共鳴。主管現在在催促新方向，我們不能再推諉扯皮、推卸責任了，這次一定要做出亮點。

**Foundry (DeepSeek-V4-Flash):**
> Regarding this project, everyone may need to be more grounded. The previous planning was neither here nor there, and the target audience was completely unengaged. The supervisor is now eagerly awaiting a new direction, and we can no longer pass the buck or shift blame to each other. This time, we absolutely must deliver highlights.

**Foundry (DeepSeek-V4-Pro):**
> Regarding this project, everyone may need to be more down-to-earth. The earlier plan was a bit lukewarm, and the target audience felt completely disconnected. Management is now eagerly knocking on the table for new direction. We can’t keep passing the buck and shifting blame. This time, we have to deliver a real highlight.

**Foundry (Kimi-K2.6):**
> Regarding this project, we all need to be more grounded. The previous planning was too lukewarm and completely failed to resonate with the target audience. Our supervisor is eagerly awaiting a new direction, so we can't keep passing the buck or shifting blame anymore. We absolutely must deliver something outstanding this time.

**Foundry (Kimi-K2.5):**
> Regarding this project, we all need to be more grounded. The previous planning was too lukewarm and completely failed to resonate with the target audience. Management is eagerly awaiting a new direction, so we can't keep passing the buck or shifting blame. We must deliver real highlights this time.

**Foundry (o3):**
> Regarding this project, we probably need to be more down-to-earth. The previous plan was too lukewarm and didn’t resonate with the target audience at all. The manager is tapping his bowl waiting for a new direction—we can’t keep passing the buck and dodging responsibility. We have to produce something impressive this time.


---

### sample-16 — Corporate Slang (Taiwanese)

**Original:**
> 頭先個會真係多餘，老細又係度畫大餅，講埋啲模稜兩可嘅嘢。佢仲要塞錢入我袋咁款，叫我哋要『有溫度』。我都費事同佢詏，唯有扮聽話，唯唯諾諾算數。

**Teams Native:**
> That meeting just now was really unnecessary, and the boss was just making empty promises and saying all sorts of ambiguous things. He even stuffed money into my pocket, telling us to be 'warm.' I couldn't be bothered to argue with him, so I just pretended to obey and meekly agreed.
 

**Foundry (gpt-5-mini):**
> That meeting was pointless — the boss was painting grand visions and speaking in vague terms. He even dangled money and told us to be “more warm.” I don’t want to argue, so I’ll just play along and keep my head down.

**Foundry (gpt-5-nano):**
> That meeting just now was really unnecessary. The boss kept painting grand visions and spoke in vague terms. He even tried to pay me off, telling us we need to be “warm.” I’m fed up arguing with him; I’ll just pretend to listen and nod along.

**Foundry (gpt-5-chat):**
> That meeting earlier was such a waste of time. The boss was overselling things again and talking in vague, ambiguous terms. Then he acted like he was doing us a huge favor, telling us we needed to “show more warmth.” I couldn’t be bothered arguing with him, so I just pretended to go along with it and nodded obediently.

**Foundry (gpt-5.1):**
> 剛才那個會真的很多餘，老闆又在那邊畫大餅，講一堆模稜兩可的話。他還一副硬要塞任務給我的樣子，叫我們要「有溫度」。我也懶得跟他爭辯，只好裝作聽話，點頭附和算了。

**Foundry (gpt-4.1):**
> That meeting just now was completely unnecessary; the boss was just making empty promises and talking in circles again. He even acted like he was doing us a favor and asked us to "bring warmth" to our work. I couldn’t be bothered to argue with him, so I just pretended to listen and nodded along to get it over with.

**Foundry (gpt-4.1-nano):**
> 剛才的會議真是多餘，老闆又在吹大話，說些模稜兩可的話。他還要塞錢進我口袋，叫我們要『有溫度』。我也懶得跟他爭，只能裝作聽話，點頭應付。

**Foundry (DeepSeek-V4-Flash):**
> 剛剛那個會真是多餘，老闆又在畫大餅，講些模稜兩可的話。他還一副要強加好意的樣子，叫我們要『有溫度』。我也懶得跟他爭辯，只好裝作聽話，唯唯諾諾算了。

**Foundry (DeepSeek-V4-Pro):**
> The meeting just now was really pointless. The boss was again painting pie-in-the-sky pictures and saying vague stuff. He also acted like he was doing us a favor by lecturing us on being “empathetic.” I couldn’t be bothered to argue with him, so I just played along and nodded in agreement.

**Foundry (Kimi-K2.6):**
> That meeting earlier was completely unnecessary. The boss was making empty promises again and spouting vague nonsense. He even patronizingly acted like he was doing us some huge favor, telling us to be "warm." I couldn't be bothered arguing with him, so I'll just play along, nod along obediently, and leave it at that.

**Foundry (Kimi-K2.5):**
> That meeting just now was completely pointless—the boss was selling dreams again, spouting all this ambiguous nonsense. He was trying to butter us up, telling us to be "warm." I couldn't be bothered arguing with him, so I'll just play along and nod through it.

**Foundry (o3):**
> That last meeting was completely unnecessary. The boss was drawing pie in the sky again, spouting vague ideas. He even acted like he was stuffing money in my pocket, telling us we need to be more “heart-warming.” I couldn’t be bothered to argue, so I just pretended to listen and nodded along.


---

## Token &amp; Cost Summary

> ⚠️ **Batched-mode cost warning:** Gemini/Qwen/DeepSeek figures below came from calls bundling multiple messages together. Each call's fixed system-prompt overhead is divided across every message in that batch, so "cost/message" here *understates* real production cost, where every message pays that overhead alone. Re-run with `SINGLE_MESSAGE_MODE=true` for a number that matches production. (DeepL and Azure OpenAI are unaffected — they always send one message per call, in either mode.)

Rates come from `pricing.json` and must be kept in sync with each vendor's current pricing page — see the comment at the top of that file. "rate not set" means `pricing.json` has no usable rate for that engine/model, not that it's free.

| Engine | Model | Mode | Calls | Messages | Input tok | Output tok | Cached tok | Chars | Cost/message | Latency ms (median/min/max) |
|---|---|---|---|---|---|---|---|---|---|---|
| Foundry | gpt-5-mini | batch | 4 | 16 | 1762 | 6044 | 0 | — | $0.000783 | 14664 / 13098 / 17851 |
| Foundry | gpt-5-nano | batch | 4 | 16 | 1762 | 9905 | 0 | — | $0.000253 | 19563 / 15105 / 20204 |
| Foundry | gpt-5-chat | batch | 4 | 16 | 1762 | 748 | 0 | — | $0.000605 | 4120 / 3641 / 6208 |
| Foundry | gpt-5.1 | batch | 4 | 16 | 1762 | 830 | 0 | — | $0.000656 | 4430 / 3891 / 6401 |
| Foundry | gpt-4.1 | batch | 4 | 16 | 1766 | 726 | 0 | — | $0.000584 | 1737 / 1356 / 5291 |
| Foundry | gpt-4.1-nano | batch | 4 | 16 | 1766 | 731 | 0 | — | $0.000029 | 1539 / 1044 / 1832 |
| Foundry | DeepSeek-V4-Flash | batch | 4 | 16 | 1695 | 666 | 256 | — | $0.000041 | 9315 / 3028 / 16356 |
| Foundry | DeepSeek-V4-Pro | batch | 4 | 16 | 1695 | 703 | 768 | — | $0.000261 | 3665 / 3289 / 4482 |
| Foundry | Kimi-K2.6 | batch | 4 | 16 | 1761 | 17361 | 256 | — | $0.004432 | 33428 / 13225 / 72227 |
| Foundry | Kimi-K2.5 | batch | 4 | 16 | 1761 | 9557 | 768 | — | $0.001858 | 17737 / 10137 / 28852 |
| Foundry | o3 | batch | 4 | 16 | 1762 | 2678 | 0 | — | $0.001559 | 7618 / 7117 / 11272 |

