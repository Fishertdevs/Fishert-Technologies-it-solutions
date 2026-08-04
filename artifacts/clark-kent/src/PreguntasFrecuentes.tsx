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
      q: "¿Pueden hacerse cargo del mantenimiento después de entregar?",
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
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);
  const next = () => setActive((a) => (a + 1) % items.length);

  const current = items[active];

  return (
    <section className="faq2-section">
      <div className="faq2-inner">

        {/* LEFT — heading block */}
        <div className="faq2-left">
          <p className="faq2-eyebrow">
            {lang === "es" ? "PREGUNTAS" : "FAQ"}
          </p>
          <h2 className="faq2-heading">
            {lang === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
          </h2>
          <p className="faq2-sub">
            {lang === "es"
              ? "Todo lo que necesitas saber antes de comenzar tu proyecto con nosotros."
              : "Everything you need to know before starting your project with us."}
          </p>

          {/* Counter */}
          <p className="faq2-counter">
            <span className="faq2-counter-cur">{String(active + 1).padStart(2, "0")}</span>
            <span className="faq2-counter-sep"> / </span>
            <span className="faq2-counter-total">{String(items.length).padStart(2, "0")}</span>
          </p>
        </div>

        {/* RIGHT — single Q&A carousel */}
        <div className="faq2-right">
          <div className="faq2-card" key={active}>
            <h3 className="faq2-question">{current.q}</h3>
            <p className="faq2-answer">{current.a}</p>
          </div>

          {/* Dot navigation */}
          <div className="faq2-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`faq2-dot${i === active ? " faq2-dot--active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Pregunta ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow navigation */}
          <div className="faq2-arrows">
            <button className="faq2-arrow" onClick={prev} aria-label="anterior">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="faq2-arrow" onClick={next} aria-label="siguiente">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
