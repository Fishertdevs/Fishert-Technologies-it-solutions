import { useLang } from "./LanguageContext";
import { useScrollReveal } from "./hooks/useScrollReveal";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const sectionRef = useScrollReveal(".reveal");

  return (
    <section className="ctw-section">
      {/* Top wave — white, continues the portfolio section above */}
      <svg
        className="ctw-wave ctw-wave--top"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,30 C1200,72 960,2 720,30 C480,72 240,2 0,30 Z" fill="#ffffff" />
      </svg>
      <div
        className="ctw-inner"
        ref={sectionRef as React.RefObject<HTMLDivElement>}
      >
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
            <h3 className="ctw-imagination-quote reveal">
              {lang === "es"
                ? "Tu único límite es tu imaginación."
                : "Your only limit is your imagination."}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
