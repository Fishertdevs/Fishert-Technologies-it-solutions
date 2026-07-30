import { useState } from "react";
import { useLang } from "./LanguageContext";

/* ── i18n ──────────────────────────────────────────────────── */
const content = {
  es: {
    title: "¿TIENES UN PROYECTO EN MENTE?",
    tabs: ["Contáctanos", "Agendar cita"],
    sub: "Cuéntanos tu idea y construimos juntos la solución.",
    info: [
      { icon: "location", label: "Ubicación",          value: "Colombia · Remoto global" },
      { icon: "email",    label: "Correo electrónico",  value: "hola@fishertstudio.com" },
      { icon: "whatsapp", label: "WhatsApp",            value: "+57 300 000 0000" },
    ],
    btn: "Escribirnos",
    steps: [
      { n: "01", title: "Cuéntanos tu proyecto",  desc: "Escríbenos por WhatsApp con una breve descripción de tu idea." },
      { n: "02", title: "Elige fecha y hora",     desc: "Te proponemos un horario en menos de 24 h para una llamada corta." },
      { n: "03", title: "Confirmamos la cita",    desc: "Recibe la confirmación directamente en tu WhatsApp. Sin formularios." },
    ],
    cta: "Ir a WhatsApp",
    back: "← Volver",
  },
  en: {
    title: "DO YOU HAVE A PROJECT IN MIND?",
    tabs: ["Contact us", "Book a call"],
    sub: "Tell us your idea and we'll build the solution together.",
    info: [
      { icon: "location", label: "Location",   value: "Colombia · Global remote" },
      { icon: "email",    label: "Email",       value: "hello@fishertstudio.com" },
      { icon: "whatsapp", label: "WhatsApp",    value: "+57 300 000 0000" },
    ],
    btn: "Write to us",
    steps: [
      { n: "01", title: "Tell us your project", desc: "Send us a message on WhatsApp with a brief description of your idea." },
      { n: "02", title: "Pick a time slot",     desc: "We'll suggest a slot within 24 h for a short discovery call." },
      { n: "03", title: "Confirm the call",     desc: "Get the confirmation straight on your WhatsApp. No forms needed." },
    ],
    cta: "Go to WhatsApp",
    back: "← Back",
  },
};

/* ── Icons ─────────────────────────────────────────────────── */
function LocationIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const iconMap: Record<string, JSX.Element> = {
  location: <LocationIcon />,
  email:    <EmailIcon />,
  whatsapp: <WhatsAppIcon />,
};

/* ── Component ─────────────────────────────────────────────── */
export default function Contacto() {
  const { lang } = useLang();
  const t = content[lang];
  const [slide, setSlide] = useState(0);

  const waNumber = "573000000000";
  const waMsg = encodeURIComponent("Hola Fishert Studio, tengo un proyecto en mente.");

  return (
    <section id="contacto" className="contacto-section">

      {/* ── Top wave ─────────────────────────────────────────── */}
      <svg className="contacto-wave contacto-wave--top"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,0 L0,0 Z" fill="#000000" />
      </svg>

      <div className="contacto-outer">

        {/* ── Left: title + slider container ───────────────── */}
        <div className="contacto-left-area">

          <h2 className="contacto-section-title">{t.title}</h2>

          <div className="contacto-wrap">

            {/* ── Info / Booking slider ─────────────────────── */}
            <div className="contacto-info">

              {/* Tabs */}
              <div className="cslider-tabs">
                {t.tabs.map((tab, i) => (
                  <button
                    key={i}
                    className={`cslider-tab${slide === i ? " cslider-tab--active" : ""}`}
                    onClick={() => setSlide(i)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Track */}
              <div className="cslider-track-wrap">
                <div className="cslider-track" style={{ transform: `translateX(${slide * -50}%)` }}>

                  {/* Slide 0 — Contáctanos */}
                  <div className="cslider-slide">
                    <p className="contacto-info-sub">{t.sub}</p>
                    <ul className="contacto-info-list">
                      {t.info.map((item) => (
                        <li key={item.icon} className="contacto-info-item">
                          <span className="contacto-info-icon">{iconMap[item.icon]}</span>
                          <span className="contacto-info-text">
                            <span className="contacto-info-label">{item.label}</span>
                            <span className="contacto-info-value">{item.value}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button className="contacto-info-btn">
                      {t.btn}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Slide 1 — Agendar cita */}
                  <div className="cslider-slide">
                    <div className="cslider-steps">
                      {t.steps.map((s) => (
                        <div key={s.n} className="cslider-step">
                          <span className="cslider-step-n">{s.n}</span>
                          <div className="cslider-step-body">
                            <strong className="cslider-step-title">{s.title}</strong>
                            <p className="cslider-step-desc">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a
                      href={`https://wa.me/${waNumber}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contacto-info-btn contacto-info-btn--wa"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                      {t.cta}
                    </a>
                  </div>

                </div>{/* end .cslider-track */}
              </div>{/* end .cslider-track-wrap */}

            </div>{/* end .contacto-info */}

            {/* Map — attribution hidden via overflow */}
            <div className="contacto-map-col">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.12%2C4.58%2C-74.00%2C4.70&amp;layer=mapnik&amp;marker=4.6097%2C-74.0817"
                title="Mapa Fishert Studio — Bogotá"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>{/* end .contacto-wrap */}
        </div>{/* end .contacto-left-area */}

        {/* ── Art image ────────────────────────────────────── */}
        <div className="contacto-art">
          <img
            src={`${import.meta.env.BASE_URL}girl-pearl.png`}
            alt="Fishert Studio"
          />
        </div>

      </div>{/* end .contacto-outer */}
    </section>
  );
}
