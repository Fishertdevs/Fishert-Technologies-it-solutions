import { useState } from "react";
import { useLang } from "./LanguageContext";
import ReviewForm from "./ReviewForm";
import resenasBust from "@assets/resenas_bust.png";

const reviews = {
  es: [
    {
      quote: "Fishert Studio transformó por completo nuestra presencia digital. El resultado superó todas nuestras expectativas y el equipo fue excepcional en cada etapa.",
      author: "Carlos M.",
      company: "Alterego Store",
      stars: 5,
    },
    {
      quote: "Profesionales, creativos y extremadamente puntuales. Lograron capturar la esencia de nuestra firma jurídica en un sitio web que genera confianza desde el primer clic.",
      author: "Dra. Alejandra S.",
      company: "SGC Abogados",
      stars: 5,
    },
    {
      quote: "La mejor inversión que hemos hecho para nuestro negocio. El equipo de Fishert entiende perfectamente cómo traducir una idea en una solución digital que funciona.",
      author: "Juan P.",
      company: "Picapastos y Molinos Vilar",
      stars: 5,
    },
  ],
  en: [
    {
      quote: "Fishert Studio completely transformed our digital presence. The result exceeded all our expectations and the team was exceptional at every stage.",
      author: "Carlos M.",
      company: "Alterego Store",
      stars: 5,
    },
    {
      quote: "Professional, creative and extremely punctual. They captured the essence of our law firm in a website that builds trust from the very first click.",
      author: "Dr. Alejandra S.",
      company: "SGC Abogados",
      stars: 5,
    },
    {
      quote: "The best investment we have made for our business. The Fishert team perfectly understands how to translate an idea into a digital solution that works.",
      author: "Juan P.",
      company: "Picapastos y Molinos Vilar",
      stars: 5,
    },
  ],
};

/* Blue Twitter-style verified badge */
function BlueBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      aria-label="Verificado" style={{ flexShrink: 0 }}>
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z"
        fill="#1D9BF0"
        stroke="none"
      />
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const Stars = ({ count, lang }: { count: number; lang: "es" | "en" }) => (
  <div className="resena-stars">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="resena-star">★</span>
    ))}
    <span className="resena-verified">
      {lang === "es" ? "Usuario verificado" : "Verified user"}
      <BlueBadge />
    </span>
  </div>
);

const VISIBLE = 2;

export default function Resenas() {
  const { lang } = useLang();
  const list = reviews[lang];
  const [showForm, setShowForm] = useState(false);
  const [start, setStart] = useState(0);

  const pages = Math.max(1, list.length - VISIBLE + 1);
  const clamp = (n: number) => Math.max(0, Math.min(n, pages - 1));
  const goPrev = () => setStart((s) => clamp(s - 1));
  const goNext = () => setStart((s) => clamp(s + 1));
  const visible = list.slice(start, start + VISIBLE);

  return (
    <section id="resenas" className="resenas-section">
      {/* Top wave — white from portafolio section above */}
      <svg
        style={{ display: "block", width: "100%", height: 80, marginBottom: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,30 C1200,72 960,2 720,30 C480,72 240,2 0,30 Z" fill="#ffffff" />
      </svg>

      <div className="resenas-inner" style={{ paddingTop: 60 }}>
        <div className="resenas-layout">
          <div className="resenas-content">
            <div className="resenas-header">
              <h2 className="resenas-heading">
                {lang === "es" ? "Lo que dicen nuestros clientes." : "What our clients say."}
              </h2>
              <p className="resenas-sub">
                {lang === "es"
                  ? "Clientes satisfechos que hablan de nuestro trabajo."
                  : "Satisfied clients who speak about our work."}
              </p>
            </div>

            <div className="resenas-grid">
              {visible.map((r, i) => (
                <div key={start + i} className="resena-card">
                  <Stars count={r.stars} lang={lang} />
                  <blockquote className="resena-quote">"{r.quote}"</blockquote>
                  <div className="resena-author">
                    <span className="resena-name">{r.author}</span>
                    <span className="resena-company">{r.company}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="resenas-controls">
              <button className="resenas-cta-btn" onClick={() => setShowForm(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {lang === "es" ? "Agregar reseña" : "Add a review"}
              </button>

              <div className="resenas-nav">
                <button
                  className="resenas-arrow"
                  onClick={goPrev}
                  disabled={start === 0}
                  aria-label={lang === "es" ? "Anterior" : "Previous"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="resenas-dots">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      className={`resenas-dot${i === start ? " resenas-dot--active" : ""}`}
                      onClick={() => setStart(clamp(i))}
                      aria-label={`${lang === "es" ? "Ir a" : "Go to"} ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="resenas-arrow"
                  onClick={goNext}
                  disabled={start >= pages - 1}
                  aria-label={lang === "es" ? "Siguiente" : "Next"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="resenas-bust" aria-hidden="true">
            <img src={resenasBust} alt="" className="resenas-bust-img" />
          </div>
        </div>
      </div>

      {/* Bottom wave — single boundary into Preguntas Frecuentes (orange).
          Same signature wave used across the FAQ section. */}
      <svg
        style={{ display: "block", width: "100%", height: 80, marginTop: 40 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#E8621E" />
      </svg>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
