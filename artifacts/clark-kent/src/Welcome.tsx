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

  // Split into words — spaces are rendered as plain text nodes so wrapping works
  const words = t.body.split(" ");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Wait one frame so the About section pin has been registered and
    // ScrollTrigger has calculated positions correctly
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const titleInner = el.querySelector<HTMLElement>(".wlc-title-inner");
        const wordEls = el.querySelectorAll<HTMLElement>(".wlc-word");

        // Title: start clipped below (same as hero lines)
        gsap.set(titleInner, { yPercent: 108, skewX: -3 });
        // Words: start very faded
        gsap.set(wordEls, { opacity: 0.12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // 6× viewport height — explicit so it never rushes past
            end: () => `+=${window.innerHeight * 6}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 (0 → 0.16): Title clips in from below
        tl.to(
          titleInner,
          { yPercent: 0, skewX: 0, duration: 0.16, ease: "power2.out" },
          0,
        );

        // Phase 2 (0.20 → 1.0): Words reveal sequentially
        const wordStart = 0.20;
        const wordBudget = 0.80;
        const wordStep = wordBudget / wordEls.length;

        wordEls.forEach((word, i) => {
          tl.to(
            word,
            { opacity: 1, duration: wordStep * 2.4, ease: "none" },
            wordStart + i * wordStep,
          );
        });

        // Force recalc after pinned About section has settled
        ScrollTrigger.refresh();
      }, el);

      return () => ctx.revert();
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — clip-reveal from below, single line, red, no wrapping */}
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        {/* Body — word-by-word reveal. Spaces are outside spans so text wraps. */}
        <p className="wlc-body">
          {words.map((word, i) => (
            <span key={`${lang}-${i}`} className="wlc-word">
              {word}
            </span>
          )).reduce<React.ReactNode[]>((acc, el, i) => {
            if (i === 0) return [el];
            return [...acc, " ", el];
          }, [])}
        </p>
      </div>
    </section>
  );
}
