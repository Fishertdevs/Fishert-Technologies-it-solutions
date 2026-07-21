import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    lines: [
      "Somos una agencia de software especializada en diseñar,",
      "construir y escalar productos digitales de alto impacto.",
      "Convertimos ideas ambiciosas en experiencias reales que",
      "posicionan a los negocios como líderes de su industria.",
    ],
  },
  en: {
    title: "Welcome to Fishert Studio",
    lines: [
      "We are a software agency specialized in designing,",
      "building and scaling high-impact digital products.",
      "We turn ambitious ideas into real experiences that",
      "position businesses as leaders of their industry.",
    ],
  },
};

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = content[lang];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const titleBar = el.querySelector<HTMLElement>(".wlc-title-bar");
      const titleEl = el.querySelector<HTMLElement>(".wlc-title");
      const bodyLines = el.querySelectorAll<HTMLElement>(".wlc-body-line");
      const bodyBars = el.querySelectorAll<HTMLElement>(".wlc-body-bar");

      // Initial state
      gsap.set(titleBar, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(titleEl, { opacity: 0 });
      bodyLines.forEach((l) => gsap.set(l, { opacity: 0 }));
      bodyBars.forEach((b) => gsap.set(b, { scaleX: 0, transformOrigin: "left center" }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 4,
        },
      });

      // Title sweep in → reveal → sweep out
      tl.to(titleBar, { scaleX: 1, duration: 0.35, ease: "none" }, 0);
      tl.to(titleEl, { opacity: 1, duration: 0.01 }, 0.34);
      tl.to(titleBar, { scaleX: 0, transformOrigin: "right center", duration: 0.35, ease: "none" }, 0.36);

      // Body lines: each line sweeps in, reveals, sweeps out
      const bodyStart = 0.85;
      const step = 0.38;
      bodyLines.forEach((line, i) => {
        const bar = bodyBars[i];
        const t0 = bodyStart + i * step;
        tl.to(bar, { scaleX: 1, duration: 0.28, ease: "none" }, t0);
        tl.to(line, { opacity: 1, duration: 0.01 }, t0 + 0.27);
        tl.to(bar, { scaleX: 0, transformOrigin: "right center", duration: 0.28, ease: "none" }, t0 + 0.29);
      });
    }, el);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section className="welcome-section" ref={sectionRef}>
      <div className="welcome-inner">
        {/* Title */}
        <div className="wlc-title-wrap">
          <h2 className="wlc-title">{t.title}</h2>
          <div className="wlc-title-bar" />
        </div>

        {/* Body lines */}
        <div className="wlc-body">
          {t.lines.map((line, i) => (
            <div className="wlc-line-wrap" key={i}>
              <span className="wlc-body-line">{line}</span>
              <div className="wlc-body-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
