import { useLang } from "./LanguageContext";

const copy = {
  es: {
    heading: "¿Quieres un resultado así?",
    sub: "Cuéntanos tu proyecto. La primera llamada es sin costo.",
    cta: "Iniciar proyecto",
  },
  en: {
    heading: "Want results like these?",
    sub: "Tell us about your project. The first call is free.",
    cta: "Start a project",
  },
};

export default function PortfolioCTA() {
  const { lang } = useLang();
  const t = copy[lang];

  return (
    <section className="pcta-section">
      <h2 className="pcta-heading">{t.heading}</h2>
      <p className="pcta-sub">{t.sub}</p>
      <a href="#contacto" className="pcta-btn">
        {t.cta}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </section>
  );
}
