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

type TelegramVideo = {
  file_id: string;
};

type TelegramFile = {
  file_path?: string;
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

export const sendTelegramVideo = async (
  chatId: string,
  video: { buffer: Buffer; mimeType: string; fileName: string },
  caption: string,
  replyMarkup?: TelegramReplyMarkup,
) => {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append(
    "video",
    new Blob([new Uint8Array(video.buffer)], { type: video.mimeType }),
    video.fileName,
  );
  formData.append("caption", caption);
  if (replyMarkup) formData.append("reply_markup", JSON.stringify(replyMarkup));

  const response = await fetch(`${telegramApiBase()}/sendVideo`, {
    method: "POST",
    body: formData,
  });
  const body = (await response.json()) as TelegramApiResponse<{ video?: TelegramVideo }>;
  if (!response.ok || !body.ok || !body.result?.video?.file_id) {
    throw new Error(body.description ?? "Telegram video upload failed");
  }
  return body.result;
};

export const downloadTelegramFile = async (fileId: string) => {
  const file = await callTelegram<TelegramFile>("getFile", { file_id: fileId });
  if (!file.file_path) throw new Error("Telegram did not return a file path");
  const response = await fetch(
    `${telegramApiBase().replace("/bot", "/file/bot")}/${file.file_path}`,
  );
  if (!response.ok) throw new Error("Telegram video download failed");
  return response;
};

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

const telegramCommands = [
  { command: "start", description: "Abrir el panel de administración" },
  { command: "ayuda", description: "Ver ayuda y comandos" },
  { command: "resenas", description: "Administrar reseñas" },
  { command: "planes", description: "Administrar planes" },
  { command: "redes", description: "Administrar redes sociales" },
  { command: "contacto", description: "Editar datos de contacto" },
  { command: "equipo", description: "Administrar integrantes del equipo" },
  { command: "mensajes", description: "Ver mensajes de contacto" },
  { command: "accesos", description: "Gestionar accesos del equipo" },
  { command: "cancelar", description: "Cancelar la operación actual" },
];

const chatCommandScope = (chatId: string) => {
  const numericChatId = Number(chatId);
  return Number.isSafeInteger(numericChatId)
    ? { type: "chat" as const, chat_id: numericChatId }
    : null;
};

export const setTelegramCommands = async (chatId?: string) => {
  const scope = chatId ? chatCommandScope(chatId) : null;
  await callTelegram("setMyCommands", {
    commands: telegramCommands,
    ...(scope ? { scope } : {}),
  });
};

export const clearTelegramCommands = async (chatId: string) => {
  const scope = chatCommandScope(chatId);
  if (!scope) return;
  await callTelegram("setMyCommands", { commands: [], scope });
};

export const clearTelegramDefaultCommands = async () =>
  callTelegram("setMyCommands", { commands: [] });

export const setTelegramWebhook = async (url: string, secretToken?: string) =>
  callTelegram("setWebhook", {
    url,
    ...(secretToken ? { secret_token: secretToken } : {}),
    allowed_updates: ["message", "callback_query"],
  });

export const pendingReviewMarkup = (reviewId: number): TelegramReplyMarkup => ({
  inline_keyboard: [[
    { text: "✅ Aprobar", callback_data: `review:publish:${reviewId}` },
    { text: "🚫 Rechazar", callback_data: `review:reject:${reviewId}` },
  ]],
});

export const notifyPendingReview = async (review: {
  id: number;
  name: string;
  company?: string | null;
  text: string;
  rating: number;
  category: "review" | "testimonial";
  video?: { buffer: Buffer; mimeType: string; fileName: string };
}): Promise<{ notified: boolean; telegramFileId: string | null }> => {
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) {
    return { notified: false, telegramFileId: null };
  }

  const caption = [
    "Nueva reseña pendiente de aprobación",
    "",
    `#${review.id} · ${escapeTelegramText(review.name)}`,
    `Empresa: ${escapeTelegramText(review.company) || "—"}`,
    `Calificación: ${review.rating}/5`,
    `Categoría: ${review.category === "testimonial" ? "Testimonio del cliente" : "Reseña del cliente"}`,
    "",
    escapeTelegramText(review.text),
    "",
    "Puedes aprobarla o rechazarla con los botones.",
  ].join("\n");

  if (review.video) {
    const result = await sendTelegramVideo(
      chatId,
      review.video,
      caption,
      pendingReviewMarkup(review.id),
    );
    return { notified: true, telegramFileId: result.video?.file_id ?? null };
  }

  await sendTelegramMessage(chatId, caption, pendingReviewMarkup(review.id));
  return { notified: true, telegramFileId: null };
};

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
      await clearTelegramDefaultCommands();
      const ownerChatId = process.env.TELEGRAM_CHAT_ID?.trim();
      if (ownerChatId) await setTelegramCommands(ownerChatId);
    } catch {
      webhookRegistration = null;
    }
  })();
  return webhookRegistration;
};

export const telegramMenu = (includeAccess = false): TelegramReplyMarkup => ({
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
    ...(includeAccess
      ? [[{ text: "🔐 Gestionar accesos", callback_data: "menu:access" }]]
      : []),
  ],
});

export const backToMenuMarkup = (): TelegramReplyMarkup => ({
  inline_keyboard: [[{ text: "↩️ Volver al menú", callback_data: "menu:home" }]],
});

export const escapeTelegramText = (value: string | null | undefined) =>
  String(value ?? "").replace(/\s+/g, " ").trim();