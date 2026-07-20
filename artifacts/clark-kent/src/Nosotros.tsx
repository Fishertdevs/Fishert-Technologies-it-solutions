import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2026",
    lines: ["EQUIPO", "PEQUEÑO.", "IMPACTO", "GRANDE."],
    body: "No somos una agencia tradicional. Somos un equipo compacto de diseñadores e ingenieros que construye software como si fuera nuestro propio producto — con ownership real y sin atajos.",
    stats: [
      { num: "5+", label: "Años activos" },
      { num: "40+", label: "Proyectos entregados" },
      { num: "20+", label: "Clientes satisfechos" },
    ],
  },
  en: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2026",
    lines: ["SMALL", "TEAM.", "BIG", "IMPACT."],
    body: "We're not a traditional agency. We're a compact team of designers and engineers who builds software as if it were our own product — with real ownership and zero shortcuts.",
    stats: [
      { num: "5+", label: "Years active" },
      { num: "40+", label: "Projects delivered" },
      { num: "20+", label: "Happy clients" },
    ],
  },
};

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

      tl.to(".nos-badge", { opacity: 1, y: 0, duration: 0.4, ease: "none" }, 0);
      tl.to(".nos-line-inner", { yPercent: 0, duration: 1.1, ease: "none", stagger: 0.18 }, 0.1);
      tl.to(".nos-divider", { scaleX: 1, duration: 0.6, ease: "none" }, 0.8);
      tl.to(".nos-body", { opacity: 1, y: 0, duration: 0.6, ease: "none" }, 1.0);
      tl.to(".nos-stat", { opacity: 1, y: 0, duration: 0.5, ease: "none", stagger: 0.2 }, 1.2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" className="nos-section" ref={sectionRef}>
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
          <p className="nos-body">{t.body}</p>

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
