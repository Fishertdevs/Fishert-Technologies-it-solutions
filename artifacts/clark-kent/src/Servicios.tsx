import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const galleryData = [
  { id: 1, img: "W4.png", title: "Blue Tulip" },
  { id: 2, img: "W5.png", title: "Opera Mask" },
  { id: 3, img: "W6.png", title: "Blue Bloom" },
  { id: 4, img: "W7.png", title: "First Contact" },
  { id: 5, img: "W8.png", title: "White Yak" },
  { id: 6, img: "W9.png", title: "Heron Girl" },
];

// After 6 cycles the carousel returns to its exact starting state.
// Each cycle: one card enters from left (slot 0), all shift right, rightmost exits.
// Entry order: W9, W8, W7, W6, W5, W4 → then repeats.
const ENTRY_ORDER = [5, 4, 3, 2, 1, 0]; // indices into galleryData

const VISIBLE = 5;
const ANIM = 0.7;  // slide duration (s)
const HOLD = 0.9;  // pause between cycles (s)
const STEP = ANIM + HOLD;

type Slot = { size: number; x: number };

export default function Servicios() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const { lang } = useLang();

  // ── Compute slot sizes from actual section width ────────────────────────
  useEffect(() => {
    const compute = () => {
      const vw = sectionRef.current?.clientWidth ?? window.innerWidth;
      const sizes = [vw * 0.12, vw * 0.16, vw * 0.20, vw * 0.24, vw * 0.28];
      let x = 0;
      const result: Slot[] = sizes.map((s) => { const slot = { size: s, x }; x += s; return slot; });
      setSlots(result);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // ── Build infinite auto-play GSAP timeline ─────────────────────────────
  useEffect(() => {
    if (slots.length < VISIBLE || !sectionRef.current) return;

    // Kill any leftover ScrollTrigger instances from previous renders
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const ctx = gsap.context(() => {
      // 1. Hide all cards
      gsap.set(".svc-item", {
        position: "absolute",
        bottom: 0,
        left: 0,
        x: 0,
        width: 0,
        height: 0,
        opacity: 0,
      });

      // 2. Place initial 5 visible cards
      for (let i = 0; i < VISIBLE; i++) {
        gsap.set(`.svc-item--${galleryData[i].id}`, {
          x: slots[i].x,
          width: slots[i].size,
          height: slots[i].size,
          opacity: 1,
        });
      }

      // 3. Build 6-cycle looping timeline
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
      const screen = [0, 1, 2, 3, 4]; // current visible: indices into galleryData

      for (let ci = 0; ci < 6; ci++) {
        const t = ci * STEP;
        const enterIdx = ENTRY_ORDER[ci];
        const enterId = galleryData[enterIdx].id;

        // Position entering card off-screen left at slot-0 size, just before its turn
        tl.set(`.svc-item--${enterId}`, {
          x: -slots[0].size,
          width: slots[0].size,
          height: slots[0].size,
          opacity: 1,
        }, t === 0 ? "<" : t - 0.001);

        // Slide entering card to slot 0
        tl.to(`.svc-item--${enterId}`, {
          x: slots[0].x,
          duration: ANIM,
          ease: "power2.inOut",
        }, t);

        // Shift each visible card one slot right; last one exits off-screen
        screen.forEach((idx, si) => {
          const id = galleryData[idx].id;
          if (si < VISIBLE - 1) {
            tl.to(`.svc-item--${id}`, {
              x: slots[si + 1].x,
              width: slots[si + 1].size,
              height: slots[si + 1].size,
              duration: ANIM,
              ease: "power2.inOut",
            }, t);
          } else {
            // Exit right: move beyond the last slot's right edge
            tl.to(`.svc-item--${id}`, {
              x: slots[VISIBLE - 1].x + slots[VISIBLE - 1].size,
              duration: ANIM,
              ease: "power2.inOut",
            }, t);
          }
        });

        // Advance screen state (mirrors what the animation does)
        screen.unshift(enterIdx);
        screen.pop();
      }
    }, sectionRef); // scope selectors to this section

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
        backgroundColor: "#143020",
        position: "relative",
        borderRadius: "56px",
      }}
    >
      <div className="works-text-block">
        <h2 className="works-heading">
          {lang === "es" ? "NUESTRAS SOLUCIONES." : "OUR SOLUTIONS."}
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
              bottom: 0,
              left: 0,
              borderRadius: "16px 16px 0 0",
            }}
          >
            <img
              src={`${base}${item.img}`}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center bottom",
                display: "block",
              }}
            />
            <div className="works-item-overlay">
              <span className="works-item-title">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
