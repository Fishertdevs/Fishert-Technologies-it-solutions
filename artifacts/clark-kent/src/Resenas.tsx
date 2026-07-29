import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

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

const Stars = ({ count }: { count: number }) => (
  <div className="resena-stars">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="resena-star">★</span>
    ))}
  </div>
);

export default function Resenas() {
  const { lang } = useLang();
  const list = reviews[lang];

  return (
    <section id="resenas" className="resenas-section">
      {/* Gallery background image + overlay */}
      <div
        className="resenas-gallery-bg"
        style={{ backgroundImage: `url(${base}gallery-bg.jpg)` }}
        aria-hidden="true"
      />
      <div className="resenas-overlay" aria-hidden="true" />

      {/* Top wave from portafolio (white) */}
      <svg
        className="resenas-wave"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,30 C1200,72 960,2 720,30 C480,72 240,2 0,30 Z" fill="#ffffff" />
      </svg>

      <div className="resenas-inner">
        {/* Header */}
        <div className="resenas-header">
          <h2 className="resenas-heading">
            {lang === "es" ? "Lo que dicen nuestros clientes." : "What our clients say."}
          </h2>
          <p className="resenas-sub">
            {lang === "es" ? "— Exposición permanente de resultados." : "— A permanent exhibition of results."}
          </p>
        </div>

        {/* Gallery wall — review cards as framed artworks */}
        <div className="resenas-gallery-wall">
          {list.map((r, i) => (
            <div key={i} className="resena-frame">
              {/* Spotlight effect per frame */}
              <div className="resena-spotlight" aria-hidden="true" />

              {/* Artwork frame */}
              <div className="resena-artwork">
                {/* Frame border top label */}
                <div className="resena-frame-label">
                  <span className="resena-frame-number">0{i + 1}</span>
                  <span className="resena-frame-line" />
                </div>

                <Stars count={r.stars} />

                <blockquote className="resena-quote">
                  <span className="resena-quote-mark">"</span>
                  {r.quote}
                  <span className="resena-quote-mark resena-quote-mark--close">"</span>
                </blockquote>

                <div className="resena-author">
                  <span className="resena-name">{r.author}</span>
                  <span className="resena-company">{r.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
