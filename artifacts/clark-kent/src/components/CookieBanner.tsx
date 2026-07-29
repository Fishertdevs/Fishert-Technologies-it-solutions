import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

export default function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fs_cookie_consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("fs_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("fs_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <span className="cookie-banner-icon">🍪</span>
          <p>
            {lang === "es"
              ? "Utilizamos cookies esenciales para mejorar tu experiencia. Al hacer clic en «Aceptar», aceptas el uso de cookies según nuestra "
              : "We use essential cookies to improve your experience. By clicking «Accept», you accept the use of cookies according to our "}
            <a href="/cookies" className="cookie-banner-link">
              {lang === "es" ? "Política de Cookies" : "Cookie Policy"}
            </a>.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-decline" onClick={decline}>
            {lang === "es" ? "Rechazar" : "Decline"}
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>
            {lang === "es" ? "Aceptar" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
