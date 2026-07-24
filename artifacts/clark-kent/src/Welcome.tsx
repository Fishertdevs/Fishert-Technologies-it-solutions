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
      const lines = sectionRef.current!.querySelectorAll<HTMLElement>(".wlc-line");

      // Title: clip-reveal from below (same as hero)
      gsap.set(titleInner, { yPercent: 108, skewX: -3 });
      // Body lines: invisible + shifted down
      gsap.set(lines, { opacity: 0, y: 40 });

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

      // Phase 1 (0 → 0.16): title clips in
      tl.to(titleInner, { yPercent: 0, skewX: 0, duration: 0.16, ease: "power2.out" }, 0);

      // Phase 2 (0.22 → end): lines fade+slide in staggered
      const lineStep = 0.12;
      const lineDur  = 0.20;

      lines.forEach((line, i) => {
        tl.to(
          line,
          { opacity: 1, y: 0, duration: lineDur, ease: "power3.out" },
          0.22 + i * lineStep,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title — clip-reveal */}
        <div className="wlc-title-clip">
          <h2 className="wlc-title-inner">{t.title}</h2>
        </div>

        {/* Body — staggered fade + slide-up per line */}
        <div className="wlc-lines">
          {t.lines.map((line, i) => (
            <span key={`${lang}-${i}`} className="wlc-line">
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
