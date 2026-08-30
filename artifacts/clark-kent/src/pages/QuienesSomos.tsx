import { useEffect } from "react";
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

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".qs-value-card"));
    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("qs-value-card--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("qs-value-card--visible", entry.isIntersecting);
        });
      },
      { threshold: 0.28 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="qs-page">

        {/* ── Intro ── */}
        <section className="qs-hero">
          <div className="qs-hero-content">
            <h1 className="qs-hero-title">
              {lang === "es" ? "Fishert Studio" : "Fishert Studio"}
            </h1>
            <p className="qs-hero-sub">
              {lang === "es"
                ? "Un estudio de software que convierte ideas ambiciosas en experiencias digitales con identidad."
                : "A software studio turning ambitious ideas into digital experiences with identity."}
            </p>
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
                  ? "Fishert Studio es un estudio de software para ideas ambiciosas. Unimos estrategia, diseño e ingeniería para convertir oportunidades en experiencias digitales claras, útiles y preparadas para crecer."
                  : "Fishert Studio is a software studio for ambitious ideas. We combine strategy, design, and engineering to turn opportunities into clear, useful digital experiences built to grow."}
              </p>
              <p>
                {lang === "es"
                  ? "Trabajamos junto a marcas y equipos que buscan más que una solución estándar: una identidad propia, decisiones bien pensadas y tecnología que haga avanzar su negocio. Cada proyecto empieza escuchando, explorando y encontrando la forma más directa de hacerlo realidad."
                  : "We work with brands and teams looking for more than a standard solution: a distinct identity, thoughtful decisions, and technology that moves the business forward. Every project starts by listening, exploring, and finding the clearest way to make it real."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="qs-values">
          <div className="qs-values-inner">
            <h2 className="qs-values-heading">
              {lang === "es" ? "Qué nos diferencia." : "What sets us apart."}
            </h2>
            <div className="qs-values-grid">
              {v.map((val, i) => (
                <div
                  key={i}
                  className={`qs-value-card ${i % 2 === 0 ? "qs-value-card--from-right" : "qs-value-card--from-left"}`}
                >
                  <div
                    className="qs-value-card-content"
                    style={{ transitionDelay: `${i * 0.16}s` }}
                  >
                    <h3 className="qs-value-title">{val.title}</h3>
                    <p className="qs-value-body">{val.body}</p>
                  </div>
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

      </main>
      <Footer />
    </>
  );
}
