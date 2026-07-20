import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const floatingImages = [
  { src: `${base}ai1_2.png`, className: "about-float about-float--1" },
  { src: `${base}ai2_2.png`, className: "about-float about-float--2" },
  { src: `${base}ai3_2.png`, className: "about-float about-float--3" },
];

const content = {
  es: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2026",
    lines: ["TU PRÓXIMA", "GRAN IDEA", "COMIENZA", "CON", "NOSOTROS"],
    cta_primary: "Iniciar Proyecto",
    cta_secondary: "Ver Portafolio",
  },
  en: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2026",
    lines: ["YOUR NEXT", "BIG IDEA", "STARTS", "WITH", "US"],
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
      // ── Initial hidden states ───────────────────────────────
      gsap.set(".about-badge", { opacity: 0, y: 12 });
      gsap.set(".about-line-inner", { yPercent: 108, skewX: -3 });
      gsap.set(".about-cta-wrap", { opacity: 0, y: 18 });
      gsap.set(".about-float--1", { opacity: 0, x: 50, y: -30, rotate: 7, scale: 0.9 });
      gsap.set(".about-float--2", { opacity: 0, x: 70, y: 50, rotate: -5, scale: 0.85 });
      gsap.set(".about-float--3", { opacity: 0, x: 30, y: 25, rotate: 4, scale: 0.88 });

      // ── PAGE LOAD entrance (no scroll needed) ───────────────
      const intro = gsap.timeline({ delay: 0.1 });

      intro.to(".about-badge", {
        opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
      });

      intro.to(
        ".about-line-inner",
        { yPercent: 0, skewX: 0, stagger: 0.075, duration: 0.65, ease: "power3.out" },
        "-=0.3",
      );

      intro.to(
        ".about-cta-wrap",
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.25",
      );

      // ── SCROLL-PINNED phase: images drift in while pinned ───
      const scrollTl = gsap.timeline({
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

      scrollTl.to(".about-float--1", {
        opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
        duration: 0.65, ease: "none",
      }, 0.15);

      scrollTl.to(".about-float--2", {
        opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
        duration: 0.65, ease: "none",
      }, 0.75);

      scrollTl.to(".about-float--3", {
        opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
        duration: 0.65, ease: "none",
      }, 1.35);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" className="about-section" ref={sectionRef}>
      {floatingImages.map((img, i) => (
        <div key={i} className={img.className}>
          <img src={img.src} alt="" />
        </div>
      ))}

      <div className="about-content">
        <div className="about-agency-badge about-badge">{t.badge}</div>

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
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#portafolio" className="about-cta-secondary">
            {t.cta_secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
