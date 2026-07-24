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
      // Background image always visible — no animation on it.
      // Text + CTAs start hidden and reveal on scroll down.
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
          onLeaveBack: () => {
            gsap.set(".about-line-inner", { yPercent: 108, skewX: -3 });
            gsap.set(".about-cta-wrap", { opacity: 0, y: 18 });
          },
        },
      });

      // Text slides up from below as you scroll down
      tl.to(
        ".about-line-inner",
        { yPercent: 0, skewX: 0, stagger: 0.1, duration: 0.55, ease: "none" },
        0,
      );
      tl.to(".about-cta-wrap", { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.5);
      // No fade-out — content stays visible until the pin releases
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
            </a>
            <a href="#portafolio" className="about-cta-secondary">
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
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#ffffff"
        />
      </svg>
    </section>
  );
}
