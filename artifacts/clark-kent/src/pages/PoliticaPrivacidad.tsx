import { useLang } from "../LanguageContext";
import PolicyLayout from "../components/PolicyLayout";

export default function PoliticaPrivacidad() {
  const { lang } = useLang();
  const es = lang === "es";

  return (
    <PolicyLayout
      title={es ? "Política de Privacidad" : "Privacy Policy"}
      date={es ? "Última actualización: enero 2026" : "Last updated: January 2026"}
      sections={[
        {
          heading: es ? "1. Responsable del tratamiento" : "1. Data controller",
          body: es
            ? "Fishert Studio es el responsable del tratamiento de los datos personales recogidos a través de este sitio web."
            : "Fishert Studio is the data controller of personal data collected through this website.",
        },
        {
          heading: es ? "2. Datos que recopilamos" : "2. Data we collect",
          body: es
            ? "Podemos recopilar la siguiente información: nombre y datos de contacto cuando nos escribe, datos de navegación anónimos para mejorar el sitio, e información técnica como tipo de dispositivo y navegador."
            : "We may collect: name and contact details when you write to us, anonymous browsing data to improve the site, and technical information such as device type and browser.",
        },
        {
          heading: es ? "3. Finalidad del tratamiento" : "3. Purpose of processing",
          body: es
            ? "Los datos personales se utilizan exclusivamente para responder a sus consultas, gestionar la relación contractual cuando corresponda, y mejorar continuamente nuestros servicios."
            : "Personal data is used exclusively to respond to your inquiries, manage the contractual relationship when applicable, and continuously improve our services.",
        },
        {
          heading: es ? "4. Sus derechos" : "4. Your rights",
          body: es
            ? "Tiene derecho a acceder, rectificar, suprimir y oponerse al tratamiento de sus datos. Para ejercer estos derechos, puede contactarnos a través de los medios disponibles en este sitio."
            : "You have the right to access, rectify, delete and object to the processing of your data. Contact us through the means available on this site to exercise these rights.",
        },
        {
          heading: es ? "5. Seguridad" : "5. Security",
          body: es
            ? "Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la divulgación."
            : "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss or disclosure.",
        },
        {
          heading: es ? "6. Contacto" : "6. Contact",
          body: es
            ? "Para cualquier consulta relacionada con nuestra política de privacidad, puede ponerse en contacto con nosotros a través de los canales disponibles en nuestro sitio web."
            : "For any questions related to our privacy policy, contact us through the channels available on our website.",
        },
      ]}
    />
  );
}
