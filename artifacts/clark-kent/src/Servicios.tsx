import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

/* ─── Section colour ─────────────────────────────────────── */
const GREEN = "#3D5C18"; // army-olive — intentional, not generic

/* ─── Service definitions ────────────────────────────────── */
type Service = { id: number; color: string; textDark: boolean; title: string; keys: string };
const services: Record<string, Service[]> = {
  es: [
    { id: 1, color: "#F7C948", textDark: true,  title: "Desarrollo Web",       keys: "React · Next.js · APIs · SEO" },
    { id: 2, color: "#2B4EFF", textDark: false, title: "Desarrollo de Software",keys: "Arquitectura · Backend · Escalabilidad" },
    { id: 3, color: "#FF3E3E", textDark: false, title: "Automatización e IA",   keys: "ML · LLMs · Agentes · Pipelines" },
    { id: 4, color: "#A040FF", textDark: false, title: "Marketing Digital",     keys: "SEO · SEM · Analytics · Growth" },
    { id: 5, color: "#FF6B1A", textDark: false, title: "Diseño UX/UI",         keys: "Figma · Prototipos · Design Systems" },
    { id: 6, color: "#00C9A7", textDark: true,  title: "Cloud y DevOps",       keys: "AWS · Docker · Kubernetes · CI/CD" },
  ],
  en: [
    { id: 1, color: "#F7C948", textDark: true,  title: "Web Development",       keys: "React · Next.js · APIs · SEO" },
    { id: 2, color: "#2B4EFF", textDark: false, title: "Software Development",  keys: "Architecture · Backend · Scalability" },
    { id: 3, color: "#FF3E3E", textDark: false, title: "AI & Automation",       keys: "ML · LLMs · Agents · Pipelines" },
    { id: 4, color: "#A040FF", textDark: false, title: "Digital Marketing",     keys: "SEO · SEM · Analytics · Growth" },
    { id: 5, color: "#FF6B1A", textDark: false, title: "UX/UI Design",         keys: "Figma · Prototypes · Design Systems" },
    { id: 6, color: "#00C9A7", textDark: true,  title: "Cloud & DevOps",       keys: "AWS · Docker · Kubernetes · CI/CD" },
  ],
};

/* ─── Animated SVG illustrations ─────────────────────────── */
function IlluWeb() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* browser frame */}
      <rect x="20" y="28" width="160" height="120" rx="12" fill="none" stroke="#111" strokeWidth="7"/>
      <rect x="20" y="28" width="160" height="28" rx="12" fill="#111"/>
      <rect x="20" y="44" width="160" height="12" fill="#111"/>
      <circle cx="36" cy="42" r="5" fill="#FF5F57"/><circle cx="52" cy="42" r="5" fill="#FFBE2E"/><circle cx="68" cy="42" r="5" fill="#27C840"/>
      {/* code lines */}
      {[0,1,2].map(i => (
        <line key={i} x1="34" y1={78 + i * 22} x2="166" y2={78 + i * 22} stroke="#111" strokeWidth="6" strokeLinecap="round"
          strokeDasharray="132" strokeDashoffset="132">
          <animate attributeName="stroke-dashoffset" from="132" to={-20 + i * 30} dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite"/>
        </line>
      ))}
      {/* cursor */}
      <rect x="100" y="71" width="5" height="14" fill="#111">
        <animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite"/>
      </rect>
    </svg>
  );
}

function IlluSoftware() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* spinning gear */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 100 85" to="360 100 85" dur="5s" repeatCount="indefinite"/>
        <circle cx="100" cy="85" r="28" fill="none" stroke="#fff" strokeWidth="7"/>
        <circle cx="100" cy="85" r="12" fill="#fff"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const r = Math.PI * deg / 180;
          const x1 = 100 + 28 * Math.cos(r), y1 = 85 + 28 * Math.sin(r);
          const x2 = 100 + 42 * Math.cos(r), y2 = 85 + 42 * Math.sin(r);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="7" strokeLinecap="round"/>;
        })}
      </g>
      {/* </> label */}
      <text x="100" y="163" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="monospace">&lt;/&gt;</text>
    </svg>
  );
}

