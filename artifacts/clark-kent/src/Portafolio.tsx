import { useState, useEffect, useRef, type PointerEvent } from "react";
import { Link } from "wouter";
import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const projects = [
  {
    title: "Alterego Store",
    img:   "proj-alterego.png",
    url:   "www.alterego-store.com.co",
    desc:  "Tienda de moda y lifestyle con catálogo digital y experiencia de compra única.",
    color: "#111111",
    slug:  "alterego-store",
  },
  {
    title: "Picapastos y Molinos Vilar",
    img:   "proj-picapastos.png",
    url:   "www.picapastosymolinosvilar.com.co",
    desc:  "Fabricación y venta de maquinaria agroindustrial de alta calidad.",
    color: "#C0001A",
    slug:  "picapastos-vilar",
  },
  {
    title: "SGC Abogados",
    img:   "proj-sgc.png",
    url:   "www.sgcabogados.com.co",
    desc:  "Servicios jurídicos especializados, asesoría legal confiable en Colombia.",
    color: "#C9A227",
    slug:  "sgc-abogados",
  },
  {
    title: "Dr. Mario Sánchez",
    img:   "proj-mario.png",
    url:   "dr-mario-sanchez-website-api-server-one.vercel.app",
    desc:  "Terapeuta respiratorio y salubrista público comprometido con el bienestar.",
    color: "#0077B6",
    slug:  "dr-mario-sanchez",
  },
  {
    title: "Mi Tienda Go",
    img:   "proj-mitienda.png",
    url:   "app.mitiendago.co",
    desc:  "Gestiona ventas, gastos y cajas diarias en un chat rápido, simple y claro.",
    color: "#00A651",
    slug:  "mi-tienda-go",
  },
];

// phase: typing → results → cursor → image
type Phase = "typing" | "results" | "cursor" | "image";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CursorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2L4 14.5L7.2 11.3L9.4 16.8L11.6 15.9L9.3 10.4L14 10.4L4 2Z"
      fill="#1a1a1a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

