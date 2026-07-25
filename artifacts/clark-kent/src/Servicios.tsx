import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const galleryData = [
  { id: 101, img: "W4.png", title: "Blue Tulip" },
  { id: 102, img: "W5.png", title: "Opera Mask" },
  { id: 103, img: "W6.png", title: "Blue Bloom" },
  { id: 104, img: "W7.png", title: "First Contact" },
  { id: 105, img: "W8.png", title: "White Yak" },
  { id: 106, img: "W9.png", title: "Heron Girl" },
];

type SlotConfig = { size: number; x: number };

export default function Servicios() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<SlotConfig[]>([]);
  const { lang } = useLang();

  const initialVisibleCount = 3;
  const initialVisible = galleryData.slice(0, initialVisibleCount);
  const queuedItems = galleryData.slice(initialVisibleCount);
  const domItems = [...[...queuedItems].reverse(), ...initialVisible];

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const sizes = [vw * 0.25, vw * 0.35, vw * 0.40];
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
      position: "absolute",
      bottom: 0,
      left: 0,
      x: 0,
      width: 0,
      height: 0,
      opacity: 0,
    });

    initialVisible.forEach((item, index) => {
      const slot = slots[index];
      gsap.set(`.svc-item--${item.id}`, {
        x: slot.x,
        width: slot.size,
        height: slot.size,
        opacity: 1,
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${queuedItems.length * 100}%`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 4,
      },
    });

    const currentScreen = initialVisible.map((item) => item.id);

    queuedItems.forEach((queuedItem, cycleIndex) => {
      const enteringId = queuedItem.id;
      const startTime = cycleIndex;

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
  }, [slots]);

  return (
    <section
      id="servicios"
      ref={sectionRef}
      style={{ width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#143020", position: "relative", borderRadius: "56px" }}
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
        {domItems.map((item) => (
          <div
            key={item.id}
            className={`svc-item svc-item--${item.id}`}
            style={{ overflow: "hidden", position: "absolute", bottom: 0, left: 0, borderRadius: "16px 16px 0 0" }}
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
