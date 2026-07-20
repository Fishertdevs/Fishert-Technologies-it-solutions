import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const heroImages = [
  `${base}vapor1.jpg`,
  `${base}vapor2.jpg`,
  `${base}vapor3.jpg`,
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
      // ── initial hidden states ──────────────────────────────────
      gsap.set(".about-line-inner", { yPercent: 108, skewX: -3 });
      gsap.set(".about-cta-wrap", { opacity: 0, y: 18 });
      gsap.set(".vapor-img--1", { opacity: 0, scale: 0.82, rotate: -6 });
      gsap.set(".vapor-img--2", { opacity: 0, scale: 0.82, rotate: 5 });
      gsap.set(".vapor-img--3", { opacity: 0, scale: 0.82, rotate: -4 });

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

      // ── text reveals ───────────────────────────────────────────
      tl.to(
        ".about-line-inner",
        { yPercent: 0, skewX: 0, stagger: 0.1, duration: 0.55, ease: "none" },
        0,
      );
      tl.to(".about-cta-wrap", { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.6);

      // ── images reveal (staggered, each with its resting rotation) ──
      tl.to(".vapor-img--1", { opacity: 1, scale: 1, rotate: -4,  duration: 0.35, ease: "none" }, 0.05);
      tl.to(".vapor-img--2", { opacity: 1, scale: 1, rotate: 3,   duration: 0.35, ease: "none" }, 0.18);
      tl.to(".vapor-img--3", { opacity: 1, scale: 1, rotate: -2,  duration: 0.35, ease: "none" }, 0.3);

      // ── fade everything out at the end ─────────────────────────
      tl.to(
        [".about-line-inner", ".about-cta-wrap", ".vapor-img--1", ".vapor-img--2", ".vapor-img--3"],
        { opacity: 0, duration: 0.18, ease: "none" },
        0.86,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" className="about-section" ref={sectionRef}>
      {/* SVG clip-path definitions (invisible) */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          {/* Organic circle */}
          <clipPath id="clip-blob-circle" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.02 C0.72,0.02 0.94,0.12 0.97,0.32 C1,0.52 0.92,0.68 0.88,0.82 C0.82,0.96 0.68,1 0.5,1 C0.32,1 0.16,0.95 0.1,0.82 C0.04,0.69 0.02,0.54 0.04,0.36 C0.06,0.18 0.28,0.02 0.5,0.02 Z" />
          </clipPath>
          {/* Arch / stadium top */}
          <clipPath id="clip-arch" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L0,0.38 C0,0.14 0.5,0 0.5,0 C0.5,0 1,0.14 1,0.38 L1,1 Z" />
          </clipPath>
          {/* Rounded blob slant */}
          <clipPath id="clip-slant" clipPathUnits="objectBoundingBox">
            <path d="M0.08,0 L0.92,0 C0.97,0 1,0.04 1,0.09 L1,0.86 C1,0.94 0.88,1 0.72,1 L0.06,1 C0.02,1 0,0.96 0,0.9 L0,0.1 C0,0.05 0.03,0 0.08,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="about-content">
        {/* LEFT — text */}
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

        {/* RIGHT — collage of 3 images */}
        <div className="about-collage">
          <div className="vapor-img vapor-img--1">
            <img src={heroImages[0]} alt="" />
          </div>
          <div className="vapor-img vapor-img--2">
            <img src={heroImages[1]} alt="" />
          </div>
          <div className="vapor-img vapor-img--3">
            <img src={heroImages[2]} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