function IlluAI() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* brain outline */}
      <path d="M65,125 C42,115 35,90 45,72 C55,52 75,45 100,50 C125,45 145,52 155,72 C165,90 158,115 135,125 C130,135 70,135 65,125Z"
        fill="none" stroke="#fff" strokeWidth="6"/>
      {/* neural nodes */}
      {[[72,85],[100,68],[128,85],[86,105],[114,105]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill="#fff">
          <animate attributeName="r" values="6;10;6" dur="1.6s" begin={`${i*0.3}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" begin={`${i*0.3}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* connections */}
      {[[72,85,100,68],[100,68,128,85],[72,85,86,105],[128,85,114,105],[86,105,114,105]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.5" strokeOpacity="0.6"/>
      ))}
      {/* lightning bolt */}
      <path d="M108,22 L94,55 L108,55 L94,88" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
}

function IlluMarketing() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* baseline */}
      <line x1="25" y1="148" x2="175" y2="148" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      {/* bars */}
      {[
        { x: 35, h: 80, delay: "0s" },
        { x: 85, h: 110, delay: "0.25s" },
        { x: 135, h: 60, delay: "0.5s" },
      ].map(({ x, h, delay }, i) => (
        <rect key={i} x={x} y={148 - h} width="30" height={h} rx="5" fill="#fff">
          <animate attributeName="height" values={`0;${h};${h}`} dur="2s" begin={delay} repeatCount="indefinite"/>
          <animate attributeName="y" values={`148;${148 - h};${148 - h}`} dur="2s" begin={delay} repeatCount="indefinite"/>
        </rect>
      ))}
      {/* arrow up */}
      <polyline points="170,35 178,25 186,35" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="178" y1="25" x2="178" y2="60" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

function IlluUX() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* wireframe being drawn */}
      <rect x="35" y="42" width="130" height="90" rx="10" fill="none" stroke="#fff" strokeWidth="6"
        strokeDasharray="440" strokeDashoffset="440">
        <animate attributeName="stroke-dashoffset" values="440;0;0;440" dur="3s" repeatCount="indefinite"/>
      </rect>
      {/* inner elements */}
      <rect x="48" y="55" width="50" height="30" rx="4" fill="none" stroke="#fff" strokeWidth="3" strokeOpacity="0.7">
        <animate attributeName="opacity" values="0;0;1;1;0" dur="3s" repeatCount="indefinite"/>
      </rect>
      <line x1="48" y1="102" x2="152" y2="102" stroke="#fff" strokeWidth="3" strokeOpacity="0.7">
        <animate attributeName="opacity" values="0;0;1;1;0" dur="3s" repeatCount="indefinite"/>
      </line>
      <line x1="48" y1="116" x2="120" y2="116" stroke="#fff" strokeWidth="3" strokeOpacity="0.7">
        <animate attributeName="opacity" values="0;0;1;1;0" dur="3s" repeatCount="indefinite"/>
      </line>
      {/* cursor */}
      <polygon points="155,148 155,175 161,168 167,183 172,181 166,165 175,162" fill="#fff" stroke="#FF6B1A" strokeWidth="2">
        <animateTransform attributeName="transform" type="translate" values="0,0;-70,-56;0,-56;0,0" dur="3s" repeatCount="indefinite"/>
      </polygon>
    </svg>
  );
}

function IlluCloud() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* cloud */}
      <path d="M55,105 C38,105 28,90 36,77 C33,66 44,55 58,57 C66,46 82,40 98,49 C112,40 130,45 134,60 C150,60 160,74 154,90 C151,102 140,108 126,108 Z"
        fill="none" stroke="#111" strokeWidth="7"/>
      {/* revolving arrows */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 100 148" to="360 100 148" dur="3s" repeatCount="indefinite"/>
        <path d="M74,148 A26,26 0 1,1 126,148" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
        <polygon points="74,140 64,152 78,154" fill="#111"/>
      </g>
      {/* down-up arrow inside cloud */}
      <line x1="100" y1="72" x2="100" y2="96" stroke="#111" strokeWidth="5" strokeLinecap="round">
        <animate attributeName="y1" values="72;80;72" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="96;104;96" dur="1.5s" repeatCount="indefinite"/>
      </line>
      <polyline points="93,80 100,72 107,80" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,8;0,0" dur="1.5s" repeatCount="indefinite"/>
      </polyline>
    </svg>
  );
}

