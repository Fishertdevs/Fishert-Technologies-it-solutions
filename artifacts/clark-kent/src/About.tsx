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
      // Text and CTAs always visible — no reveal animation
      gsap.set(".about-line-inner", { yPercent: 0, skewX: 0, clearProps: "all" });
      gsap.set(".about-cta-wrap", { opacity: 1, y: 0, clearProps: "all" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

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
            <a href="#contacto" className="about-cta-primary" onClick={(e) => handleClick(e, "#contacto")}>
              {t.cta_primary}
            </a>
            <a href="#portafolio" className="about-cta-secondary" onClick={(e) => handleClick(e, "#portafolio")}>
              {t.cta_secondary}
            </a>
          </div>
        </div>
      </div>
      {/* SVG wave — white fill to blend into the next section */}
      <svg
        aria-hidden="true"
        className="about-wave"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 82"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,82 L0,82 Z"
          fill="#ffffff"
        />
      </svg>
    </section>
  );
}
