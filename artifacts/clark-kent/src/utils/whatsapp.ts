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