const illustrations: Record<number, () => JSX.Element> = {
  1: IlluWeb, 2: IlluSoftware, 3: IlluAI, 4: IlluMarketing, 5: IlluUX, 6: IlluCloud,
};

/* ─── Slot layout ─────────────────────────────────────────── */
type SlotConfig = { size: number; x: number };

export default function Servicios() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<SlotConfig[]>([]);
  const { lang } = useLang();

  const galleryData  = services[lang];
  const initialVisibleCount = 3;
  const initialVisible = galleryData.slice(0, initialVisibleCount);  // first 3
  const queuedItems   = galleryData.slice(initialVisibleCount);       // last 3 — rotate in one by one
  const domItems      = [...[...queuedItems].reverse(), ...initialVisible];

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const sizes = [vw * 0.20, vw * 0.28, vw * 0.37];
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

    gsap.set(".svc-item", { position: "absolute", bottom: 0, left: 0, x: 0, width: 0, height: 0, opacity: 0 });

    initialVisible.forEach((item, i) => {
      gsap.set(`.svc-item--${item.id}`, { x: slots[i].x, width: slots[i].size, height: slots[i].size, opacity: 1 });
    });

    // Each queued service gets 200% of viewport to rotate in — all 3 pass through before section ends
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${queuedItems.length * 200}%`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 3,
      },
    });

    const currentScreen = initialVisible.map(item => item.id);

    queuedItems.forEach((queuedItem, cycleIndex) => {
      const enteringId = queuedItem.id;
      const startTime  = cycleIndex;

      gsap.set(`.svc-item--${enteringId}`, { opacity: 1 });
      tl.to(`.svc-item--${enteringId}`,
        { x: slots[0].x, width: slots[0].size, height: slots[0].size, duration: 1, ease: "none" },
        startTime,
      );

      currentScreen.forEach((screenId, index) => {
        if (index < initialVisibleCount - 1) {
          const next = slots[index + 1];
          tl.to(`.svc-item--${screenId}`,
            { x: next.x, width: next.size, height: next.size, duration: 1, ease: "none" },
            startTime,
          );
        } else {
          const last = slots[initialVisibleCount - 1];
          tl.to(`.svc-item--${screenId}`, { x: last.x + last.size, duration: 1, ease: "none" }, startTime);
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
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: GREEN,
        position: "relative",
        borderRadius: "44px 44px 0 0",  // curved corners — no SVG waves
        marginTop: "-44px",
        zIndex: 2,
      }}
    >
      {/* Heading */}
      <div className="works-text-block">
        <h2 className="works-heading">
          {lang === "es" ? <>LO QUE<br />HACEMOS.</> : <>WHAT WE<br />DO.</>}
        </h2>
        <p className="works-tagline">
          {lang === "es"
            ? "Nuestros servicios se adaptan a cada etapa de tu negocio, desde la estrategia hasta la ejecución técnica."
            : "Our services adapt to every stage of your business, from strategy to technical execution."}
        </p>
      </div>

      {/* Cards */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {domItems.map(item => {
          const Illu = illustrations[item.id];
          const stroke = item.textDark ? "#111111" : "#ffffff";
          return (
            <div
              key={item.id}
              className={`svc-item svc-item--${item.id}`}
              style={{
                overflow: "hidden",
                position: "absolute",
                bottom: 0,
                left: 0,
                borderRadius: "20px",
                backgroundColor: item.color,
              }}
            >
              {/* Animated illustration fills the top portion */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "10% 8% 30% 8%" }}>
                <Illu />
              </div>

              {/* Service name + keywords — always visible at bottom */}
              <div className="svc-card-overlay" style={{ color: stroke }}>
                <span className="svc-card-title" style={{ color: stroke }}>{item.title}</span>
                <span className="svc-card-keys"  style={{ color: item.textDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)" }}>
                  {item.keys}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
