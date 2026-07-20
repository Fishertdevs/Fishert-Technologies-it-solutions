import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;
const heroImage = `${base}hero-statue.png`;

const content = {
  es: {
    lines: ["TU PRÓXIMA GRAN", "IDEA COMIENZA", "CON NOSOTROS"],
    cta_primary: "Iniciar Proyecto",
    cta_secondary: "Ver Portafolio",
  },
  en: {
    lines: ["YOUR NEXT BIG", "IDEA STARTS", "WITH US"],
    cta_primary: "Start a Project",
    cta_secondary: "View Portfolio",
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while scrolling down — content stays fully visible.
      // No fade-out: it only disappears when scrolling back up past the entry point.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=350%",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" className="about-section" ref={sectionRef}>
      {/* Full-screen background image */}
      <div className="vapor-img vapor-img--1">
        <img src={heroImage} alt="" />
      </div>

      <div className="about-content">
        {/* Text */}
        <div className="about-text-col">
          <div className="about-lines">
            {t.lines.map((line, i) => (
              <div className="about-line" key={i}>
                <span className="about-line-inner">{line}</span>
              </div>
            ))}
          </div>

          <div className="about-cta-wrap">
            <a href="#contacto" className="about-cta-primary">
              {t.cta_primary}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#portafolio" className="about-cta-secondary">
              {t.cta_secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
