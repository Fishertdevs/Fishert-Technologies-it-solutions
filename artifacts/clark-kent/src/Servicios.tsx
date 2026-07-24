import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

// Exactly 7 services — 5 initially visible, 2 cycle in, then section ends
const services = {
  es: [
    { id: 1, img: "W1.png", title: "Diseño UI/UX" },
    { id: 2, img: "W2.png", title: "Desarrollo Web" },
    { id: 3, img: "W3.png", title: "Apps Móviles" },
    { id: 4, img: "W4.png", title: "Inteligencia Artificial" },
    { id: 5, img: "W5.png", title: "Branding & Identidad" },
    { id: 6, img: "W6.png", title: "Estrategia Digital" },
    { id: 7, img: "W7.png", title: "Consultoría Tech" },
  ],
  en: [
    { id: 1, img: "W1.png", title: "UI/UX Design" },
    { id: 2, img: "W2.png", title: "Web Development" },
    { id: 3, img: "W3.png", title: "Mobile Apps" },
    { id: 4, img: "W4.png", title: "Artificial Intelligence" },
    { id: 5, img: "W5.png", title: "Branding & Identity" },
    { id: 6, img: "W6.png", title: "Digital Strategy" },
    { id: 7, img: "W7.png", title: "Tech Consulting" },
  ],
};

type SlotConfig = { size: number; x: number };

const GREEN = "#3E7B5C"; // aesthetic sage-emerald — not generic dark

export default function Servicios() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<SlotConfig[]>([]);
  const { lang } = useLang();

  const galleryData = services[lang];
  const initialVisibleCount = 5;
  const initialVisible = galleryData.slice(0, initialVisibleCount);
  const queuedItems   = galleryData.slice(initialVisibleCount);         // 2 items
  const domItems      = [...[...queuedItems].reverse(), ...initialVisible];

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const sizes = [vw * 0.12, vw * 0.16, vw * 0.2, vw * 0.24, vw * 0.28];
      const computedSlots: SlotConfig[] = [];
      let currentX = 0;
      for (let i = 0; i < initialVisibleCount; i++) {
        computedSlots.push({ size: sizes[i], x: currentX });
        currentX += sizes[i];
      }
      setSlots(computedSlots);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (slots.length === 0) return;

    gsap.set(".svc-item", {
      position: "absolute", bottom: 0, left: 0,
      x: 0, width: 0, height: 0, opacity: 0,
    });

    initialVisible.forEach((item, index) => {
      const slot = slots[index];
      gsap.set(`.svc-item--${item.id}`, {
        x: slot.x, width: slot.size, height: slot.size, opacity: 1,
      });
    });

    // End = one viewport per queued service (2 total) → section releases after all 7 shown
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${queuedItems.length * 150}%`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 3,
      },
    });

    const currentScreen = initialVisible.map((item) => item.id);

    queuedItems.forEach((queuedItem, cycleIndex) => {
      const enteringId = queuedItem.id;
      const startTime  = cycleIndex;

      gsap.set(`.svc-item--${enteringId}`, { opacity: 1 });
      tl.to(
        `.svc-item--${enteringId}`,
        { x: slots[0].x, width: slots[0].size, height: slots[0].size, duration: 1, ease: "none" },
        startTime,
      );

      currentScreen.forEach((screenId, index) => {
        if (index < initialVisibleCount - 1) {
          const nextSlot = slots[index + 1];
          tl.to(
            `.svc-item--${screenId}`,
            { x: nextSlot.x, width: nextSlot.size, height: nextSlot.size, duration: 1, ease: "none" },
            startTime,
          );
        } else {
          const lastSlot = slots[initialVisibleCount - 1];
          tl.to(
            `.svc-item--${screenId}`,
            { x: lastSlot.x + lastSlot.size, duration: 1, ease: "none" },
            startTime,
          );
        }
      });

      currentScreen.unshift(enteringId);
      currentScreen.pop();
    });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [slots, lang]);

  return (
    <section
      id="servicios"
      ref={sectionRef}
      style={{ height: "100vh", overflow: "hidden", backgroundColor: GREEN, position: "relative" }}
    >
      {/* Top wave — white → green */}
      <svg aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "80px", zIndex: 20, pointerEvents: "none", display: "block" }}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,0 L0,0 Z" fill="#ffffff" />
      </svg>

      {/* Bottom wave — green → white */}
      <svg aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "80px", zIndex: 20, pointerEvents: "none", display: "block" }}
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
      </svg>

      {/* Heading block */}
      <div className="works-text-block">
        <h2 className="works-heading">
          {lang === "es" ? <>LO QUE<br />HACEMOS.</> : <>WHAT WE<br />DO.</>}
        </h2>
        <p className="works-tagline">
          {lang === "es"
            ? <>Diseño, ingeniería e IA aplicada<br />para productos que escalan.</>
            : <>Design, engineering and applied AI<br />for products that scale.</>}
        </p>
        <p className="works-sub">
          {lang === "es" ? "DISEÑO. CÓDIGO. ESTRATEGIA. IA." : "DESIGN. CODE. STRATEGY. AI."}
        </p>
      </div>

      {/* Cards */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {domItems.map((item) => (
          <div
            key={item.id}
            className={`svc-item svc-item--${item.id}`}
            style={{ overflow: "hidden", position: "absolute", bottom: 0, left: 0, borderRadius: "20px" }}
          >
            <img
              src={`${base}${item.img}`}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "bottom left", display: "block" }}
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
