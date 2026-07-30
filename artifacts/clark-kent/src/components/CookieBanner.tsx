import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";

function CookieIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3.003-2.937.005-.034.016-.136.017-.17a.998.998 0 0 0-1.254-1.006A2.963 2.963 0 0 1 15 7c-1.654 0-3-1.346-3-3 0-.217.031-.434.081-.648a1 1 0 0 0-1.176-1.176C5.585 3.07 2 7.15 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.259-.014-.516-.032-.773a1.004 1.004 0 0 0-.37-.163z"
        fill="#C8834A" />
      <circle cx="8.5"  cy="11.5" r="1.5" fill="#5C3010" />
      <circle cx="12"   cy="15"   r="1"   fill="#5C3010" />
      <circle cx="15"   cy="11"   r="1"   fill="#5C3010" />
      <circle cx="10"   cy="8"    r="1"   fill="#5C3010" />
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
