import { useLang } from "./LanguageContext";

const copy = {
  es: {
    heading: "¿Quieres un resultado así?",
    sub: "Cuéntanos sobre tu proyecto y agenda una asesoría inicial para definir juntos la mejor estrategia digital.",
    cta: "Cotiza tu proyecto",
  },
  en: {
    heading: "Want results like these?",
    sub: "Tell us about your project and schedule an initial consultation to define the best digital strategy together.",
    cta: "Get a quote",
  },
};

export default function PortfolioCTA() {
  const { lang } = useLang();
  const t = copy[lang];

  return (
    <section className="pcta-section">
      {/* Top wave — same shape as FAQ / Nosotros */}
      <svg className="pcta-wave pcta-wave--top" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
          fill="#ffffff" />
      </svg>

      <div className="pcta-content">
        <h2 className="pcta-heading">{t.heading}</h2>
        <p className="pcta-sub">{t.sub}</p>
        <a href="#contacto" className="pcta-btn">
          {t.cta}
        </a>
      </div>

      {/* Bottom wave — same shape as FAQ / Nosotros, tinted to blend into the next dark section */}
      <svg className="pcta-wave pcta-wave--bottom" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#111111" />
      </svg>
    </section>
  );
}
