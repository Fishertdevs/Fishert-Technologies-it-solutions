import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";

type Plan = {
  name: string;
  price: string;
  badge?: string;
  features: string[];
};

type ServiceData = {
  title: string;
  eyebrow: string;
  hero: string;
  intro: string;
  description: string;
  plans: Plan[];
};

const data: Record<string, { es: ServiceData; en: ServiceData }> = {
  "desarrollo-web": {
    es: {
      title: "Desarrollo Web",
      eyebrow: "SERVICIO",
      hero: "svc1_2.jpg",
      intro: "Sitios y aplicaciones web que convierten.",
      description:
        "Diseñamos y desarrollamos experiencias web con identidad propia — rápidas, responsivas y construidas para posicionarse. Desde landing pages de alto impacto hasta plataformas web complejas con integraciones, cada proyecto es único.",
      plans: [
        {
          name: "Starter",
          price: "$800",
          features: [
            "Landing page de alto impacto",
            "Diseño responsivo (mobile + desktop)",
            "SEO técnico básico",
            "Formulario de contacto funcional",
            "Dominio y hosting configurados",
            "1 mes de soporte post-entrega",
          ],
        },
        {
          name: "Professional",
          price: "$2.000",
          badge: "Más popular",
          features: [
            "Web corporativa multi-sección",
            "CMS para gestión de contenido",
            "SEO avanzado + velocidad optimizada",
            "Integraciones (analytics, chat, CRM)",
            "Blog o catálogo de productos",
            "3 meses de soporte y mantenimiento",
          ],
        },
        {
          name: "Enterprise",
          price: "A medida",
          features: [
            "Plataforma web de escala",
            "E-commerce o apps interactivas",
            "Arquitectura personalizada",
            "Integraciones API complejas",
            "Panel de administración a medida",
            "Soporte y mantenimiento continuo",
          ],
        },
      ],
    },
    en: {
      title: "Web Development",
      eyebrow: "SERVICE",
      hero: "svc1_2.jpg",
      intro: "Websites and web apps that convert.",
      description:
        "We design and develop web experiences with their own identity — fast, responsive, and built to rank. From high-impact landing pages to complex web platforms with integrations, every project is unique.",
      plans: [
        {
          name: "Starter",
          price: "$800",
          features: [
            "High-impact landing page",
            "Responsive design (mobile + desktop)",
            "Basic technical SEO",
            "Functional contact form",
            "Domain and hosting configured",
            "1 month post-delivery support",
          ],
        },
        {
          name: "Professional",
          price: "$2,000",
          badge: "Most popular",
          features: [
            "Multi-section corporate website",
            "CMS for content management",
            "Advanced SEO + optimized speed",
            "Integrations (analytics, chat, CRM)",
            "Blog or product catalog",
            "3 months of support & maintenance",
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          features: [
            "Scalable web platform",
            "E-commerce or interactive apps",
            "Custom architecture",
            "Complex API integrations",
            "Custom admin panel",
            "Continuous support & maintenance",
          ],
        },
      ],
    },
  },
  "desarrollo-software": {
    es: {
      title: "Desarrollo de Software",
      eyebrow: "SERVICIO",
      hero: "svc2_2.jpg",
      intro: "Software a medida que escala con tu negocio.",
      description:
        "Construimos soluciones de software desde cero, adaptadas exactamente a tu modelo de negocio. Plataformas SaaS, sistemas de gestión, aplicaciones móviles — diseñadas para crecer contigo y no limitarte.",
      plans: [
        {
          name: "MVP",
          price: "$3.000",
          features: [
            "App funcional con features core",
            "Backend + base de datos configurados",
            "Autenticación de usuarios",
            "Panel de administración básico",
            "Deploy en la nube incluido",
            "2 meses de desarrollo estimado",
          ],
        },
        {
          name: "Growth",
          price: "$8.000",
          badge: "Más popular",
          features: [
            "Plataforma con features completas",
            "Integraciones con servicios externos",
            "Panel de administración avanzado",
            "Notificaciones y automatizaciones",
            "Reportes y analítica integrada",
            "4 meses de desarrollo estimado",
          ],
        },
        {
          name: "Enterprise",
          price: "A medida",
          features: [
            "Plataforma de escala empresarial",
            "Arquitectura de microservicios",
            "Alta disponibilidad y redundancia",
            "Seguridad y auditorías",
            "SLA de soporte garantizado",
            "Equipo dedicado al proyecto",
          ],
        },
      ],
    },
    en: {
      title: "Software Development",
      eyebrow: "SERVICE",
      hero: "svc2_2.jpg",
      intro: "Custom software that scales with your business.",
      description:
        "We build software solutions from scratch, tailored exactly to your business model. SaaS platforms, management systems, mobile apps — designed to grow with you and never hold you back.",
      plans: [
        {
          name: "MVP",
          price: "$3,000",
          features: [
            "Functional app with core features",
            "Backend + database configured",
            "User authentication",
            "Basic admin panel",
            "Cloud deploy included",
            "Estimated 2-month build",
          ],
        },
        {
          name: "Growth",
          price: "$8,000",
          badge: "Most popular",
          features: [
            "Platform with full feature set",
            "External service integrations",
            "Advanced admin panel",
            "Notifications and automations",
            "Reporting and built-in analytics",
            "Estimated 4-month build",
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          features: [
            "Enterprise-scale platform",
            "Microservices architecture",
            "High availability & redundancy",
            "Security audits",
            "Guaranteed support SLA",
            "Dedicated project team",
          ],
        },
      ],
    },
  },
  "automatizacion-ia": {
    es: {
      title: "Automatización e IA",
      eyebrow: "SERVICIO",
      hero: "svc3_2.jpg",
      intro: "Elimina tareas repetitivas. Activa inteligencia real.",
      description:
        "Implementamos automatizaciones y soluciones de inteligencia artificial que liberan tiempo, reducen errores y permiten que tu equipo enfoque su energía en lo que realmente importa. Desde chatbots hasta modelos entrenados para tu industria.",
      plans: [
        {
          name: "Essentials",
          price: "$1.200",
          features: [
            "Automatización de 2–3 procesos clave",
            "Chatbot básico con IA (WhatsApp o web)",
            "Integración con tus herramientas actuales",
            "Flujos de trabajo automatizados",
            "Documentación y capacitación",
            "1 mes de soporte post-entrega",
          ],
        },
        {
          name: "Advanced",
          price: "$3.500",
          badge: "Más popular",
          features: [
            "Automatización end-to-end de operaciones",
            "Agente IA personalizado para tu negocio",
            "Procesamiento de documentos con IA",
            "Integraciones CRM, ERP o e-commerce",
            "Dashboard de métricas y control",
            "3 meses de soporte y mejora continua",
          ],
        },
        {
          name: "Custom",
          price: "A medida",
          features: [
            "Modelos de IA entrenados con tus datos",
            "Solución de IA enterprise a escala",
            "Automatización de cadenas completas",
            "Integración con infraestructura existente",
            "Mantenimiento y reentrenamiento",
            "Equipo de IA dedicado",
          ],
        },
      ],
    },
    en: {
      title: "Automation & AI",
      eyebrow: "SERVICE",
      hero: "svc3_2.jpg",
      intro: "Eliminate repetitive tasks. Activate real intelligence.",
      description:
        "We implement automations and AI solutions that free up time, reduce errors, and let your team focus their energy on what truly matters. From chatbots to models trained for your industry.",
      plans: [
        {
          name: "Essentials",
          price: "$1,200",
          features: [
            "Automation of 2–3 key processes",
            "Basic AI chatbot (WhatsApp or web)",
            "Integration with your current tools",
            "Automated workflows",
            "Documentation and training",
            "1 month post-delivery support",
          ],
        },
        {
          name: "Advanced",
          price: "$3,500",
          badge: "Most popular",
          features: [
            "End-to-end operations automation",
            "Custom AI agent for your business",
            "AI-powered document processing",
            "CRM, ERP or e-commerce integrations",
            "Metrics and control dashboard",
            "3 months of support and iteration",
          ],
        },
        {
          name: "Custom",
          price: "Custom",
          features: [
            "AI models trained on your data",
            "Enterprise-scale AI solution",
            "Full-chain automation",
            "Existing infrastructure integration",
            "Maintenance and retraining",
            "Dedicated AI team",
          ],
        },
      ],
    },
  },
  "marketing-digital": {
    es: {
      title: "Marketing Digital",
      eyebrow: "SERVICIO",
      hero: "svc4_2.jpg",
      intro: "Presencia digital que genera resultados medibles.",
      description:
        "Creamos estrategias de marketing digital orientadas a datos — no a vanity metrics. Desde la gestión de redes hasta campañas de pauta con ROI claro, combinamos creatividad y análisis para hacer crecer tu marca.",
      plans: [
        {
          name: "Starter",
          price: "$500 / mes",
          features: [
            "Gestión de 2 redes sociales",
            "12 publicaciones mensuales",
            "Diseño de contenido visual",
            "Informe mensual de resultados",
            "Asesoría estratégica básica",
            "Respuesta a comentarios incluida",
          ],
        },
        {
          name: "Growth",
          price: "$1.200 / mes",
          badge: "Más popular",
          features: [
            "Gestión de 4 redes sociales",
            "Campañas de Meta Ads + Google Ads",
            "SEO on-page y off-page",
            "Email marketing automatizado",
            "Contenido premium (reels, stories)",
            "Reportes quincenales con KPIs",
          ],
        },
        {
          name: "Full",
          price: "$2.500 / mes",
          features: [
            "Estrategia de marketing 360°",
            "Performance marketing avanzado",
            "Producción de contenido audiovisual",
            "Branding y comunicación de marca",
            "Consultoría de posicionamiento",
            "Account manager dedicado",
          ],
        },
      ],
    },
    en: {
      title: "Digital Marketing",
      eyebrow: "SERVICE",
      hero: "svc4_2.jpg",
      intro: "Digital presence that generates measurable results.",
      description:
        "We build data-driven digital marketing strategies — not vanity metrics. From social media management to ad campaigns with clear ROI, we combine creativity and analysis to grow your brand.",
      plans: [
        {
          name: "Starter",
          price: "$500 / mo",
          features: [
            "Management of 2 social networks",
            "12 monthly posts",
            "Visual content design",
            "Monthly results report",
            "Basic strategic advisory",
            "Comment responses included",
          ],
        },
        {
          name: "Growth",
          price: "$1,200 / mo",
          badge: "Most popular",
          features: [
            "Management of 4 social networks",
            "Meta Ads + Google Ads campaigns",
            "On-page and off-page SEO",
            "Automated email marketing",
            "Premium content (reels, stories)",
            "Bi-weekly KPI reports",
          ],
        },
        {
          name: "Full",
          price: "$2,500 / mo",
          features: [
            "360° marketing strategy",
            "Advanced performance marketing",
            "Audiovisual content production",
            "Brand communication & branding",
            "Positioning consultancy",
            "Dedicated account manager",
          ],
        },
      ],
    },
  },
  "cloud-devops": {
    es: {
      title: "Cloud y DevOps",
      eyebrow: "SERVICIO",
      hero: "svc5_2.jpg",
      intro: "Infraestructura sólida. Deploys sin fricción.",
      description:
        "Diseñamos, migramos y gestionamos infraestructuras cloud que escalan sin sorpresas. Implementamos pipelines CI/CD, monitoreo proactivo y prácticas DevOps para que tu equipo entregue software más rápido y con más confianza.",
      plans: [
        {
          name: "Essential",
          price: "$800",
          features: [
            "Configuración de servidor en la nube",
            "Pipeline CI/CD básico",
            "Monitoreo de uptime y alertas",
            "Certificados SSL y seguridad base",
            "Backups automáticos",
            "1 mes de soporte incluido",
          ],
        },
        {
          name: "Professional",
          price: "$2.000",
          badge: "Más popular",
          features: [
            "Infraestructura cloud completa",
            "CI/CD avanzado con tests automatizados",
            "Escalado automático (auto-scaling)",
            "Seguridad y compliance básico",
            "Logs centralizados y trazabilidad",
            "3 meses de gestión y soporte",
          ],
        },
        {
          name: "Enterprise",
          price: "A medida",
          features: [
            "Arquitectura multi-cloud o híbrida",
            "Alta disponibilidad y disaster recovery",
            "Seguridad avanzada y auditorías",
            "SLA de uptime garantizado",
            "Equipo DevOps dedicado",
            "Gestión y mantenimiento continuo",
          ],
        },
      ],
    },
    en: {
      title: "Cloud & DevOps",
      eyebrow: "SERVICE",
      hero: "svc5_2.jpg",
      intro: "Solid infrastructure. Frictionless deploys.",
      description:
        "We design, migrate, and manage cloud infrastructures that scale without surprises. We implement CI/CD pipelines, proactive monitoring, and DevOps practices so your team ships software faster and with more confidence.",
      plans: [
        {
          name: "Essential",
          price: "$800",
          features: [
            "Cloud server configuration",
            "Basic CI/CD pipeline",
            "Uptime monitoring and alerts",
            "SSL certificates and base security",
            "Automatic backups",
            "1 month of support included",
          ],
        },
        {
          name: "Professional",
          price: "$2,000",
          badge: "Most popular",
          features: [
            "Complete cloud infrastructure",
            "Advanced CI/CD with automated tests",
            "Auto-scaling",
            "Security and basic compliance",
            "Centralized logs and traceability",
            "3 months of management and support",
          ],
        },
        {
          name: "Enterprise",
          price: "Custom",
          features: [
            "Multi-cloud or hybrid architecture",
            "High availability and disaster recovery",
            "Advanced security and audits",
            "Guaranteed uptime SLA",
            "Dedicated DevOps team",
            "Continuous management and maintenance",
          ],
        },
      ],
    },
  },
};

export default function ServicioDetalle() {
  const params = useParams<{ slug: string }>();
  const { lang } = useLang();
  const slug = params.slug ?? "";
  const service = data[slug];

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!service) {
    return (
      <>
        <Navbar />
        <div className="svc-page-notfound">
          <p>{lang === "es" ? "Servicio no encontrado." : "Service not found."}</p>
          <Link href="/" className="svc-back-link">
            ← {lang === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const t = service[lang];
  const base = import.meta.env.BASE_URL || "/";

  return (
    <>
      <Navbar />
      <main className="svc-page">

        {/* ── Hero ── */}
        <section className="svc-page-hero">
          <img src={`${base}${t.hero}`} alt={t.title} className="svc-page-hero-img" />
          <div className="svc-page-hero-overlay" />
          <div className="svc-page-hero-content">
            <Link href="/" className="svc-back-link">
              ← {lang === "es" ? "Volver al inicio" : "Back to home"}
            </Link>
            <p className="svc-page-eyebrow">{t.eyebrow}</p>
            <h1 className="svc-page-title">{t.title}</h1>
            <p className="svc-page-intro">{t.intro}</p>
          </div>
        </section>

        {/* ── Description ── */}
        <section className="svc-page-desc">
          <p>{t.description}</p>
        </section>

        {/* ── Plans ── */}
        <section className="svc-page-plans">
          <p className="svc-plans-eyebrow">
            {lang === "es" ? "PLANES" : "PLANS"}
          </p>
          <h2 className="svc-plans-heading">
            {lang === "es" ? "Elige tu plan." : "Choose your plan."}
          </h2>
          <div className="svc-plans-grid">
            {t.plans.map((plan, i) => (
              <div key={i} className={`svc-plan-card${plan.badge ? " svc-plan-card--featured" : ""}`}>
                {plan.badge && (
                  <span className="svc-plan-badge">{plan.badge}</span>
                )}
                <p className="svc-plan-name">{plan.name}</p>
                <p className="svc-plan-price">{plan.price}</p>
                <ul className="svc-plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/#contacto" className="svc-plan-cta">
                  {lang === "es" ? "Iniciar proyecto" : "Start project"}
                </a>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
