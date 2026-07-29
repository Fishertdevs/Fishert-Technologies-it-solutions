import { useLang } from "../LanguageContext";

export default function PoliticaCookies() {
  const { lang } = useLang();

  return (
    <div className="policy-page">
      <div className="policy-inner">
        <a href="/" className="policy-back">← {lang === "es" ? "Volver al inicio" : "Back to home"}</a>
        <h1 className="policy-title">{lang === "es" ? "Política de Cookies" : "Cookie Policy"}</h1>
        <p className="policy-date">{lang === "es" ? "Última actualización: enero 2026" : "Last updated: January 2026"}</p>

        <div className="policy-body">
          <h2>{lang === "es" ? "¿Qué son las cookies?" : "What are cookies?"}</h2>
          <p>{lang === "es"
            ? "Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Permiten que el sitio recuerde sus preferencias y mejoren su experiencia de navegación."
            : "Cookies are small text files that websites store on your device when you visit them. They allow the site to remember your preferences and improve your browsing experience."
          }</p>

          <h2>{lang === "es" ? "Cookies que utilizamos" : "Cookies we use"}</h2>
          <p>{lang === "es"
            ? "Este sitio web utiliza únicamente cookies esenciales para su funcionamiento correcto. No utilizamos cookies de seguimiento o publicidad de terceros."
            : "This website uses only essential cookies for its correct operation. We do not use third-party tracking or advertising cookies."
          }</p>

          <h3>{lang === "es" ? "Cookies esenciales" : "Essential cookies"}</h3>
          <p>{lang === "es"
            ? "Estas cookies son necesarias para que el sitio web funcione correctamente e incluyen preferencias de idioma y consentimiento de cookies. No pueden ser desactivadas."
            : "These cookies are necessary for the website to function correctly and include language preferences and cookie consent. They cannot be disabled."
          }</p>

          <h2>{lang === "es" ? "Control de cookies" : "Cookie control"}</h2>
          <p>{lang === "es"
            ? "Puede gestionar las cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar las cookies esenciales puede afectar el funcionamiento del sitio web."
            : "You can manage cookies through your browser settings. Please note that disabling essential cookies may affect the website's functionality."
          }</p>

          <h2>{lang === "es" ? "Más información" : "More information"}</h2>
          <p>{lang === "es"
            ? "Para obtener más información sobre cómo utilizamos las cookies, no dude en contactarnos a través de los canales disponibles en nuestro sitio."
            : "For more information on how we use cookies, feel free to contact us through the channels available on our site."
          }</p>
        </div>
      </div>
    </div>
  );
}
