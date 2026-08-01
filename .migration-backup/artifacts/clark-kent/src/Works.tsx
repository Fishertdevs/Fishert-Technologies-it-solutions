import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const projects = [
  { title: "Alter Ego Store",              img: "proj-alterego.png"   },
  { title: "Pica Pastos y Molinos Vilar",  img: "proj-picapastos.png" },
  { title: "SGC Abogados",                 img: "proj-sgc.png"        },
  { title: "Dr. Mario Sánchez",            img: "proj-mario.png"      },
  { title: "Mi Tienda Go",                 img: "proj-mitienda.png"   },
];

const worksData = [
  ...projects.map((p, i) => ({ id: i + 1, ...p })),
  ...projects.map((p, i) => ({ id: i + 6, ...p })),
];

type SlotConfig = {
  size: number;
  x: number;
};

export default function Works() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<SlotConfig[]>([]);
  const { lang } = useLang();

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

  useLayoutEffect(() => {
    if (slots.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".works-item", {
        position: "absolute", bottom: 0, left: 0,
        x: 0, width: 0, height: 0, opacity: 0,
      });

      initialVisible.forEach((item, index) => {
        const slot = slots[index];
        gsap.set(`.works-item--${item.id}`, {
          x: slot.x, width: slot.size, height: slot.size, opacity: 1,
        });
      });

      const worksTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${queuedItems.length * 100}%`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
      });

      const currentScreen = initialVisible.map((item) => item.id);

      queuedItems.forEach((queuedItem, cycleIndex) => {
        const enteringId = queuedItem.id;
        const startTime = cycleIndex;

        gsap.set(`.works-item--${enteringId}`, { opacity: 1 });
        worksTl.to(`.works-item--${enteringId}`, {
          x: slots[0].x, width: slots[0].size, height: slots[0].size,
          duration: 1, ease: "none",
        }, startTime);

        currentScreen.forEach((screenId, index) => {
          if (index < initialVisibleCount - 1) {
            const nextSlot = slots[index + 1];
            worksTl.to(`.works-item--${screenId}`, {
              x: nextSlot.x, width: nextSlot.size, height: nextSlot.size,
              duration: 1, ease: "none",
            }, startTime);
          } else {
            const lastSlot = slots[initialVisibleCount - 1];
            worksTl.to(`.works-item--${screenId}`, {
              x: lastSlot.x + lastSlot.size, duration: 1, ease: "none",
            }, startTime);
          }
        });

        currentScreen.unshift(enteringId);
        currentScreen.pop();
      });
    }, sectionRef);

    return () => ctx.revert();
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
      <div className="works-text-block">
        <h2 className="casos-heading">
          {lang === "es" ? "NUESTROS CASOS DE ÉXITO." : "OUR SUCCESS STORIES."}
        </h2>
        <p className="works-tagline">
          {lang === "es"
            ? <>Una selección curada de proyectos en<br />diseño, dirección e IA.</>
            : <>A curated selection of projects across<br />design, direction & AI.</>}
        </p>
        <p className="works-sub">
          {lang === "es" ? "DISEÑO. DIRECCIÓN. IA. CÓDIGO." : "DESIGN. DIRECTION. AI. CODE."}
        </p>
      </div>
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
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "bottom left",
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
