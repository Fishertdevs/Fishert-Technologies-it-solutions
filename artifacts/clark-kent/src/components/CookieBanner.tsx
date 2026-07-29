import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

/** Two hands reaching toward a cookie — inspired by the Creation of Adam */
function CookieIcon() {
  return (
    <svg
      width="64" height="22" viewBox="0 0 110 38" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Cookie */}
      <circle cx="55" cy="19" r="12" fill="#C8834A" />
      <circle cx="51"   cy="15"   r="2"   fill="#5C3010" />
      <circle cx="57"   cy="19"   r="1.7" fill="#5C3010" />
      <circle cx="52"   cy="23.5" r="1.5" fill="#5C3010" />
      <circle cx="59.5" cy="14"   r="1.4" fill="#5C3010" />

      {/* Left hand — index finger pointing right toward cookie */}
      <path
        d="M0 25 L10 25 Q14 25 14 22 L14 18
           Q14 15 17 15 L35 15
           Q38 15 38 18.5 Q38 22 35 22 L17 22
           Q14 22 14 25 Q14 30 10 32 L0 32 Z"
        fill="#C9956A"
      />

      {/* Right hand — index finger pointing left toward cookie */}
      <path
        d="M110 25 L100 25 Q96 25 96 22 L96 18
           Q96 15 93 15 L75 15
           Q72 15 72 18.5 Q72 22 75 22 L93 22
           Q96 22 96 25 Q96 30 100 32 L110 32 Z"
        fill="#C9956A"
      />
    </svg>
  );
}

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

  const accept = () => { localStorage.setItem("fs_cookie_consent", "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem("fs_cookie_consent", "declined"); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent" data-theme="light">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <CookieIcon />
          <p>
            {lang === "es"
              ? "Utilizamos cookies esenciales para mejorar tu experiencia. Al hacer clic en «Aceptar», aceptas el uso de cookies según nuestra "
              : "We use essential cookies to improve your experience. By clicking «Accept», you agree to our "}
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
