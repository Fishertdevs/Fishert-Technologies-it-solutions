import { useState, useEffect, useRef } from "react";
import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const projects = [
  {
    title: "Alter Ego Store",
    img:   "proj-alterego.png",
    url:   "www.alterego-store.com.co",
    desc:  "Tienda de moda y lifestyle con catálogo digital y experiencia de compra única.",
  },
  {
    title: "Pica Pastos y Molinos Vilar",
    img:   "proj-picapastos.png",
    url:   "www.picapastosymolinosvilar.com.co",
    desc:  "Fabricación y venta de maquinaria agroindustrial de alta calidad.",
  },
  {
    title: "SGC Abogados",
    img:   "proj-sgc.png",
    url:   "www.sgcabogados.com.co",
    desc:  "Servicios jurídicos especializados, asesoría legal confiable en Colombia.",
  },
  {
    title: "Dr. Mario Sánchez",
    img:   "proj-mario.png",
    url:   "dr-mario-sanchez-website-api-server-one.vercel.app",
    desc:  "Terapeuta respiratorio y salubrista público comprometido con el bienestar.",
  },
  {
    title: "Mi Tienda Go",
    img:   "proj-mitienda.png",
    url:   "app.mitiendago.co",
    desc:  "Gestiona ventas, gastos y cajas diarias en un chat rápido, simple y claro.",
  },
];

/* Google favicon SVG */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Portafolio() {
  const [current, setCurrent]       = useState(0);
  const [typedUrl, setTypedUrl]     = useState("");
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { lang } = useLang();

  /* ── Typing animation ── */
  useEffect(() => {
    const url = projects[current].url;
    setTypedUrl("");
    setShowResults(false);

    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setTypedUrl(url.slice(0, i));
      if (i >= url.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setTimeout(() => setShowResults(true), 300);
      }
    }, 36);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current]);

  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);
  const next = () => setCurrent((c) => (c + 1) % projects.length);
  const project = projects[current];

  return (
    <section id="portafolio" className="port-section">

      {/* ── Left: title ── */}
      <div className="port-left">
        <h2 className="port-title">
          {lang === "es"
            ? <><span>NUESTROS</span><br /><span>CASOS DE ÉXITO.</span></>
            : <><span>OUR</span><br /><span>SUCCESS STORIES.</span></>}
        </h2>
      </div>

      {/* ── Right: Google search simulation ── */}
      <div className="port-right">
        <div className="port-google-wrap">

          {/* Google logo row */}
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

          {/* Results area */}
          <div className={`port-results ${showResults ? "port-results-in" : ""}`}>

            {/* Top result */}
            <div className="port-result-row">
              <div className="port-result-left">
                <div className="port-result-site">
                  <div className="port-result-favicon">
                    <GoogleIcon />
                  </div>
                  <div>
                    <p className="port-result-sitename">{project.title}</p>
                    <p className="port-result-url">https://{project.url}</p>
                  </div>
                </div>
                <h3 className="port-result-title">{project.title}</h3>
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

              <div className="port-result-thumb">
                <img
                  key={current}
                  src={`${base}${project.img}`}
                  alt={project.title}
                  className="port-thumb-img"
                />
              </div>
            </div>

            {/* Ghost result lines */}
            <div className="port-ghost-results">
              <div className="port-ghost-line" style={{ width: "60%" }} />
              <div className="port-ghost-line" style={{ width: "80%" }} />
              <div className="port-ghost-line" style={{ width: "50%" }} />
            </div>

          </div>
        </div>

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
                onClick={() => setCurrent(i)}
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
  );
}
