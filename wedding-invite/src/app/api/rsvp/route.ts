import { NextRequest, NextResponse } from "next/server";
import siteConfig from "@/config/site.json";

/**
 * Resolve the Telegram chat ID based on the incoming domain.
 * Uses the "domains" mapping in site.json → env variable lookup.
 *
 * site.json domains example:
 *   "localhost": "default",
 *   "test1.com": "CHAT_ID_FOR_TEST1"
 *
 * Corresponding .env variables:
 *   TELEGRAM_CHAT_ID_DEFAULT=-5201219877
 *   TELEGRAM_CHAT_ID_FOR_TEST1=-123456789
 */
function resolveChatId(host: string | null): string | undefined {
  if (!host) return process.env.TELEGRAM_CHAT_ID_DEFAULT;

  // Strip port (e.g. localhost:3000 → localhost)
  const domain = host.split(":")[0].toLowerCase();

  // Look up in config
  const envKey = siteConfig.domains[domain as keyof typeof siteConfig.domains];
  if (envKey) {
    const chatId = process.env[`TELEGRAM_CHAT_ID_${envKey.toUpperCase()}`];
    if (chatId) return chatId;
  }

  // Fallback to default
  return process.env.TELEGRAM_CHAT_ID_DEFAULT;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attendance, children, childrenCount, drinks, food } = body;

    // Build Telegram message
    const attendanceMap: Record<string, string> = {
      yes: "✅ Придёт",
      no: "❌ Не придёт",
      later: "⏳ Сообщит позже",
    };

    const foodMap: Record<string, string> = {
      meat: "🥩 Мясо",
      fish: "🐟 Рыба",
      "": "Не указано",
    };

    const host = req.headers.get("host");

    const message = [
      "🌸 *Новый ответ на приглашение*",
      `🌐 *Домен:* ${host || "unknown"}`,
      "",
      `👤 *Имя:* ${name}`,
      `📅 *Присутствие:* ${attendanceMap[attendance] ?? attendance}`,
      `👶 *Дети:* ${children === "yes" ? `Да — ${childrenCount || "не указано"}` : "Нет"}`,
      `🍷 *Напитки:* ${drinks?.join(", ") || "не указано"}`,
      `🍽 *Еда:* ${foodMap[food] ?? "не указано"}`,
    ].join("\n");

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = resolveChatId(host);

    if (!token || !chatId) {
      // Dev mode — just log and return success
      console.log("RSVP received (no TG creds):", message);
      return NextResponse.json({ ok: true });
    }

    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("Telegram error:", err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
