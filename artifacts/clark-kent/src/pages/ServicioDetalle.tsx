import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { Link, useParams } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { buildInfoHref } from "../utils/whatsapp";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServicioDetalle.css";

type Plan = {
  name: string;
  price: string;
  currency?: string;
  period?: string;
  badge?: string;
  features: string[];
  isCustom?: boolean;
};

type ServiceData = {
  title: string;
  eyebrow: string;
  hero: string;
  intro: string;
  description: string;
  plans: Plan[];
};

type LocalizedCopy = {
  es: string;
  en: string;
};

type PlatformIconName =
  | "wordpress"
  | "shopify"
  | "woocommerce"
  | "custom"
  | "mvp"
  | "saas"
  | "api"
  | "mobile"
  | "ai"
  | "automation"
  | "crm"
  | "data"
  | "strategy"
  | "content"
  | "ads"
  | "analytics"
  | "cloud"
  | "pipeline"
  | "observability"
  | "security";

type PlatformDetail = {
  icon: PlatformIconName;
  es: string;
  en: string;
};

type ServiceContext = {
  contextLabel: LocalizedCopy;
  items: {
    es: string[];
    en: string[];
  };
  pricingTitle: LocalizedCopy;
  pricingSub: LocalizedCopy;
  offerHeadline: LocalizedCopy;
};

const serviceContexts: Record<string, ServiceContext> = {
  "desarrollo-web": {
    contextLabel: {
      es: "Un stack pensado para hacer crecer tu negocio",
      en: "A stack designed to grow your business",
    },
    items: {
      es: ["WordPress", "Shopify", "WooCommerce", "Desarrollo a medida"],
      en: ["WordPress", "Shopify", "WooCommerce", "Custom development"],
    },
    pricingTitle: {
      es: "Tu próxima versión empieza aquí.",
      en: "Your next version starts here.",
    },
    pricingSub: {
      es: "Cuéntanos qué quieres construir y te recomendamos el camino correcto.",
      en: "Tell us what you want to build and we'll recommend the right path.",
    },
    offerHeadline: {
      es: "Tu próxima versión empieza hoy.",
      en: "Your next version starts today.",
    },
  },
  "desarrollo-software": {
    contextLabel: {
      es: "Tecnología de producto para convertir visión en escala",
      en: "Product technology that turns vision into scale",
    },
    items: {
      es: ["MVPs", "SaaS", "APIs e integraciones", "Apps móviles"],
      en: ["MVPs", "SaaS", "APIs & integrations", "Mobile apps"],
    },
    pricingTitle: {
      es: "Construye el producto que tu negocio necesita.",
      en: "Build the product your business needs.",
    },
    pricingSub: {
      es: "Un equipo de producto para convertir una oportunidad en tecnología real.",
      en: "A product team to turn an opportunity into real technology.",
    },
    offerHeadline: {
      es: "De la idea al primer release.",
      en: "From idea to your first release.",
    },
  },
  "automatizacion-ia": {
    contextLabel: {
      es: "Sistemas inteligentes que multiplican el trabajo de tu equipo",
      en: "Intelligent systems that multiply your team's capacity",
    },
    items: {
      es: ["Agentes IA", "RPA y workflows", "CRM y ERP", "Datos inteligentes"],
      en: ["AI agents", "RPA & workflows", "CRM & ERP", "Intelligent data"],
    },
    pricingTitle: {
      es: "Haz que tu operación piense mejor.",
      en: "Make your operations think smarter.",
    },
    pricingSub: {
      es: "Detectamos dónde se pierde tiempo y diseñamos una automatización que sí se usa.",
      en: "We find where time is lost and design automation your team will actually use.",
    },
    offerHeadline: {
      es: "Menos tareas repetitivas. Más espacio para crecer.",
      en: "Less repetition. More room to grow.",
    },
  },
  "marketing-digital": {
    contextLabel: {
      es: "Creatividad, distribución y datos en un mismo sistema",
      en: "Creativity, distribution, and data in one system",
    },
    items: {
      es: ["Estrategia", "Contenido", "Paid media", "Analítica"],
      en: ["Strategy", "Content", "Paid media", "Analytics"],
    },
    pricingTitle: {
      es: "Haz que tu marca se note y convierta.",
      en: "Make your brand stand out and convert.",
    },
    pricingSub: {
      es: "Creatividad, distribución y datos trabajando juntos para mover tu negocio.",
      en: "Creativity, distribution, and data working together to move your business.",
    },
    offerHeadline: {
      es: "Tu marca merece una campaña que se recuerde.",
      en: "Your brand deserves a campaign people remember.",
    },
  },
  "cloud-devops": {
    contextLabel: {
      es: "La infraestructura que hace confiable cada lanzamiento",
      en: "The infrastructure behind every reliable launch",
    },
    items: {
      es: ["Cloud", "CI/CD", "Observabilidad", "Seguridad"],
      en: ["Cloud", "CI/CD", "Observability", "Security"],
    },
    pricingTitle: {
      es: "Entrega más rápido. Opera con confianza.",
      en: "Ship faster. Operate with confidence.",
    },
    pricingSub: {
      es: "Diseñamos la base técnica para que tu producto crezca sin fricción.",
      en: "We design the technical foundation for your product to grow without friction.",
    },
    offerHeadline: {
      es: "Tu próximo lanzamiento no debería esperar.",
      en: "Your next launch should not have to wait.",
    },
  },
};

