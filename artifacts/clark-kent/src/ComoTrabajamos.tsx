import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const quote =
    lang === "es"
      ? "Tu único límite es tu imaginación."
      : "Your only limit is your imagination.";

  return (
    <section className="ctw-section">
      <div className="ctw-inner">
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
            <h3 className="ctw-imagination-quote">{quote}</h3>
          </div>
        </div>
      </div>

      <div className="ctw-wave ctw-wave--bottom" aria-hidden="true" />
    </section>
  );
}
