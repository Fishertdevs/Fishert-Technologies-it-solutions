import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const brands = [
  {
    fav: "fav-vilar.png",
    name: "Vilar Molinos",
    // Picapastos — bold condensed display, red/aggressive
    font: "Impact, 'Arial Narrow', Arial, sans-serif",
    weight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#C0001A",
  },
  {
    fav: "fav-alterego.png",
    name: "Alterego",
    // Elegant serif uppercase
    font: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
    weight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#111111",
  },
  {
    fav: "fav-mitiendago.png",
    name: "Mi Tienda Go",
    // Bold italic rounded sans — blue / orange accent brand
    font: "'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif",
    weight: 700,
    letterSpacing: "0.00em",
    textTransform: "none" as const,
    fontStyle: "italic" as const,
    color: "#0053A0",
  },
  {
    fav: "fav-respira.png",
    name: "Respira",
    // Wide-spaced navy uppercase — medical, clean
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    weight: 700,
    letterSpacing: "0.28em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#1a3a6b",
  },
  {
    fav: "fav-sgc.png",
    name: "SGC Abogados",
    // Gold serif uppercase — prestigious legal
    font: "Georgia, 'Times New Roman', serif",
    weight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#b5883a",
  },
];

export default function Socios() {
  const { lang } = useLang();

  return (
    <section className="socios-section">
      {/* ── Header ── */}
      <div className="socios-header">
        <h2 className="socios-title">
          {lang === "es" ? "Marcas que confían en nosotros" : "Brands that trust us"}
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
                fontStyle: b.fontStyle,
                color: b.color,
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
