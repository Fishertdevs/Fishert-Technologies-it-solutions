// ── Shared WhatsApp helpers ──────────────────────────────────────
// Single source of truth for Fishert Studio's WhatsApp number and the
// time-aware "request info" message used by the floating button, the
// footer icon and the contact board icon.

// format: country code + number, no + or spaces
export const WA_NUMBER = "573112512939";

/** Returns a greeting based on the current local hour. */
export function getGreeting(lang: "es" | "en"): string {
  const hour = new Date().getHours();
  if (lang === "es") {
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 19) return "Buenas tardes";
    return "Buenas noches";
  } else {
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 19) return "Good afternoon";
    return "Good evening";
  }
}

/** Builds the standard "request information" message with a dynamic greeting. */
export function buildInfoMessage(lang: "es" | "en"): string {
  const greeting = getGreeting(lang);
  if (lang === "es") {
    return `${greeting}, Fishert Studio. Me pongo en contacto para solicitar información sobre sus servicios. Quedo atento a su respuesta. Muchas gracias.`;
  }
  return `${greeting}, Fishert Studio. I'm reaching out to request information about your services. I look forward to hearing from you. Thank you.`;
}

/** Full wa.me href with the standard info message pre-filled. */
export function buildInfoHref(lang: "es" | "en"): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildInfoMessage(lang))}`;
}

/** Builds a professional proposal request for a specific service and plan. */
export function buildServiceProposalHref(
  lang: "es" | "en",
  serviceName: string,
  planName: string,
): string {
  const greeting = getGreeting(lang);
  const message = lang === "es"
    ? `${greeting}, Fishert Studio. Me interesa el plan ${planName} de ${serviceName}. Agradezco que me compartan una propuesta con el alcance, los tiempos estimados y la inversión para evaluar el siguiente paso. Quedo atento(a). Muchas gracias.`
    : `${greeting}, Fishert Studio. I am interested in the ${planName} plan for ${serviceName}. Please share a proposal with the scope, estimated timeline, and investment so I can evaluate the next step. I look forward to hearing from you. Thank you.`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Builds a professional discount request tied to a specific service and campaign. */
export function buildServiceDiscountHref(
  lang: "es" | "en",
  serviceName: string,
  discount: number,
): string {
  const greeting = getGreeting(lang);
  const message = lang === "es"
    ? `${greeting}, Fishert Studio. Quiero solicitar el descuento vigente del ${discount}% para el servicio de ${serviceName}. Me gustaría conocer el plan más adecuado para mi proyecto, su alcance y cómo aplicar la oferta. Quedo atento(a) a su orientación. Muchas gracias.`
    : `${greeting}, Fishert Studio. I would like to request the current ${discount}% discount for ${serviceName}. I would appreciate guidance on the best plan for my project, its scope, and how to apply the offer. I look forward to your reply. Thank you.`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