export default function Portafolio() {
  const [current, setCurrent] = useState(0);
  const [typedUrl, setTypedUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [clicking, setClicking] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t4 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { lang } = useLang();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const clearAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    [t1, t2, t3, t4].forEach(r => { if (r.current) clearTimeout(r.current); });
  };

  useEffect(() => {
    clearAll();
    const url = projects[current].url;
    setTypedUrl("");
    setPhase("typing");
    setClicking(false);

    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setTypedUrl(url.slice(0, i));
      if (i >= url.length) {
        clearInterval(timerRef.current!);
        // phase: results
        t1.current = setTimeout(() => {
          setPhase("results");
          // phase: cursor
          t2.current = setTimeout(() => {
            setPhase("cursor");
            // click pulse
            t3.current = setTimeout(() => {
              setClicking(true);
              // phase: full image
              t4.current = setTimeout(() => {
                setPhase("image");
              }, 280);
            }, 650);
          }, 500);
        }, 300);
      }
    }, 36);

    return clearAll;
  }, [current]);

  const goTo = (i: number) => setCurrent(i);
  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);
  const next = () => setCurrent((c) => (c + 1) % projects.length);
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    touchStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null || Math.abs(start - event.clientX) < 45) return;
    start > event.clientX ? next() : prev();
  };
  const project = projects[current];

  const showResults = phase === "results" || phase === "cursor" || phase === "image";
  const showCursor  = phase === "cursor" || phase === "image";
  const showImage   = phase === "image";

  return (
    <>
    {/* Blob clip-path definition — scales with the container via objectBoundingBox */}
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <clipPath id="port-blob-clip" clipPathUnits="objectBoundingBox">
          <path d="
            M 0.5 0.04
            C 0.61 0.01 0.79 0.06 0.88 0.19
            C 0.97 0.31 0.96 0.47 0.9 0.57
            C 0.85 0.65 0.72 0.66 0.77 0.78
            C 0.82 0.9 0.72 0.99 0.59 0.97
            C 0.5 0.95 0.5 0.99 0.41 0.97
            C 0.28 0.99 0.18 0.9 0.23 0.78
            C 0.28 0.66 0.15 0.65 0.1 0.57
            C 0.04 0.47 0.03 0.31 0.12 0.19
            C 0.21 0.06 0.39 0.01 0.5 0.04 Z
          " />
        </clipPath>
      </defs>
    </svg>

    <div className="port-outer">

      {/* Right-anchored decorative portrait — pinned to viewport edge */}
      <img
        src={`${base}casos-exito-retrato.png`}
        alt=""
        aria-hidden="true"
        className="port-anchor-img"
      />

    <section
      id="portafolio"
      ref={sectionRef}
      className={`port-section${isVisible ? " port-section--visible" : ""}`}
    >

      {/* ── Left: title ── */}
      <div className="port-left">
        <h2 className="port-title">
          {lang === "es"
            ? "NUESTROS CASOS DE ÉXITO."
            : "OUR SUCCESS STORIES."}
        </h2>
      </div>

      {/* ── Right: Google search simulation ── */}
      <div className="port-right">
        <div className="port-blob-outer">
        <div
          className="port-google-wrap"
          style={{ borderColor: hovered ? project.color : '#111111' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { touchStartX.current = null; }}
        >

          {/* Search UI (fades out when image shows) */}
          <div className={`port-google-content ${showImage ? "port-google-content--hidden" : ""}`}>

            {/* Google logo */}
            <div className="port-google-top">
              <GoogleIcon />
              <span className="port-google-wordmark">
                <span style={{ color: "#4285F4" }}>G</span>
                <span style={{ color: "#EA4335" }}>o</span>
                <span style={{ color: "#FBBC05" }}>o</span>
                <span style={{ color: "#4285F4" }}>g</span>
                <span style={{ color: "#34A853" }}>l</span>
                <span style={{ color: "#EA4335" }}>e</span>
              </span>
            </div>

            {/* Search bar */}
            <div className="port-google-bar">
              <svg className="port-bar-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#9aa0a6" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="port-bar-text">{typedUrl}</span>
              <span className="port-bar-cursor" aria-hidden="true" />
            </div>

            {/* Results */}
            <div className={`port-results ${showResults ? "port-results-in" : ""}`}>
              <div className="port-result-row">
                <div className="port-result-left">
                  <div className="port-result-site">
                    <div className="port-result-favicon"><GoogleIcon /></div>
                    <div>
                      <p className="port-result-sitename">{project.title}</p>
                      <p className="port-result-url">https://{project.url}</p>
                    </div>
                  </div>

                  {/* Title + cursor */}
                  <div className="port-title-wrap">
                    <h3 className="port-result-title">{project.title}</h3>
                    {showCursor && (
                      <span className={`port-click-cursor ${clicking ? "port-click-cursor--click" : ""}`}>
                        <CursorIcon />
                      </span>
                    )}
                  </div>

                  <p className="port-result-desc">{project.desc}</p>
                  <a
                    className="port-visit"
                    href={`https://${project.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === "es" ? "Ver proyecto →" : "View project →"}
                  </a>
                </div>

                {/* Small thumb stub (visible during results/cursor, hidden during image) */}
                <div className="port-result-thumb-stub" />
              </div>

              {/* Ghost lines */}
              <div className="port-ghost-results">
                <div className="port-ghost-line" style={{ width: "60%" }} />
                <div className="port-ghost-line" style={{ width: "80%" }} />
                <div className="port-ghost-line" style={{ width: "50%" }} />
              </div>
            </div>
          </div>

          {/* Full-size image overlay (fills wrap on click) */}
          <div className={`port-full-overlay ${showImage ? "port-full-overlay--visible" : ""}`}>
            <img
              key={current}
              src={`${base}${project.img}`}
              alt={project.title}
              className="port-full-img"
            />
            <a
              className="port-overlay-link"
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === "es" ? "Ver proyecto →" : "View project →"}
            </a>
          </div>

        </div>
        </div>{/* port-blob-outer */}

        {/* Navigation */}
        <div className="port-nav">
          <button className="port-arrow" onClick={prev} aria-label="anterior">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="port-pips">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`proyecto ${i + 1}`}
                className={`port-pip ${i === current ? "port-pip-active" : ""}`}
              />
            ))}
          </div>
          <button className="port-arrow" onClick={next} aria-label="siguiente">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </section>

      {/* Full-width wave — outside the constrained port-section */}
      <svg
        className="port-wave port-wave--bottom"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L1440,0 L1440,40 C1200,0 960,80 720,40 C480,0 240,80 0,40 Z"
          fill="var(--port-surface)"
        />
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="var(--port-next-section)"
        />
      </svg>
    </div>
    </>
  );
}
