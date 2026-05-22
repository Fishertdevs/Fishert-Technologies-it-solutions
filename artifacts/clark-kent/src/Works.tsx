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

type Dimensions = { itemSize: number; heights: number[] };

export default function Works() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState<Dimensions>({
    itemSize: 0,
    heights: [],
  });

  const initialVisibleCount = 5;
  const initialVisible = worksData.slice(0, initialVisibleCount);
  const queuedItems = worksData.slice(initialVisibleCount);
  const domItems = [...[...queuedItems].reverse(), ...initialVisible];

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const itemSize = vw / 5;

      const maxHeightV = vh * 0.9;
      const minHeightV = vh * 0.35;
      const heightStep = (maxHeightV - minHeightV) / (initialVisibleCount - 1);

      const newHeights = initialVisible.map((_, index) => {
        return maxHeightV - index * heightStep;
      });

      setDimensions({ itemSize, heights: newHeights });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (dimensions.itemSize === 0) return;

    const itemSize = dimensions.itemSize;
    const heights = dimensions.heights;

    initialVisible.forEach((item, index) => {
      const reversedIndex = initialVisibleCount - 1 - index;
      gsap.set(`.works-item--${item.id}`, {
        x: reversedIndex * itemSize,
        width: itemSize,
        height: heights[reversedIndex],
        opacity: 1,
      });
    });

    queuedItems.forEach((item) => {
      gsap.set(`.works-item--${item.id}`, {
        position: "absolute",
        bottom: 0,
        left: 0,
        x: 0,
        width: 0,
        height: 0,
        opacity: 0,
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
          x: 0,
          width: itemSize,
          height: heights[0],
          duration: 1,
          ease: "none",
        },
        startTime,
      );

      currentScreen.forEach((screenId, index) => {
        if (index < initialVisibleCount - 1) {
          const newSlotIndex = index + 1;

          worksTl.to(
            `.works-item--${screenId}`,
            {
              x: newSlotIndex * itemSize,
              height: heights[newSlotIndex],
              duration: 1,
              ease: "none",
            },
            startTime,
          );
        } else {
          worksTl.to(
            `.works-item--${screenId}`,
            {
              x: initialVisibleCount * itemSize,
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
  }, [dimensions.itemSize]);

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
        ref={trackRef}
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
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "100%",
              }}
            >
              <img
                src={`${base}${item.img}`}
                alt={`Work ${item.id}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "bottom left",
                  display: "block",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
