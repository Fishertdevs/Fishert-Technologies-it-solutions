import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const galleryData = [
  { id: 1, img: "svc1_2.jpg", num: "I",    pos: "center center", es: "Desarrollo Web",         en: "Web Development" },
  { id: 2, img: "svc2_2.jpg", num: "II",   pos: "center bottom", es: "Desarrollo de Software", en: "Software Development" },
  { id: 3, img: "svc3_2.jpg", num: "III",  pos: "center center", es: "Automatización e IA",    en: "Automation & AI" },
  { id: 4, img: "svc4_2.jpg", num: "IV",   pos: "center center", es: "Marketing Digital",      en: "Digital Marketing" },
  { id: 5, img: "svc5_2.jpg", num: "V",    pos: "center bottom", es: "Cloud y DevOps",         en: "Cloud & DevOps" },
];

// 5 unique images, 4 visible at a time (1 always off-screen to enable carousel entry).
// Entry order: after 5 scroll cycles every card returns to its original slot.
const ENTRY_ORDER = [4, 3, 2, 1, 0]; // indices into galleryData

const VISIBLE = 4;

type Slot = { size: number; height: number; x: number };

export default function Servicios() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const { lang } = useLang();

  // ── Slot sizes from actual section width ───────────────────────────────
  useEffect(() => {
    const compute = () => {
      const vw = sectionRef.current?.clientWidth ?? window.innerWidth;
      const vh = sectionRef.current?.clientHeight ?? window.innerHeight;
      // Widths must sum to 1.0 × vw so cards fill the section (carousel works)
      const widths = [vw * 0.18, vw * 0.22, vw * 0.27, vw * 0.33];
      // Heights are capped at 60 vh so cards aren't overwhelmingly tall
      const maxH = vh * 0.60;
      let x = 0;
      setSlots(
        widths.map((w) => {
          const slot: Slot = { size: w, height: Math.min(w, maxH), x };
          x += w;
          return slot;
        })
      );
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ── Scroll-driven 6-cycle carousel (user controls with scroll) ─────────
  useLayoutEffect(() => {
    if (slots.length < VISIBLE || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hide all cards, then place the initial 5
      gsap.set(".svc-item", {
        position: "absolute", bottom: 0, left: 0,
        x: 0, width: 0, height: 0, opacity: 0,
      });
      for (let i = 0; i < VISIBLE; i++) {
        gsap.set(`.svc-item--${galleryData[i].id}`, {
          x: slots[i].x, width: slots[i].size, height: slots[i].height, opacity: 1,
        });
      }

      // 2. Scroll-driven timeline — user scrolls to advance each cycle
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${5 * 100}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 4,
        },
      });

      const screen = [0, 1, 2, 3];

      for (let ci = 0; ci < 5; ci++) {
        const t = ci;
        const enterIdx = ENTRY_ORDER[ci];
        const enterId = galleryData[enterIdx].id;

        // Position entering card off-screen left at slot-0 size, just before cycle
        tl.set(`.svc-item--${enterId}`, {
          x: -slots[0].size, width: slots[0].size, height: slots[0].height, opacity: 1,
        }, t === 0 ? "<" : t - 0.001);

        // Slide entering card into slot 0
        tl.to(`.svc-item--${enterId}`, {
          x: slots[0].x, duration: 1, ease: "none",
        }, t);

        // Shift each visible card one slot to the right; rightmost exits
        screen.forEach((idx, si) => {
          const id = galleryData[idx].id;
          if (si < VISIBLE - 1) {
            tl.to(`.svc-item--${id}`, {
              x: slots[si + 1].x,
              width: slots[si + 1].size,
              height: slots[si + 1].height,
              duration: 1, ease: "none",
            }, t);
          } else {
            tl.to(`.svc-item--${id}`, {
              x: slots[VISIBLE - 1].x + slots[VISIBLE - 1].size,
              duration: 1, ease: "none",
            }, t);
          }
        });

        screen.unshift(enterIdx);
        screen.pop();
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slots]);

  return (
    <section
      id="servicios"
      ref={sectionRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "repeating-conic-gradient(#111111 0% 25%, #333333 0% 50%) center / 52px 52px",
        position: "relative",
        borderRadius: "56px",
      }}
    >
      {/* Top wave — white to match the section above */}
      <svg
        style={{ position: "absolute", top: -1, left: 0, width: "100%", height: 80, zIndex: 20, display: "block", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,32 C1200,72 960,2 720,32 C480,72 240,2 0,32 Z" fill="#ffffff" />
      </svg>

      <div className="works-text-block">
        <h2 className="works-heading">
          {lang === "es" ? "NUESTROS SERVICIOS." : "OUR SERVICES."}
        </h2>
        <p className="works-tagline">
          {lang === "es"
            ? <>Diseñamos, desarrollamos y escalamos<br />soluciones digitales para marcas<br />que buscan liderar.</>
            : <>We design, build and scale digital<br />solutions for brands that aim to lead.</>}
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {galleryData.map((item) => (
          <div
            key={item.id}
            className={`svc-item svc-item--${item.id}`}
            style={{
              overflow: "hidden",
              position: "absolute",
              bottom: 0, left: 0,
              borderRadius: "16px 16px 0 0",
            }}
          >
            <img
              src={`${base}${item.img}`}
              alt={lang === "es" ? item.es : item.en}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: item.pos,
                display: "block",
              }}
            />
            <div className="svc-label-overlay">
              <span className="svc-label-num">{item.num}</span>
              <span className="svc-label-title">{lang === "es" ? item.es : item.en}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
