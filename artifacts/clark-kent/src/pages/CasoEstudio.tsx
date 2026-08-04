import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

type Result = { metric: string; label: string };
type CaseData = {
  title: string;
  tagline: string;
  img: string;
  url: string;
  industry: string;
  services: string[];
  problem: string;
  solution: string;
  results: Result[];
  tech: string[];
  quote?: { text: string; author: string };
};

const cases: Record<string, { es: CaseData; en: CaseData }> = {
  "alterego-store": {
    es: {
      title: "Alterego Store",
      tagline: "De tienda local a referente digital de moda y lifestyle.",
      img: "proj-alterego.png",
      url: "www.alterego-store.com.co",
      industry: "Moda & Lifestyle",
      services: ["Desarrollo Web", "Marketing Digital"],
      problem:
        "Alterego Store tenía presencia física pero nula visibilidad digital. Sus ventas dependían 100% del tráfico en tienda y recomendaciones de boca a boca. Sin catálogo online, sin forma de llegar a nuevos clientes fuera de su zona.",
      solution:
        "Diseñamos y desarrollamos un e-commerce con identidad visual propia — bold, urbano y aspiracional. Catálogo digital con filtros, experiencia de compra optimizada para mobile y una estrategia de contenido en redes que construyó comunidad desde el primer mes.",
      results: [
        { metric: "+340%", label: "Tráfico web en 90 días" },
        { metric: "62%", label: "Ventas desde mobile" },
        { metric: "4.2×", label: "ROAS en Meta Ads" },
        { metric: "2.800+", label: "Seguidores ganados" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Meta Ads", "Google Analytics"],
      quote: {
        text: "Fishert Studio transformó por completo nuestra presencia digital. El resultado superó todas nuestras expectativas y el equipo fue excepcional en cada etapa.",
        author: "Carlos M. — Alterego Store",
      },
    },
    en: {
      title: "Alterego Store",
      tagline: "From local store to digital fashion & lifestyle reference.",
      img: "proj-alterego.png",
      url: "www.alterego-store.com.co",
      industry: "Fashion & Lifestyle",
      services: ["Web Development", "Digital Marketing"],
      problem:
        "Alterego Store had a physical presence but zero digital visibility. Sales depended 100% on foot traffic and word of mouth. No online catalog, no way to reach new customers outside their area.",
      solution:
        "We designed and developed an e-commerce with its own visual identity — bold, urban, and aspirational. Digital catalog with filters, mobile-optimized checkout, and a content strategy that built community from month one.",
      results: [
        { metric: "+340%", label: "Web traffic in 90 days" },
        { metric: "62%", label: "Sales from mobile" },
        { metric: "4.2×", label: "ROAS on Meta Ads" },
        { metric: "2,800+", label: "New followers" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Meta Ads", "Google Analytics"],
      quote: {
        text: "Fishert Studio completely transformed our digital presence. The result exceeded all our expectations and the team was exceptional at every stage.",
        author: "Carlos M. — Alterego Store",
      },
    },
  },
  "picapastos-vilar": {
    es: {
      title: "Picapastos y Molinos Vilar",
      tagline: "Presencia digital que refleja décadas de ingeniería agroindustrial.",
      img: "proj-picapastos.png",
      url: "www.picapastosymolinosvilar.com.co",
      industry: "Agroindustria",
      services: ["Desarrollo Web", "SEO"],
      problem:
        "Empresa con más de 20 años de trayectoria que operaba completamente sin presencia digital. Sus clientes la conocían por referidos, pero estaban perdiendo licitaciones y contratos ante competidores con mejor imagen online.",
      solution:
        "Construimos un sitio institucional robusto y confiable — catálogo de maquinaria técnico, ficha de cada producto, formulario de cotización y SEO optimizado para búsquedas B2B. La identidad visual refuerza la autoridad técnica de la marca.",
      results: [
        { metric: "1.ª", label: "Posición en Google local" },
        { metric: "+180%", label: "Consultas de cotización" },
        { metric: "0→100", label: "Presencia digital construida desde cero" },
        { metric: "3×", label: "Leads calificados al mes" },
      ],
      tech: ["React", "Vite", "SEO Técnico", "Google Search Console"],
      quote: {
        text: "Por primera vez tenemos una presencia que refleja la seriedad y calidad de nuestra empresa. Los clientes ya nos contactan directamente por la web.",
        author: "Equipo Vilar",
      },
    },
    en: {
      title: "Picapastos y Molinos Vilar",
      tagline: "Digital presence that reflects decades of agroindustrial engineering.",
      img: "proj-picapastos.png",
      url: "www.picapastosymolinosvilar.com.co",
      industry: "Agroindustry",
      services: ["Web Development", "SEO"],
      problem:
        "A company with over 20 years of experience operating with zero digital presence. Clients knew them by referral, but they were losing bids and contracts to competitors with a better online image.",
      solution:
        "We built a robust, trustworthy institutional site — technical machinery catalog, product sheets, quote request form, and SEO optimized for B2B searches. The visual identity reinforces the brand's technical authority.",
      results: [
        { metric: "1st", label: "Position on local Google" },
        { metric: "+180%", label: "Quote inquiries" },
        { metric: "0→100", label: "Digital presence built from scratch" },
        { metric: "3×", label: "Qualified leads per month" },
      ],
      tech: ["React", "Vite", "Technical SEO", "Google Search Console"],
      quote: {
        text: "For the first time we have a presence that reflects the seriousness and quality of our company. Clients now contact us directly through the website.",
        author: "Vilar Team",
      },
    },
  },
  "sgc-abogados": {
    es: {
      title: "SGC Abogados",
      tagline: "Confianza digital para una firma jurídica de alto perfil.",
      img: "proj-sgc.png",
      url: "www.sgcabogados.com.co",
      industry: "Servicios Jurídicos",
      services: ["Desarrollo Web", "Identidad Digital"],
      problem:
        "Firma de abogados reconocida localmente que necesitaba trasladar su reputación al mundo digital. El sector legal es altamente competitivo y los clientes toman decisiones basadas en la credibilidad percibida online antes de hacer cualquier contacto.",
      solution:
        "Diseñamos un sitio que transmite autoridad, confianza y profesionalismo desde el primer scroll. Paleta sobria, tipografía editorial, áreas de práctica claras y un sistema de contacto que filtra y califica leads antes de llegar al abogado.",
      results: [
        { metric: "+220%", label: "Tiempo en sitio vs. benchmark sector" },
        { metric: "38%", label: "Tasa de conversión formulario" },
        { metric: "Top 3", label: "Resultados Google para abogados locales" },
        { metric: "5★", label: "Promedio reseñas Google" },
      ],
      tech: ["React", "TypeScript", "SEO Local", "Google My Business"],
      quote: {
        text: "Profesionales, creativos y extremadamente puntuales. Lograron capturar la esencia de nuestra firma en un sitio que genera confianza desde el primer clic.",
        author: "Dra. Alejandra S. — SGC Abogados",
      },
    },
    en: {
      title: "SGC Abogados",
      tagline: "Digital trust for a high-profile legal firm.",
      img: "proj-sgc.png",
      url: "www.sgcabogados.com.co",
      industry: "Legal Services",
      services: ["Web Development", "Digital Identity"],
      problem:
        "A locally recognized law firm that needed to translate its reputation to the digital world. The legal sector is highly competitive and clients make decisions based on perceived online credibility before making any contact.",
      solution:
        "We designed a site that conveys authority, trust, and professionalism from the first scroll. Sober palette, editorial typography, clear practice areas, and a contact system that filters and qualifies leads before they reach the attorney.",
      results: [
        { metric: "+220%", label: "Time on site vs. sector benchmark" },
        { metric: "38%", label: "Form conversion rate" },
        { metric: "Top 3", label: "Google results for local lawyers" },
        { metric: "5★", label: "Average Google reviews" },
      ],
      tech: ["React", "TypeScript", "Local SEO", "Google My Business"],
      quote: {
        text: "Professional, creative, and extremely punctual. They captured the essence of our firm in a site that builds trust from the first click.",
        author: "Dr. Alejandra S. — SGC Abogados",
      },
    },
  },
  "dr-mario-sanchez": {
    es: {
      title: "Dr. Mario Sánchez",
      tagline: "Plataforma digital para un terapeuta respiratorio con vocación de enseñar.",
      img: "proj-mario.png",
      url: "dr-mario-sanchez-website-api-server-one.vercel.app",
      industry: "Salud",
      services: ["Desarrollo Web", "Desarrollo de Software"],
      problem:
        "El Dr. Mario Sánchez tenía conocimiento y experiencia que quería compartir, pero sin plataforma digital sus contenidos no llegaban a sus pacientes ni colegas. Necesitaba una presencia que combinara credibilidad médica con accesibilidad al usuario.",
      solution:
        "Desarrollamos un sitio profesional con blog de contenidos médicos, sección de servicios de terapia, formulario de citas y perfil institucional. Diseño limpio que balancea autoridad clínica y calidez humana.",
      results: [
        { metric: "+500", label: "Pacientes contactados digitalmente" },
        { metric: "65%", label: "Citas agendadas desde la web" },
        { metric: "4.8★", label: "Satisfacción paciente" },
        { metric: "3×", label: "Alcance de contenidos vs. antes" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Vercel"],
    },
    en: {
      title: "Dr. Mario Sánchez",
      tagline: "Digital platform for a respiratory therapist with a passion for teaching.",
      img: "proj-mario.png",
      url: "dr-mario-sanchez-website-api-server-one.vercel.app",
      industry: "Healthcare",
      services: ["Web Development", "Software Development"],
      problem:
        "Dr. Mario Sánchez had knowledge and experience he wanted to share, but without a digital platform his content wasn't reaching his patients or colleagues. He needed a presence that combined medical credibility with user accessibility.",
      solution:
        "We developed a professional site with a medical content blog, therapy services section, appointment form, and institutional profile. Clean design that balances clinical authority and human warmth.",
      results: [
        { metric: "+500", label: "Patients contacted digitally" },
        { metric: "65%", label: "Appointments booked online" },
        { metric: "4.8★", label: "Patient satisfaction" },
        { metric: "3×", label: "Content reach vs. before" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "Vercel"],
    },
  },
  "mi-tienda-go": {
    es: {
      title: "Mi Tienda Go",
      tagline: "SaaS de gestión de ventas para el comercio colombiano.",
      img: "proj-mitienda.png",
      url: "app.mitiendago.co",
      industry: "SaaS / Retail Tech",
      services: ["Desarrollo de Software", "Cloud y DevOps"],
      problem:
        "Los pequeños comerciantes colombianos perdían dinero por no tener control de su caja diaria, gastos e inventario. Las soluciones existentes eran complejas y costosas. Necesitaban algo tan simple como enviar un mensaje.",
      solution:
        "Construimos una plataforma SaaS de gestión de ventas con interfaz de chat — el comerciante registra ventas y gastos como si le escribiera a un asistente. Dashboard con reportes diarios, control de caja y alertas automáticas. Arquitectura cloud escalable desde el día uno.",
      results: [
        { metric: "200+", label: "Comerciantes activos" },
        { metric: "99.9%", label: "Uptime desde lanzamiento" },
        { metric: "4 min", label: "Tiempo promedio de onboarding" },
        { metric: "NPS 72", label: "Net Promoter Score" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "CI/CD"],
      quote: {
        text: "La mejor inversión que hemos hecho para nuestro negocio. El equipo de Fishert entiende perfectamente cómo traducir una idea en una solución digital que funciona.",
        author: "Juan P. — Picapastos y Molinos Vilar",
      },
    },
    en: {
      title: "Mi Tienda Go",
      tagline: "Sales management SaaS for Colombian retailers.",
      img: "proj-mitienda.png",
      url: "app.mitiendago.co",
      industry: "SaaS / Retail Tech",
      services: ["Software Development", "Cloud & DevOps"],
      problem:
        "Small Colombian merchants were losing money due to lack of control over their daily cash, expenses, and inventory. Existing solutions were complex and expensive. They needed something as simple as sending a message.",
      solution:
        "We built a SaaS sales management platform with a chat interface — the merchant registers sales and expenses like sending a message to an assistant. Dashboard with daily reports, cash control, and automatic alerts. Scalable cloud architecture from day one.",
      results: [
        { metric: "200+", label: "Active merchants" },
        { metric: "99.9%", label: "Uptime since launch" },
        { metric: "4 min", label: "Average onboarding time" },
        { metric: "NPS 72", label: "Net Promoter Score" },
      ],
      tech: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "CI/CD"],
      quote: {
        text: "The best investment we've made for our business. The Fishert team perfectly understands how to translate an idea into a digital solution that works.",
        author: "Juan P.",
      },
    },
  },
};

export default function CasoEstudio() {
  const params = useParams<{ slug: string }>();
  const { lang } = useLang();
  const slug = params.slug ?? "";
  const caseData = cases[slug];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!caseData) {
    return (
      <>
        <Navbar />
        <div className="svc-page-notfound">
          <Link href="/" className="svc-back-link" style={{ position: "static" }}>
            ← {lang === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const t = caseData[lang];
  const base = import.meta.env.BASE_URL || "/";

  return (
    <>
      <Navbar />
      <main className="case-page">

        {/* Hero */}
        <section className="case-hero">
          <img src={`${base}${t.img}`} alt={t.title} className="case-hero-img" />
          <div className="case-hero-overlay" />
          <div className="case-hero-content">
            <Link href="/" className="svc-back-link">
              ← {lang === "es" ? "Volver al inicio" : "Back to home"}
            </Link>
            <div className="case-hero-meta">
              <span className="case-hero-industry">{t.industry}</span>
              {t.services.map((s, i) => (
                <span key={i} className="case-hero-service">{s}</span>
              ))}
            </div>
            <h1 className="case-hero-title">{t.title}</h1>
            <p className="case-hero-tagline">{t.tagline}</p>
          </div>
        </section>

        {/* Results strip */}
        <section className="case-results-strip">
          {t.results.map((r, i) => (
            <div key={i} className="case-result-item">
              <span className="case-result-metric">{r.metric}</span>
              <span className="case-result-label">{r.label}</span>
            </div>
          ))}
        </section>

        {/* Problem / Solution */}
        <section className="case-body">
          <div className="case-body-inner">
            <div className="case-block">
              <p className="case-block-eyebrow">
                {lang === "es" ? "EL PROBLEMA" : "THE PROBLEM"}
              </p>
              <p className="case-block-text">{t.problem}</p>
            </div>
            <div className="case-block">
              <p className="case-block-eyebrow">
                {lang === "es" ? "LA SOLUCIÓN" : "THE SOLUTION"}
              </p>
              <p className="case-block-text">{t.solution}</p>
            </div>
          </div>
        </section>

        {/* Quote */}
        {t.quote && (
          <section className="case-quote-section">
            <blockquote className="case-quote">
              <p className="case-quote-text">"{t.quote.text}"</p>
              <footer className="case-quote-author">— {t.quote.author}</footer>
            </blockquote>
          </section>
        )}

        {/* Tech stack */}
        <section className="case-tech-section">
          <div className="case-tech-inner">
            <p className="case-block-eyebrow">
              {lang === "es" ? "TECNOLOGÍAS" : "TECH STACK"}
            </p>
            <div className="case-tech-list">
              {t.tech.map((tech, i) => (
                <span key={i} className="case-tech-tag">{tech}</span>
              ))}
            </div>
            <a
              href={`https://${t.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="case-live-link"
            >
              {lang === "es" ? "Ver proyecto en vivo →" : "View live project →"}
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="qs-cta">
          <h2 className="qs-cta-heading">
            {lang === "es" ? "¿Quieres un resultado así?" : "Want a result like this?"}
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
