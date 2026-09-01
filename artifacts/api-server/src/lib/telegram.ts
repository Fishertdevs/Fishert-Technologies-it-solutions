type TelegramReplyMarkup = {
  inline_keyboard?: Array<Array<{
    text: string;
    callback_data?: string;
  }>>;
  keyboard?: Array<Array<{ text: string }>>;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
};

type TelegramApiResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

const telegramApiBase = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  return `https://api.telegram.org/bot${token}`;
};

const callTelegram = async <T>(
  method: string,
  payload: Record<string, unknown>,
): Promise<T> => {
  const response = await fetch(`${telegramApiBase()}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as TelegramApiResponse<T>;
  if (!response.ok || !body.ok) {
    throw new Error(body.description ?? `Telegram API ${method} failed`);
  }
  return body.result as T;
};

export const sendTelegramMessage = async (
  chatId: string,
  text: string,
  replyMarkup?: TelegramReplyMarkup,
) =>
  callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });

export const editTelegramMessage = async (
  chatId: string,
  messageId: number,
  text: string,
  replyMarkup?: TelegramReplyMarkup,
) =>
  callTelegram("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });

export const answerTelegramCallback = async (
  callbackQueryId: string,
  text?: string,
) =>
  callTelegram("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });

export const setTelegramCommands = async () =>
  callTelegram("setMyCommands", {
    commands: [
      { command: "start", description: "Abrir el panel de administración" },
      { command: "ayuda", description: "Ver ayuda y comandos" },
      { command: "resenas", description: "Administrar reseñas" },
      { command: "planes", description: "Administrar planes" },
      { command: "redes", description: "Administrar redes sociales" },
      { command: "contacto", description: "Editar datos de contacto" },
      { command: "equipo", description: "Administrar integrantes del equipo" },
      { command: "mensajes", description: "Ver mensajes de contacto" },
      { command: "cancelar", description: "Cancelar la operación actual" },
    ],
  });

export const setTelegramWebhook = async (url: string, secretToken?: string) =>
  callTelegram("setWebhook", {
    url,
    ...(secretToken ? { secret_token: secretToken } : {}),
    allowed_updates: ["message", "callback_query"],
  });

type TelegramWebhookInfo = {
  url?: string;
  has_custom_certificate?: boolean;
  pending_update_count?: number;
  last_error_date?: number;
  last_error_message?: string;
};

export const getTelegramWebhookInfo = () =>
  callTelegram<TelegramWebhookInfo>("getWebhookInfo", {});

const getTelegramWebhookUrl = () => {
  const configuredWebhookUrl = process.env.TELEGRAM_WEBHOOK_URL?.replace(/\/+$/, "");
  const host = configuredWebhookUrl
    ? configuredWebhookUrl.endsWith("/api/telegram/webhook")
      ? configuredWebhookUrl.slice(0, -"/api/telegram/webhook".length)
      : configuredWebhookUrl
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "";
  return host ? `${host}/api/telegram/webhook` : null;
};

export const getTelegramWebhookTarget = () => getTelegramWebhookUrl();

let webhookRegistration: Promise<void> | null = null;

export const ensureTelegramWebhook = async () => {
  if (webhookRegistration) return webhookRegistration;
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  const webhookUrl = getTelegramWebhookUrl();
  if (!webhookUrl) return;
  webhookRegistration = (async () => {
    try {
      await setTelegramWebhook(webhookUrl);
      await setTelegramCommands();
    } catch {
      webhookRegistration = null;
    }
  })();
  return webhookRegistration;
};

export const telegramMenu = (): TelegramReplyMarkup => ({
  inline_keyboard: [
    [
      { text: "⭐ Reseñas", callback_data: "menu:reviews" },
      { text: "💼 Planes", callback_data: "menu:plans" },
    ],
    [
      { text: "🔗 Redes sociales", callback_data: "menu:social" },
      { text: "📍 Contacto", callback_data: "menu:contact" },
    ],
    [
      { text: "👥 Equipo", callback_data: "menu:team" },
      { text: "📨 Mensajes", callback_data: "menu:contacts" },
    ],
    [{ text: "❓ Ayuda", callback_data: "menu:help" }],
  ],
});

export const backToMenuMarkup = (): TelegramReplyMarkup => ({
  inline_keyboard: [[{ text: "↩️ Volver al menú", callback_data: "menu:home" }]],
});

export const escapeTelegramText = (value: string | null | undefined) =>
  String(value ?? "").replace(/\s+/g, " ").trim();