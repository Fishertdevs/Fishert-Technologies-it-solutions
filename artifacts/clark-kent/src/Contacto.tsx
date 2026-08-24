import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";
import { buildInfoHref } from "./utils/whatsapp";

/* ── Contact data ──────────────────────────────────────────── */
const WA_NUMBER = "573112512939";
const EMAIL     = "fishertstudio@gmail.com";
const PHONE_DISPLAY = "+57 311 251 2939";

/**
 * Builds a professional, time-aware WhatsApp booking message.
 * Business hours (Colombia UTC-5):
 *   Mon–Fri  08:00 – 21:00
 *   Sat–Sun  08:00 – 14:00
 */
function buildBookingMsg(lang: "es" | "en"): string {
  // Current Colombia time (UTC-5)
  const nowUtc  = new Date();
  const colMs   = nowUtc.getTime() - 5 * 60 * 60 * 1000;
  const col     = new Date(colMs);
  const hour    = col.getUTCHours();
  const minute  = col.getUTCMinutes();
  const dayIdx  = col.getUTCDay(); // 0 Sun … 6 Sat
  const isWeekend = dayIdx === 0 || dayIdx === 6;
  const fraction  = hour + minute / 60;
  const inHours   = isWeekend ? (fraction >= 8 && fraction < 14)
                               : (fraction >= 8 && fraction < 21);

  const timeStr = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
  const days    = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  const dayName = days[dayIdx];

  if (lang === "es") {
    return inHours
      ? encodeURIComponent(
          `Hola Fishert Studio 👋\n\nSoy [tu nombre]. Hoy ${dayName} a las ${timeStr} (hora Colombia) me comunico para agendar una llamada de descubrimiento de 30 minutos.\n\nMe gustaría hablar sobre mi proyecto: [describe brevemente tu idea].\n\n¿Tienen disponibilidad esta semana? Quedo atento a su propuesta de horario.\n\nGracias.`
        )
      : encodeURIComponent(
          `Hola Fishert Studio 👋\n\nSoy [tu nombre]. Les escribo fuera de horario de atención (${timeStr}, hora Colombia).\n\nMe gustaría agendar una llamada de descubrimiento de 30 minutos para hablar sobre mi proyecto: [describe brevemente tu idea].\n\nLes agradezco que me contacten en el próximo horario hábil.\n\nGracias.`
        );
  } else {
    return inHours
      ? encodeURIComponent(
          `Hello Fishert Studio 👋\n\nMy name is [your name]. I'm reaching out today (${timeStr} Colombia time) to schedule a 30-minute discovery call.\n\nI'd love to discuss my project: [briefly describe your idea].\n\nDo you have availability this week? Looking forward to your reply.\n\nThank you.`
        )
      : encodeURIComponent(
          `Hello Fishert Studio 👋\n\nMy name is [your name]. I'm reaching out outside your business hours (${timeStr} Colombia time).\n\nI'd like to schedule a 30-minute discovery call to discuss my project: [briefly describe your idea].\n\nPlease feel free to reply during your next business hours.\n\nThank you.`
        );
  }
}

/* ── i18n ──────────────────────────────────────────────────── */
const content = {
  es: {
    title: "¿TIENES UN PROYECTO EN MENTE?",
    tabs: ["Contáctanos", "Agendar cita"],
    sub: "Cuéntanos tu idea y construimos juntos la solución.",
    hours: [
      "Lun – Vie · 8:00 am – 9:00 pm",
      "Sáb – Dom · 8:00 am – 2:00 pm",
    ],
    info: [
      { icon: "location", label: "Ubicación",          value: "Colombia · Remoto global", href: null },
      { icon: "email",    label: "Correo electrónico",  value: EMAIL,                     href: `mailto:${EMAIL}` },
      { icon: "phone",    label: "Teléfono",            value: PHONE_DISPLAY,             href: `tel:${WA_NUMBER}` },
      { icon: "whatsapp", label: "WhatsApp",            value: PHONE_DISPLAY,             href: `https://wa.me/${WA_NUMBER}` },
    ],
    bookingIntro: "Agenda una llamada y en 30 min te respondemos.",
    steps: [
      { n: "01", title: "Cuéntanos tu proyecto",  desc: "Envíanos un mensaje con una breve descripción de tu idea. Respondemos en menos de 24 h." },
      { n: "02", title: "Agendamos una llamada",  desc: "Te proponemos un horario de 30 minutos para conocernos y alinear el alcance del proyecto." },
      { n: "03", title: "Recibes la confirmación",desc: "La cita llega directo a tu WhatsApp. Sin formularios, sin fricciones." },
    ],
    cta: "Agendar",
  },
  en: {
    title: "DO YOU HAVE A PROJECT IN MIND?",
    tabs: ["Contact us", "Book a call"],
    sub: "Tell us your idea and we'll build the solution together.",
    hours: [
      "Mon – Fri · 8:00 am – 9:00 pm",
      "Sat – Sun · 8:00 am – 2:00 pm",
    ],
    info: [
      { icon: "location", label: "Location",  value: "Colombia · Global remote", href: null },
      { icon: "email",    label: "Email",     value: EMAIL,                      href: `mailto:${EMAIL}` },
      { icon: "phone",    label: "Phone",     value: PHONE_DISPLAY,              href: `tel:${WA_NUMBER}` },
      { icon: "whatsapp", label: "WhatsApp",  value: PHONE_DISPLAY,              href: `https://wa.me/${WA_NUMBER}` },
    ],
    bookingIntro: "Book a call and we'll get back to you in 30 min.",
    steps: [
      { n: "01", title: "Tell us your project",   desc: "Send us a message with a brief description of your idea. We reply within 24 h." },
      { n: "02", title: "We schedule a call",     desc: "We propose a 30-minute slot to get to know each other and align on project scope." },
      { n: "03", title: "Receive your confirmation", desc: "The appointment lands straight in your WhatsApp. No forms, no friction." },
    ],
    cta: "Book now",
  },
};

