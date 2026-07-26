import { useState, useEffect, useRef } from "react";
import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const projects = [
  { title: "Alter Ego Store",             img: "proj-alterego.png",   url: "alterego-store.com.co"                                       },
  { title: "Pica Pastos y Molinos Vilar", img: "proj-picapastos.png", url: "picapastosymolinosvilar.com.co"                               },
  { title: "SGC Abogados",                img: "proj-sgc.png",        url: "sgcabogados.com.co"                                           },
  { title: "Dr. Mario Sánchez",           img: "proj-mario.png",      url: "dr-mario-sanchez-website-api-server-one.vercel.app"           },
  { title: "Mi Tienda Go",                img: "proj-mitienda.png",   url: "app.mitiendago.co"                                            },
];

export default function Portafolio() {
  const [current, setCurrent]     = useState(0);
  const [typedUrl, setTypedUrl]   = useState(projects[0].url);
  const [showImg, setShowImg]     = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { lang } = useLang();

  /* ── Typing animation on project change ── */
  useEffect(() => {
    const url = projects[current].url;
    setShowImg(false);
    setTypedUrl("");

    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setTypedUrl(url.slice(0, i));
      if (i >= url.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setTimeout(() => setShowImg(true), 160);
      }
    }, 32);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current]);

  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);
  const next = () => setCurrent((c) => (c + 1) % projects.length);
  const project = projects[current];

  return (
    <section id="portafolio" className="port-section">

      {/* ── Left: title only ── */}
      <div className="port-left">
        <h2 className="port-title">
          {lang === "es" ? <>NUESTROS CASOS<br />DE ÉXITO.</> : <>OUR SUCCESS<br />STORIES.</>}
        </h2>
      </div>

      {/* ── Right: browser + info + nav ── */}
      <div className="port-right">

        {/* Browser mockup */}
        <div className="port-browser">
          <div className="port-bar">
            <div className="port-dots">
              <span className="port-dot-btn port-dot-red"   />
              <span className="port-dot-btn port-dot-yellow"/>
              <span className="port-dot-btn port-dot-green" />
            </div>
            <div className="port-url-box">
              <span className="port-url-lock">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                  <rect x="1" y="5" width="8" height="7" rx="1.5" fill="#888"/>
                  <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="#888" strokeWidth="1.2" fill="none"/>
                </svg>
              </span>
              <span className="port-url-scheme">https://</span>
              <span className="port-url-typed">{typedUrl}</span>
              <span className="port-url-cursor" aria-hidden="true" />
            </div>
          </div>

          <div className="port-viewport">
            <img
              key={current}
              src={`${base}${project.img}`}
              alt={project.title}
              className={`port-img ${showImg ? "port-img-in" : "port-img-out"}`}
            />
          </div>
        </div>

        {/* Info + nav below screenshot */}
        <div className="port-info">
          <div className="port-info-text">
            <p className="port-project-name">{project.title}</p>
            <a
              className="port-visit"
              href={`https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === "es" ? "Ver proyecto →" : "View project →"}
            </a>
          </div>

          <div className="port-nav">
            <button className="port-arrow" onClick={prev} aria-label="anterior">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
