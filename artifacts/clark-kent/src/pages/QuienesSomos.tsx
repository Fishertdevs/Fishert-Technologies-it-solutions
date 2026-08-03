import { useEffect } from "react";
import { Link } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

const team = [
  {
    name: "Harry Fishert",
    role: { es: "Fundador & Lead Developer", en: "Founder & Lead Developer" },
    bio: {
      es: "Visionario detrás de Fishert Studio. Apasionado por crear soluciones digitales que desafíen lo convencional.",
      en: "The visionary behind Fishert Studio. Passionate about creating digital solutions that challenge the conventional.",
    },
  },
];

const values = {
  es: [
    {
      icon: "◈",
      title: "Calidad sin compromiso",
      body: "Cada línea de código, cada pixel, cada estrategia pasa por un estándar que no negociamos. No entregamos nada que no nos enorgullezca.",
    },
    {
      icon: "◎",
      title: "Identidad propia",
      body: "Creemos que cada marca merece una solución única. Nunca copiamos plantillas ni soluciones genéricas — todo parte desde cero.",
    },
    {
      icon: "◉",
      title: "Transparencia total",
      body: "Comunicación clara, plazos reales, presupuestos honestos. El cliente sabe en todo momento qué está pasando con su proyecto.",
    },
    {
      icon: "◐",
      title: "Resultados medibles",
      body: "No trabajamos para impresionar en reuniones. Trabajamos para que los números de tu negocio mejoren. Eso es lo que nos importa.",
    },
  ],
  en: [
    {
      icon: "◈",
      title: "Uncompromising quality",
      body: "Every line of code, every pixel, every strategy passes through a standard we don't negotiate. We never deliver anything we're not proud of.",
    },
    {
      icon: "◎",
      title: "Own identity",
      body: "We believe every brand deserves a unique solution. We never copy templates or generic solutions — everything starts from scratch.",
    },
    {
      icon: "◉",
      title: "Full transparency",
      body: "Clear communication, realistic timelines, honest budgets. The client always knows exactly what's happening with their project.",
    },
    {
      icon: "◐",
      title: "Measurable results",
      body: "We don't work to impress in meetings. We work to move your business numbers forward. That's what matters to us.",
    },
  ],
};

export default function QuienesSomos() {
  const { lang } = useLang();
  const v = values[lang];
  const base = import.meta.env.BASE_URL || "/";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />
      <main className="qs-page">

        {/* ── Hero ── */}
        <section className="qs-hero">
          <img src={`${base}mona-lisa.png`} alt="Fishert Studio" className="qs-hero-img" />
          <div className="qs-hero-overlay" />
          <div className="qs-hero-content">
            <Link href="/" className="svc-back-link">
              ← {lang === "es" ? "Volver al inicio" : "Back to home"}
            </Link>
            <p className="svc-page-eyebrow">
              {lang === "es" ? "QUIÉNES SOMOS" : "ABOUT US"}
            </p>
            <h1 className="qs-hero-title">
              {lang === "es" ? "Rompemos con lo\nconvencional." : "We break with\nthe conventional."}
            </h1>
          </div>
        </section>

        {/* ── Origin story ── */}
        <section className="qs-story">
          <div className="qs-story-inner">
            <p className="svc-plans-eyebrow">
              {lang === "es" ? "NUESTRA HISTORIA" : "OUR STORY"}
            </p>
            <h2 className="qs-story-heading">
              {lang === "es" ? "Cómo iniciamos esta idea." : "How we started this idea."}
            </h2>
            <div className="qs-story-body">
              <p>
                {lang === "es"
                  ? "Fishert Studio comenzó con una idea de Harry Fishert, nuestro fundador y líder de desarrollo. Lo que empezó como un hobby entre amigos pronto se convirtió en una visión compartida: construir una agencia de software capaz de romper con lo convencional y crear soluciones digitales que realmente marcaran la diferencia."
                  : "Fishert Studio began with an idea from Harry Fishert, our founder and lead developer. What started as a hobby among friends quickly became a shared vision: to build a software agency capable of breaking with convention and creating digital solutions that truly make a difference."}
              </p>
              <p>
                {lang === "es"
                  ? "Desde el primer día, nuestro objetivo ha sido explorar nuevas ideas, expandirnos hacia diferentes áreas de la tecnología y desarrollar proyectos que inspiren. No creemos en las soluciones genéricas ni en los sitios web que se parecen entre sí. Diseñamos experiencias digitales con identidad propia, combinando ingeniería, diseño y estrategia."
                  : "From day one, our goal has been to explore new ideas, expand into different areas of technology, and develop projects that inspire. We don't believe in generic solutions or websites that all look the same. We design digital experiences with their own identity, combining engineering, design, and strategy."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="qs-values">
          <div className="qs-values-inner">
            <p className="svc-plans-eyebrow">
              {lang === "es" ? "NUESTROS VALORES" : "OUR VALUES"}
            </p>
            <h2 className="qs-values-heading">
              {lang === "es" ? "Lo que nos define." : "What defines us."}
            </h2>
            <div className="qs-values-grid">
              {v.map((val, i) => (
                <div key={i} className="qs-value-card">
                  <span className="qs-value-icon" aria-hidden="true">{val.icon}</span>
                  <h3 className="qs-value-title">{val.title}</h3>
                  <p className="qs-value-body">{val.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="qs-team">
          <div className="qs-team-inner">
            <p className="svc-plans-eyebrow">
              {lang === "es" ? "EQUIPO" : "TEAM"}
            </p>
            <h2 className="qs-team-heading">
              {lang === "es" ? "Las personas detrás del estudio." : "The people behind the studio."}
            </h2>
            <div className="qs-team-grid">
              {team.map((member, i) => (
                <div key={i} className="qs-team-card">
                  <div className="qs-team-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="qs-team-name">{member.name}</h3>
                  <p className="qs-team-role">{member.role[lang]}</p>
                  <p className="qs-team-bio">{member.bio[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="qs-cta">
          <h2 className="qs-cta-heading">
            {lang === "es" ? "¿Listo para trabajar juntos?" : "Ready to work together?"}
          </h2>
          <p className="qs-cta-sub">
            {lang === "es"
              ? "Cuéntanos tu proyecto. La primera llamada es sin costo."
              : "Tell us about your project. The first call is free."}
          </p>
          <a href="/#contacto" className="qs-cta-btn">
            {lang === "es" ? "Iniciar proyecto" : "Start a project"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </section>

      </main>
      <Footer />
    </>
  );
}
