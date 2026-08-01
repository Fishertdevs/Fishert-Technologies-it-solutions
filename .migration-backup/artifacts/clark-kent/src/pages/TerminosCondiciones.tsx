import { useLang } from "../LanguageContext";
import PolicyLayout from "../components/PolicyLayout";

export default function TerminosCondiciones() {
  const { lang } = useLang();
  const es = lang === "es";

  return (
    <PolicyLayout
      title={es ? "Términos y Condiciones" : "Terms & Conditions"}
      date={es ? "Última actualización: enero 2026" : "Last updated: January 2026"}
      sections={[
        {
          heading: es ? "1. Aceptación de los términos" : "1. Acceptance of terms",
          body: es
            ? "Al acceder y utilizar los servicios de Fishert Studio, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice nuestros servicios."
            : "By accessing and using Fishert Studio's services, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, we ask that you do not use our services.",
        },
        {
          heading: es ? "2. Servicios ofrecidos" : "2. Services offered",
          body: es
            ? "Fishert Studio ofrece servicios de diseño, desarrollo de software a la medida, consultoría digital y soluciones tecnológicas personalizadas. Cada proyecto se rige por un contrato específico acordado entre las partes."
            : "Fishert Studio offers design, custom software development, digital consulting and personalized technology solutions. Each project is governed by a specific contract agreed between the parties.",
        },
        {
          heading: es ? "3. Propiedad intelectual" : "3. Intellectual property",
          body: es
            ? "Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, imágenes y software, es propiedad de Fishert Studio y está protegido por las leyes de propiedad intelectual aplicables. Queda prohibida su reproducción sin autorización expresa."
            : "All content on this website, including texts, graphics, logos, images and software, is the property of Fishert Studio and is protected by applicable intellectual property laws. Its reproduction without express authorization is prohibited.",
        },
        {
          heading: es ? "4. Limitación de responsabilidad" : "4. Limitation of liability",
          body: es
            ? "Fishert Studio no será responsable por daños indirectos, incidentales o consecuentes que puedan surgir del uso de nuestros servicios. Nuestra responsabilidad máxima se limita al valor del contrato acordado."
            : "Fishert Studio shall not be liable for indirect, incidental or consequential damages that may arise from the use of our services. Our maximum liability is limited to the value of the agreed contract.",
        },
        {
          heading: es ? "5. Modificaciones" : "5. Modifications",
          body: es
            ? "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en este sitio web. Le recomendamos revisar estos términos periódicamente."
            : "We reserve the right to modify these terms at any time. Modifications will take effect immediately after their publication on this website. We recommend reviewing these terms periodically.",
        },
        {
          heading: es ? "6. Contacto" : "6. Contact",
          body: es
            ? "Para cualquier consulta sobre estos términos, puede contactarnos a través de nuestro sitio web o mediante los canales de comunicación disponibles."
            : "For any questions about these terms, you can contact us through our website or through available communication channels.",
        },
      ]}
    />
  );
}
