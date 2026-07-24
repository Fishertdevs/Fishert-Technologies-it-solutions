import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    lines: [
      "Somos una agencia de software especializada",
      "en diseñar, construir y escalar productos",
      "digitales de alto impacto.",
      "Convertimos ideas ambiciosas en experiencias",
      "reales que posicionan a los negocios",
      "como líderes de su industria.",
    ],
  },
  en: {
    title: "Welcome to Fishert Studio",
    lines: [
      "We are a software agency specialized",
      "in designing, building and scaling",
      "high-impact digital products.",
      "We turn ambitious ideas into real experiences",
      "that position businesses as leaders",
      "of their industry.",
    ],
  },
};

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleInner = sectionRef.current!.querySelector<HTMLElement>(".wlc-title-inner");
      const lineInners = sectionRef.current!.querySelectorAll<HTMLElement>(".wlc-line-inner");

      // Title: same clip-reveal as hero
      gsap.set(titleInner, { yPercent: 108, skewX: -3 });
      // Body lines: start clipped below, slight skew
      gsap.set(lineInners, { yPercent: 110, skewX: -2 });

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

      // Phase 1 (0 → 0.16): Title clips in
      tl.to(titleInner, { yPercent: 0, skewX: 0, duration: 0.16, ease: "power2.out" }, 0);

      // Phase 2 (0.22 → 1): Lines slide up one by one, staggered
      const lineStart = 0.22;
      const lineStep = 0.12;
      const lineDur = 0.18;

      lineInners.forEach((line, i) => {
        tl.to(
          line,
          { yPercent: 0, skewX: 0, duration: lineDur, ease: "power2.out" },
          lineStart + i * lineStep,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — clip-reveal from below */}
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        {/* Body — line-by-line clip reveal, each line its own overflow:hidden mask */}
        <div className="wlc-lines">
          {t.lines.map((line, i) => (
            <div key={`${lang}-${i}`} className="wlc-line-clip">
              <span className="wlc-line-inner">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
