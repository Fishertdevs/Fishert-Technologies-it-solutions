import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    body: "Somos una agencia de software especializada en diseñar, construir y escalar productos digitales de alto impacto. Convertimos ideas ambiciosas en experiencias reales que posicionan a los negocios como líderes de su industria.",
  },
  en: {
    title: "Welcome to Fishert Studio",
    body: "We are a software agency specialized in designing, building and scaling high-impact digital products. We turn ambitious ideas into real experiences that position businesses as leaders of their industry.",
  },
};

export default function Welcome() {
  const { lang } = useLang();
  const t = content[lang];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      className={`welcome-section${isVisible ? " welcome-section--visible" : ""}`}
    >
      <div className="welcome-inner">
        <h2 className="wlc-title">{t.title}</h2>
        <p className="wlc-body">{t.body}</p>
      </div>
    </section>
  );
}
