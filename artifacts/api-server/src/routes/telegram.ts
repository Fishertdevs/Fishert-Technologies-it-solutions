import { asc, desc, and, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  contactSettingsTable,
  contactsTable,
  db,
  planFeaturesTable,
  plansTable,
  reviewsTable,
  serviceCategoriesTable,
  socialLinksTable,
  teamMembersTable,
  telegramAdminsTable,
  telegramSessionsTable,
} from "@workspace/db";
import {
  answerTelegramCallback,
  backToMenuMarkup,
  editTelegramMessage,
  escapeTelegramText,
  ensureTelegramWebhook,
  getTelegramWebhookInfo,
  sendTelegramMessage,
  setTelegramCommands,
  telegramMenu,
} from "../lib/telegram";

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
};

type TelegramChat = {
  id: number;
};

type TelegramMessage = {
  message_id: number;
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
};

type TelegramCallback = {
  id: string;
  from: TelegramUser;
  data?: string;
  message?: TelegramMessage;
};

type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallback;
};

type TelegramLog = {
  info: (object: object, message: string) => void;
  warn: (object: object, message: string) => void;
  error: (object: object, message: string) => void;
};

type ReplyMarkup = {
  inline_keyboard: Array<Array<{
    text: string;
    callback_data?: string;
  }>>;
};

type SessionData = Record<string, unknown>;

const router: IRouter = Router();
const maxMessageLength = 3900;

const inline = (...rows: Array<Array<{ text: string; callback_data: string }>>): ReplyMarkup => ({
  inline_keyboard: rows,
});

const chunkText = (value: string) =>
  value.length <= maxMessageLength
    ? [value]
    : [value.slice(0, maxMessageLength - 40), "…\nEl contenido es demasiado largo para Telegram."];

const sendLongMessage = async (chatId: string, text: string, markup?: ReplyMarkup) => {
  const chunks = chunkText(text);
  for (const [index, chunk] of chunks.entries()) {
    await sendTelegramMessage(chatId, chunk, index === chunks.length - 1 ? markup : undefined);
  }
};

const getSession = async (chatId: string) => {
  const [session] = await db
    .select()
    .from(telegramSessionsTable)
    .where(eq(telegramSessionsTable.chatId, chatId))
    .limit(1);
  return session;
};

const saveSession = async (chatId: string, state: string, data: SessionData = {}) => {
  await db
    .insert(telegramSessionsTable)
    .values({ chatId, state, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: telegramSessionsTable.chatId,
      set: { state, data, updatedAt: new Date() },
    });
};

const clearSession = async (chatId: string) => {
  await db
    .delete(telegramSessionsTable)
    .where(eq(telegramSessionsTable.chatId, chatId));
};

const isAuthorized = async (chatId: string) => {
  const configuredChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (configuredChatId) return configuredChatId === chatId;
  const [admin] = await db
    .select({ id: telegramAdminsTable.id })
    .from(telegramAdminsTable)
    .where(and(
      eq(telegramAdminsTable.chatId, chatId),
      eq(telegramAdminsTable.isActive, true),
    ))
    .limit(1);
  return Boolean(admin);
};

const hasAdmins = async () => {
  const [admin] = await db
    .select({ id: telegramAdminsTable.id })
    .from(telegramAdminsTable)
    .where(eq(telegramAdminsTable.isActive, true))
    .limit(1);
  return Boolean(admin);
};

const helpText = [
  "Panel de administración de Fishert Studio",
  "",
  "Usa los botones para administrar el contenido. El bot guarda todo en PostgreSQL y los cambios aparecen en el sitio al recargar.",
  "",
  "También puedes usar /cancelar para salir de cualquier operación.",
].join("\n");

const showHome = async (chatId: string, greeting = false) => {
  await clearSession(chatId);
  await sendTelegramMessage(
    chatId,
    greeting ? `Bienvenido al panel de Fishert Studio.\n\n${helpText}` : helpText,
    telegramMenu(),
  );
};