const platformDetails: Record<string, PlatformDetail> = {
  WordPress: {
    icon: "wordpress",
    es: "Contenido flexible y una presencia editorial lista para evolucionar.",
    en: "Flexible content and an editorial presence built to evolve.",
  },
  Shopify: {
    icon: "shopify",
    es: "E-commerce ágil para vender mejor, sin fricción operativa.",
    en: "Agile e-commerce built to sell better, without operational friction.",
  },
  WooCommerce: {
    icon: "woocommerce",
    es: "Comercio conectado a tu marca, catálogo y forma de trabajar.",
    en: "Commerce connected to your brand, catalog, and way of working.",
  },
  "Desarrollo a medida": {
    icon: "custom",
    es: "Producto digital diseñado alrededor de tus procesos y objetivos.",
    en: "A digital product designed around your processes and goals.",
  },
  "Custom development": {
    icon: "custom",
    es: "A digital product designed around your processes and goals.",
    en: "A digital product designed around your processes and goals.",
  },
  MVPs: {
    icon: "mvp",
    es: "La versión esencial para validar una oportunidad con velocidad.",
    en: "The essential version to validate an opportunity with speed.",
  },
  SaaS: {
    icon: "saas",
    es: "Productos escalables con una experiencia pensada para retener.",
    en: "Scalable products with an experience designed for retention.",
  },
  "APIs e integraciones": {
    icon: "api",
    es: "Sistemas que se conectan para que el negocio fluya mejor.",
    en: "Systems that connect so your business can move better.",
  },
  "APIs & integrations": {
    icon: "api",
    es: "Sistemas que se conectan para que el negocio fluya mejor.",
    en: "Connected systems that keep your business moving better.",
  },
  "Apps móviles": {
    icon: "mobile",
    es: "Experiencias móviles útiles, rápidas y hechas para el uso real.",
    en: "Useful, fast mobile experiences made for real-world use.",
  },
  "Mobile apps": {
    icon: "mobile",
    es: "Experiencias móviles útiles, rápidas y hechas para el uso real.",
    en: "Useful, fast mobile experiences made for real-world use.",
  },
  "Agentes IA": {
    icon: "ai",
    es: "Asistentes que entienden el contexto y actúan por tu equipo.",
    en: "Assistants that understand context and act for your team.",
  },
  "AI agents": {
    icon: "ai",
    es: "Asistentes que entienden el contexto y actúan por tu equipo.",
    en: "Context-aware assistants that act for your team.",
  },
  "RPA y workflows": {
    icon: "automation",
    es: "Flujos automáticos para eliminar trabajo repetitivo y errores.",
    en: "Automated workflows that remove repetitive work and errors.",
  },
  "RPA & workflows": {
    icon: "automation",
    es: "Flujos automáticos para eliminar trabajo repetitivo y errores.",
    en: "Automated workflows that remove repetitive work and errors.",
  },
  "CRM y ERP": {
    icon: "crm",
    es: "Operaciones conectadas para tomar decisiones con una sola verdad.",
    en: "Connected operations with one source of truth for decisions.",
  },
  "CRM & ERP": {
    icon: "crm",
    es: "Operaciones conectadas para tomar decisiones con una sola verdad.",
    en: "Connected operations with one source of truth for decisions.",
  },
  "Datos inteligentes": {
    icon: "data",
    es: "Datos convertidos en señales claras para actuar a tiempo.",
    en: "Data turned into clear signals so you can act in time.",
  },
  "Intelligent data": {
    icon: "data",
    es: "Datos convertidos en señales claras para actuar a tiempo.",
    en: "Data turned into clear signals so you can act in time.",
  },
  Estrategia: {
    icon: "strategy",
    es: "Una dirección clara para que cada acción tenga propósito.",
    en: "A clear direction so every action has a purpose.",
  },
  Strategy: {
    icon: "strategy",
    es: "Una dirección clara para que cada acción tenga propósito.",
    en: "A clear direction so every action has a purpose.",
  },
  Contenido: {
    icon: "content",
    es: "Ideas que construyen reconocimiento y conversación alrededor de tu marca.",
    en: "Ideas that build recognition and conversation around your brand.",
  },
  Content: {
    icon: "content",
    es: "Ideas que construyen reconocimiento y conversación alrededor de tu marca.",
    en: "Ideas that build recognition and conversation around your brand.",
  },
  "Paid media": {
    icon: "ads",
    es: "Inversión distribuida con intención, medición y aprendizaje continuo.",
    en: "Intentional media investment powered by measurement and learning.",
  },
  Analítica: {
    icon: "analytics",
    es: "Métricas que revelan qué mover para crecer con criterio.",
    en: "Metrics that reveal what to move to grow with intention.",
  },
  Analytics: {
    icon: "analytics",
    es: "Métricas que revelan qué mover para crecer con criterio.",
    en: "Metrics that reveal what to move to grow with intention.",
  },
  Cloud: {
    icon: "cloud",
    es: "Una base flexible para operar con velocidad y confianza.",
    en: "A flexible foundation to operate with speed and confidence.",
  },
  "CI/CD": {
    icon: "pipeline",
    es: "Entregas frecuentes y seguras, desde el commit hasta producción.",
    en: "Frequent, safer releases from commit to production.",
  },
  Observabilidad: {
    icon: "observability",
    es: "Visibilidad real para detectar y resolver antes de afectar al usuario.",
    en: "Real visibility to detect and resolve issues before users feel them.",
  },
  Observability: {
    icon: "observability",
    es: "Visibilidad real para detectar y resolver antes de afectar al usuario.",
    en: "Real visibility to detect and resolve issues before users feel them.",
  },
  Seguridad: {
    icon: "security",
    es: "Protección integrada para que cada lanzamiento nazca preparado.",
    en: "Built-in protection so every launch starts prepared.",
  },
  Security: {
    icon: "security",
    es: "Protección integrada para que cada lanzamiento nazca preparado.",
    en: "Built-in protection so every launch starts prepared.",
  },
};

