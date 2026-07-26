import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2026",
    lines: ["ASÍ", "NACIÓ", "TODO."],
    body: [
      "Fisher Studio comenzó con una idea de Harry Fishert, nuestro fundador y líder de desarrollo. Lo que empezó como un hobby entre amigos pronto se convirtió en una visión compartida: construir una agencia de software capaz de romper con lo convencional y crear soluciones digitales que realmente marcaran la diferencia.",
      "Desde el primer día, nuestro objetivo ha sido explorar nuevas ideas, expandirnos hacia diferentes áreas de la tecnología y desarrollar proyectos que inspiren. No creemos en las soluciones genéricas ni en los sitios web que se parecen entre sí. Diseñamos experiencias digitales con identidad propia, combinando ingeniería, diseño y estrategia para ayudar a cada cliente a construir una presencia única en el mundo digital.",
    ],
    stats: [
      { num: "5+", label: "Años activos" },
      { num: "40+", label: "Proyectos entregados" },
      { num: "20+", label: "Clientes satisfechos" },
    ],
  },
  en: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2026",
    lines: ["IT ALL", "STARTED", "HERE."],
    body: [
      "Fisher Studio began with an idea from Harry Fishert, our founder and lead developer. What started as a hobby among friends quickly became a shared vision: to build a software agency capable of breaking with convention and creating digital solutions that truly make a difference.",
      "From day one, our goal has been to explore new ideas, expand into different areas of technology, and develop projects that inspire. We don't believe in generic solutions or websites that all look the same. We design digital experiences with their own identity, combining engineering, design, and strategy to help each client build a unique presence in the digital world.",
    ],
    stats: [
      { num: "5+", label: "Years active" },
      { num: "40+", label: "Projects delivered" },
      { num: "20+", label: "Happy clients" },
    ],
  },
};

/** Wavy checkerboard background — SVG feTurbulence displacement */
function WavyChecker() {
  return (
    <svg
      className="nos-checker-bg"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="nos-checker-pat"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <rect width="40" height="40" fill="#111111" />
          <rect x="40" width="40" height="40" fill="#f0ece2" />
          <rect y="40" width="40" height="40" fill="#f0ece2" />
          <rect x="40" y="40" width="40" height="40" fill="#111111" />
        </pattern>
        <filter id="nos-wave-f" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.013 0.013"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      {/* Warped checkerboard + orange accent squares */}
      <g filter="url(#nos-wave-f)">
        <rect width="100%" height="100%" fill="url(#nos-checker-pat)" />
        {/* Orange accents — same positions as the reference image */}
        <rect x="71%" y="7%"  width="40" height="40" fill="#E84A2A" />
        <rect x="12%" y="54%" width="40" height="40" fill="#E84A2A" />
        <rect x="56%" y="79%" width="40" height="40" fill="#E84A2A" />
        <rect x="38%" y="28%" width="40" height="40" fill="#E84A2A" />
      </g>
    </svg>
  );
}

export default function Nosotros() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".nos-line-inner", { yPercent: 105 });
      gsap.set(".nos-badge", { opacity: 0, y: 16 });
      gsap.set(".nos-body", { opacity: 0, y: 24 });
      gsap.set(".nos-stat", { opacity: 0, y: 32 });
      gsap.set(".nos-divider", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });

      tl.to(".nos-badge",     { opacity: 1, y: 0, duration: 0.4, ease: "none" }, 0);
      tl.to(".nos-line-inner",{ yPercent: 0, duration: 1.1, ease: "none", stagger: 0.18 }, 0.1);
      tl.to(".nos-divider",   { scaleX: 1, duration: 0.6, ease: "none" }, 0.8);
      tl.to(".nos-body",      { opacity: 1, y: 0, duration: 0.6, ease: "none", stagger: 0.25 }, 1.0);
      tl.to(".nos-stat",      { opacity: 1, y: 0, duration: 0.5, ease: "none", stagger: 0.2 }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" className="nos-section" ref={sectionRef}>
      <WavyChecker />
      <div className="nos-inner">
        {/* Left column */}
        <div className="nos-left">
          <div className="nos-badge">{t.badge}</div>
          <div className="nos-lines">
            {t.lines.map((line, i) => (
              <div className="nos-line" key={i}>
                <span className="nos-line-inner">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="nos-right">
          <div className="nos-body-group">
            {t.body.map((para, i) => (
              <p key={i} className="nos-body">{para}</p>
            ))}
          </div>

          <div className="nos-divider" />

          <div className="nos-stats">
            {t.stats.map((s) => (
              <div key={s.num} className="nos-stat">
                <span className="nos-stat-num">{s.num}</span>
                <span className="nos-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
