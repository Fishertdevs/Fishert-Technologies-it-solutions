import { useLang } from "./LanguageContext";
import { useScrollReveal } from "./hooks/useScrollReveal";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const sectionRef = useScrollReveal(".reveal");

  return (
    <section className="ctw-section">
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

      <svg
        className="ctw-wave ctw-wave--bottom"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="ctw-checker" width="144" height="144" patternUnits="userSpaceOnUse">
            <rect width="144" height="144" fill="#ffffff" />
            <rect width="72" height="72" fill="#d8d8d8" />
            <rect x="72" y="72" width="72" height="72" fill="#d8d8d8" />
          </pattern>
        </defs>
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="url(#ctw-checker)"
        />
      </svg>
    </section>
  );
}
