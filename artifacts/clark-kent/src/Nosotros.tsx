import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageContext";

const content = {
  es: {
    title: "CÓMO INICIAMOS ESTA IDEA.",
    body: [
      "Fisher Studio comenzó con una idea de Harry Fishert, nuestro fundador y líder de desarrollo. Lo que empezó como un hobby entre amigos pronto se convirtió en una visión compartida: construir una agencia de software capaz de romper con lo convencional y crear soluciones digitales que realmente marcaran la diferencia.",
      "Desde el primer día, nuestro objetivo ha sido explorar nuevas ideas, expandirnos hacia diferentes áreas de la tecnología y desarrollar proyectos que inspiren. No creemos en las soluciones genéricas ni en los sitios web que se parecen entre sí. Diseñamos experiencias digitales con identidad propia, combinando ingeniería, diseño y estrategia para ayudar a cada cliente a construir una presencia única en el mundo digital.",
    ],
  },
  en: {
    title: "HOW WE STARTED THIS IDEA.",
    body: [
      "Fisher Studio began with an idea from Harry Fishert, our founder and lead developer. What started as a hobby among friends quickly became a shared vision: to build a software agency capable of breaking with convention and creating digital solutions that truly make a difference.",
      "From day one, our goal has been to explore new ideas, expand into different areas of technology, and develop projects that inspire. We don't believe in generic solutions or websites that all look the same. We design digital experiences with their own identity, combining engineering, design, and strategy to help each client build a unique presence in the digital world.",
    ],
  },
};

export default function Nosotros() {
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
      id="nosotros"
      ref={sectionRef}
      className={`nos-section${isVisible ? " nos-section--visible" : ""}`}
    >

      {/* Top wave */}
      <svg className="nos-wave nos-wave--top" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 L1440,0 L1440,32 C1200,72 960,2 720,32 C480,72 240,2 0,32 Z"
          fill="#ffffff" />
      </svg>

      <div className="nos-layout">

        {/* Left: full-height Mona Lisa */}
        <div className="nos-img-col">
          <img
            src={`${import.meta.env.BASE_URL}mona-lisa.png`}
            alt="Mona Lisa narrando la historia de Fisher Studio"
            className="nos-mona"
          />
        </div>

        {/* Right: title + rounded card */}
        <div className="nos-speech-col">
          <h2 className="nos-title">{t.title}</h2>

          {/* Simple rounded-corner white card */}
          <div className="nos-card">
            {t.body.map((para, i) => (
              <p key={i} className="nos-body">{para}</p>
            ))}
          </div>

          {/* Conócenos CTA */}
          <a href="/quienes-somos" className="nos-cta-btn">
            {lang === "es" ? "Conócenos" : "Meet Us"}
          </a>
        </div>

      </div>

      {/* Bottom wave */}
      <svg className="nos-wave nos-wave--bottom" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#ffffff" />
      </svg>

    </section>
  );
}
