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

  const words = t.body.split(" ");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const titleInner = el.querySelector<HTMLElement>(".wlc-title-inner");
      const wordEls = el.querySelectorAll<HTMLElement>(".wlc-word");

      // Title starts clipped below — same effect as hero lines
      gsap.set(titleInner, { yPercent: 108, skewX: -3 });
      // All words start very faded (ghost)
      gsap.set(wordEls, { opacity: 0.12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // Long enough to not rush: title reveal + all words
          end: "+=500%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 (0 → 0.18): Title clips in from below, identical to hero
      tl.to(
        titleInner,
        { yPercent: 0, skewX: 0, duration: 0.18, ease: "power2.out" },
        0,
      );

      // Phase 2 (0.22 → 1.0): Each word fades to full opacity sequentially
      const wordStart = 0.22;
      const wordBudget = 0.78; // remaining timeline for words
      const wordStep = wordBudget / wordEls.length;

      wordEls.forEach((word, i) => {
        tl.to(
          word,
          { opacity: 1, duration: wordStep * 2.2, ease: "none" },
          wordStart + i * wordStep,
        );
      });
    }, el);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — clip-reveal from below, single line, red */}
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        {/* Body — word-by-word reveal, dark on white */}
        <p className="wlc-body">
          {words.map((word, i) => (
            <span key={`${lang}-${i}`} className="wlc-word">
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
