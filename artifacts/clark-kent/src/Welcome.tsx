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

    const titleEl = el.querySelector<HTMLElement>(".wlc-title-inner");
    const wordEls = Array.from(el.querySelectorAll<HTMLElement>(".wlc-word"));

    // Set initial states immediately so there's no flash
    if (titleEl) gsap.set(titleEl, { yPercent: 108, skewX: -3 });
    gsap.set(wordEls, { opacity: 0.12 });

    let tl: gsap.core.Timeline | null = null;

    // Small delay so the About section's pin is registered first
    const tid = window.setTimeout(() => {
      if (!el) return;

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // 6 viewport heights of scroll room — never rushes through
          end: () => `+=${window.innerHeight * 6}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: title clips in from below
      if (titleEl) {
        tl.to(titleEl, { yPercent: 0, skewX: 0, duration: 0.18, ease: "power2.out" }, 0);
      }

      // Phase 2: each word fades to full opacity sequentially
      const wordStep = 0.82 / wordEls.length;
      wordEls.forEach((word, i) => {
        tl!.to(
          word,
          { opacity: 1, duration: wordStep * 2.5, ease: "none" },
          0.18 + i * wordStep,
        );
      });

      // Recalculate all ScrollTrigger positions after About's pin
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      window.clearTimeout(tid);
      // Kill the timeline and its ScrollTrigger explicitly
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
        tl = null;
      }
      // Catch any leftover triggers on this element
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === el)
        .forEach((st) => st.kill());
      if (titleEl) gsap.killTweensOf(titleEl);
      gsap.killTweensOf(wordEls);
    };
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — clip-reveal, single line */}
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        {/* Body — word-by-word reveal. Spaces are plain text nodes → wraps correctly */}
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
