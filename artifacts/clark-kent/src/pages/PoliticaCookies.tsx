import { useLang } from "../LanguageContext";
import PolicyLayout from "../components/PolicyLayout";

export default function PoliticaCookies() {
  const { lang } = useLang();
  const es = lang === "es";

  return (
    <PolicyLayout
      title={es ? "Política de Cookies" : "Cookie Policy"}
      date={es ? "Última actualización: enero 2026" : "Last updated: January 2026"}
      sections={[
        {
          heading: es ? "¿Qué son las cookies?" : "What are cookies?",
          body: es
            ? "Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Permiten que el sitio recuerde sus preferencias y mejoran su experiencia de navegación."
            : "Cookies are small text files that websites store on your device when you visit them. They allow the site to remember your preferences and improve your browsing experience.",
        },
        {
          heading: es ? "Cookies que utilizamos" : "Cookies we use",
          body: es
            ? "Este sitio web utiliza únicamente cookies esenciales para su funcionamiento correcto. No utilizamos cookies de seguimiento o publicidad de terceros."
            : "This website uses only essential cookies for its correct operation. We do not use third-party tracking or advertising cookies.",
        },
        {
          subheading: es ? "Cookies esenciales" : "Essential cookies",
          body: es
            ? "Estas cookies son necesarias para que el sitio web funcione correctamente e incluyen preferencias de idioma y consentimiento de cookies. No pueden ser desactivadas."
            : "These cookies are necessary for the website to function correctly and include language preferences and cookie consent. They cannot be disabled.",
        },
        {
          heading: es ? "Control de cookies" : "Cookie control",
          body: es
            ? "Puede gestionar las cookies a través de la configuración de su navegador. Tenga en cuenta que deshabilitar las cookies esenciales puede afectar el funcionamiento del sitio web."
            : "You can manage cookies through your browser settings. Please note that disabling essential cookies may affect the website's functionality.",
        },
        {
          heading: es ? "Más información" : "More information",
          body: es
            ? "Para obtener más información sobre cómo utilizamos las cookies, no dude en contactarnos a través de los canales disponibles en nuestro sitio."
            : "For more information on how we use cookies, feel free to contact us through the channels available on our site.",
        },
      ]}
    />
  );
}
