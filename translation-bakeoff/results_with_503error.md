# Translation Bake-off Results

Generated 2026-07-02T03:18:42.093Z

Blind-review tip: cover the "Teams Native" and "LLM" column headers when showing
this to reviewers, so the ranking isn't biased by knowing which engine is which.

---

### sample-1

**Original:**
> 三送飯鐵粉

**Teams Native:**
> Third, sending rice with iron fans

**LLM:** _Error: Gemini API 503: {
  "error": {
    "code": 503,
    "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
    "status": "UNAVAILABLE"
  }
}
_

---

### sample-2

**Original:**
> 麻煩你哋盡快覆返個報價,客戶今日要決定

**Teams Native:**
> Please reply with the quote as soon as possible; the client needs to decide today

**LLM:** _Error: Gemini API 503: {
  "error": {
    "code": 503,
    "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
    "status": "UNAVAILABLE"
  }
}
_

---

### sample-3

**Original:**
> Please confirm receipt of the signed NDA by EOD.

**Teams Native:**
> 請確認於 EOD 前已收到簽署的保密協議

**LLM:** _Error: Gemini API 503: {
  "error": {
    "code": 503,
    "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
    "status": "UNAVAILABLE"
  }
}
_

---

### sample-4 — Corporate Idioms (English)

**Original:**
> I honestly don't have the bandwidth to take this offline right now. Can we put a pin in it until Q3?

**Teams Native:**
> 說實話，我現在真的沒精力把它關掉。我們能先擱置到第三季嗎？

**LLM:** _Error: Gemini API 503: {
  "error": {
    "code": 503,
    "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
    "status": "UNAVAILABLE"
  }
}
_

---

### sample-5 — Tech/Business Jargon (English)

**Original:**
> Before we finalize the vendor, let's do a quick bake-off between the two platforms. We also need to make sure we're dogfooding our own API in staging.

**Teams Native:**
> 在確定提供商之前，先來個快速的烘焙大賽。我們也必須確保在 Stage 上對自己的 API 進行過度優化

**LLM:**
> 在我們最終確定供應商之前，讓我們快速比較一下這兩個平台。我們還需要確保我們在 Staging 環境中進行內部測試我們的 API。

---

### sample-6 — Passive-Aggressive / Diplomatic (English)

**Original:**
> As per my last email, going forward I would appreciate it if we could avoid working in silos. Please loop me in on all client-facing comms.

**Teams Native:**
> 根據我上封信，未來我希望能避免各自為政。請把所有面向客戶的溝通都通知我。

**LLM:**
> 如我上封郵件所述，今後若能避免各自為政，我將不勝感激。請將我納入所有客戶溝通的循環中。

---

### sample-7 — Workplace Slang (Traditional Chinese)

**Original:**
> 這個專案大家都在內卷，主管又整天畫大餅，最後出了事還不是我們基層要背黑鍋。

**Teams Native:**
> Everyone is fiercely competitive on this project, the supervisor keeps making empty promises, and in the end, when something goes wrong, it's us frontline staff who have to take the blame.

**LLM:**
> Regarding this project, everyone is caught in intense internal competition, and the manager is always making grand promises. In the end, if something goes wrong, it's us on the front lines who will have to take the blame.

---

### sample-8 — High-Context Nuance (Traditional Chinese)

**Original:**
> 客戶那邊好像有點微詞，我們最好先超前部署，免得到時候被殺個措手不及。

**Teams Native:**
> It seems the client has some better complaints. We'd better plan ahead to avoid being caught off guard when the time comes.

**LLM:**
> The client seems to have some reservations. We should proactively prepare to avoid being caught off guard later.

---

### sample-9 — Legal (Traditional Chinese)

**Original:**
> 若乙方未能履行付款義務，甲方及擔保人須負連帶責任，且不得以不可抗力為由主張免責。

**Teams Native:**
> If Party B fails to perform its payment obligations, Party A and the guarantor shall bear joint responsibility, and may not claim exemption on the grounds of force majeure.

**LLM:**
> If Party B fails to fulfill its payment obligation, Party A and the guarantor shall be jointly and severally liable and may not claim exemption on the grounds of force majeure.

---

### sample-10 — Financial Jargon (English)

**Original:**
> Given the current burn rate, we only have about four months of runway left, and the lender is now asking for a bigger haircut on the collateral.

**Teams Native:**
> 鑑於目前的燃燒率，我們只剩下大約四個月的跑道，貸款人現在要求對抵押品進行更大的理髮。

**LLM:**
> 鑑於目前的燒錢速度，我們的資金僅夠維持約四個月的營運，而貸款方現在要求對抵押品進行更大的減值處理。

