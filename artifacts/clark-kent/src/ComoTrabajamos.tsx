import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const quote =
    lang === "es"
      ? "Tu único límite es tu imaginación."
      : "Your only limit is your imagination.";

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
      ref={sectionRef}
      className={`ctw-section${isVisible ? " ctw-section--visible" : ""}`}
    >
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
