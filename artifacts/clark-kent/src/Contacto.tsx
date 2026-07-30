import { useLang } from "./LanguageContext";

const content = {
  es: {
    eyebrow: "Contáctanos",
    mapTitle: "¿Tienes un proyecto\nen mente?",
    mapSub: "Cuéntanos tu idea y construimos\njuntos la solución.",
    info: [
      { icon: "location", text: "Colombia · Remoto global" },
      { icon: "email",    text: "hola@fishertstudio.com" },
      { icon: "whatsapp", text: "+57 300 000 0000" },
    ],
    mapBtn: "Escribirnos",
  },
  en: {
    eyebrow: "Contact us",
    mapTitle: "Have a project\nin mind?",
    mapSub: "Tell us your idea and we'll\nbuild the solution together.",
    info: [
      { icon: "location", text: "Colombia · Global remote" },
      { icon: "email",    text: "hello@fishertstudio.com" },
      { icon: "whatsapp", text: "+57 300 000 0000" },
    ],
    mapBtn: "Write to us",
  },
};

/* ── Icons ───────────────────────────────────────────────────── */
function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const iconMap: Record<string, JSX.Element> = {
  location: <LocationIcon />,
  email:    <EmailIcon />,
  whatsapp: <WhatsAppIcon />,
};

/* ── Component ───────────────────────────────────────────────── */
export default function Contacto() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <section id="contacto" className="contacto-section">
      <div className="contacto-map-outer">

        {/* Top rule */}
        <div className="contacto-rule" aria-hidden="true">
          <span className="contacto-rule-label">{t.eyebrow}</span>
          <span className="contacto-rule-line" />
        </div>

        {/* Map + card */}
        <div className="contacto-map-wrap">
          <iframe
            className="contacto-map-iframe"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.25%2C4.45%2C-73.9%2C4.8&amp;layer=mapnik"
            title="Fishert Studio location map"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          <div className="contacto-map-gradient" aria-hidden="true" />

          <div className="contacto-map-card">
            <span className="contacto-map-eyebrow">{t.eyebrow}</span>

            <h2 className="contacto-map-title">
              {t.mapTitle.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </h2>

            <p className="contacto-map-sub">
              {t.mapSub.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>

            <ul className="contacto-map-info">
              {t.info.map((item) => (
                <li key={item.icon} className="contacto-map-info-item">
                  <span className="contacto-map-info-icon">{iconMap[item.icon]}</span>
                  <span className="contacto-map-info-text">{item.text}</span>
                </li>
              ))}
            </ul>

            <button className="contacto-map-btn">
              {t.mapBtn}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
