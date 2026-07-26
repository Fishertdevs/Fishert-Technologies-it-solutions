import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    title: "CÓMO INICIAMOS ESTA IDEA.",
    body: [
      "Fisher Studio comenzó con una idea de Harry Fishert, nuestro fundador y líder de desarrollo. Lo que empezó como un hobby entre amigos pronto se convirtió en una visión compartida: construir una agencia de software capaz de romper con lo convencional y crear soluciones digitales que realmente marcaran la diferencia.",
      "Desde el primer día, nuestro objetivo ha sido explorar nuevas ideas, expandirnos hacia diferentes áreas de la tecnología y desarrollar proyectos que inspiren. No creemos en las soluciones genéricas ni en los sitios web que se parecen entre sí. Diseñamos experiencias digitales con identidad propia, combinando ingeniería, diseño y estrategia para ayudar a cada cliente a construir una presencia única en el mundo digital.",
    ],
  },
  en: {
    title: "HOW WE STARTED THIS IDEA.",
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
      gsap.set(".nos-title",  { opacity: 0, y: 20 });
      gsap.set(".nos-cloud",  { opacity: 0, x: 24 });
      gsap.set(".nos-mona",   { scale: 1.05, opacity: 0 });

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

      tl.to(".nos-mona",  { scale: 1, opacity: 1, duration: 0.8, ease: "none" }, 0);
      tl.to(".nos-title", { opacity: 1, y: 0,     duration: 0.7, ease: "none" }, 0.4);
      tl.to(".nos-cloud", { opacity: 1, x: 0,     duration: 0.7, ease: "none" }, 0.75);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" className="nos-section" ref={sectionRef}>

      {/* Top wave — fills from y=0 down to wave curve with white */}
      <svg className="nos-wave nos-wave--top" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 L1440,0 L1440,32 C1200,72 960,2 720,32 C480,72 240,2 0,32 Z"
          fill="#ffffff" />
      </svg>

      {/* Hidden SVG filter for goo / cloud-blob merge effect */}
      <svg className="nos-filter-def" aria-hidden="true">
        <defs>
          <filter id="nos-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11"
              result="cloud" />
          </filter>
        </defs>
      </svg>

      <div className="nos-layout">

        {/* Left: full-height Mona Lisa */}
        <div className="nos-img-col">
          <img
            src={`${import.meta.env.BASE_URL}mona-lisa.png`}
            alt="Mona Lisa narrando la historia de Fisher Studio"
            className="nos-mona"
          />
        </div>

        {/* Right: single-line title + cloud container */}
        <div className="nos-speech-col">

          {/* Title — single line */}
          <h2 className="nos-title">{t.title}</h2>

          {/* Cloud wrapper — blobs layer + text layer */}
          <div className="nos-cloud-wrap">

            {/* Blob layer — all white circles merged via goo filter */}
            <div className="nos-cloud-blobs" aria-hidden="true">
              {/* Main cloud body */}
              <div className="ncb ncb-body" />
              {/* Top bumps */}
              <div className="ncb ncb-t1" />
              <div className="ncb ncb-t2" />
              <div className="ncb ncb-t3" />
              <div className="ncb ncb-t4" />
              <div className="ncb ncb-t5" />
              {/* Thought-bubble tail — three shrinking circles pointing left */}
              <div className="ncb ncb-tail1" />
              <div className="ncb ncb-tail2" />
              <div className="ncb ncb-tail3" />
            </div>

            {/* Text layer — above blobs, no filter */}
            <div className="nos-cloud" aria-label="Contenido">
              {t.body.map((para, i) => (
                <p key={i} className="nos-body">{para}</p>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom wave */}
      <svg className="nos-wave nos-wave--bottom" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#ffffff" />
      </svg>

    </section>
  );
}
