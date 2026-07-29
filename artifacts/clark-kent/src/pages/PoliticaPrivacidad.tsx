import { useLang } from "../LanguageContext";

export default function PoliticaPrivacidad() {
  const { lang } = useLang();

  return (
    <div className="policy-page">
      <div className="policy-inner">
        <a href="/" className="policy-back">← {lang === "es" ? "Volver al inicio" : "Back to home"}</a>
        <h1 className="policy-title">{lang === "es" ? "Política de Privacidad" : "Privacy Policy"}</h1>
        <p className="policy-date">{lang === "es" ? "Última actualización: enero 2026" : "Last updated: January 2026"}</p>

        <div className="policy-body">
          <h2>{lang === "es" ? "1. Responsable del tratamiento" : "1. Data controller"}</h2>
          <p>{lang === "es"
            ? "Fishert Studio es el responsable del tratamiento de los datos personales recogidos a través de este sitio web."
            : "Fishert Studio is the data controller of personal data collected through this website."
          }</p>

          <h2>{lang === "es" ? "2. Datos que recopilamos" : "2. Data we collect"}</h2>
          <p>{lang === "es"
            ? "Podemos recopilar la siguiente información: nombre y datos de contacto cuando nos escribe, datos de navegación anónimos para mejorar el sitio, e información técnica como tipo de dispositivo y navegador."
            : "We may collect the following information: name and contact details when you write to us, anonymous browsing data to improve the site, and technical information such as device type and browser."
          }</p>

          <h2>{lang === "es" ? "3. Finalidad del tratamiento" : "3. Purpose of processing"}</h2>
          <p>{lang === "es"
            ? "Los datos personales se utilizan exclusivamente para responder a sus consultas, gestionar la relación contractual cuando corresponda, y mejorar continuamente nuestros servicios."
            : "Personal data is used exclusively to respond to your inquiries, manage the contractual relationship when applicable, and continuously improve our services."
          }</p>

          <h2>{lang === "es" ? "4. Sus derechos" : "4. Your rights"}</h2>
          <p>{lang === "es"
            ? "Tiene derecho a acceder, rectificar, suprimir y oponerse al tratamiento de sus datos. Para ejercer estos derechos, puede contactarnos a través de los medios disponibles en este sitio."
            : "You have the right to access, rectify, delete and object to the processing of your data. To exercise these rights, you can contact us through the means available on this site."
          }</p>

          <h2>{lang === "es" ? "5. Seguridad" : "5. Security"}</h2>
          <p>{lang === "es"
            ? "Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la divulgación."
            : "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss or disclosure."
          }</p>

          <h2>{lang === "es" ? "6. Contacto" : "6. Contact"}</h2>
          <p>{lang === "es"
            ? "Para cualquier consulta relacionada con nuestra política de privacidad, puede ponerse en contacto con nosotros a través de los canales disponibles en nuestro sitio web."
            : "For any questions related to our privacy policy, you can contact us through the channels available on our website."
          }</p>
        </div>
      </div>
    </div>
  );
}
