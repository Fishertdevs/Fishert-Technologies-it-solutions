import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const worksData = [
  { id: 1, img: "w1.png" },
  { id: 2, img: "w2.png" },
  { id: 3, img: "w3.png" },
  { id: 4, img: "w4.png" },
  { id: 5, img: "w5.png" },
  { id: 6, img: "w6.png" },
  { id: 7, img: "w7.png" },
  { id: 8, img: "w8.png" },
  { id: 9, img: "w9.png" },
];

type SlotConfig = {
  size: number;
  x: number;
};

export default function Works() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<SlotConfig[]>([]);

  const initialVisibleCount = 5;
  const initialVisible = worksData.slice(0, initialVisibleCount);
  const queuedItems = worksData.slice(initialVisibleCount);
  const domItems = [...[...queuedItems].reverse(), ...initialVisible];

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;

      const sizes = [
        vw * 0.12,
        vw * 0.16,
        vw * 0.2,
        vw * 0.24,
        vw * 0.28,
      ];

      const computedSlots: SlotConfig[] = [];
      let currentX = 0;

      for (let i = 0; i < initialVisibleCount; i++) {
        computedSlots.push({
          size: sizes[i],
          x: currentX,
        });
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

    gsap.set(".works-item", {
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
      gsap.set(`.works-item--${item.id}`, {
        x: slot.x,
        width: slot.size,
        height: slot.size,
        opacity: 1,
      });
    });

    const worksTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${queuedItems.length * 100}%`,
        scrub: 1,
        pin: true,
      },
    });

    const currentScreen = initialVisible.map((item) => item.id);

    queuedItems.forEach((queuedItem, cycleIndex) => {
      const enteringId = queuedItem.id;
      const startTime = cycleIndex;

      gsap.set(`.works-item--${enteringId}`, { opacity: 1 });
      worksTl.to(
        `.works-item--${enteringId}`,
        {
          x: slots[0].x,
          width: slots[0].size,
          height: slots[0].size,
          duration: 1,
          ease: "none",
        },
        startTime,
      );

      currentScreen.forEach((screenId, index) => {
        if (index < initialVisibleCount - 1) {
          const nextSlot = slots[index + 1];

          worksTl.to(
            `.works-item--${screenId}`,
            {
              x: nextSlot.x,
              width: nextSlot.size,
              height: nextSlot.size,
              duration: 1,
              ease: "none",
            },
            startTime,
          );
        } else {
          const lastSlot = slots[initialVisibleCount - 1];
          worksTl.to(
            `.works-item--${screenId}`,
            {
              x: lastSlot.x + lastSlot.size,
              duration: 1,
              ease: "none",
            },
            startTime,
          );
        }
      });

      currentScreen.unshift(enteringId);
      currentScreen.pop();
    });

    return () => {
      worksTl.scrollTrigger?.kill();
      worksTl.kill();
    };
  }, [slots]);

  return (
    <section
      className="works-section"
      ref={sectionRef}
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <div
        className="works-track"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {domItems.map((item) => (
          <div
            key={item.id}
            className={`works-item works-item--${item.id}`}
            style={{
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          >
            <img
              src={`${base}${item.img}`}
              alt={`Work ${item.id}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "bottom left",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