/* ── SVG Icons ─────────────────────────────────────────────── */
function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.38 2 2 0 0 1 3.56 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactElement> = {
  location: <LocationIcon />,
  email:    <EmailIcon />,
  phone:    <PhoneIcon />,
  whatsapp: <WhatsAppIcon />,
};

/* ── Component ─────────────────────────────────────────────── */
export default function Contacto() {
  const { lang } = useLang();
  const t = content[lang];
  const [slide, setSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className={`contacto-section${isVisible ? " contacto-section--visible" : ""}`}
    >

      {/* ── Top wave — same pattern as Nosotros ──────────────── */}
      <svg className="contacto-wave contacto-wave--top"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 L1440,0 L1440,32 C1200,72 960,2 720,32 C480,72 240,2 0,32 Z" fill="#ffffff" />
      </svg>

      {/* ── Two-column grid: content (left) | image (right) ──── */}
      <div className="contacto-layout">

        {/* LEFT: title + info+map wrap */}
        <div className="contacto-content-col">

          <h2 className="contacto-section-title">{t.title}</h2>

          <div className="contacto-wrap">

            {/* ── Slider panel ──────────────────────────────── */}
            <div className="contacto-info">

              {/* Tabs — centered */}
              <div className="cslider-tabs">
                {t.tabs.map((tab, i) => (
                  <button key={i}
                    className={`cslider-tab${slide === i ? " cslider-tab--active" : ""}`}
                    onClick={() => setSlide(i)}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Track */}
              <div className="cslider-track-wrap">
                <div className="cslider-track" style={{ transform: `translateX(${slide * -50}%)` }}>

                  {/* ── Slide 0: Contáctanos ─────────────────── */}
                  <div className="cslider-slide">
                    {/* Header — centered */}
                    <div className="cslide-contact-header">
                      <p className="contacto-info-sub">{t.sub}</p>
                      <div className="contacto-info-hours-block">
                        {t.hours.map((h) => (
                          <p key={h} className="contacto-info-hours">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            {h}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Info list */}
                    <ul className="contacto-info-list">
                      {t.info.map((item) => (
                        <li key={item.icon} className="contacto-info-item">
                          <span className="contacto-info-icon">{iconMap[item.icon]}</span>
                          <span className="contacto-info-text">
                            <span className="contacto-info-label">{item.label}</span>
                            {item.href ? (
                              <a href={item.href}
                                target={item.href.startsWith("https") ? "_blank" : undefined}
                                rel={item.href.startsWith("https") ? "noopener noreferrer" : undefined}
                                className="contacto-info-value contacto-info-link">
                                {item.value}
                              </a>
                            ) : (
                              <span className="contacto-info-value">{item.value}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Social icons — centered, brand colors on hover */}
                    <div className="contacto-social-row">
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                        className="contacto-social-btn contacto-social-btn--ig" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                        </svg>
                      </a>
                      <a href="https://github.com/fishertstudio" target="_blank" rel="noopener noreferrer"
                        className="contacto-social-btn contacto-social-btn--gh" aria-label="GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                        </svg>
                      </a>
                      <a href={buildInfoHref(lang)} target="_blank" rel="noopener noreferrer"
                        className="contacto-social-btn contacto-social-btn--wa" aria-label="WhatsApp">
                        <WhatsAppIcon size={18} />
                      </a>
                    </div>
                  </div>

                  {/* ── Slide 1: Agendar cita ────────────────── */}
                  <div className="cslider-slide cslider-slide--booking">

                    <p className="cslider-booking-intro">{t.bookingIntro}</p>

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

                    {/* Agendar — right-aligned text button */}
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${buildBookingMsg(lang)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cslider-cta-text"
                    >
                      <WhatsAppIcon size={15} />
                      {t.cta}
                    </a>

                  </div>

                </div>{/* .cslider-track */}
              </div>{/* .cslider-track-wrap */}

            </div>{/* .contacto-info */}

            {/* Map — original full-column, rounded via wrap overflow */}
            <div className="contacto-map-col">
              <iframe
                src="https://maps.google.com/maps?q=Bogot%C3%A1%2C+Colombia&z=12&output=embed&hl=es"
                title="Mapa Fishert Studio — Bogotá"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>{/* .contacto-wrap */}
        </div>{/* .contacto-content-col */}

        {/* RIGHT: art image — full height, anchored bottom */}
        <div className="contacto-img-col">
          <img
            src={`${import.meta.env.BASE_URL}girl-pearl.png`}
            alt="Fishert Studio"
            className="contacto-pearl"
          />
        </div>

      </div>{/* .contacto-layout */}


    </section>
  );
}
