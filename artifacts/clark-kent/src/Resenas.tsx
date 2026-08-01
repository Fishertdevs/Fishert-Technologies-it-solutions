import { useLang } from "./LanguageContext";

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

const Stars = ({ count, lang }: { count: number; lang: "es" | "en" }) => (
  <div className="resena-stars">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="resena-star">★</span>
    ))}
    <span className="resena-verified">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3 }}>
        <path d="M12 2l2.4 4.8 5.3.8-3.85 3.75.91 5.3L12 14.27l-4.76 2.38.91-5.3L4.3 7.6l5.3-.8z"
          fill="#C0001A" stroke="#C0001A" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {lang === "es" ? "Usuario verificado" : "Verified user"}
    </span>
  </div>
);

export default function Resenas() {
  const { lang } = useLang();
  const list = reviews[lang];

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
          {list.map((r, i) => (
            <div key={i} className="resena-card">
              <Stars count={r.stars} lang={lang} />
              <blockquote className="resena-quote">"{r.quote}"</blockquote>
              <div className="resena-author">
                <span className="resena-name">{r.author}</span>
                <span className="resena-company">{r.company}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="resenas-cta-row">
          <a
            href="https://www.google.com/search?q=Fishert+Studio+Bogot%C3%A1+rese%C3%B1as"
            target="_blank"
            rel="noopener noreferrer"
            className="resenas-cta-btn"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {lang === "es" ? "Agregar reseña" : "Add a review"}
          </a>
        </div>
      </div>
    </section>
  );
}
