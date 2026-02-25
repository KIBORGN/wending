require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// ── Auth middleware ──────────────────────────────────
app.use((req, res, next) => {
  const secret = process.env.BOT_SECRET;
  if (secret) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }
  next();
});

// ── Health check ────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, bot: !!process.env.TELEGRAM_BOT_TOKEN });
});

// ── Send message to Telegram ────────────────────────
app.post("/send", async (req, res) => {
  const { chatId, text, parseMode } = req.body;

  if (!chatId || !text) {
    return res
      .status(400)
      .json({ ok: false, error: "chatId and text are required" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("[DEV] No TELEGRAM_BOT_TOKEN. Message:", text);
    return res.json({ ok: true, dev: true });
  }

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode || "Markdown",
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("Telegram API error:", err);
      return res.status(502).json({ ok: false, error: err });
    }

    const data = await tgRes.json();
    return res.json({ ok: true, messageId: data.result?.message_id });
  } catch (err) {
    console.error("Send error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// ── Start server ────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🤖 Telegram bot service running on port ${PORT}`);
  console.log(`   Token: ${process.env.TELEGRAM_BOT_TOKEN ? "✅ set" : "❌ missing"}`);
  console.log(`   Secret: ${process.env.BOT_SECRET ? "✅ set" : "⚠️ open (no auth)"}`);
});
