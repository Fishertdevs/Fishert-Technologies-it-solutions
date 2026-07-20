import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const floatingImages = [
  { src: `${base}surreal1.png`, className: "about-float about-float--1" },
  { src: `${base}surreal2.png`, className: "about-float about-float--2" },
  { src: `${base}surreal3.png`, className: "about-float about-float--3" },
];

const content = {
  es: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2026",
    lines: ["TRANSFORMA", "TU NEGOCIO", "CON SOFTWARE", "HECHO PARA", "GANAR."],
  },
  en: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2026",
    lines: ["TRANSFORM", "YOUR BUSINESS", "WITH SOFTWARE", "BUILT", "TO WIN."],
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title lines: hidden below clip, reveal on scroll
      gsap.set(".about-line-inner", { yPercent: 110 });
      // Images: hidden, oversized — will zoom in one by one to collage
      gsap.set(".about-float--1", { opacity: 0, scale: 3.2, transformOrigin: "center center" });
      gsap.set(".about-float--2", { opacity: 0, scale: 3.2, transformOrigin: "center center" });
      gsap.set(".about-float--3", { opacity: 0, scale: 3.2, transformOrigin: "center center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=430%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 5,
        },
      });

      // ── Phase 1: title lines reveal staggered ───────────────
      tl.to(
        ".about-line-inner",
        { yPercent: 0, stagger: 0.09, duration: 0.55, ease: "none" },
        0,
      );

      // ── Phase 2: img1 zooms in from large → collage position ─
      tl.to(".about-float--1", { opacity: 1, duration: 0.2, ease: "none" }, 0.7);
      tl.to(".about-float--1", { scale: 1, duration: 0.9, ease: "none" }, 0.85);

      // ── Phase 3: img2 ────────────────────────────────────────
      tl.to(".about-float--2", { opacity: 1, duration: 0.2, ease: "none" }, 1.65);
      tl.to(".about-float--2", { scale: 1, duration: 0.9, ease: "none" }, 1.8);

      // ── Phase 4: img3 ────────────────────────────────────────
      tl.to(".about-float--3", { opacity: 1, duration: 0.2, ease: "none" }, 2.55);
      tl.to(".about-float--3", { scale: 1, duration: 0.9, ease: "none" }, 2.7);

      // ── Phase 5: all hold in collage ─────────────────────────
      // (timeline ends at 3.8 — pin holds)
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
        <div className="about-agency-badge">{t.badge}</div>
        <div className="about-lines">
          {t.lines.map((line, i) => (
            <div className="about-line" key={i}>
              <span className="about-line-inner">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
