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
      <div className="resenas-inner">

        <div className="resenas-header">
          <h2 className="resenas-heading">
            {lang === "es" ? "LO QUE DICEN\nNUESTROS CLIENTES." : "WHAT OUR\nCLIENTS SAY."}
          </h2>
          <p className="resenas-sub">
            {lang === "es"
              ? "Resultados reales. Clientes satisfechos."
              : "Real results. Satisfied clients."}
          </p>
        </div>

        <div className="resenas-grid">
          {list.map((r, i) => (
            <div key={i} className="resena-card">
              <Stars count={r.stars} />
              <blockquote className="resena-quote">"{r.quote}"</blockquote>
              <div className="resena-author">
                <span className="resena-name">{r.author}</span>
                <span className="resena-company">{r.company}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
