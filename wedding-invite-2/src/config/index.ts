import domainsConfig from "./domains.json";
import defaultWedding from "./weddings/default.json";

// ──────────────────────────────────────────────────────
// Реестр свадеб
// ──────────────────────────────────────────────────────
// Чтобы добавить новую свадьбу:
// 1. Скопируй  weddings/_template.json → weddings/my-wedding.json
// 2. Заполни JSON (имена, даты, тексты, фото)
// 3. Импортируй ниже:  import myWedding from './weddings/my-wedding.json';
// 4. Добавь в registry:  'my-wedding': myWedding,
// 5. В domains.json → "my-domain.com": "my-wedding"
// 6. В .env.local → TELEGRAM_CHAT_ID_MY_WEDDING=-chatid
// 7. npm run build && pm2 restart wedding-invite
// ──────────────────────────────────────────────────────

export type WeddingConfig = typeof defaultWedding;

const weddingRegistry: Record<string, WeddingConfig> = {
  default: defaultWedding,
  // 'second-wedding': secondWedding,
};

/**
 * Определяет конфиг свадьбы по домену (hostname).
 * Читает маппинг из domains.json.
 */
export function getWeddingByDomain(hostname: string): WeddingConfig {
  const domain = hostname.split(":")[0].toLowerCase();
  const weddingId =
    (domainsConfig.domains as Record<string, string>)[domain] || "default";
  return weddingRegistry[weddingId] || weddingRegistry.default;
}

/**
 * Получает конфиг свадьбы по ID.
 */
export function getWeddingById(id: string): WeddingConfig {
  return weddingRegistry[id] || weddingRegistry.default;
}

export { domainsConfig };
export default weddingRegistry;
