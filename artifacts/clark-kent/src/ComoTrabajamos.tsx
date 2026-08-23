import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

const quoteStages = {
  es: [
    "Tu único límite es tu imaginación.",
    "Las grandes ideas comienzan con una visión.",
    "Creamos experiencias que dejan huella.",
    "Hacemos que tu idea cobre vida.",
  ],
  en: [
    "Your only limit is your imagination.",
    "Great ideas begin with a vision.",
    "We create experiences that leave a mark.",
    "We bring your idea to life.",
  ],
};

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [pinState, setPinState] = useState<"start" | "pinned" | "end">("start");
  const quotes = quoteStages[lang];

  useEffect(() => {
    setQuoteIndex(0);

    const section = sectionRef.current;
    if (!section) return;

    const updateQuote = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      const nextPinState =
        rect.top > 0
          ? "start"
          : rect.bottom > 0
            ? "pinned"
            : "end";
      const nextIndex = Math.min(
        quotes.length - 1,
        Math.floor(progress * quotes.length),
      );

      setQuoteIndex((current) => (current === nextIndex ? current : nextIndex));
      setPinState((current) => (current === nextPinState ? current : nextPinState));
    };

    updateQuote();
    window.addEventListener("scroll", updateQuote, { passive: true });
    window.addEventListener("resize", updateQuote);

    return () => {
      window.removeEventListener("scroll", updateQuote);
      window.removeEventListener("resize", updateQuote);
    };
  }, [lang, quotes.length, sectionRef]);

  return (
    <section className={`ctw-section ctw-section--${pinState}`} ref={sectionRef}>
      <div
        className="ctw-inner"
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
              <h3 className="ctw-imagination-quote" key={quoteIndex}>
                {quotes[quoteIndex]}
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
          <pattern
            id="ctw-checker-pattern"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <rect width="72" height="72" fill="#d8d8d8" />
            <rect width="36" height="36" fill="#ffffff" />
            <rect x="36" y="36" width="36" height="36" fill="#ffffff" />
          </pattern>
        </defs>
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="url(#ctw-checker-pattern)"
          stroke="none"
        />
      </svg>
    </section>
  );
}
