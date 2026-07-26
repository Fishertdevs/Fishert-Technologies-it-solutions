import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    lines: ["CÓMO", "INICIAMOS", "ESTA IDEA."],
    body: [
      "Fisher Studio comenzó con una idea de Harry Fishert, nuestro fundador y líder de desarrollo. Lo que empezó como un hobby entre amigos pronto se convirtió en una visión compartida: construir una agencia de software capaz de romper con lo convencional y crear soluciones digitales que realmente marcaran la diferencia.",
      "Desde el primer día, nuestro objetivo ha sido explorar nuevas ideas, expandirnos hacia diferentes áreas de la tecnología y desarrollar proyectos que inspiren. No creemos en las soluciones genéricas ni en los sitios web que se parecen entre sí. Diseñamos experiencias digitales con identidad propia, combinando ingeniería, diseño y estrategia para ayudar a cada cliente a construir una presencia única en el mundo digital.",
    ],
  },
  en: {
    lines: ["HOW WE", "STARTED", "THIS IDEA."],
    body: [
      "Fisher Studio began with an idea from Harry Fishert, our founder and lead developer. What started as a hobby among friends quickly became a shared vision: to build a software agency capable of breaking with convention and creating digital solutions that truly make a difference.",
      "From day one, our goal has been to explore new ideas, expand into different areas of technology, and develop projects that inspire. We don't believe in generic solutions or websites that all look the same. We design digital experiences with their own identity, combining engineering, design, and strategy to help each client build a unique presence in the digital world.",
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
      gsap.set(".nos-bubble", { opacity: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=260%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });

      tl.to(".nos-line-inner", { yPercent: 0, duration: 1.1, ease: "none", stagger: 0.18 }, 0);
      tl.to(".nos-mona",       { opacity: 1, y: 0, duration: 0.8, ease: "none" }, 0.5);
      tl.to(".nos-bubble",     { opacity: 1, y: 0, duration: 0.7, ease: "none" }, 0.7);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" className="nos-section" ref={sectionRef}>

      {/* ── Top wave — white from Socios curves into dark checker ── */}
      <svg
        className="nos-wave nos-wave--top"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,80 L0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 Z"
          fill="#ffffff"
        />
      </svg>

      <div className="nos-inner">
        {/* Left — title + image */}
        <div className="nos-left">
          <div className="nos-lines">
            {t.lines.map((line, i) => (
              <div className="nos-line" key={i}>
                <span className="nos-line-inner">{line}</span>
              </div>
            ))}
          </div>

          <img
            src={`${import.meta.env.BASE_URL}mona-lisa.jpeg`}
            alt="Mona Lisa"
            className="nos-mona"
          />
        </div>

        {/* Right — white speech-bubble card */}
        <div className="nos-right">
          <div className="nos-bubble">
            {t.body.map((para, i) => (
              <p key={i} className="nos-body">{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom wave — dark checker curves into next section ── */}
      <svg
        className="nos-wave nos-wave--bottom"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#ffffff"
        />
      </svg>

    </section>
  );
}
