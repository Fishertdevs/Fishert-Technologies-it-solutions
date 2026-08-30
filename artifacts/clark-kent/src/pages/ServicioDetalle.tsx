import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { Link, useParams } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { buildServiceDiscountHref, buildServiceProposalHref } from "../utils/whatsapp";
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

type PlanDetail = {
  deliverables: string[];
  duration: string;
};

type ProcessStage = {
  number: string;
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type ServiceData = {
  title: string;
  eyebrow: string;
  hero: string;
  intro: string;
  description: string;
  plans: Plan[];
  planDetails: Record<string, PlanDetail>;
  process: ProcessStage[];
  faqs: FAQItem[];
};

type LocalizedCopy = {
  es: string;
  en: string;
};

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

type OfferCampaign = {
  id: string;
  priority: number;
  discount: number;
  getEventDate: (year: number) => CalendarDate;
  kicker: LocalizedCopy;
  headline: LocalizedCopy;
};

const BOGOTA_TIME_ZONE = "America/Bogota";

const getBogotaDate = (): CalendarDate => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BOGOTA_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const valueFor = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: valueFor("year"),
    month: valueFor("month"),
    day: valueFor("day"),
  };
};

const fixedDate = (month: number, day: number) => (year: number): CalendarDate => ({
  year,
  month,
  day,
});

const nthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
): CalendarDate => {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - firstDay.getUTCDay() + 7) % 7;

  return {
    year,
    month,
    day: 1 + offset + (occurrence - 1) * 7,
  };
};

const lastWeekdayOfMonth = (year: number, month: number, weekday: number): CalendarDate => {
  const lastDay = new Date(Date.UTC(year, month, 0));
  const offset = (lastDay.getUTCDay() - weekday + 7) % 7;

  return {
    year,
    month,
    day: lastDay.getUTCDate() - offset,
  };
};

const offerCampaigns: OfferCampaign[] = [
  {
    id: "new-year",
    priority: 10,
    discount: 15,
    getEventDate: fixedDate(1, 1),
    kicker: { es: "Oferta de Año Nuevo", en: "New Year offer" },
    headline: {
      es: "Empieza el año con una idea más grande.",
      en: "Start the year with a bigger idea.",
    },
  },
  {
    id: "valentines-day",
    priority: 10,
    discount: 12,
    getEventDate: fixedDate(2, 14),
    kicker: { es: "Oferta de San Valentín", en: "Valentine's offer" },
    headline: {
      es: "Enamórate de la próxima versión de tu negocio.",
      en: "Fall in love with the next version of your business.",
    },
  },
  {
    id: "womens-day",
    priority: 10,
    discount: 18,
    getEventDate: fixedDate(3, 8),
    kicker: { es: "Oferta del Día de la Mujer", en: "Women's Day offer" },
    headline: {
      es: "Haz que tu negocio avance con intención.",
      en: "Move your business forward with intention.",
    },
  },
  {
    id: "mothers-day",
    priority: 20,
    discount: 25,
    getEventDate: (year) => nthWeekdayOfMonth(year, 5, 0, 2),
    kicker: { es: "Oferta del Día de la Madre", en: "Mother's Day offer" },
    headline: {
      es: "Celebra a mamá haciendo crecer su negocio.",
      en: "Celebrate mom by helping her business grow.",
    },
  },
  {
    id: "fathers-day",
    priority: 20,
    discount: 20,
    getEventDate: (year) => nthWeekdayOfMonth(year, 6, 0, 3),
    kicker: { es: "Oferta del Día del Padre", en: "Father's Day offer" },
    headline: {
      es: "El mejor regalo para su negocio es avanzar.",
      en: "The best gift for his business is moving forward.",
    },
  },
  {
    id: "halloween",
    priority: 10,
    discount: 22,
    getEventDate: fixedDate(10, 31),
    kicker: { es: "Oferta de Halloween", en: "Halloween offer" },
    headline: {
      es: "Dale vida a una idea que parecía imposible.",
      en: "Bring an idea that seemed impossible to life.",
    },
  },
  {
    id: "black-friday",
    priority: 30,
    discount: 30,
    getEventDate: (year) => lastWeekdayOfMonth(year, 11, 5),
    kicker: { es: "Oferta de Black Friday", en: "Black Friday offer" },
    headline: {
      es: "La oferta más potente del año empieza aquí.",
      en: "The biggest offer of the year starts here.",
    },
  },
  {
    id: "christmas",
    priority: 10,
    discount: 28,
    getEventDate: fixedDate(12, 25),
    kicker: { es: "Oferta de Navidad", en: "Christmas offer" },
    headline: {
      es: "Regala a tu negocio una nueva versión.",
      en: "Give your business a new version.",
    },
  },
];

