import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { useListTeamMembers } from "@workspace/api-client-react";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import footerPortrait from "@assets/image_(6)-Photoroom_1788126926994.png";
import teamSectionTexture from "@assets/image_1788744935304.png";
import teamSectionArt from "@assets/image-Photoroom_(21)_1788745192839.png";
import teamBridgeArt from "@assets/image-Photoroom_(25)_1789231231820.png";
import storySectionArt from "@assets/image-Photoroom_(22)_1788748318291.png";
import harryPortrait from "@assets/harry-portrait-cropped.png";

type TeamMember = {
  name: string;
  role: { es: string; en: string };
  bio: { es: string; en: string };
  bioLines?: { es: string[]; en: string[] };
  imageRef?: string | null;
};

const team: TeamMember[] = [
  {
    name: "Harry Fishert",
    imageRef: harryPortrait,
    role: {
      es: "Fundador · Líder de desarrollo y diseño",
      en: "Founder · Development & Design Lead",
    },
    bio: {
      es: "Transformo ideas ambiciosas en productos digitales claros, combinando estrategia, desarrollo y diseño para que cada decisión tenga propósito.",
      en: "I turn ambitious ideas into clear digital products, combining strategy, development, and design so every decision has purpose.",
    },
    bioLines: {
      es: [
        "Transformo ideas en productos claros,",
        "con estrategia, diseño y desarrollo",
        "para crear experiencias con propósito.",
      ],
      en: [
        "I turn ideas into clear products,",
        "with strategy, design, and development",
        "to create experiences with purpose.",
      ],
    },
  },
  {
    name: "David Moya",
    role: {
      es: "QA Tester",
      en: "QA Tester",
    },
    bio: {
      es: "Pongo cada experiencia a prueba para encontrar los detalles que importan y asegurar productos confiables, fluidos y listos para crecer.",
      en: "I test every experience to find the details that matter and make sure products are reliable, smooth, and ready to grow.",
    },
  },
  {
    name: "Samuel Tellez",
    role: {
      es: "Gestión interna",
      en: "Internal Operations",
    },
    bio: {
      es: "Organizo los procesos internos que mantienen al estudio enfocado, coordinado y preparado para convertir buenas ideas en resultados.",
      en: "I organize the internal processes that keep the studio focused, coordinated, and ready to turn good ideas into results.",
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

function TeamMemberCard({
  member,
  lang,
  className = "qs-team-card",
}: {
  member: TeamMember;
  lang: "es" | "en";
  className?: string;
}) {
  const shouldCenterCopy = member.name === "David Moya" || member.name === "Samuel Tellez";
  const hasPortrait = Boolean(member.imageRef);

  return (
    <article
      className={[
        className,
        shouldCenterCopy ? "qs-team-card--centered-copy" : "",
        hasPortrait ? "qs-team-card--portrait" : "",
      ].filter(Boolean).join(" ")}
    >
      {!hasPortrait && (
        <div className="qs-team-avatar">
          {member.name.charAt(0)}
        </div>
      )}
      <h3 className="qs-team-name">{member.name}</h3>
      <p className="qs-team-role">{member.role[lang]}</p>
      {!hasPortrait && (
        <p className="qs-team-bio">
          {member.bioLines?.[lang]
            ? member.bioLines[lang].map((line, index) => (
                <span key={line}>
                  {index > 0 && <br />}
                  {line}
                </span>
              ))
            : member.bio[lang]}
        </p>
      )}
      {hasPortrait && (
        <div className="qs-team-avatar qs-team-avatar--portrait">
          <img src={member.imageRef!} alt="" />
        </div>
      )}
    </article>
  );
}

export default function QuienesSomos() {
  const { lang } = useLang();
  const v = values[lang];
  const teamQuery = useListTeamMembers();
  const displayTeam: TeamMember[] = teamQuery.data?.length
    ? teamQuery.data.map((member) => ({
        name: member.name,
        role: { es: member.roleEs, en: member.roleEn },
        bio: { es: member.bioEs, en: member.bioEn },
        imageRef: member.imageRef || (member.name === "Harry Fishert" ? harryPortrait : null),
      }))
    : team;
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const [teamSlideDirection, setTeamSlideDirection] = useState<1 | -1>(1);
  const teamTouchStartX = useRef<number | null>(null);
  const currentTeamMember = displayTeam[activeTeamMember] ?? displayTeam[0];

  const changeTeamMember = (direction: number) => {
    setTeamSlideDirection(direction < 0 ? -1 : 1);
    setActiveTeamMember((current) => (current + direction + displayTeam.length) % displayTeam.length);
  };

  const selectTeamMember = (index: number) => {
    if (index === activeTeamMember) return;
    setTeamSlideDirection(index > activeTeamMember ? 1 : -1);
    setActiveTeamMember(index);
  };

  const handleTeamTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    teamTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTeamTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (teamTouchStartX.current === null) return;
    const distance = event.changedTouches[0]?.clientX - teamTouchStartX.current;
    teamTouchStartX.current = null;
    if (Math.abs(distance) < 45) return;
    changeTeamMember(distance < 0 ? 1 : -1);
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    setActiveTeamMember((current) => Math.min(current, Math.max(displayTeam.length - 1, 0)));
  }, [displayTeam.length]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".qs-value-card"));
    const heroSection = document.querySelector<HTMLElement>(".qs-hero");
    const storySection = document.querySelector<HTMLElement>(".qs-story");
    const bridgeSection = document.querySelector<HTMLElement>(".qs-team-values-bridge");
    const valuesSection = document.querySelector<HTMLElement>(".qs-values");
    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("qs-value-card--visible"));
      heroSection?.classList.add("qs-hero--visible");
      storySection?.classList.add("qs-story--visible");
      bridgeSection?.classList.add("qs-team-values-bridge--visible");
      valuesSection?.classList.add("qs-values--visible");
      return;
    }

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("qs-value-card--visible", entry.isIntersecting);
        });
      },
      { threshold: 0.28 },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const visibleClass = target.classList.contains("qs-hero")
            ? "qs-hero--visible"
            : target.classList.contains("qs-story")
              ? "qs-story--visible"
              : target.classList.contains("qs-team-values-bridge")
                ? "qs-team-values-bridge--visible"
                : "qs-values--visible";
          target.classList.toggle(visibleClass, entry.isIntersecting);
        });
      },
      { threshold: 0.12 },
    );

    cards.forEach((card) => cardsObserver.observe(card));
    if (heroSection) sectionObserver.observe(heroSection);
    if (storySection) sectionObserver.observe(storySection);
    if (bridgeSection) sectionObserver.observe(bridgeSection);
    if (valuesSection) sectionObserver.observe(valuesSection);
    return () => {
      cardsObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="qs-page">

        {/* ── Intro ── */}
        <section className="qs-hero">
          <div className="qs-hero-content">
            <h1 className="qs-hero-title">
              {lang === "es" ? "FISHERT STUDIO" : "FISHERT STUDIO"}
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
            <div className="qs-story-content">
              <p className="svc-plans-eyebrow">
                {lang === "es" ? "NUESTRA HISTORIA" : "OUR STORY"}
              </p>
              <h2 className="qs-story-heading">
                {lang === "es" ? "Cómo iniciamos esta idea." : "How we started this idea."}
              </h2>
              <div className="qs-story-body">
                <p>
                  {lang === "es"
                    ? "Fishert Studio es un estudio de software para ideas ambiciosas. Unimos estrategia, diseño e ingeniería para convertir oportunidades en experiencias digitales claras, útiles y preparadas para crecer. Trabajamos junto a marcas y equipos que buscan más que una solución estándar: una identidad propia, decisiones bien pensadas y tecnología que haga avanzar su negocio. Cada proyecto empieza escuchando, explorando y encontrando la forma más directa de hacerlo realidad."
                    : "Fishert Studio is a software studio for ambitious ideas. We combine strategy, design, and engineering to turn opportunities into clear, useful digital experiences built to grow. We work with brands and teams looking for more than a standard solution: a distinct identity, thoughtful decisions, and technology that moves the business forward. Every project starts by listening, exploring, and finding the clearest way to make it real."}
                </p>
              </div>
            </div>
            <div className="qs-story-art" aria-hidden="true">
              <img src={storySectionArt} alt="" />
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section
          id="team"
          className="qs-team"
          style={{ backgroundImage: `url(${teamSectionTexture})` }}
        >
          <div className="qs-team-inner">
            <div className="qs-team-art" aria-hidden="true">
              <img src={teamSectionArt} alt="" />
            </div>
            <div className="qs-team-content">
              <h2 className="qs-team-heading">
                {lang === "es" ? "Nuestro equipo." : "Our team."}
              </h2>
            <div className="qs-team-desktop-list">
              {displayTeam.slice(0, 3).map((member) => (
                <TeamMemberCard
                  key={member.name}
                  member={member}
                  lang={lang}
                  className="qs-team-card qs-team-card--desktop"
                />
              ))}
            </div>
            <div className="qs-team-grid">
              <button
                type="button"
                className="qs-team-arrow"
                aria-label={lang === "es" ? "Ver integrante anterior" : "View previous team member"}
                onClick={() => changeTeamMember(-1)}
              >
                ←
              </button>
              <div
                className="qs-team-viewport"
                onTouchStart={handleTeamTouchStart}
                onTouchEnd={handleTeamTouchEnd}
                aria-live="polite"
              >
                <TeamMemberCard
                  key={currentTeamMember.name}
                  member={currentTeamMember}
                  lang={lang}
                  className={`qs-team-card ${teamSlideDirection > 0 ? "qs-team-card--next" : "qs-team-card--previous"}`}
                >
                </TeamMemberCard>
              </div>
              <button
                type="button"
                className="qs-team-arrow"
                aria-label={lang === "es" ? "Ver siguiente integrante" : "View next team member"}
                onClick={() => changeTeamMember(1)}
              >
                →
              </button>
            </div>
            <div className="qs-team-dots" role="tablist" aria-label={lang === "es" ? "Integrantes del equipo" : "Team members"}>
              {displayTeam.map((member, index) => (
                <button
                  key={member.name}
                  type="button"
                  role="tab"
                  className={index === activeTeamMember ? "qs-team-dot qs-team-dot--active" : "qs-team-dot"}
                  aria-label={`${lang === "es" ? "Ver a" : "View"} ${member.name}`}
                  aria-selected={index === activeTeamMember}
                  onClick={() => selectTeamMember(index)}
                />
              ))}
            </div>
            </div>
          </div>
          <svg
            className="qs-team-wave qs-team-wave--bottom"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 46C170 78 310 78 480 44S790 10 960 44s310 34 480 2V90H0Z"
              fill="#ffffff"
            />
          </svg>
        </section>

        <section className="qs-team-values-bridge" aria-label={lang === "es" ? "Transición entre secciones" : "Section transition"}>
          <div className="qs-team-values-bridge-copy">
            <span className="qs-team-values-bridge-eyebrow">
              {lang === "es" ? "NUESTRO EQUIPO" : "OUR TEAM"}
            </span>
            <p>
              {lang === "es"
                ? "Detrás de cada resultado hay un equipo que combina estrategia, diseño y tecnología para convertir ideas ambiciosas en experiencias digitales claras, relevantes y preparadas para crecer. Escuchamos cada desafío, alineamos las decisiones con los objetivos del negocio y cuidamos cada detalle para construir soluciones que conecten con las personas y generen resultados sostenibles."
                : "Behind every result is a team that combines strategy, design, and technology to turn ambitious ideas into clear, meaningful digital experiences built to grow. We listen to every challenge, align decisions with business goals, and care for every detail to build solutions that connect with people and create lasting results."}
            </p>
          </div>
          <div className="qs-team-values-bridge-art" aria-hidden="true">
            <img src={teamBridgeArt} alt="" />
          </div>
        </section>

        {/* ── Values ── */}
        <section className="qs-values">
          <div className="qs-values-inner">
            <h2 className="qs-values-heading">
              {lang === "es" ? "QUÉ NOS DIFERENCIA." : "WHAT SETS US APART."}
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

        <section className="qs-footer-art" aria-label="Fishert Studio">
          <div className="qs-footer-art-copy">
            <p>
              {(lang === "es"
                ? ["La tecnología", "convierte las ideas", "en posibilidades."]
                : ["Technology", "turns ideas into", "new digital possibilities."]
              ).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <div className="qs-footer-art-media">
            <img src={footerPortrait} alt="" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