const showReviews = async (chatId: string) => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .orderBy(desc(reviewsTable.createdAt));
  if (reviews.length === 0) {
    await sendTelegramMessage(chatId, "No hay reseñas registradas.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  const pending = reviews.filter((review) => review.status === "pending");
  const published = reviews.filter((review) => review.status === "published");
  const rejected = reviews.filter((review) => review.status === "rejected");
  const text = [
    "Reseñas",
    "",
    `Pendientes: ${pending.length}`,
    `Publicadas: ${published.length}`,
    `Rechazadas: ${rejected.length}`,
    "",
    "Selecciona una reseña para ver sus acciones:",
  ].join("\n");
  const rows = reviews.slice(0, 20).map((review) => [{
    text: `${review.status === "published" ? "✅" : review.status === "rejected" ? "🚫" : "⏳"} ${escapeTelegramText(review.name)} · ${review.rating}/5`,
    callback_data: `review:view:${review.id}`,
  }]);
  rows.push([{ text: "➕ Crear reseña", callback_data: "review:new" }]);
  rows.push([{ text: "↩️ Volver al menú", callback_data: "menu:home" }]);
  await sendTelegramMessage(chatId, text, inline(...rows));
};

const showReview = async (chatId: string, reviewId: number, messageId?: number) => {
  const [review] = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.id, reviewId))
    .limit(1);
  if (!review) {
    await sendTelegramMessage(chatId, "La reseña ya no existe.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  const text = [
    `Reseña #${review.id}`,
    `Estado: ${review.status}`,
    `Nombre: ${escapeTelegramText(review.name)}`,
    `Empresa: ${escapeTelegramText(review.company) || "—"}`,
    `Calificación: ${review.rating}/5`,
    "",
    escapeTelegramText(review.text),
  ].join("\n");
  const markup = inline(
    [{ text: "✅ Publicar", callback_data: `review:publish:${review.id}` }, { text: "🚫 Rechazar", callback_data: `review:reject:${review.id}` }],
    [{ text: "✏️ Editar", callback_data: `review:edit:${review.id}` }, { text: "🗑️ Eliminar", callback_data: `confirm:review:${review.id}` }],
    [{ text: "↩️ Volver a reseñas", callback_data: "menu:reviews" }],
  );
  if (messageId) {
    await editTelegramMessage(chatId, messageId, text, markup);
  } else {
    await sendTelegramMessage(chatId, text, markup);
  }
};

const showPlanCategories = async (chatId: string) => {
  const categories = await db
    .select()
    .from(serviceCategoriesTable)
    .orderBy(asc(serviceCategoriesTable.slug));
  const rows = categories.map((category) => [{
    text: `${category.nameEs}`,
    callback_data: `plan:category:${category.id}`,
  }]);
  rows.push([{ text: "➕ Crear plan", callback_data: "plan:new:choose" }]);
  rows.push([{ text: "↩️ Volver al menú", callback_data: "menu:home" }]);
  await sendTelegramMessage(chatId, "Planes\n\nSelecciona una categoría:", inline(...rows));
};

