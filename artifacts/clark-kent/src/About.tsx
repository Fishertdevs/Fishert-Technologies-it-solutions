import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const floatingImages = [
  { src: `${base}ai1.png`, className: "about-float about-float--1" },
  { src: `${base}ai2.png`, className: "about-float about-float--2" },
  { src: `${base}ai3.png`, className: "about-float about-float--3" },
];

const content = {
  es: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2020",
    lines: ["CONSTRUIMOS", "PRODUCTOS", "DIGITALES", "QUE ESCALAN", "Y RINDEN"],
    descriptor:
      "Creamos productos digitales de extremo a extremo — desde estrategia y diseño hasta ingeniería y despliegue — para equipos que se niegan a lanzar software mediocre.",
  },
  en: {
    badge: "FISHERT SOFTWARE AGENCY · EST. 2020",
    lines: ["WE BUILD", "DIGITAL", "PRODUCTS", "THAT SCALE", "& PERFORM"],
    descriptor:
      "We craft end-to-end digital products — from strategy and design to engineering and deployment — for teams that refuse to ship mediocre software.",
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".about-line-inner", { yPercent: 105 });
      gsap.set(".about-float", { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 });
      gsap.set(".about-agency-badge", { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });

      tl.to(".about-line-inner", { yPercent: 0, duration: 1.2, ease: "none", stagger: 0.18 }, 0);
      tl.to(".about-agency-badge", { opacity: 1, y: 0, duration: 0.6, ease: "none" }, 0.3);

      tl.to(".about-float--1", { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" }, 0.2);
      tl.to(".about-float--2", { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" }, 0.5);
      tl.to(".about-float--3", { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" }, 0.78);

      tl.to(".about-float--1", { y: -30, duration: 2, ease: "none" }, 0);
      tl.to(".about-float--2", { y: -20, duration: 2, ease: "none" }, 0);
      tl.to(".about-float--3", { y: -25, duration: 2, ease: "none" }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {floatingImages.map((img, i) => (
        <div key={i} className={img.className}>
          <img src={img.src} alt="" />
        </div>
      ))}

      <div className="about-content">
        <div className="about-agency-badge">{t.badge}</div>
        <div className="about-lines">
          {t.lines.map((line, i) => (
            <div className="about-line" key={i}>
              <span className="about-line-inner">{line}</span>
            </div>
          ))}
        </div>
        <p className="about-descriptor">{t.descriptor}</p>
      </div>
    </section>
  );
}
