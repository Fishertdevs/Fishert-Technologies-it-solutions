import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    badge: "FISHERT SOFTWARE AGENCY",
    label: "SERVICIOS",
    items: [
      {
        num: "01",
        title: "Diseño de Producto",
        desc: "Interfaces que reducen fricción y aumentan retención.",
      },
      {
        num: "02",
        title: "Desarrollo Web & Móvil",
        desc: "Código limpio, arquitecturas escalables, entregas reales.",
      },
      {
        num: "03",
        title: "Ingeniería de Software",
        desc: "Sistemas robustos diseñados para crecer sin romperse.",
      },
      {
        num: "04",
        title: "Estrategia Digital",
        desc: "Roadmaps claros para productos que compiten y ganan.",
      },
      {
        num: "05",
        title: "Inteligencia Artificial",
        desc: "IA integrada donde realmente agrega valor al negocio.",
      },
    ],
  },
  en: {
    badge: "FISHERT SOFTWARE AGENCY",
    label: "SERVICES",
    items: [
      {
        num: "01",
        title: "Product Design",
        desc: "Interfaces that cut friction and drive retention.",
      },
      {
        num: "02",
        title: "Web & Mobile Dev",
        desc: "Clean code, scalable architecture, real deliverables.",
      },
      {
        num: "03",
        title: "Software Engineering",
        desc: "Robust systems built to scale without breaking.",
      },
      {
        num: "04",
        title: "Digital Strategy",
        desc: "Clear roadmaps for products that compete and win.",
      },
      {
        num: "05",
        title: "Artificial Intelligence",
        desc: "AI integrated where it genuinely adds business value.",
      },
    ],
  },
};

export default function Servicios() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".srv-item", { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 });
      gsap.set(".srv-badge", { opacity: 0, y: 16 });
      gsap.set(".srv-label-inner", { yPercent: 110 });
      gsap.set(".srv-progress-fill", { scaleY: 0, transformOrigin: "top center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=320%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 4,
        },
      });

      tl.to(".srv-badge", { opacity: 1, y: 0, duration: 0.4, ease: "none" }, 0);
      tl.to(".srv-label-inner", { yPercent: 0, duration: 0.5, ease: "none" }, 0);
      tl.to(".srv-progress-fill", { scaleY: 1, duration: 2.5, ease: "none" }, 0.4);

      // Reveal each service item sequentially
      const items = gsap.utils.toArray<HTMLElement>(".srv-item");
      items.forEach((item, i) => {
        const startAt = 0.3 + i * 0.42;
        tl.to(
          item,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.5,
            ease: "none",
          },
          startAt,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="srv-section" ref={sectionRef}>
      <div className="srv-inner">
        {/* Left column */}
        <div className="srv-left">
          <div className="srv-badge">{t.badge}</div>
          <div className="srv-label-wrap">
            <span className="srv-label-inner">{t.label}</span>
          </div>
          <div className="srv-progress-track">
            <div className="srv-progress-fill" />
          </div>
        </div>

        {/* Right column: service list */}
        <div className="srv-list">
          {t.items.map((item) => (
            <div key={item.num} className="srv-item">
              <span className="srv-item-num">{item.num}</span>
              <div className="srv-item-body">
                <span className="srv-item-title">{item.title}</span>
                <span className="srv-item-desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
