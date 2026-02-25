import { NextRequest, NextResponse } from "next/server";
import { getWeddingByDomain } from "@/config";

/**
 * Resolve the Telegram chat ID based on the incoming domain.
 * domains.json maps domain → wedding ID
 * Each wedding has telegramChatKey → env variable TELEGRAM_CHAT_ID_{KEY}
 */
function resolveChatId(host: string | null): string | undefined {
  if (!host) return process.env.TELEGRAM_CHAT_ID_DEFAULT;

  const domain = host.split(":")[0].toLowerCase();
  const wedding = getWeddingByDomain(domain);
  const chatId =
    process.env[`TELEGRAM_CHAT_ID_${wedding.telegramChatKey.toUpperCase()}`];
  return chatId || process.env.TELEGRAM_CHAT_ID_DEFAULT;
}

/**
 * Send message via external telegram-bot service, or fallback to direct Telegram API.
 */
async function sendTelegram(
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const botApiUrl = process.env.BOT_API_URL;

  if (botApiUrl) {
    // ── External telegram-bot microservice ──
    const res = await fetch(botApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.BOT_SECRET
          ? { Authorization: `Bearer ${process.env.BOT_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ chatId, text, parseMode: "Markdown" }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    return { ok: true };
  }

  // ── Fallback: direct Telegram API ──
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("RSVP received (no TG creds):", text);
    return { ok: true };
  }

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attendance, children, childrenCount, drinks, food } = body;

    const attendanceMap: Record<string, string> = {
      yes: "✅ Придёт",
      no: "❌ Не придёт",
      later: "⏳ Сообщит позже",
    };

    const host = req.headers.get("host");

    const message = [
      "🌸 *Новый ответ на приглашение*",
      `🌐 *Домен:* ${host || "unknown"}`,
      "",
      `👤 *Имя:* ${name}`,
      `📅 *Присутствие:* ${attendanceMap[attendance] ?? attendance}`,
      `👶 *Дети:* ${children === "yes" ? `Да — ${childrenCount || "не указано"}` : "Нет"}`,
      `🍷 *Напитки:* ${drinks?.length ? drinks.join(", ") : "не указано"}`,
      `🍽 *Еда:* ${food?.length ? food.join(", ") : "не указано"}`,
    ].join("\n");

    const chatId = resolveChatId(host);

    if (!chatId) {
      console.log("RSVP received (no chatId):", message);
      return NextResponse.json({ ok: true });
    }

    const result = await sendTelegram(chatId, message);

    if (!result.ok) {
      console.error("Telegram send error:", result.error);
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
