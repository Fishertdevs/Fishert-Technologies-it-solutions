import { useLang } from "./LanguageContext";
import ctaLandscape from "@assets/cta_landscape.jpg";

export default function ContactoCTA() {
  const { lang } = useLang();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="cta-land">
      <img className="cta-land-bg" src={ctaLandscape} alt="" aria-hidden="true" />
      <div className="cta-land-overlay" aria-hidden="true" />

      <div className="cta-land-inner">
        <p className="cta-land-eyebrow">
          {lang === "es" ? "¿LISTO PARA EMPEZAR?" : "READY TO START?"}
        </p>
        <h2 className="cta-land-title">
          {lang === "es"
            ? "Tu idea merece existir."
            : "Your idea deserves to exist."}
        </h2>
        <p className="cta-land-sub">
          {lang === "es"
            ? "Hablemos hoy y convirtamos ese proyecto que tienes en mente en un producto real."
            : "Let's talk today and turn the project you have in mind into a real product."}
        </p>
        <a href="#contacto" className="cta-land-btn" onClick={(e) => handleClick(e, "#contacto")}>
          {lang === "es" ? "Iniciar mi proyecto" : "Start my project"}
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
