import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const heroImages = [
  `${base}hero-img1.jpg`,
  `${base}hero-img2.jpg`,
  `${base}hero-img3.jpg`,
  `${base}hero-img4.jpg`,
];

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
      gsap.set(".about-line-inner", { yPercent: 108, skewX: -3 });
      gsap.set(".about-cta-wrap", { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=350%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 5,
        },
      });

      tl.to(
        ".about-line-inner",
        { yPercent: 0, skewX: 0, stagger: 0.1, duration: 0.55, ease: "none" },
        0,
      );

      tl.to(".about-cta-wrap", { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.65);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" className="about-section" ref={sectionRef}>
      <div className="about-content">
        {/* LEFT — 4 photos */}
        <div className="about-photo-grid">
          {heroImages.map((src, i) => (
            <div key={i} className="about-photo-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {/* RIGHT — text */}
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