function PlatformIcon({ name }: { name: PlatformIconName }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "wordpress":
      return <svg {...commonProps}><circle cx="12" cy="12" r="8.5" /><path d="m6.3 8.2 2.8 8.1 1.8-5.3 1.9 5.3 3-8.1M8.2 8.2h2.1M14.2 8.2h1.9" /></svg>;
    case "shopify":
      return <svg {...commonProps}><path d="M6.8 8.5h10.4l-1 10.2H7.8L6.8 8.5Z" /><path d="M9.2 8.5C9.2 5.2 14.8 5.2 14.8 8.5M11.1 12.1c.6-.7 2.1-.6 2.4.3.3 1-1.2 1.1-1.2 2.2 0 .6.5 1 .9 1.2" /></svg>;
    case "woocommerce":
      return <svg {...commonProps}><rect x="4.2" y="5" width="15.6" height="14" rx="3" /><path d="M7.4 10.2c.4 3.2 1.1 5 2.2 5 .9 0 1.5-2.4 2.2-4.2.7 1.8 1.3 4.2 2.2 4.2 1.1 0 1.8-1.8 2.3-5" /></svg>;
    case "custom":
      return <svg {...commonProps}><path d="m8.5 5-4 7 4 7M15.5 5l4 7-4 7M13.5 4.5l-3 15" /></svg>;
    case "mvp":
      return <svg {...commonProps}><path d="M8.5 4.5h7M9 4.5v3l-3.8 8.2a2.3 2.3 0 0 0 2.1 3.3h9.4a2.3 2.3 0 0 0 2.1-3.3L15 7.5v-3M7.5 14h9" /><path d="m12 10 .7 1.4 1.5.2-1.1 1.1.3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1.1 1.5-.2L12 10Z" /></svg>;
    case "saas":
      return <svg {...commonProps}><path d="m12 4 7 3.5-7 3.5-7-3.5L12 4Z" /><path d="m5 11 7 3.5 7-3.5M5 14.5l7 3.5 7-3.5" /></svg>;
    case "api":
      return <svg {...commonProps}><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="m7.8 11 8.4-4M7.8 13l8.4 4" /></svg>;
    case "mobile":
      return <svg {...commonProps}><rect x="7" y="3.5" width="10" height="17" rx="2" /><path d="M10.5 6h3M11 17.5h2" /></svg>;
    case "ai":
      return <svg {...commonProps}><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3ZM18 15l.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" /></svg>;
    case "automation":
      return <svg {...commonProps}><rect x="4" y="5" width="5" height="4" rx="1" /><rect x="15" y="5" width="5" height="4" rx="1" /><rect x="9.5" y="15" width="5" height="4" rx="1" /><path d="M6.5 9v2.5h11V9M12 11.5V15" /></svg>;
    case "crm":
      return <svg {...commonProps}><circle cx="9" cy="8" r="2.5" /><circle cx="16.5" cy="9" r="2" /><path d="M4.5 18c.5-3 2.2-4.5 4.5-4.5s4 1.5 4.5 4.5M14.5 14.5c2.8-.4 4.3.9 5 3.5" /></svg>;
    case "data":
      return <svg {...commonProps}><ellipse cx="12" cy="6" rx="6.5" ry="2.5" /><path d="M5.5 6v6c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V6M5.5 12v6c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-6" /></svg>;
    case "strategy":
      return <svg {...commonProps}><circle cx="12" cy="12" r="8" /><path d="m14.8 9.2-2 4.2-4.2 2 2-4.2 4.2-2ZM12 4v2M20 12h-2M12 20v-2M4 12h2" /></svg>;
    case "content":
      return <svg {...commonProps}><path d="m5 17.8-.8 2.2 2.2-.8L18.7 7a2.1 2.1 0 0 0-3-3L5 15.8v2Z" /><path d="m13.8 5.8 3 3" /></svg>;
    case "ads":
      return <svg {...commonProps}><path d="M4 10.2a2 2 0 0 1 2-2h4l7-3v13l-7-3H6a2 2 0 0 1-2-2v-3Z" /><path d="M7 15.2 8.3 20h2.2l-1.2-4.8M20 9a3 3 0 0 1 0 6" /></svg>;
    case "analytics":
      return <svg {...commonProps}><path d="M5 19V5M5 19h15" /><path d="m8 15 3-3 2.2 1.5L18.5 8" /></svg>;
    case "cloud":
      return <svg {...commonProps}><path d="M7.3 18.5h9.8a3.7 3.7 0 0 0 .5-7.4A5.8 5.8 0 0 0 6.5 9.7a4.4 4.4 0 0 0 .8 8.8Z" /></svg>;
    case "pipeline":
      return <svg {...commonProps}><circle cx="6" cy="6" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="6" cy="18" r="2" /><path d="M8 6h4a3 3 0 0 1 3 3v1M8 18h4a3 3 0 0 0 3-3v-1" /></svg>;
    case "observability":
      return <svg {...commonProps}><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" /><circle cx="12" cy="12" r="2.3" /></svg>;
    case "security":
      return <svg {...commonProps}><path d="M12 3.5 19 6v5.3c0 4.5-2.8 7.8-7 9.2-4.2-1.4-7-4.7-7-9.2V6l7-2.5Z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
}

