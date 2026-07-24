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
    const ctx = gsap.context(() => {
      const titleInner = sectionRef.current!.querySelector<HTMLElement>(".wlc-title-inner");
      const wordEls = sectionRef.current!.querySelectorAll<HTMLElement>(".wlc-word");

      // Same initial state as hero lines
      gsap.set(titleInner, { yPercent: 108, skewX: -3 });
      gsap.set(wordEls, { opacity: 0.12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 6}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 (0 → 0.18): title clips up from below — identical to hero
      tl.to(titleInner, { yPercent: 0, skewX: 0, duration: 0.18, ease: "power2.out" }, 0);

      // Phase 2 (0.20 → 1): word-by-word reveal
      const wordStep = 0.80 / wordEls.length;
      wordEls.forEach((word, i) => {
        tl.to(word, { opacity: 1, duration: wordStep * 2.5, ease: "none" }, 0.20 + i * wordStep);
      });
    }, sectionRef); // scope to section — same pattern as About.tsx

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        <p className="wlc-body">
          {words.reduce<React.ReactNode[]>((acc, word, i) => {
            const span = (
              <span key={`${lang}-${i}`} className="wlc-word">
                {word}
              </span>
            );
            return i === 0 ? [span] : [...acc, " ", span];
          }, [])}
        </p>
      </div>
    </section>
  );
}
