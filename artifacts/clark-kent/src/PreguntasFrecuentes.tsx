import { useState } from "react";
import { useLang } from "./LanguageContext";

const faqs = {
  es: [
    {
      q: "¿Cuánto tiempo toma desarrollar un proyecto?",
      a: "Depende del alcance. Un sitio web corporativo toma entre 3 y 6 semanas. Un software a medida o plataforma digital puede tomar entre 2 y 6 meses. Siempre definimos plazos claros al inicio del proyecto.",
    },
    {
      q: "¿Trabajan con clientes de cualquier país?",
      a: "Sí. Trabajamos de forma remota con clientes en toda Latinoamérica, España y EE.UU. Nos coordinamos fácilmente mediante videollamadas y herramientas colaborativas.",
    },
    {
      q: "¿Qué incluye el servicio de Marketing Digital?",
      a: "Incluye estrategia de contenido, gestión de redes sociales, campañas de pauta publicitaria (Meta Ads, Google Ads), SEO y analítica de resultados. Adaptamos el plan a los objetivos de cada cliente.",
    },
    {
      q: "¿Pueden hacerse cargo del mantenimiento del proyecto después de entregarlo?",
      a: "Sí. Ofrecemos planes de mantenimiento mensual que incluyen actualizaciones, soporte técnico, corrección de errores y mejoras progresivas. Así tu producto sigue evolucionando.",
    },
    {
      q: "¿Cómo es el proceso para iniciar un proyecto?",
      a: "El proceso comienza con una llamada de descubrimiento sin costo donde entendemos tu negocio y objetivos. Luego enviamos una propuesta con alcance, tiempos y presupuesto. Una vez aprobada, arrancamos.",
    },
    {
      q: "¿Qué tecnologías utilizan?",
      a: "Trabajamos con React, Node.js, TypeScript, PostgreSQL, Python y herramientas de IA. Elegimos la tecnología según lo que mejor se adapte a cada proyecto — no usamos una sola stack para todo.",
    },
  ],
  en: [
    {
      q: "How long does it take to develop a project?",
      a: "It depends on the scope. A corporate website takes 3 to 6 weeks. Custom software or a digital platform can take 2 to 6 months. We always define clear timelines at the start of each project.",
    },
    {
      q: "Do you work with clients from any country?",
      a: "Yes. We work remotely with clients across Latin America, Spain, and the US. We coordinate easily via video calls and collaborative tools.",
    },
    {
      q: "What does the Digital Marketing service include?",
      a: "It includes content strategy, social media management, paid ad campaigns (Meta Ads, Google Ads), SEO, and results analytics. We tailor the plan to each client's goals.",
    },
    {
      q: "Can you handle maintenance after the project is delivered?",
      a: "Yes. We offer monthly maintenance plans that include updates, technical support, bug fixes, and progressive improvements — so your product keeps evolving.",
    },
    {
      q: "What does the process look like to start a project?",
      a: "It starts with a free discovery call where we understand your business and objectives. Then we send a proposal with scope, timeline, and budget. Once approved, we get started.",
    },
    {
      q: "What technologies do you use?",
      a: "We work with React, Node.js, TypeScript, PostgreSQL, Python, and AI tools. We choose the technology that best fits each project — we don't use one stack for everything.",
    },
  ],
};

export default function PreguntasFrecuentes() {
  const { lang } = useLang();
  const items = faqs[lang];
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <p className="faq-eyebrow">
          {lang === "es" ? "PREGUNTAS FRECUENTES" : "FREQUENTLY ASKED QUESTIONS"}
        </p>
        <h2 className="faq-heading">
          {lang === "es" ? "Todo lo que necesitas saber." : "Everything you need to know."}
        </h2>

        <div className="faq-list">
          {items.map((item, i) => (
            <div key={i} className={`faq-item${open === i ? " faq-item--open" : ""}`}>
              <button className="faq-question" onClick={() => toggle(i)} aria-expanded={open === i}>
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  {open === i ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
              </button>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
