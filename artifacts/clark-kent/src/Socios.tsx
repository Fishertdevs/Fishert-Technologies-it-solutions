import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const logos = [
  { src: "logo-vilar.png",      alt: "Picapastos Vilar Molinos" },
  { src: "logo-alterego.png",   alt: "Alterego" },
  { src: "logo-mitiendago.png", alt: "Mi Tienda Go" },
  { src: "logo-respira.jpg",    alt: "Respira Terapia Respiratoria" },
  { src: "logo-sgc.png",        alt: "SGC Abogados" },
];

export default function Socios() {
  const { lang } = useLang();
  const heading = lang === "es" ? "Gracias por confiar en nosotros" : "Thank you for trusting us";

  return (
    <section className="socios-section">
      <div className="socios-divider">
        <span className="socios-divider-line" />
        <span className="socios-divider-label">{heading}</span>
        <span className="socios-divider-line" />
      </div>

      <div className="socios-logos">
        {logos.map((logo) => (
          <div className="socios-logo" key={logo.alt}>
            <img
              src={`${base}${logo.src}`}
              alt={logo.alt}
              className="socios-logo-img"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