const defaultOffer: OfferCampaign = {
  id: "monthly-default",
  priority: 0,
  discount: 20,
  getEventDate: fixedDate(1, 1),
  kicker: { es: "Oferta de este mes", en: "This month's offer" },
  headline: {
    es: "Tu próxima versión empieza hoy.",
    en: "Your next version starts today.",
  },
};

const getOfferCampaign = (date: CalendarDate): OfferCampaign => {
  const matchingCampaign = offerCampaigns
    .filter((campaign) => campaign.getEventDate(date.year).month === date.month)
    .sort((a, b) => b.priority - a.priority)[0];

  return matchingCampaign ?? defaultOffer;
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
  closingTitle: LocalizedCopy;
  closingText: LocalizedCopy;
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
    closingTitle: {
      es: "Hagamos que tu presencia digital trabaje más.",
      en: "Let's make your digital presence work harder.",
    },
    closingText: {
      es: "Cuéntanos qué quieres mejorar y recibe una primera orientación para elegir el alcance correcto.",
      en: "Tell us what you want to improve and get initial guidance on the right scope.",
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
      es: "De la idea al producto.",
      en: "From idea to product.",
    },
    pricingSub: {
      es: "Diseñamos y construimos MVPs, SaaS y plataformas a medida para convertir tu oportunidad en software escalable.",
      en: "We design and build MVPs, SaaS products, and custom platforms that turn your opportunity into scalable software.",
    },
    offerHeadline: {
      es: "De la idea al primer lanzamiento.",
      en: "From idea to your first launch.",
    },
    closingTitle: {
      es: "Tu próxima versión merece un equipo a la altura.",
      en: "Your next version deserves the right team.",
    },
    closingText: {
      es: "Agenda una discovery call y convierte una oportunidad de negocio en un producto que pueda crecer.",
      en: "Book a discovery call and turn a business opportunity into a product that can grow.",
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
      es: "Comienza a automatizar tus procesos.",
      en: "Start automating your processes.",
    },
    pricingSub: {
      es: "Detectamos dónde se pierde tiempo y diseñamos una automatización que sí se usa.",
      en: "We find where time is lost and design automation your team will actually use.",
    },
    offerHeadline: {
      es: "Menos tareas repetitivas. Más espacio para crecer.",
      en: "Less repetition. More room to grow.",
    },
    closingTitle: {
      es: "Encuentra el proceso que podemos liberar.",
      en: "Find the process we can set free.",
    },
    closingText: {
      es: "Hablemos de tu operación, tus cuellos de botella y el siguiente automatismo que sí tendrá impacto.",
      en: "Let's talk about your operation, bottlenecks, and the next automation that will make an impact.",
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
    closingTitle: {
      es: "Convirtamos atención en crecimiento.",
      en: "Let's turn attention into growth.",
    },
    closingText: {
      es: "Comparte tus objetivos y diseñemos una estrategia que conecte creatividad, distribución y resultados.",
      en: "Share your goals and let's design a strategy connecting creativity, distribution, and results.",
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
    closingTitle: {
      es: "Prepara la infraestructura para lo que viene.",
      en: "Prepare the infrastructure for what's next.",
    },
    closingText: {
      es: "Revisemos tu operación actual y construyamos una base más segura, observable y lista para escalar.",
      en: "Let's review your current operation and build a safer, observable foundation ready to scale.",
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
      planDetails: {
        Starter: {
          deliverables: ["Landing page publicada", "Sistema visual responsive", "SEO técnico y formularios"],
          duration: "3–4 semanas",
        },
        Professional: {
          deliverables: ["Arquitectura de contenidos", "CMS y analítica conectada", "Optimización SEO y conversión"],
          duration: "6–8 semanas",
        },
        Enterprise: {
          deliverables: ["Arquitectura a medida", "Integraciones y panel operativo", "Plan de evolución y soporte"],
          duration: "A definir según alcance",
        },
      },
      process: [
        { number: "01", title: "Diagnóstico", description: "Entendemos tu negocio, tus usuarios y las oportunidades que tu presencia digital todavía no está capturando." },
        { number: "02", title: "Estrategia", description: "Convertimos los hallazgos en una arquitectura, una experiencia y un plan de contenido orientados a objetivos reales." },
        { number: "03", title: "Construcción", description: "Diseñamos y desarrollamos una web rápida, clara y preparada para evolucionar contigo." },
        { number: "04", title: "Lanzamiento y optimización", description: "Publicamos con control, medimos el comportamiento y priorizamos mejoras para seguir convirtiendo." },
      ],
      faqs: [
        { question: "¿El producto queda a nombre de mi empresa?", answer: "Sí. Al finalizar el proyecto, tu empresa recibe la propiedad de los diseños, contenidos y código producido para la web." },
        { question: "¿Qué soporte recibo después del lanzamiento?", answer: "Incluimos el soporte indicado en el plan para resolver ajustes, dudas y aprendizajes iniciales sin dejarte solo después de publicar." },
        { question: "¿Pueden mantener y evolucionar mi web?", answer: "Sí. Podemos acompañarte con mantenimiento continuo, nuevas funcionalidades, contenido y optimización según las prioridades del negocio." },
        { question: "¿Cómo eligen la tecnología adecuada?", answer: "Partimos de tus objetivos, equipo y operación. Elegimos la solución que mantenga el proyecto útil, sostenible y fácil de hacer crecer." },
      ],
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
      planDetails: {
        Starter: {
          deliverables: ["Published landing page", "Responsive visual system", "Technical SEO and forms"],
          duration: "3–4 weeks",
        },
        Professional: {
          deliverables: ["Content architecture", "Connected CMS and analytics", "SEO and conversion optimization"],
          duration: "6–8 weeks",
        },
        Enterprise: {
          deliverables: ["Custom architecture", "Integrations and operations panel", "Evolution and support plan"],
          duration: "Scoped to the project",
        },
      },
      process: [
        { number: "01", title: "Diagnosis", description: "We understand your business, your users, and the opportunities your digital presence is not capturing yet." },
        { number: "02", title: "Strategy", description: "We turn those findings into architecture, experience, and content priorities tied to real goals." },
        { number: "03", title: "Build", description: "We design and develop a fast, clear website ready to evolve with your business." },
        { number: "04", title: "Launch and optimize", description: "We publish with control, measure behavior, and prioritize improvements that keep conversion moving." },
      ],
      faqs: [
        { question: "Does my company own the final product?", answer: "Yes. Once the project is complete, your company receives ownership of the designs, content, and code produced for the website." },
        { question: "What support do I receive after launch?", answer: "We include the support described in your plan to handle adjustments, questions, and early learnings after going live." },
        { question: "Can you maintain and evolve my website?", answer: "Yes. We can stay involved with ongoing maintenance, new features, content, and optimization as business priorities change." },
        { question: "How do you choose the right technology?", answer: "We start with your goals, team, and operation, then choose a solution that stays useful, sustainable, and easy to grow." },
      ],
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
      planDetails: {
        MVP: {
          deliverables: ["Alcance priorizado y prototipo funcional", "Producto core con backend", "Base para validar con usuarios"],
          duration: "8–10 semanas",
        },
        Growth: {
          deliverables: ["Producto completo y escalable", "Integraciones y panel avanzado", "Analítica para decisiones de producto"],
          duration: "4–5 meses",
        },
        Enterprise: {
          deliverables: ["Arquitectura de alta escala", "Seguridad, disponibilidad y gobierno", "Equipo dedicado y evolución continua"],
          duration: "A definir según alcance",
        },
      },
      process: [
        { number: "01", title: "Diagnóstico", description: "Alineamos la oportunidad, el modelo de negocio y las necesidades de quienes usarán el producto." },
        { number: "02", title: "Estrategia", description: "Definimos el alcance correcto, la experiencia y las decisiones de producto que reducen riesgo antes de construir." },
        { number: "03", title: "Construcción", description: "Iteramos en ciclos cortos para convertir la visión en software probado, usable y listo para aprender." },
        { number: "04", title: "Lanzamiento y optimización", description: "Acompañamos el lanzamiento, observamos el uso y priorizamos la siguiente versión con datos reales." },
      ],
      faqs: [
        { question: "¿El producto queda a nombre de mi empresa?", answer: "Sí. Entregamos a tu empresa los diseños y el código creado para el producto, junto con la documentación necesaria para continuar." },
        { question: "¿Qué soporte recibo después del lanzamiento?", answer: "El plan incluye acompañamiento durante la salida y el período indicado para estabilizar el producto y resolver aprendizajes iniciales." },
        { question: "¿Pueden mantener y evolucionar el software?", answer: "Sí. Podemos continuar como equipo de producto para mantenimiento, nuevas versiones, mejoras y soporte de largo plazo." },
        { question: "¿Cómo eligen la tecnología adecuada?", answer: "Evaluamos el problema, la escala esperada, el equipo y la velocidad necesaria para recomendar una base técnica sostenible, sin imponer herramientas por moda." },
      ],
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
      planDetails: {
        MVP: {
          deliverables: ["Prioritized scope and functional prototype", "Core product with backend", "Foundation for user validation"],
          duration: "8–10 weeks",
        },
        Growth: {
          deliverables: ["Complete, scalable product", "Integrations and advanced admin panel", "Analytics for product decisions"],
          duration: "4–5 months",
        },
        Enterprise: {
          deliverables: ["High-scale architecture", "Security, availability, and governance", "Dedicated team and continuous evolution"],
          duration: "Scoped to the project",
        },
      },
      process: [
        { number: "01", title: "Diagnosis", description: "We align the opportunity, business model, and needs of the people who will use the product." },
        { number: "02", title: "Strategy", description: "We define the right scope, experience, and product decisions to reduce risk before building." },
        { number: "03", title: "Build", description: "We work in short cycles to turn the vision into tested, usable software ready to learn from." },
        { number: "04", title: "Launch and optimize", description: "We support the launch, observe usage, and prioritize the next version with real data." },
      ],
      faqs: [
        { question: "Does my company own the final product?", answer: "Yes. We deliver the designs and code created for the product, together with the documentation needed to keep moving." },
        { question: "What support do I receive after launch?", answer: "Your plan includes launch support and the stated period to stabilize the product and address early learnings." },
        { question: "Can you maintain and evolve the software?", answer: "Yes. We can continue as your product team for maintenance, new versions, improvements, and long-term support." },
        { question: "How do you choose the right technology?", answer: "We assess the problem, expected scale, team, and required speed to recommend a sustainable foundation rather than imposing tools for their own sake." },
      ],
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
      title: "Automatización + IA",
      eyebrow: "SERVICIO",
      hero: "svc3_2.jpg",
      intro: "Elimina tareas repetitivas. Activa inteligencia real.",
      description:
        "Implementamos automatizaciones y soluciones de inteligencia artificial que liberan tiempo, reducen errores y permiten que tu equipo enfoque su energía en lo que realmente importa. Desde chatbots hasta modelos entrenados para tu industria.",
      planDetails: {
        Essentials: {
          deliverables: ["Mapa de procesos prioritarios", "2–3 automatizaciones activas", "Documentación para el equipo"],
          duration: "4–6 semanas",
        },
        Advanced: {
          deliverables: ["Sistema operativo end-to-end", "Agente IA e integraciones", "Métricas para medir impacto"],
          duration: "8–12 semanas",
        },
        Custom: {
          deliverables: ["Solución IA diseñada a medida", "Automatización de flujos completos", "Plan de mantenimiento y evolución"],
          duration: "A definir según alcance",
        },
      },
      process: [
        { number: "01", title: "Diagnóstico", description: "Mapeamos cómo trabaja tu equipo, dónde se repite el esfuerzo y qué decisiones necesitan mejor información." },
        { number: "02", title: "Estrategia", description: "Priorizamos oportunidades y diseñamos una solución que equilibre impacto, adopción y control humano." },
        { number: "03", title: "Construcción", description: "Conectamos tus sistemas, configuramos los flujos y entrenamos la solución con casos reales." },
        { number: "04", title: "Lanzamiento y optimización", description: "Ponemos la automatización en manos del equipo, medimos resultados y mejoramos lo que aprende." },
      ],
      faqs: [
        { question: "¿El producto queda a nombre de mi empresa?", answer: "Sí. Los flujos, configuraciones y entregables creados para tu operación quedan disponibles para tu empresa al terminar el proyecto." },
        { question: "¿Qué soporte recibo después del lanzamiento?", answer: "Incluimos soporte para acompañar la adopción, resolver ajustes y asegurar que el equipo pueda usar la solución con confianza." },
        { question: "¿Pueden mantener y mejorar la automatización?", answer: "Sí. Podemos monitorear los flujos, incorporar nuevos casos de uso y ajustar la solución cuando cambien tus procesos." },
        { question: "¿Cómo eligen la tecnología adecuada?", answer: "Partimos del proceso y del nivel de control que necesitas. Seleccionamos una solución segura, comprensible y compatible con tu operación actual." },
      ],
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
      planDetails: {
        Essentials: {
          deliverables: ["Priority process map", "2–3 active automations", "Documentation for your team"],
          duration: "4–6 weeks",
        },
        Advanced: {
          deliverables: ["End-to-end operating system", "AI agent and integrations", "Impact measurement metrics"],
          duration: "8–12 weeks",
        },
        Custom: {
          deliverables: ["Purpose-built AI solution", "Full workflow automation", "Maintenance and evolution plan"],
          duration: "Scoped to the project",
        },
      },
      process: [
        { number: "01", title: "Diagnosis", description: "We map how your team works, where effort repeats, and which decisions need better information." },
        { number: "02", title: "Strategy", description: "We prioritize opportunities and design a solution balancing impact, adoption, and human control." },
        { number: "03", title: "Build", description: "We connect your systems, configure the workflows, and train the solution on real cases." },
        { number: "04", title: "Launch and optimize", description: "We put the automation in your team's hands, measure outcomes, and improve what it learns." },
      ],
      faqs: [
        { question: "Does my company own the final product?", answer: "Yes. The workflows, configurations, and deliverables created for your operation remain available to your company when the project ends." },
        { question: "What support do I receive after launch?", answer: "We include support for adoption, adjustments, and making sure your team can use the solution with confidence." },
        { question: "Can you maintain and improve the automation?", answer: "Yes. We can monitor workflows, add new use cases, and adjust the solution as your processes change." },
        { question: "How do you choose the right technology?", answer: "We start with the process and level of control you need, then select a secure, understandable solution compatible with your current operation." },
      ],
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
      planDetails: {
        Starter: {
          deliverables: ["Calendario editorial mensual", "Contenido para dos canales", "Reporte de aprendizajes y resultados"],
          duration: "Primer ciclo de 4 semanas",
        },
        Growth: {
          deliverables: ["Estrategia multicanal", "Campañas y contenido de performance", "Reporte quincenal con próximos pasos"],
          duration: "Ciclos mensuales",
        },
        Full: {
          deliverables: ["Estrategia integral de marca", "Producción y distribución de contenido", "Dirección dedicada de crecimiento"],
          duration: "Ciclos mensuales",
        },
      },
      process: [
        { number: "01", title: "Diagnóstico", description: "Leemos tu marca, audiencia y datos para entender qué está funcionando y dónde se está perdiendo atención." },
        { number: "02", title: "Estrategia", description: "Definimos mensajes, canales y una ruta de experimentación conectada a tus objetivos de negocio." },
        { number: "03", title: "Construcción", description: "Producimos contenido y campañas con una idea clara, una ejecución consistente y medición desde el inicio." },
        { number: "04", title: "Lanzamiento y optimización", description: "Publicamos, aprendemos del comportamiento de la audiencia y redistribuimos esfuerzos hacia lo que sí mueve resultados." },
      ],
      faqs: [
        { question: "¿El producto queda a nombre de mi empresa?", answer: "Sí. Tu empresa conserva los materiales finales producidos para la marca y recibe los reportes y aprendizajes de cada ciclo." },
        { question: "¿Qué soporte recibo después del lanzamiento?", answer: "El acompañamiento es continuo dentro del ciclo contratado: revisamos resultados, resolvemos dudas y ajustamos el plan con tu equipo." },
        { question: "¿Pueden mantener y evolucionar la estrategia?", answer: "Sí. La estrategia se revisa con frecuencia para incorporar aprendizajes, nuevas campañas y cambios en el negocio o la audiencia." },
        { question: "¿Cómo eligen la tecnología adecuada?", answer: "Usamos las herramientas que mejor conecten contenido, distribución y medición, siempre priorizando claridad y resultados sobre la cantidad de plataformas." },
      ],
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
      planDetails: {
        Starter: {
          deliverables: ["Monthly editorial calendar", "Content for two channels", "Results and learning report"],
          duration: "First 4-week cycle",
        },
        Growth: {
          deliverables: ["Multichannel strategy", "Performance content and campaigns", "Bi-weekly report with next steps"],
          duration: "Monthly cycles",
        },
        Full: {
          deliverables: ["Integrated brand strategy", "Content production and distribution", "Dedicated growth direction"],
          duration: "Monthly cycles",
        },
      },
      process: [
        { number: "01", title: "Diagnosis", description: "We read your brand, audience, and data to understand what is working and where attention is being lost." },
        { number: "02", title: "Strategy", description: "We define messages, channels, and an experimentation path connected to your business goals." },
        { number: "03", title: "Build", description: "We produce content and campaigns with a clear idea, consistent execution, and measurement from day one." },
        { number: "04", title: "Launch and optimize", description: "We publish, learn from audience behavior, and shift effort toward what moves results." },
      ],
      faqs: [
        { question: "Does my company own the final product?", answer: "Yes. Your company keeps the final materials produced for the brand and receives the reports and learnings from each cycle." },
        { question: "What support do I receive after launch?", answer: "Support is continuous within the contracted cycle: we review results, answer questions, and adjust the plan with your team." },
        { question: "Can you maintain and evolve the strategy?", answer: "Yes. We revisit the strategy regularly to incorporate learnings, new campaigns, and changes in the business or audience." },
        { question: "How do you choose the right technology?", answer: "We use the tools that best connect content, distribution, and measurement, prioritizing clarity and results over the number of platforms." },
      ],
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
      planDetails: {
        Essential: {
          deliverables: ["Base cloud configurada", "Pipeline de entrega inicial", "Monitoreo, backups y seguridad base"],
          duration: "3–4 semanas",
        },
        Professional: {
          deliverables: ["Infraestructura cloud completa", "Entrega automatizada con pruebas", "Observabilidad y escalado controlado"],
          duration: "6–8 semanas",
        },
        Enterprise: {
          deliverables: ["Arquitectura híbrida o multi-cloud", "Alta disponibilidad y recuperación", "Operación continua con equipo dedicado"],
          duration: "A definir según alcance",
        },
      },
      process: [
        { number: "01", title: "Diagnóstico", description: "Revisamos tu infraestructura, riesgos y forma de entregar para encontrar los puntos que frenan la operación." },
        { number: "02", title: "Estrategia", description: "Diseñamos una ruta técnica con prioridades claras para ganar confiabilidad sin sobredimensionar la solución." },
        { number: "03", title: "Construcción", description: "Configuramos la base, automatizamos los despliegues y hacemos visible el estado real de tus servicios." },
        { number: "04", title: "Lanzamiento y optimización", description: "Ponemos la operación en marcha, verificamos cada transición y optimizamos con datos de uso y rendimiento." },
      ],
      faqs: [
        { question: "¿El producto queda a nombre de mi empresa?", answer: "Sí. La configuración y documentación creada para tu infraestructura quedan bajo el control de tu empresa al finalizar el proyecto." },
        { question: "¿Qué soporte recibo después del lanzamiento?", answer: "El soporte incluido ayuda a estabilizar la operación, resolver incidencias iniciales y transferir conocimiento a tu equipo." },
        { question: "¿Pueden mantener y evolucionar la infraestructura?", answer: "Sí. Podemos acompañar la operación continua, el crecimiento de capacidad, la seguridad y las mejoras de entrega." },
        { question: "¿Cómo eligen la tecnología adecuada?", answer: "Elegimos la base según tus necesidades de disponibilidad, seguridad, presupuesto y equipo, evitando complejidad que no aporte valor." },
      ],
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
      planDetails: {
        Essential: {
          deliverables: ["Configured cloud foundation", "Initial delivery pipeline", "Monitoring, backups, and base security"],
          duration: "3–4 weeks",
        },
        Professional: {
          deliverables: ["Complete cloud infrastructure", "Automated delivery with testing", "Observability and controlled scaling"],
          duration: "6–8 weeks",
        },
        Enterprise: {
          deliverables: ["Hybrid or multi-cloud architecture", "High availability and recovery", "Continuous operations with a dedicated team"],
          duration: "Scoped to the project",
        },
      },
      process: [
        { number: "01", title: "Diagnosis", description: "We review your infrastructure, risks, and delivery habits to find what is slowing the operation down." },
        { number: "02", title: "Strategy", description: "We design a technical path with clear priorities to increase reliability without overbuilding." },
        { number: "03", title: "Build", description: "We configure the foundation, automate deployments, and make the real state of your services visible." },
        { number: "04", title: "Launch and optimize", description: "We put operations in motion, verify every transition, and optimize with usage and performance data." },
      ],
      faqs: [
        { question: "Does my company own the final product?", answer: "Yes. The configuration and documentation created for your infrastructure remain under your company's control when the project ends." },
        { question: "What support do I receive after launch?", answer: "Included support helps stabilize operations, resolve early incidents, and transfer knowledge to your team." },
        { question: "Can you maintain and evolve the infrastructure?", answer: "Yes. We can support ongoing operations, capacity growth, security, and delivery improvements." },
        { question: "How do you choose the right technology?", answer: "We choose the foundation based on your availability, security, budget, and team needs, avoiding complexity that adds no value." },
      ],
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
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);
  const [currentDate, setCurrentDate] = useState<CalendarDate>(() => getBogotaDate());
  const planTouchStartX = useRef<number | null>(null);
  const processTouchStartX = useRef<number | null>(null);
  const faqTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActivePlan(0);
    setActiveProcess(0);
    setActiveFaq(0);
  }, [slug]);

  useEffect(() => {
    const refreshDate = () => setCurrentDate(getBogotaDate());
    const intervalId = window.setInterval(refreshDate, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

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
  const activeOffer = getOfferCampaign(currentDate);
  const offerHeadline = activeOffer.id === "monthly-default"
    ? context.offerHeadline[lang]
    : activeOffer.headline[lang];

  const formatPlanPrice = (plan: Plan) => {
    if (plan.isCustom || !isRecurring || billingMode === "monthly") {
      return plan.price;
    }

    const monthlyPrice = Number(plan.price.replace(/[^\d]/g, ""));
    return new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US").format(monthlyPrice * 0.8);
  };

  const formatCustomPlanPrice = (price: string) => {
    const match = price.match(/^(.+?)\s+(\$[\d.,]+)\s+([A-Z]{3})$/);
    return match
      ? { prefix: match[1], value: match[2], currency: match[3] }
      : { prefix: "", value: price, currency: "" };
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

  const handleProcessTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    processTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleProcessTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = processTouchStartX.current;
    processTouchStartX.current = null;
    const endX = event.changedTouches[0]?.clientX;
    if (startX === null || endX === undefined) return;

    const deltaX = startX - endX;
    if (Math.abs(deltaX) < 40) return;
    setActiveProcess((current) => (
      deltaX > 0
        ? (current + 1) % t.process.length
        : (current - 1 + t.process.length) % t.process.length
    ));
  };

  const handleFaqTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    faqTouchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleFaqTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = faqTouchStartX.current;
    faqTouchStartX.current = null;
    const endX = event.changedTouches[0]?.clientX;
    if (startX === null || endX === undefined) return;

    const deltaX = startX - endX;
    if (Math.abs(deltaX) < 40) return;
    setActiveFaq((current) => (
      deltaX > 0
        ? (current + 1) % t.faqs.length
        : (current - 1 + t.faqs.length) % t.faqs.length
    ));
  };

  const activeStage = t.process[activeProcess] ?? t.process[0];
  const activeFaqItem = t.faqs[activeFaq] ?? t.faqs[0];

  return (
    <>
      <Navbar />
      <main className="svc2-container">
        {/* ── Hero ── */}
        <header className="svc2-hero">
          <div className="svc2-hero-content">
            <div className="svc2-title-wrap">
              <span className="svc2-eyebrow">{t.eyebrow}</span>
              <h1 className="svc2-title">
                {slug === "desarrollo-software" ? (
                  lang === "es" ? <>Desarrollo de<br />Software</> : <>Software<br />Development</>
                ) : t.title}
              </h1>
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

        {/* ── Process ── */}
        <section className="svc2-process-section" aria-labelledby="svc2-process-title">
          <div className="svc2-process-header">
            <h2 id="svc2-process-title">
              {lang === "es"
                ? "Cómo trabajamos"
                : "How we work"}
            </h2>
            <p>
              {lang === "es"
                ? "Un proceso claro para tomar mejores decisiones, construir con intención y seguir mejorando."
                : "A clear process for making better decisions, building with intention, and continuing to improve."}
            </p>
          </div>
          <div className="svc2-process-carousel" aria-roledescription="carousel">
            <button
              type="button"
              className="svc2-process-arrow"
              aria-label={lang === "es" ? "Etapa anterior" : "Previous stage"}
              onClick={() => setActiveProcess((current) => (current - 1 + t.process.length) % t.process.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div
              className="svc2-process-viewport"
              onTouchStart={handleProcessTouchStart}
              onTouchEnd={handleProcessTouchEnd}
              onTouchCancel={() => {
                processTouchStartX.current = null;
              }}
              aria-live="polite"
            >
              <article className="svc2-process-stage" key={activeStage.number}>
                <h3>{activeStage.title}</h3>
                <p>{activeStage.description}</p>
              </article>
            </div>
            <button
              type="button"
              className="svc2-process-arrow"
              aria-label={lang === "es" ? "Siguiente etapa" : "Next stage"}
              onClick={() => setActiveProcess((current) => (current + 1) % t.process.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="svc2-process-dots" aria-label={lang === "es" ? "Navegación de metodología" : "Methodology navigation"}>
            {t.process.map((stage, index) => (
              <button
                key={stage.number}
                type="button"
                className={activeProcess === index ? "svc2-process-dot svc2-process-dot--active" : "svc2-process-dot"}
                aria-label={`${lang === "es" ? "Ver etapa" : "View stage"} ${index + 1}: ${stage.title}`}
                aria-pressed={activeProcess === index}
                onClick={() => setActiveProcess(index)}
              />
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="svc2-pricing-section">
          <div className="svc2-pricing-header">
            <h3 className={`svc2-pricing-title ${slug === "desarrollo-software" ? "svc2-pricing-title--single-line" : ""}`}>
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
                      (() => {
                        const customPrice = formatCustomPlanPrice(plan.price);
                        return (
                          <p className="svc2-plan-price svc2-plan-price--custom">
                            <span className="svc2-plan-price-prefix">{customPrice.prefix}</span>
                            <span className="svc2-plan-price-value">{customPrice.value}</span>
                            {customPrice.currency && (
                              <span className="svc2-plan-price-currency">{customPrice.currency}</span>
                            )}
                          </p>
                        );
                      })()
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
                    <li className="svc2-plan-feature">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>
                        {lang === "es"
                          ? "Tiempo estimado: 3–4 semanas"
                          : "Estimated timing: 3–4 weeks"}
                      </span>
                    </li>
                    {plan.features.map((f, j) => (
                      <li key={j} className="svc2-plan-feature">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={buildServiceProposalHref(lang, t.title, plan.name)} target="_blank" rel="noopener noreferrer" className="svc2-plan-cta">
                    {lang === "es" ? "Solicitar propuesta" : "Request proposal"}
                  </a>
                </div>
              ))}
            </div>
            <div className="svc2-plans-arrows">
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
        </section>

        {/* ── FAQ ── */}
        <section className="svc2-faq-section svc2-faq-section--carousel" aria-labelledby="svc2-faq-title">
          <div className="svc2-process-header">
            <h2 id="svc2-faq-title">
              {lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
            <p>
              {lang === "es"
                ? "Claridad sobre la relación, el producto y lo que viene después."
                : "Clarity on the relationship, the product, and what comes next."}
            </p>
          </div>
          <div className="svc2-process-carousel svc2-faq-carousel" aria-roledescription="carousel">
            <button
              type="button"
              className="svc2-process-arrow"
              aria-label={lang === "es" ? "Pregunta anterior" : "Previous question"}
              onClick={() => setActiveFaq((current) => (current - 1 + t.faqs.length) % t.faqs.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div
              className="svc2-process-viewport"
              onTouchStart={handleFaqTouchStart}
              onTouchEnd={handleFaqTouchEnd}
              onTouchCancel={() => {
                faqTouchStartX.current = null;
              }}
              aria-live="polite"
            >
              <article className="svc2-process-stage" key={activeFaq}>
                <h3>{activeFaqItem.question}</h3>
                <p>{activeFaqItem.answer}</p>
              </article>
            </div>
            <button
              type="button"
              className="svc2-process-arrow"
              aria-label={lang === "es" ? "Siguiente pregunta" : "Next question"}
              onClick={() => setActiveFaq((current) => (current + 1) % t.faqs.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="svc2-process-dots" aria-label={lang === "es" ? "Navegación de preguntas frecuentes" : "FAQ navigation"}>
            {t.faqs.map((faq, index) => (
              <button
                key={faq.question}
                type="button"
                className={activeFaq === index ? "svc2-process-dot svc2-process-dot--active" : "svc2-process-dot"}
                aria-label={`${lang === "es" ? "Ver pregunta" : "View question"} ${index + 1}`}
                aria-pressed={activeFaq === index}
                onClick={() => setActiveFaq(index)}
              />
            ))}
          </div>
        </section>

        <section className="svc2-offer-section" aria-label={activeOffer.kicker[lang]}>
          <div className="svc2-month-offer">
            <div className="svc2-month-offer-mark" aria-hidden="true">
              <strong>{activeOffer.discount}%</strong>
              <span>OFF</span>
            </div>
            <div className="svc2-month-offer-copy">
              <span className="svc2-month-offer-kicker">
                {activeOffer.kicker[lang]}
              </span>
              <h3>{offerHeadline}</h3>
              <p>
                {lang === "es"
                  ? `${activeOffer.discount}% de descuento en tu primer servicio.`
                  : `${activeOffer.discount}% off your first service.`}
              </p>
            </div>
            <a href={buildServiceDiscountHref(lang, t.title, activeOffer.discount)} target="_blank" rel="noopener noreferrer" className="svc2-month-offer-link">
              {lang === "es" ? "Solicitar descuento" : "Request discount"}
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
