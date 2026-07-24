import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    body: "Somos una agencia de software especializada en diseñar, construir y escalar productos digitales de alto impacto. Convertimos ideas ambiciosas en experiencias reales que posicionan a los negocios como líderes de su industria.",
  },
  en: {
    title: "Welcome to Fishert Studio",
    body: "We are a software agency specialized in designing, building and scaling high-impact digital products. We turn ambitious ideas into real experiences that position businesses as leaders of their industry.",
  },
};

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  // Split body text into word spans
  const words = t.body.split(" ");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const titleEl = el.querySelector<HTMLElement>(".wlc-title");
      const wordEls = el.querySelectorAll<HTMLElement>(".wlc-word");

      // Start state: title slightly faded, all words at minimum opacity
      gsap.set(titleEl, { opacity: 0, y: 18 });
      gsap.set(wordEls, { opacity: 0.12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // Give enough scroll room: ~80px per word, min 250%
          end: `+=${Math.max(280, words.length * 55)}%`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Title fades in
      tl.to(titleEl, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0);

      // 2. Words reveal one-by-one (with slight overlap for fluidity)
      const wordStart = 0.3;
      const totalWordDuration = 0.65; // portion of timeline for all words
      const wordStep = totalWordDuration / wordEls.length;

      wordEls.forEach((word, i) => {
        tl.to(
          word,
          { opacity: 1, duration: wordStep * 1.6, ease: "none" },
          wordStart + i * wordStep,
        );
      });
    }, el);

    return () => ctx.revert();
  }, [lang, words.length]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title */}
        <h2 className="wlc-title">{t.title}</h2>

        {/* Body — word-by-word reveal */}
        <p className="wlc-body">
          {words.map((word, i) => (
            <span key={i} className="wlc-word">
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
