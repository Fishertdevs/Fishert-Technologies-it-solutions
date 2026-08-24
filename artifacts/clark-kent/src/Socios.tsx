import { useLang } from "./LanguageContext";

const base = import.meta.env.BASE_URL || "/";

const brands = [
  {
    fav: "fav-vilar.png",
    line1: "PICAPASTOS Y",
    line2: "MOLINOS VILAR",
    // Slab-serif bold — matches the Picapastos logo lettering exactly
    font: "'Rockwell', 'Rockwell Extra Bold', 'Memphis', Georgia, serif",
    weight: 900,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#C0001A",
    mobileLines: ["PICAPASTOS", "MOLINOS", "VILAR"],
  },
  {
    fav: "fav-alterego.png",
    line1: "Alterego",
    line2: "",
    // Elegant serif uppercase
    font: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
    weight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#111111",
    mobileLines: ["ALTEREGO"],
  },
  {
    fav: "fav-mitiendago.png",
    line1: "Mi Tienda Go",
    line2: "",
    // Bold italic rounded sans — blue brand
    font: "'Trebuchet MS', 'Helvetica Neue', Arial, sans-serif",
    weight: 700,
    letterSpacing: "0.00em",
    textTransform: "none" as const,
    fontStyle: "italic" as const,
    color: "#0053A0",
    mobileLines: ["MI TIENDA", "GO"],
  },
  {
    fav: "fav-respira.png",
    line1: "Dr. Mario Sanchez",
    line2: "Terapia Respiratoria",
    // Heavy high-contrast serif — Bodoni/Didot style matching their brand
    font: "'Didot', 'Bodoni MT', 'Playfair Display', Georgia, 'Times New Roman', serif",
    weight: 900,
    letterSpacing: "0.02em",
    textTransform: "none" as const,
    fontStyle: "normal" as const,
    color: "#1a3a6b",
    mobileLines: ["DR. MARIO", "SANCHEZ", "TERAPIA", "RESPIRATORIA"],
  },
  {
    fav: "fav-sgc.png",
    line1: "SGC Abogados",
    line2: "",
    // Gold serif uppercase — prestigious legal
    font: "Georgia, 'Times New Roman', serif",
    weight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontStyle: "normal" as const,
    color: "#b5883a",
    mobileLines: ["SGC", "ABOGADOS"],
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
      </div>

      {/* ── Divider ── */}
      <div className="socios-rule" />

      {/* ── Brand grid ── */}
      <div className="socios-grid">
        <div className="socios-track">
          {[...brands, ...brands].map((b, i) => (
            <div className="socios-cell" key={`${b.line1}-${i}`}>
              <img
                src={`${base}${b.fav}`}
                alt={b.line1}
                className="socios-fav"
              />
              <span
                className="socios-brand-name socios-brand-name-desktop"
                style={{
                  fontFamily: b.font,
                  fontWeight: b.weight,
                  letterSpacing: b.letterSpacing,
                  textTransform: b.textTransform,
                  fontStyle: b.fontStyle,
                  color: b.color,
                }}
              >
                {b.line1}
                {b.line2 && <><br />{b.line2}</>}
              </span>
              <span className="socios-brand-name socios-brand-name-mobile">
                {b.mobileLines.map((line) => <span key={line}>{line}</span>)}
              </span>
              {i < brands.length * 2 - 1 && <div className="socios-cell-divider" />}
            </div>
          ))}
        </div>
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
