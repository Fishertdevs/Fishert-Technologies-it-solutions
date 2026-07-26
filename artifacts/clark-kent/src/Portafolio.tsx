import { useState } from "react";
import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const projects = [
  { title: "Alter Ego Store",             img: "proj-alterego.png",   url: "https://www.alterego-store.com.co/"                          },
  { title: "Pica Pastos y Molinos Vilar", img: "proj-picapastos.png", url: "https://www.picapastosymolinosvilar.com.co/"                  },
  { title: "SGC Abogados",                img: "proj-sgc.png",        url: "https://www.sgcabogados.com.co/"                             },
  { title: "Dr. Mario Sánchez",           img: "proj-mario.png",      url: "https://dr-mario-sanchez-website-api-server-one.vercel.app/" },
  { title: "Mi Tienda Go",                img: "proj-mitienda.png",   url: "https://app.mitiendago.co"                                   },
];

export default function Portafolio() {
  const [current, setCurrent] = useState(0);
  const { lang } = useLang();

  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);
  const next = () => setCurrent((c) => (c + 1) % projects.length);

  const project = projects[current];
  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <section id="portafolio" className="port-section">
      {/* ── Left column ── */}
      <div className="port-left">
        <h2 className="casos-heading">
          {lang === "es" ? "NUESTROS CASOS\nDE ÉXITO." : "OUR SUCCESS\nSTORIES."}
        </h2>

        <div className="port-meta">
          <p className="port-project-title">{project.title}</p>
          <a
            className="port-visit"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang === "es" ? "Ver proyecto →" : "View project →"}
          </a>
        </div>

        <div className="port-nav">
          <button className="port-arrow" onClick={prev} aria-label="anterior">
            ←
          </button>
          <span className="port-counter">
            {pad(current)} / {pad(projects.length - 1)}
          </span>
          <button className="port-arrow" onClick={next} aria-label="siguiente">
            →
          </button>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="port-right">
        <div className="port-card">
          <img
            key={current}
            src={`${base}${project.img}`}
            alt={project.title}
            className="port-img"
          />
        </div>
      </div>
    </section>
  );
}
