import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();

  return (
    <section className="ctw-section">
      <div className="ctw-inner">
        <div className="ctw-header">
          <p className="ctw-eyebrow">
            {lang === "es" ? "NUESTRO PROCESO" : "OUR PROCESS"}
          </p>
          <h2 className="ctw-heading">
            {lang === "es" ? "Así trabajamos." : "How we work."}
          </h2>
          <p className="ctw-subheading">
            {lang === "es"
              ? "Un proceso claro convierte la incertidumbre en confianza."
              : "A clear process turns uncertainty into trust."}
          </p>
        </div>

        <div className="ctw-imagination">
          <div className="ctw-imagination-media">
            <img
              className="ctw-imagination-img"
              src={ctwStatue}
              alt={
                lang === "es"
                  ? "Escultura clásica con mascarilla contemporánea"
                  : "Classical sculpture wearing a contemporary mask"
              }
            />
          </div>
          <div className="ctw-imagination-copy">
            <h3 className="ctw-imagination-quote">
              {lang === "es"
                ? "Tu único límite es tu imaginación."
                : "Your only limit is your imagination."}
            </h3>
            <p className="ctw-imagination-sub">
              {lang === "es"
                ? "Lo clásico y lo nuevo, unidos por lo que somos capaces de crear."
                : "The classic and the new, joined by what we're able to create."}
            </p>
          </div>
        </div>

        <div className="ctw-cta-row">
          <a href="#contacto" className="ctw-cta">
            {lang === "es" ? "Agendar llamada de descubrimiento" : "Schedule a discovery call"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
