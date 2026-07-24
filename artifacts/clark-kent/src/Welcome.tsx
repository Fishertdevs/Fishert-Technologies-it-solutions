import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    title: "Bienvenidos a\nFishert Studio",
    body: "Somos una agencia de software especializada en diseñar, construir y escalar productos digitales de alto impacto. Convertimos ideas ambiciosas en experiencias reales que posicionan a los negocios como líderes de su industria.",
  },
  en: {
    title: "Welcome to\nFishert Studio",
    body: "We are a software agency specialized in designing, building and scaling high-impact digital products. We turn ambitious ideas into real experiences that position businesses as leaders of their industry.",
  },
};

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  const words = t.body.split(" ");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const wordEls = el.querySelectorAll<HTMLElement>(".wlc-word");

      // All words start ghost-white (very faded)
      gsap.set(wordEls, { opacity: 0.15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${Math.max(300, words.length * 60)}%`,
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Reveal each word to pure white sequentially, slight overlap for fluid feel
      const totalDuration = 0.9;
      const wordStep = totalDuration / wordEls.length;

      wordEls.forEach((word, i) => {
        tl.to(
          word,
          { opacity: 1, duration: wordStep * 2, ease: "none" },
          i * wordStep,
        );
      });
    }, el);

    return () => ctx.revert();
  }, [lang, words.length]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — static, no animation */}
        <h2 className="wlc-title">
          {t.title.split("\n").map((line, i) => (
            <span key={i} className="wlc-title-line">{line}</span>
          ))}
        </h2>

        {/* Body — word-by-word reveal */}
        <p className="wlc-body">
          {words.map((word, i) => (
            <span key={i} className="wlc-word">
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
