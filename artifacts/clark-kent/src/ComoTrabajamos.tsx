import { useRef } from "react";
import { useLang } from "./LanguageContext";

const steps = {
  es: [
    {
      num: "01",
      title: "Descubrimiento",
      body: "Empezamos con una llamada sin costo. Entendemos tu negocio, tus objetivos y los problemas que quieres resolver. Sin formularios genéricos — escuchamos.",
    },
    {
      num: "02",
      title: "Propuesta",
      body: "Con lo que aprendimos, preparamos una propuesta clara: alcance, tecnología, tiempos y presupuesto real. Sin letra pequeña ni sorpresas.",
    },
    {
      num: "03",
      title: "Diseño",
      body: "Antes de escribir una línea de código, diseñamos la experiencia. Wireframes, prototipos y validación contigo. Así el producto ya existe antes de construirse.",
    },
    {
      num: "04",
      title: "Desarrollo",
      body: "Construimos por sprints con entregas incrementales. Ves el avance real desde la primera semana. Feedback continuo — nada queda como sorpresa al final.",
    },
    {
      num: "05",
      title: "Lanzamiento",
      body: "Deploy, pruebas finales, configuración de dominio y analítica. No te entregamos solo el código — te entregamos el producto funcionando en producción.",
    },
    {
      num: "06",
      title: "Soporte",
      body: "El trabajo no termina al entregar. Ofrecemos planes de mantenimiento para que tu producto siga evolucionando y nunca se quede atrás.",
    },
  ],
  en: [
    {
      num: "01",
      title: "Discovery",
      body: "We start with a free call. We understand your business, goals, and the problems you want to solve. No generic forms — we listen.",
    },
    {
      num: "02",
      title: "Proposal",
      body: "With what we learned, we prepare a clear proposal: scope, technology, timeline, and a real budget. No fine print, no surprises.",
    },
    {
      num: "03",
      title: "Design",
      body: "Before writing a single line of code, we design the experience. Wireframes, prototypes, and validation with you. The product exists before it's built.",
    },
    {
      num: "04",
      title: "Development",
      body: "We build in sprints with incremental deliveries. You see real progress from week one. Continuous feedback — nothing is a surprise at the end.",
    },
    {
      num: "05",
      title: "Launch",
      body: "Deploy, final testing, domain configuration, and analytics. We don't hand over code — we deliver a product running in production.",
    },
    {
      num: "06",
      title: "Support",
      body: "The work doesn't end at delivery. We offer maintenance plans so your product keeps evolving and never falls behind.",
    },
  ],
};

export default function ComoTrabajamos() {
  const { lang } = useLang();
  const items = steps[lang];
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section ref={sectionRef} className="ctw-section">
      <div className="ctw-inner">
        <div className="ctw-header">
          <p className="ctw-eyebrow">
            {lang === "es" ? "NUESTRO PROCESO" : "OUR PROCESS"}
          </p>
          <h2 className="ctw-heading">
            {lang === "es" ? "Así trabajamos." : "How we work."}
          </h2>
          <p className="ctw-subheading">
            {lang === "es"
              ? "Un proceso claro convierte la incertidumbre en confianza."
              : "A clear process turns uncertainty into trust."}
          </p>
        </div>

        <div className="ctw-grid">
          {items.map((step, i) => (
            <div key={i} className="ctw-step">
              <span className="ctw-step-num">{step.num}</span>
              <div className="ctw-step-line" aria-hidden="true" />
              <h3 className="ctw-step-title">{step.title}</h3>
              <p className="ctw-step-body">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="ctw-cta-row">
          <a href="#contacto" className="ctw-cta">
            {lang === "es" ? "Agendar llamada de descubrimiento" : "Schedule a discovery call"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
