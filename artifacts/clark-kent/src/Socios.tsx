import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const brands = [
  {
    fav: "fav-vilar.png",
    name: "Vilar Molinos",
    font: "'Helvetica Neue', Arial, sans-serif",
    weight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  {
    fav: "fav-alterego.png",
    name: "Alterego",
    font: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
    weight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
  },
  {
    fav: "fav-mitiendago.png",
    name: "Mi Tienda Go",
    font: "'Helvetica Neue', Arial, sans-serif",
    weight: 700,
    letterSpacing: "0.01em",
    textTransform: "none" as const,
  },
  {
    fav: "fav-respira.png",
    name: "Respira",
    font: "'Helvetica Neue', Arial, sans-serif",
    weight: 300,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
  },
  {
    fav: "fav-sgc.png",
    name: "SGC Abogados",
    font: "Georgia, 'Times New Roman', serif",
    weight: 700,
    letterSpacing: "0.04em",
    textTransform: "none" as const,
  },
];

export default function Socios() {
  const { lang } = useLang();

  return (
    <section className="socios-section">
      {/* ── Header ── */}
      <div className="socios-header">
        <span className="socios-eyebrow">
          {lang === "es" ? "MARCAS QUE CONFÍAN EN NOSOTROS" : "BRANDS THAT TRUST US"}
        </span>
        <h2 className="socios-title">
          {lang === "es"
            ? <>Gracias por <em className="socios-accent">confiar</em> en nosotros</>
            : <>Thank you for <em className="socios-accent">trusting</em> us</>}
        </h2>
        <p className="socios-subtitle">
          {lang === "es"
            ? <>Hemos tenido el privilegio de colaborar con empresas increíbles<br />que comparten nuestra visión y confían en nuestro trabajo.</>
            : <>We've had the privilege of working with amazing companies<br />that share our vision and trust in our work.</>}
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="socios-rule" />

      {/* ── Brand grid ── */}
      <div className="socios-grid">
        {brands.map((b, i) => (
          <div className="socios-cell" key={b.name}>
            <img
              src={`${base}${b.fav}`}
              alt={b.name}
              className="socios-fav"
            />
            <span
              className="socios-brand-name"
              style={{
                fontFamily: b.font,
                fontWeight: b.weight,
                letterSpacing: b.letterSpacing,
                textTransform: b.textTransform,
              }}
            >
              {b.name}
            </span>
            {i < brands.length - 1 && <div className="socios-cell-divider" />}
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="socios-rule" />

      {/* ── Footer quote ── */}
      <p className="socios-footnote">
        {lang === "es"
          ? "Cada proyecto es una historia de confianza, compromiso y resultados."
          : "Every project is a story of trust, commitment and results."}
      </p>
    </section>
  );
}
