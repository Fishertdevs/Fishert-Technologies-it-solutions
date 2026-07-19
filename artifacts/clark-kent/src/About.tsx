import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const floatingImages = [
  { src: `${base}tech1.png`, className: "about-float about-float--1" },
  { src: `${base}tech2.png`, className: "about-float about-float--2" },
  { src: `${base}tech3.png`, className: "about-float about-float--3" },
];

const content = {
  es: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2020",
    lines: ["TRANSFORMA", "TU NEGOCIO", "CON SOFTWARE", "HECHO PARA", "GANAR."],
    descriptor:
      "Bienvenidos a Fishert Studio. Somos una agencia de software que diseña, construye y escala productos digitales que transforman negocios en líderes de su industria.",
  },
  en: {
    badge: "FISHERT STUDIO · SOFTWARE AGENCY · EST. 2020",
    lines: ["TRANSFORM", "YOUR BUSINESS", "WITH SOFTWARE", "BUILT", "TO WIN."],
    descriptor:
      "Welcome to Fishert Studio. We are a software agency that designs, builds and scales digital products — turning businesses into leaders of their industry.",
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Images start hidden — reveal + parallax on scroll
      gsap.set(".about-float", { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 5,
        },
      });

      scrollTl.to(
        ".about-float--1",
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" },
        0.05,
      );
      scrollTl.to(
        ".about-float--2",
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" },
        0.35,
      );
      scrollTl.to(
        ".about-float--3",
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.9, ease: "none" },
        0.62,
      );

      // Subtle parallax drift
      scrollTl.to(".about-float--1", { y: -30, duration: 2, ease: "none" }, 0);
      scrollTl.to(".about-float--2", { y: -20, duration: 2, ease: "none" }, 0);
      scrollTl.to(".about-float--3", { y: -25, duration: 2, ease: "none" }, 0);
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
        <p className="about-descriptor">{t.descriptor}</p>
      </div>
    </section>
  );
}