const data: Record<string, { es: ServiceData; en: ServiceData }> = {
  "desarrollo-web": {
    es: {
      title: "Desarrollo Web",
      eyebrow: "SERVICIO",
      hero: "svc1_2.jpg",
      intro: "Diseño, desarrollo y estrategia para que tu negocio venda mejor en digital.",
      description:
        "Diseñamos y desarrollamos experiencias web con identidad propia — rápidas, responsivas y construidas para posicionarse. Desde landing pages de alto impacto hasta plataformas web complejas con integraciones, cada proyecto es único.",
      plans: [
        {
          name: "Starter",
          price: "3.500.000",
          currency: "COP",
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
          price: "8.500.000",
          currency: "COP",
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
          price: "Desde $15.000.000 COP",
          isCustom: true,
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
      intro: "Design, development, and strategy to help your business sell better online.",
      description:
        "We design and develop web experiences with their own identity — fast, responsive, and built to rank. From high-impact landing pages to complex web platforms with integrations, every project is unique.",
      plans: [
        {
          name: "Starter",
          price: "3,500,000",
          currency: "COP",
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
          price: "8,500,000",
          currency: "COP",
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
          price: "From $15,000,000 COP",
          isCustom: true,
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
          price: "15.000.000",
          currency: "COP",
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
          price: "35.000.000",
          currency: "COP",
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
          price: "Desde $60.000.000 COP",
          isCustom: true,
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
          price: "15,000,000",
          currency: "COP",
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
          price: "35,000,000",
          currency: "COP",
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
          price: "From $60,000,000 COP",
          isCustom: true,
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
          price: "5.000.000",
          currency: "COP",
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
          price: "15.000.000",
          currency: "COP",
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
          price: "Desde $30.000.000 COP",
          isCustom: true,
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
          price: "5,000,000",
          currency: "COP",
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
          price: "15,000,000",
          currency: "COP",
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
          price: "From $30,000,000 COP",
          isCustom: true,
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
          price: "2.500.000",
          currency: "COP",
          period: "/ mes",
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
          price: "5.000.000",
          currency: "COP",
          period: "/ mes",
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
          price: "10.000.000",
          currency: "COP",
          period: "/ mes",
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
          price: "2,500,000",
          currency: "COP",
          period: "/ mo",
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
          price: "5,000,000",
          currency: "COP",
          period: "/ mo",
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
          price: "10,000,000",
          currency: "COP",
          period: "/ mo",
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
          price: "3.500.000",
          currency: "COP",
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
          price: "8.500.000",
          currency: "COP",
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
          price: "Desde $20.000.000 COP",
          isCustom: true,
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
          price: "3,500,000",
          currency: "COP",
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
          price: "8,500,000",
          currency: "COP",
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
          price: "From $20,000,000 COP",
          isCustom: true,
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
  const [billingMode, setBillingMode] = useState<"monthly" | "annual">("monthly");
  const [activePlan, setActivePlan] = useState(0);
  const planTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!service) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const motionTargets = [
        ".svc2-hero-content > *",
        ".svc2-desc-text",
        ".svc2-pricing-title",
        ".svc2-pricing-sub",
        ".svc2-cycle-row",
        ".svc2-month-offer-copy > *",
        ".svc2-month-offer-link",
      ];
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(motionTargets, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(".svc2-hero-content > *", { y: 30, opacity: 0 });
      gsap.set(".svc2-desc-text", { y: 40, opacity: 0 });
      gsap.set(
        [
          ".svc2-pricing-title",
          ".svc2-pricing-sub",
          ".svc2-cycle-row",
          ".svc2-month-offer-copy > *",
          ".svc2-month-offer-link",
        ],
        { y: 26, opacity: 0 },
      );

      gsap.to(".svc2-hero-content > *", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(".svc2-desc-text", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".svc2-desc-section",
          start: "top 80%",
        },
      });

      gsap.to(
        [
          ".svc2-pricing-title",
          ".svc2-pricing-sub",
          ".svc2-cycle-row",
          ".svc2-month-offer-copy > *",
          ".svc2-month-offer-link",
        ],
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".svc2-pricing-section",
            start: "top 78%",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [slug, service]);

  useEffect(() => {
    if (!service) return;

    const activeCard = document.querySelector(".svc2-plan-card--active");
    if (!activeCard) return;

    const textTargets = activeCard.querySelectorAll<HTMLElement>(
      ".svc2-plan-name, .svc2-plan-price-wrap, .svc2-plan-tagline, .svc2-plan-divider, .svc2-plan-feature, .svc2-plan-cta",
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(textTargets, { y: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      textTargets,
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.045,
        ease: "power3.out",
      },
    );

    return () => {
      tween.kill();
    };
  }, [activePlan, service]);

  if (!service) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20vh 48px", textAlign: "center" }}>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", color: "#111" }}>
            {lang === "es" ? "Servicio no encontrado." : "Service not found."}
          </p>
          <Link href="/" style={{ color: "#C0001A", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, textDecoration: "none" }}>
            ← {lang === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const t = service[lang];
  const context = serviceContexts[slug];
  const isRecurring = slug === "marketing-digital";

  const formatPlanPrice = (plan: Plan) => {
    if (plan.isCustom || !isRecurring || billingMode === "monthly") {
      return plan.price;
    }

    const monthlyPrice = Number(plan.price.replace(/[^\d]/g, ""));
    return new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US").format(monthlyPrice * 0.8);
  };

  const planPeriod = (plan: Plan) => {
    if (plan.isCustom) return "";
    if (!isRecurring) return "";
    if (billingMode === "annual") {
      return lang === "es" ? "/ mes, cobrado anual" : "/ mo, billed annually";
    }
    return plan.period || (lang === "es" ? "/ mes" : "/ mo");
  };

  const planTagline = (plan: Plan) => {
    const taglines = lang === "es"
      ? {
          Starter: "Una solución enfocada para lanzar tu presencia digital con una base sólida, clara y lista para crecer.",
          Professional: "Una experiencia digital completa para posicionar tu marca, conectar con tus clientes y convertir mejor.",
          Enterprise: "Una plataforma diseñada alrededor de tus procesos para resolver retos complejos y escalar con control.",
          MVP: "Valida tu oportunidad con un producto funcional, enfocado en aprender rápido y construir sobre bases firmes.",
          Growth: "La capacidad de producto que necesitas para consolidar operaciones, integrar herramientas y acelerar tu crecimiento.",
          Essentials: "Empieza a automatizar los procesos que más tiempo consumen y libera a tu equipo para tareas de mayor valor.",
          Advanced: "Una capa inteligente para coordinar operaciones, reducir fricción y convertir datos en decisiones más rápidas.",
          Custom: "Ingeniería especializada para diseñar una solución alineada con tus procesos, objetivos y visión de largo plazo.",
          Full: "Una estrategia conectada de contenido, medios y analítica para construir demanda y convertir atención en resultados.",
          Essential: "Una base cloud confiable para desplegar con seguridad, monitorear tu operación y mantenerla siempre disponible.",
        }
      : {
          Starter: "A focused solution to launch your digital presence on a clear, solid foundation built to grow.",
          Professional: "A complete digital experience to position your brand, connect with customers, and convert better.",
          Enterprise: "A platform designed around your processes to solve complex challenges and scale with control.",
          MVP: "Validate your opportunity with a functional product built to learn quickly and grow on solid foundations.",
          Growth: "The product capacity you need to consolidate operations, integrate tools, and accelerate growth.",
          Essentials: "Start automating the processes that consume the most time and free your team for higher-value work.",
          Advanced: "An intelligent layer to coordinate operations, reduce friction, and turn data into faster decisions.",
          Custom: "Specialized engineering for a solution aligned with your processes, goals, and long-term vision.",
          Full: "A connected strategy across content, media, and analytics to build demand and turn attention into results.",
          Essential: "A reliable cloud foundation to deploy securely, monitor operations, and stay consistently available.",
        };

    return taglines[plan.name as keyof typeof taglines] ?? (
      lang === "es"
        ? "Una solución profesional diseñada para tu siguiente etapa."
        : "A professional solution designed for your next stage."
    );
  };

  const handlePlanTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    planTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handlePlanTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = planTouchStartX.current;
    planTouchStartX.current = null;
    const endX = event.changedTouches[0]?.clientX;
    if (startX === null || endX === undefined) return;

    const deltaX = startX - endX;
    if (Math.abs(deltaX) < 40) return;
    setActivePlan((current) => (
      deltaX > 0
        ? (current + 1) % t.plans.length
        : (current - 1 + t.plans.length) % t.plans.length
    ));
  };

  return (
    <>
      <Navbar />
      <main className="svc2-container">
        {/* ── Hero ── */}
        <header className="svc2-hero">
          <div className="svc2-hero-content">
            <div className="svc2-title-wrap">
              <span className="svc2-eyebrow">{t.eyebrow}</span>
              <h1 className={`svc2-title ${t.title.length > 18 ? "svc2-title--compact" : ""}`}>{t.title}</h1>
            </div>
            <p className="svc2-intro">{t.intro}</p>
          </div>
        </header>

        {/* ── Description ── */}
        <section className="svc2-desc-section">
          <div className="svc2-desc-inner">
            <h2 className="svc2-desc-text">{t.description}</h2>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="svc2-pricing-section">
          <div className="svc2-pricing-header">
            <h3 className="svc2-pricing-title">
              {context.pricingTitle[lang]}
            </h3>
            <p className="svc2-pricing-sub">
              {context.pricingSub[lang]}
            </p>
            <div className="svc2-cycle-row">
              {isRecurring ? (
                <>
                  <div className="svc2-cycle-toggle" role="group" aria-label={lang === "es" ? "Frecuencia de pago" : "Billing frequency"}>
                    <button
                      type="button"
                      className={billingMode === "monthly" ? "svc2-cycle-option svc2-cycle-option--active" : "svc2-cycle-option"}
                      aria-pressed={billingMode === "monthly"}
                      onClick={() => setBillingMode("monthly")}
                    >
                      {lang === "es" ? "Mensual" : "Monthly"}
                    </button>
                    <button
                      type="button"
                      className={billingMode === "annual" ? "svc2-cycle-option svc2-cycle-option--active" : "svc2-cycle-option"}
                      aria-pressed={billingMode === "annual"}
                      onClick={() => setBillingMode("annual")}
                    >
                      {lang === "es" ? "Anual" : "Annual"}
                    </button>
                  </div>
                  {billingMode === "annual" && (
                    <span className="svc2-annual-note">
                      {lang === "es" ? "20% OFF, eso es 2 meses GRATIS" : "20% OFF, that's 2 months FREE"}
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="svc2-plans-carousel">
            <button
              type="button"
              className="svc2-plan-arrow svc2-plan-arrow--previous"
              aria-label={lang === "es" ? "Plan anterior" : "Previous plan"}
              onClick={() => setActivePlan((current) => (current - 1 + t.plans.length) % t.plans.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div
              className="svc2-plans-grid"
              onTouchStart={handlePlanTouchStart}
              onTouchEnd={handlePlanTouchEnd}
              onTouchCancel={() => {
                planTouchStartX.current = null;
              }}
            >
              {t.plans.map((plan, i) => (
                <div
                  key={i}
                  className={`svc2-plan-card ${plan.badge ? "svc2-plan-popular" : ""} ${activePlan === i ? "svc2-plan-card--active" : ""}`}
                >
                  {plan.badge && (
                    <span className="svc2-plan-badge">{plan.badge}</span>
                  )}

                  <h4 className="svc2-plan-name">{plan.name}</h4>

                  <div className="svc2-plan-price-wrap">
                    {plan.isCustom ? (
                      <p className="svc2-plan-price">{plan.price}</p>
                    ) : (
                      <p className="svc2-plan-price">
                        ${formatPlanPrice(plan)}
                        <span className="svc2-plan-price-currency">
                          {plan.currency} {planPeriod(plan)}
                        </span>
                      </p>
                    )}
                    {isRecurring && billingMode === "annual" && !plan.isCustom && (
                      <span className="svc2-plan-saving">
                        {lang === "es" ? "Ahorra 20% con pago anual" : "Save 20% with annual billing"}
                      </span>
                    )}
                  </div>
                  <p className="svc2-plan-tagline">{planTagline(plan)}</p>

                  <div className="svc2-plan-divider"></div>

                  <ul className="svc2-plan-features">
                    {plan.features.map((f, j) => (
                      <li key={j} className="svc2-plan-feature">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={buildInfoHref(lang)} target="_blank" rel="noopener noreferrer" className="svc2-plan-cta">
                    {lang === "es" ? "Solicitar propuesta" : "Request proposal"}
                  </a>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="svc2-plan-arrow svc2-plan-arrow--next"
              aria-label={lang === "es" ? "Siguiente plan" : "Next plan"}
              onClick={() => setActivePlan((current) => (current + 1) % t.plans.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="svc2-plan-dots" aria-label={lang === "es" ? "Navegación de planes" : "Plan navigation"}>
            {t.plans.map((plan, index) => (
              <button
                key={plan.name}
                type="button"
                className={activePlan === index ? "svc2-plan-dot svc2-plan-dot--active" : "svc2-plan-dot"}
                aria-label={`${lang === "es" ? "Ver plan" : "View plan"} ${plan.name}`}
                aria-pressed={activePlan === index}
                onClick={() => setActivePlan(index)}
              />
            ))}
          </div>
          <div className="svc2-month-offer">
            <div className="svc2-month-offer-mark" aria-hidden="true">
              <strong>20%</strong>
              <span>OFF</span>
            </div>
            <div className="svc2-month-offer-copy">
              <span className="svc2-month-offer-kicker">
                {lang === "es" ? "Oferta de este mes" : "This month's offer"}
              </span>
              <h3>{context.offerHeadline[lang]}</h3>
              <p>
                {lang === "es"
                  ? "20% de descuento en tu primer servicio."
                  : "20% off your first service."}
              </p>
            </div>
            <a href={buildInfoHref(lang)} target="_blank" rel="noopener noreferrer" className="svc2-month-offer-link">
              {lang === "es" ? "Hablemos" : "Let's talk"}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h13" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
