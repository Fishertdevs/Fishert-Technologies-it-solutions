import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLang } from "./LanguageContext";
import faqPortrait from "@assets/faq_portrait.png";

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
  const swipeStartX = useRef<number | null>(null);

  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);
  const next = () => setActive((a) => (a + 1) % items.length);

  const current = items[active];

  const handleSwipeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipeStartX.current = event.clientX;
  };

  const handleSwipeEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return;

    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <section className="faq2-section">

      <div className="faq2-inner">

        {/* LEFT — portrait image, full height anchored to bottom */}
        <div className="faq2-left">
          <img
            className="faq2-portrait"
            src={faqPortrait}
            alt={lang === "es" ? "Ilustración Preguntas Frecuentes" : "FAQ illustration"}
          />
        </div>

        {/* RIGHT — title + single Q&A carousel */}
        <div className="faq2-right">
          <h2 className="faq2-heading">
            {lang === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
          </h2>

          <div
            className="faq2-card"
            key={active}
            onPointerDown={handleSwipeStart}
            onPointerUp={handleSwipeEnd}
            onPointerCancel={() => {
              swipeStartX.current = null;
            }}
          >
            <h3 className="faq2-question">{current.q}</h3>
            <p className="faq2-answer">{current.a}</p>
          </div>

          {/* Navigation — arrows in the same row as dots */}
          <div className="faq2-nav">
            <button type="button" className="faq2-arrow" onClick={prev} aria-label={lang === "es" ? "anterior" : "previous"}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="faq2-dots">
              {items.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`faq2-dot${i === active ? " faq2-dot--active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`${lang === "es" ? "Pregunta" : "Question"} ${i + 1}`}
                />
              ))}
            </div>

            <button type="button" className="faq2-arrow" onClick={next} aria-label={lang === "es" ? "siguiente" : "next"}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom wave — same shape as Nosotros */}
      <svg className="faq2-wave faq2-wave--bottom" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#ffffff" />
      </svg>

    </section>
  );
}
