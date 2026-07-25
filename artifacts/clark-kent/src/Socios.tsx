import { useLang } from "./LanguageContext";

// ── Inline logo SVGs ──────────────────────────────────────────────────────────

const LogoStanford = () => (
  <svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Stanford">
    <text x="0" y="28" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" fill="currentColor" letterSpacing="-0.5">S</text>
    <text x="28" y="27" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="400" fill="currentColor" letterSpacing="0">tanford</text>
  </svg>
);

const LogoMeta = () => (
  <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Meta">
    {/* Infinity / Meta wordmark approximation */}
    <path
      d="M6 18C6 14.686 8.24 12 11 12C13.314 12 15.126 13.686 17 16C18.874 13.686 20.686 12 23 12C25.76 12 28 14.686 28 18C28 21.314 25.76 24 23 24C20.686 24 18.874 22.314 17 20C15.126 22.314 13.314 24 11 24C8.24 24 6 21.314 6 18Z"
      fill="currentColor"
    />
    <text x="36" y="26" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="20" fontWeight="500" fill="currentColor">Meta</text>
  </svg>
);

const LogoBooking = () => (
  <svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Booking.com">
    <text x="0" y="26" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="20" fontWeight="700" fill="currentColor">Booking</text>
    <text x="97" y="26" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="20" fontWeight="400" fill="currentColor">.com</text>
  </svg>
);

const LogoNike = () => (
  <svg width="80" height="36" viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nike">
    {/* Nike swoosh */}
    <path
      d="M2 26C2 26 12 6 38 14C56 20 72 10 72 10C72 10 54 32 30 26C14 22 2 26 2 26Z"
      fill="currentColor"
    />
  </svg>
);

const LogoHootsuite = () => (
  <svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Hootsuite">
    {/* Owl eyes approximation */}
    <rect x="0" y="8" width="14" height="20" rx="7" fill="currentColor"/>
    <rect x="2.5" y="11" width="9" height="9" rx="4.5" fill="white"/>
    <rect x="16" y="8" width="14" height="20" rx="7" fill="currentColor"/>
    <rect x="18.5" y="11" width="9" height="9" rx="4.5" fill="white"/>
    <text x="36" y="26" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="20" fontWeight="500" fill="currentColor">Hootsuite</text>
  </svg>
);

export default function Socios() {
  const { lang } = useLang();

  const heading = lang === "es" ? "Con la Confianza de Nuestros Socios" : "Trusted by Our Partners";

  return (
    <section className="socios-section">
      {/* Divider with label */}
      <div className="socios-divider">
        <span className="socios-divider-line" />
        <span className="socios-divider-label">{heading}</span>
        <span className="socios-divider-line" />
      </div>

      {/* Logo row */}
      <div className="socios-logos">
        <div className="socios-logo"><LogoStanford /></div>
        <div className="socios-logo"><LogoMeta /></div>
        <div className="socios-logo"><LogoBooking /></div>
        <div className="socios-logo"><LogoNike /></div>
        <div className="socios-logo"><LogoHootsuite /></div>
      </div>
    </section>
  );
}