const showPlans = async (chatId: string, categoryId: number) => {
  const [category] = await db
    .select()
    .from(serviceCategoriesTable)
    .where(eq(serviceCategoriesTable.id, categoryId))
    .limit(1);
  if (!category) {
    await sendTelegramMessage(chatId, "La categoría no existe.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  const plans = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.serviceCategoryId, categoryId))
    .orderBy(asc(plansTable.sortOrder));
  const rows = plans.map((plan) => [{
    text: `${plan.isCustom ? "⚙️" : "💼"} ${plan.nameEs} · ${plan.price}${plan.isCustom ? " · a medida" : ""}`,
    callback_data: `plan:view:${plan.id}`,
  }]);
  rows.push([{ text: "➕ Crear plan en esta categoría", callback_data: `plan:new:${category.id}` }]);
  rows.push([{ text: "↩️ Volver a categorías", callback_data: "menu:plans" }]);
  await sendTelegramMessage(chatId, `${category.nameEs}\n\nSelecciona un plan:`, inline(...rows));
};

const showPlan = async (chatId: string, planId: number, messageId?: number) => {
  const [plan] = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.id, planId))
    .limit(1);
  if (!plan) {
    await sendTelegramMessage(chatId, "El plan ya no existe.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  const [category] = await db
    .select()
    .from(serviceCategoriesTable)
    .where(eq(serviceCategoriesTable.id, plan.serviceCategoryId))
    .limit(1);
  const features = await db
    .select()
    .from(planFeaturesTable)
    .where(eq(planFeaturesTable.planId, plan.id))
    .orderBy(asc(planFeaturesTable.sortOrder));
  const text = [
    `${plan.nameEs} / ${plan.nameEn}`,
    `Categoría: ${category?.nameEs ?? "—"}`,
    `Precio: ${plan.price} ${plan.currency}`,
    `Estado: ${plan.isCustom ? "A medida" : "Activo"}`,
    `Etiqueta: ${escapeTelegramText(plan.badgeEs) || "—"}`,
    "",
    "Características:",
    ...(features.length ? features.map((feature, index) => `${index + 1}. ${escapeTelegramText(feature.textEs)}`) : ["—"]),
  ].join("\n");
  const markup = inline(
    [{ text: "✏️ Editar", callback_data: `plan:edit:${plan.id}` }, { text: plan.isCustom ? "✅ Marcar estándar" : "⚙️ Marcar a medida", callback_data: `plan:toggle-custom:${plan.id}` }],
    [{ text: "🗑️ Eliminar", callback_data: `confirm:plan:${plan.id}` }],
    [{ text: "↩️ Volver a planes", callback_data: `plan:category:${plan.serviceCategoryId}` }],
  );
  if (messageId) {
    await editTelegramMessage(chatId, messageId, text, markup);
  } else {
    await sendTelegramMessage(chatId, text, markup);
  }
};

const showSocialLinks = async (chatId: string) => {
  const links = await db
    .select()
    .from(socialLinksTable)
    .orderBy(asc(socialLinksTable.category), asc(socialLinksTable.sortOrder));
  const text = links.length
    ? ["Redes sociales", "", ...links.map((link) => `${link.isActive ? "✅" : "⏸️"} #${link.id} ${link.label}: ${link.url}`)].join("\n")
    : "No hay redes sociales configuradas.";
  const rows = links.map((link) => [{
    text: `${link.isActive ? "✅" : "⏸️"} ${link.label}`,
    callback_data: `social:view:${link.id}`,
  }]);
  rows.push([{ text: "➕ Añadir red social", callback_data: "social:new" }]);
  rows.push([{ text: "↩️ Volver al menú", callback_data: "menu:home" }]);
  await sendLongMessage(chatId, text, inline(...rows));
};

const showSocialLink = async (chatId: string, linkId: number) => {
  const [link] = await db
    .select()
    .from(socialLinksTable)
    .where(eq(socialLinksTable.id, linkId))
    .limit(1);
  if (!link) {
    await sendTelegramMessage(chatId, "La red social ya no existe.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  await sendTelegramMessage(
    chatId,
    `Red social #${link.id}\n\n${link.label}\n${link.url}\nEstado: ${link.isActive ? "activa" : "inactiva"}`,
    inline(
      [{ text: "✏️ Editar", callback_data: `social:edit:${link.id}` }, { text: link.isActive ? "⏸️ Desactivar" : "▶️ Activar", callback_data: `social:toggle:${link.id}` }],
      [{ text: "🗑️ Eliminar", callback_data: `confirm:social:${link.id}` }],
      [{ text: "↩️ Volver a redes", callback_data: "menu:social" }],
    ),
  );
};

const contactFieldLabels: Record<string, string> = {
  email: "correo",
  phone: "teléfono",
  whatsappNumber: "número de WhatsApp",
  locationEs: "ubicación en español",
  locationEn: "ubicación en inglés",
  businessHoursWeekdaysEs: "horario entre semana en español",
  businessHoursWeekdaysEn: "horario entre semana en inglés",
  businessHoursWeekendEs: "horario de fin de semana en español",
  businessHoursWeekendEn: "horario de fin de semana en inglés",
};

const showContact = async (chatId: string) => {
  const [settings] = await db
    .select()
    .from(contactSettingsTable)
    .where(eq(contactSettingsTable.slug, "main"))
    .limit(1);
  if (!settings) {
    await sendTelegramMessage(chatId, "No existe la configuración principal de contacto.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  const text = [
    "Datos de contacto",
    "",
    `Correo: ${settings.email}`,
    `Teléfono: ${settings.phone}`,
    `WhatsApp: ${settings.whatsappNumber}`,
    `Ubicación: ${settings.locationEs}`,
    `Horario: ${settings.businessHoursWeekdaysEs} / ${settings.businessHoursWeekendEs}`,
  ].join("\n");
  const fields = Object.keys(contactFieldLabels);
  const rows = fields.map((field) => [{ text: `✏️ ${contactFieldLabels[field]}`, callback_data: `contact:edit:${field}` }]);
  rows.push([{ text: "↩️ Volver al menú", callback_data: "menu:home" }]);
  await sendTelegramMessage(chatId, text, inline(...rows));
};

const showTeam = async (chatId: string) => {
  const members = await db
    .select()
    .from(teamMembersTable)
    .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
  const text = members.length
    ? ["Equipo", "", ...members.map((member) => `${member.isActive ? "✅" : "⏸️"} #${member.id} ${member.name} — ${member.roleEs}`)].join("\n")
    : "No hay integrantes guardados.";
  const rows = members.map((member) => [{
    text: `${member.isActive ? "✅" : "⏸️"} ${member.name}`,
    callback_data: `team:view:${member.id}`,
  }]);
  rows.push([{ text: "➕ Añadir integrante", callback_data: "team:new" }]);
  rows.push([{ text: "↩️ Volver al menú", callback_data: "menu:home" }]);
  await sendLongMessage(chatId, text, inline(...rows));
};

const showTeamMember = async (chatId: string, memberId: number) => {
  const [member] = await db
    .select()
    .from(teamMembersTable)
    .where(eq(teamMembersTable.id, memberId))
    .limit(1);
  if (!member) {
    await sendTelegramMessage(chatId, "El integrante ya no existe.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  await sendLongMessage(
    chatId,
    [
      `Integrante #${member.id}`,
      `${member.name} — ${member.roleEs}`,
      `Estado: ${member.isActive ? "activo" : "inactivo"}`,
      `Orden: ${member.sortOrder}`,
      "",
      member.bioEs,
      member.imageRef ? `\nImagen: ${member.imageRef}` : "",
    ].join("\n"),
    inline(
      [{ text: "✏️ Editar", callback_data: `team:edit:${member.id}` }, { text: member.isActive ? "⏸️ Desactivar" : "▶️ Activar", callback_data: `team:toggle:${member.id}` }],
      [{ text: "🗑️ Eliminar", callback_data: `confirm:team:${member.id}` }],
      [{ text: "↩️ Volver al equipo", callback_data: "menu:team" }],
    ),
  );
};

const showContacts = async (chatId: string) => {
  const contacts = await db
    .select()
    .from(contactsTable)
    .orderBy(desc(contactsTable.createdAt))
    .limit(15);
  if (!contacts.length) {
    await sendTelegramMessage(chatId, "No hay mensajes de contacto.", backToMenuMarkup() as ReplyMarkup);
    return;
  }
  await sendLongMessage(
    chatId,
    ["Mensajes de contacto", "", ...contacts.map((contact) => [
      `#${contact.id} · ${contact.name}`,
      `${contact.email}${contact.phone ? ` · ${contact.phone}` : ""}`,
      contact.company ? `Empresa: ${contact.company}` : "",
      contact.message,
      "———",
    ].filter(Boolean).join("\n"))].join("\n"),
    backToMenuMarkup() as ReplyMarkup,
  );
};

const parsePipeValues = (text: string, expected: number) => {
  const values = text.split("|").map((value) => value.trim());
  return values.length >= expected && values.slice(0, expected).every(Boolean) ? values : null;
};

const parseId = (value: string | undefined) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const unauthorizedMessage = "No estás autorizado para administrar este bot.";

const handleSessionInput = async (chatId: string, text: string, session: { state: string; data: unknown }) => {
  const data = (session.data ?? {}) as SessionData;
  if (session.state === "review_new" || session.state === "review_edit") {
    const values = parsePipeValues(text, 4);
    if (!values) {
      await sendTelegramMessage(chatId, "Formato: nombre | empresa (o -) | texto | calificación 1-5");
      return;
    }
    const rating = Number(values[3]);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      await sendTelegramMessage(chatId, "La calificación debe ser un número entero entre 1 y 5.");
      return;
    }
    if (session.state === "review_new") {
      await db.insert(reviewsTable).values({
        name: values[0],
        company: values[1] === "-" ? null : values[1],
        text: values[2],
        rating,
        status: "pending",
      });
      await clearSession(chatId);
      await sendTelegramMessage(chatId, "Reseña creada como pendiente de aprobación.", backToMenuMarkup() as ReplyMarkup);
      return;
    }
    const reviewId = parseId(String(data.reviewId));
    if (!reviewId) throw new Error("Invalid review session");
    await db.update(reviewsTable).set({
      name: values[0],
      company: values[1] === "-" ? null : values[1],
      text: values[2],
      rating,
      updatedAt: new Date(),
    }).where(eq(reviewsTable.id, reviewId));
    await clearSession(chatId);
    await sendTelegramMessage(chatId, "Reseña actualizada.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  if (session.state === "plan_new_name") {
    const values = parsePipeValues(text, 3);
    if (!values) {
      await sendTelegramMessage(chatId, "Formato: slug | nombre en español | nombre en inglés");
      return;
    }
    await saveSession(chatId, "plan_new_price", { ...data, slug: values[0], nameEs: values[1], nameEn: values[2] });
    await sendTelegramMessage(chatId, "Escribe el precio y la moneda, por ejemplo:\n3500000 | COP");
    return;
  }

  if (session.state === "plan_new_price") {
    const values = parsePipeValues(text, 2);
    if (!values) {
      await sendTelegramMessage(chatId, "Formato: precio | moneda");
      return;
    }
    await saveSession(chatId, "plan_new_features", { ...data, price: values[0], currency: values[1] });
    await sendTelegramMessage(chatId, "Escribe una característica por línea con este formato:\nEspañol || English\n\nCuando termines, escribe FIN.");
    return;
  }

  if (session.state === "plan_new_features") {
    if (text.toUpperCase() === "FIN") {
      const categoryId = parseId(String(data.categoryId));
      if (!categoryId) throw new Error("Invalid plan category");
      const [plan] = await db.insert(plansTable).values({
        serviceCategoryId: categoryId,
        slug: String(data.slug),
        nameEs: String(data.nameEs),
        nameEn: String(data.nameEn),
        price: String(data.price),
        currency: String(data.currency),
        sortOrder: 0,
        isCustom: false,
      }).returning();
      const featureLines = Array.isArray(data.features) ? data.features as string[] : [];
      if (plan && featureLines.length) {
        await db.insert(planFeaturesTable).values(featureLines.map((line, index) => {
          const [textEs, textEn] = line.split("||").map((value) => value.trim());
          return { planId: plan.id, textEs: textEs || textEn || line, textEn: textEn || textEs || line, sortOrder: index };
        }));
      }
      await clearSession(chatId);
      await sendTelegramMessage(chatId, "Plan creado correctamente.", backToMenuMarkup() as ReplyMarkup);
      return;
    }
    const features = Array.isArray(data.features) ? [...data.features as string[], text] : [text];
    await saveSession(chatId, "plan_new_features", { ...data, features });
    await sendTelegramMessage(chatId, "Característica guardada. Escribe otra o FIN.");
    return;
  }

  if (session.state === "plan_edit") {
    const planId = parseId(String(data.planId));
    const field = String(data.field ?? "");
    if (!planId) throw new Error("Invalid plan session");
    const updates: Record<string, unknown> = {};
    if (field === "name") {
      const values = parsePipeValues(text, 2);
      if (!values) {
        await sendTelegramMessage(chatId, "Formato: nombre en español | nombre en inglés");
        return;
      }
      updates.nameEs = values[0];
      updates.nameEn = values[1];
    } else if (field === "price") {
      const values = parsePipeValues(text, 2);
      if (!values) {
        await sendTelegramMessage(chatId, "Formato: precio | moneda");
        return;
      }
      updates.price = values[0];
      updates.currency = values[1];
    } else if (field === "badge") {
      const values = parsePipeValues(text, 2);
      if (!values) {
        await sendTelegramMessage(chatId, "Formato: etiqueta en español | etiqueta en inglés (usa - para borrar)");
        return;
      }
      updates.badgeEs = values[0] === "-" ? null : values[0];
      updates.badgeEn = values[1] === "-" ? null : values[1];
    } else if (field === "features") {
      await db.delete(planFeaturesTable).where(eq(planFeaturesTable.planId, planId));
      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length) {
        await db.insert(planFeaturesTable).values(lines.map((line, index) => {
          const [textEs, textEn] = line.split("||").map((value) => value.trim());
          return { planId, textEs: textEs || textEn || line, textEn: textEn || textEs || line, sortOrder: index };
        }));
      }
    } else {
      await sendTelegramMessage(chatId, "Ese campo no se puede editar.");
      return;
    }
    if (Object.keys(updates).length) {
      await db.update(plansTable).set({ ...updates, updatedAt: new Date() }).where(eq(plansTable.id, planId));
    }
    await clearSession(chatId);
    await sendTelegramMessage(chatId, "Plan actualizado.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  if (session.state === "social_edit") {
    const values = parsePipeValues(text, 5);
    if (!values) {
      await sendTelegramMessage(chatId, "Formato: etiqueta | icono | URL | orden | activa (si/no)");
      return;
    }
    const linkId = data.linkId ? parseId(String(data.linkId)) : null;
    const valuesToSave = {
      category: "contact",
      label: values[0],
      icon: values[1],
      url: values[2],
      sortOrder: Number(values[3]) || 0,
      isActive: ["si", "sí", "yes", "true", "1"].includes(values[4].toLowerCase()),
      updatedAt: new Date(),
    };
    if (linkId) {
      await db.update(socialLinksTable).set(valuesToSave).where(eq(socialLinksTable.id, linkId));
    } else {
      await db.insert(socialLinksTable).values(valuesToSave);
    }
    await clearSession(chatId);
    await sendTelegramMessage(chatId, "Red social guardada.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  if (session.state === "contact_edit") {
    const field = String(data.field ?? "");
    if (!Object.hasOwn(contactFieldLabels, field)) throw new Error("Invalid contact field");
    await db.update(contactSettingsTable).set({ [field]: text, updatedAt: new Date() }).where(eq(contactSettingsTable.slug, "main"));
    await clearSession(chatId);
    await sendTelegramMessage(chatId, "Dato de contacto actualizado.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  if (session.state === "team_edit") {
    const values = parsePipeValues(text, 6);
    if (!values) {
      await sendTelegramMessage(chatId, "Formato: nombre | cargo ES | cargo EN | bio ES | bio EN | orden | imagen opcional");
      return;
    }
    const memberId = data.memberId ? parseId(String(data.memberId)) : null;
    const record = {
      name: values[0],
      roleEs: values[1],
      roleEn: values[2],
      bioEs: values[3],
      bioEn: values[4],
      sortOrder: Number(values[5]) || 0,
      imageRef: values[6] && values[6] !== "-" ? values[6] : null,
      updatedAt: new Date(),
    };
    if (memberId) {
      await db.update(teamMembersTable).set(record).where(eq(teamMembersTable.id, memberId));
    } else {
      await db.insert(teamMembersTable).values(record);
    }
    await clearSession(chatId);
    await sendTelegramMessage(chatId, "Integrante guardado.", backToMenuMarkup() as ReplyMarkup);
    return;
  }

  await clearSession(chatId);
  await sendTelegramMessage(chatId, "La operación había expirado. Abre nuevamente el menú.", telegramMenu());
};

const handleCallback = async (chatId: string, callback: TelegramCallback, log: TelegramLog) => {
  const data = callback.data ?? "";
  const messageId = callback.message?.message_id;
  await answerTelegramCallback(callback.id);

  if (data === "menu:home") return showHome(chatId);
  if (data === "menu:help") {
    await sendTelegramMessage(chatId, helpText, backToMenuMarkup() as ReplyMarkup);
    return;
  }
  if (data === "menu:reviews") return showReviews(chatId);
  if (data === "menu:plans") return showPlanCategories(chatId);
  if (data === "menu:social") return showSocialLinks(chatId);
  if (data === "menu:contact") return showContact(chatId);
  if (data === "menu:team") return showTeam(chatId);
  if (data === "menu:contacts") return showContacts(chatId);

  const parts = data.split(":");
  if (parts[0] === "review") {
    const id = parseId(parts[2]);
    if (!id) return;
    if (parts[1] === "view") return showReview(chatId, id, messageId);
    if (parts[1] === "publish" || parts[1] === "reject") {
      await db.update(reviewsTable).set({ status: parts[1] === "publish" ? "published" : "rejected", updatedAt: new Date() }).where(eq(reviewsTable.id, id));
      await sendTelegramMessage(chatId, parts[1] === "publish" ? "Reseña publicada en el sitio." : "Reseña rechazada.", backToMenuMarkup() as ReplyMarkup);
      return;
    }
    if (parts[1] === "edit") {
      await saveSession(chatId, "review_edit", { reviewId: id });
      await sendTelegramMessage(chatId, "Envía: nombre | empresa (o -) | texto | calificación 1-5");
      return;
    }
  }

  if (parts[0] === "plan") {
    if (parts[1] === "category") {
      const categoryId = parseId(parts[2]);
      if (categoryId) return showPlans(chatId, categoryId);
    }
    if (parts[1] === "view") {
      const planId = parseId(parts[2]);
      if (planId) return showPlan(chatId, planId, messageId);
    }
    if (parts[1] === "new" && parts[2] === "choose") return showPlanCategories(chatId);
    if (parts[1] === "new") {
      const categoryId = parseId(parts[2]);
      if (categoryId) {
        await saveSession(chatId, "plan_new_name", { categoryId });
        await sendTelegramMessage(chatId, "Envía: slug | nombre en español | nombre en inglés");
      }
      return;
    }
    if (parts[1] === "edit") {
      const planId = parseId(parts[2]);
      if (!planId) return;
      await sendTelegramMessage(chatId, "¿Qué quieres editar?", inline(
        [{ text: "Nombre", callback_data: `plan:field:${planId}:name` }, { text: "Precio", callback_data: `plan:field:${planId}:price` }],
        [{ text: "Etiqueta", callback_data: `plan:field:${planId}:badge` }, { text: "Características", callback_data: `plan:field:${planId}:features` }],
        [{ text: "↩️ Cancelar", callback_data: `plan:view:${planId}` }],
      ));
      return;
    }
    if (parts[1] === "field") {
      const planId = parseId(parts[2]);
      if (planId) {
        await saveSession(chatId, "plan_edit", { planId, field: parts[3] });
        await sendTelegramMessage(chatId, parts[3] === "features"
          ? "Envía una característica por línea con ES || English."
          : "Envía el nuevo valor con el formato indicado en la ayuda.");
      }
      return;
    }
    if (parts[1] === "toggle-custom") {
      const planId = parseId(parts[2]);
      if (planId) {
        const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
        if (plan) await db.update(plansTable).set({ isCustom: !plan.isCustom, updatedAt: new Date() }).where(eq(plansTable.id, planId));
        await sendTelegramMessage(chatId, "Tipo de plan actualizado.", backToMenuMarkup() as ReplyMarkup);
      }
      return;
    }
  }

  if (parts[0] === "social") {
    const id = parseId(parts[2]);
    if (parts[1] === "view" && id) return showSocialLink(chatId, id);
    if (parts[1] === "new") {
      await saveSession(chatId, "social_edit");
      await sendTelegramMessage(chatId, "Envía: etiqueta | icono | URL | orden | activa (si/no)");
      return;
    }
    if (parts[1] === "edit" && id) {
      await saveSession(chatId, "social_edit", { linkId: id });
      await sendTelegramMessage(chatId, "Envía: etiqueta | icono | URL | orden | activa (si/no)");
      return;
    }
    if (parts[1] === "toggle" && id) {
      const [link] = await db.select().from(socialLinksTable).where(eq(socialLinksTable.id, id)).limit(1);
      if (link) await db.update(socialLinksTable).set({ isActive: !link.isActive, updatedAt: new Date() }).where(eq(socialLinksTable.id, id));
      return showSocialLinks(chatId);
    }
  }

  if (parts[0] === "contact" && parts[1] === "edit") {
    const field = parts.slice(2).join(":");
    if (Object.hasOwn(contactFieldLabels, field)) {
      await saveSession(chatId, "contact_edit", { field });
      await sendTelegramMessage(chatId, `Escribe el nuevo valor para ${contactFieldLabels[field]}.`);
    }
    return;
  }

  if (parts[0] === "team") {
    const id = parseId(parts[2]);
    if (parts[1] === "view" && id) return showTeamMember(chatId, id);
    if (parts[1] === "new") {
      await saveSession(chatId, "team_edit");
      await sendTelegramMessage(chatId, "Envía: nombre | cargo ES | cargo EN | bio ES | bio EN | orden | imagen opcional");
      return;
    }
    if (parts[1] === "edit" && id) {
      await saveSession(chatId, "team_edit", { memberId: id });
      await sendTelegramMessage(chatId, "Envía: nombre | cargo ES | cargo EN | bio ES | bio EN | orden | imagen opcional");
      return;
    }
    if (parts[1] === "toggle" && id) {
      const [member] = await db.select().from(teamMembersTable).where(eq(teamMembersTable.id, id)).limit(1);
      if (member) await db.update(teamMembersTable).set({ isActive: !member.isActive, updatedAt: new Date() }).where(eq(teamMembersTable.id, id));
      return showTeam(chatId);
    }
  }

  if (parts[0] === "confirm") {
    const entity = parts[1];
    const id = parseId(parts[2]);
    if (!id) return;
    await sendTelegramMessage(
      chatId,
      `¿Confirmas eliminar ${entity} #${id}? Esta acción no se puede deshacer.`,
      inline(
        [{ text: "Sí, eliminar", callback_data: `delete:${entity}:${id}` }, { text: "Cancelar", callback_data: "menu:home" }],
      ),
    );
    return;
  }

  if (parts[0] === "delete") {
    const entity = parts[1];
    const id = parseId(parts[2]);
    if (!id) return;
    if (entity === "review") await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    if (entity === "plan") await db.delete(plansTable).where(eq(plansTable.id, id));
    if (entity === "social") await db.delete(socialLinksTable).where(eq(socialLinksTable.id, id));
    if (entity === "team") await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
    log.info({ entity, id }, "Telegram admin deletion completed");
    await sendTelegramMessage(chatId, "Elemento eliminado correctamente.", backToMenuMarkup() as ReplyMarkup);
  }
};

const handleMessage = async (message: TelegramMessage, log: TelegramLog) => {
  const chatId = String(message.chat.id);
  const text = message.text?.trim() ?? "";
  if (!text) return;

  const commandMatch = text.match(/^\/([a-z_]+)(?:@\w+)?(?:\s+([\s\S]+))?$/i);
  const command = commandMatch?.[1]?.toLowerCase();

  if (!(await isAuthorized(chatId))) {
    await sendTelegramMessage(chatId, unauthorizedMessage);
    return;
  }

  if (command === "start") {
    try {
      await setTelegramCommands();
    } catch (error) {
      log.warn({ err: error }, "Could not refresh Telegram command menu");
    }
    await showHome(chatId, true);
    return;
  }
  if (command === "ayuda") {
    await sendTelegramMessage(chatId, helpText, telegramMenu());
    return;
  }
  if (command === "cancelar") {
    await showHome(chatId);
    return;
  }
  if (command === "resenas") return showReviews(chatId);
  if (command === "planes") return showPlanCategories(chatId);
  if (command === "redes") return showSocialLinks(chatId);
  if (command === "contacto") return showContact(chatId);
  if (command === "equipo") return showTeam(chatId);
  if (command === "mensajes") return showContacts(chatId);

  const session = await getSession(chatId);
  if (session) {
    await handleSessionInput(chatId, text, session);
    return;
  }
  await sendTelegramMessage(chatId, "No reconocí esa instrucción. Usa /start para abrir el menú.", telegramMenu());
};

const processUpdate = async (update: TelegramUpdate, log: TelegramLog) => {
  if (update.callback_query?.message) {
    const chatId = String(update.callback_query.message.chat.id);
    if (!(await isAuthorized(chatId))) {
      await answerTelegramCallback(update.callback_query.id, "No autorizado");
      await sendTelegramMessage(chatId, unauthorizedMessage);
      return;
    }
    await handleCallback(chatId, update.callback_query, log);
    return;
  }
  if (update.message) await handleMessage(update.message, log);
};

router.post("/telegram/webhook", async (req, res): Promise<void> => {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    res.status(503).json({ error: "Telegram bot is not configured." });
    return;
  }
  try {
    await processUpdate(req.body as TelegramUpdate, req.log);
  } catch (error) {
    req.log.error({ err: error }, "Telegram update failed");
  }
  res.sendStatus(200);
});

router.get("/telegram/health", async (_req, res): Promise<void> => {
  const configured = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  if (!configured) {
    res.json({ configured, chatIdConfigured: Boolean(process.env.TELEGRAM_CHAT_ID) });
    return;
  }
  await ensureTelegramWebhook();
  try {
    const webhook = await getTelegramWebhookInfo();
    res.json({
      configured,
      chatIdConfigured: true,
      webhook: {
        registered: Boolean(webhook.url),
        url: webhook.url ?? null,
        pendingUpdates: webhook.pending_update_count ?? 0,
        lastErrorMessage: webhook.last_error_message ?? null,
      },
    });
  } catch (error) {
    res.status(502).json({
      configured,
      chatIdConfigured: true,
      webhook: { registered: false },
      error: "Telegram API could not be checked.",
    });
  }
});

export default router;