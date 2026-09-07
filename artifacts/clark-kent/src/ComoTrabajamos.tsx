import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";
import ctwStatue from "@assets/ctw_statue.png";

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const quotes =
    lang === "es"
      ? [
          "Tu único límite es tu imaginación.",
          "Cada gran idea comienza con una conversación.",
          "Convertimos ideas en experiencias digitales.",
        ]
      : [
          "Your only limit is your imagination.",
          "Every great idea starts with a conversation.",
          "We turn ideas into digital experiences.",
        ];

  const quote = quotes[quoteIndex];

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(min-width: 901px)").matches) return;

    let lastScrollY = window.scrollY;
    let lastChangeAt = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === lastScrollY) return;

      const rect = section.getBoundingClientRect();
      const isSectionVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!isSectionVisible) {
        lastScrollY = currentScrollY;
        return;
      }

      const direction = currentScrollY > lastScrollY ? 1 : -1;
      lastScrollY = currentScrollY;

      const now = performance.now();
      if (now - lastChangeAt < 360) return;
      lastChangeAt = now;

      setQuoteIndex((current) => (current + direction + quotes.length) % quotes.length);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [quotes.length]);

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
            <h3 className="ctw-imagination-quote" key={quoteIndex}>{quote}</h3>
          </div>
        </div>
      </div>

      <div className="ctw-wave ctw-wave--bottom" aria-hidden="true" />
    </section>
  );
}
