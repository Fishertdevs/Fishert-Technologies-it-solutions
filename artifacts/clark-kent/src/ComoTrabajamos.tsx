import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();

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
      </div>
    </section>
  );
}
