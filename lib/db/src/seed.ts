import { and, eq } from "drizzle-orm";
import { db, pool } from "./index";
import {
  planFeatures,
  serviceCategories,
  servicePlans,
  siteSettings,
  socialLinks,
} from "./schema";

type SeedPlan = {
  slug: string;
  name: string;
  priceCop: number | null;
  priceLabelEs: string;
  priceLabelEn: string;
  periodEs?: string;
  periodEn?: string;
  badgeEs?: string;
  badgeEn?: string;
  isCustom?: boolean;
  features: Array<{ es: string; en: string }>;
};

type SeedCategory = {
  slug: string;
  nameEs: string;
  nameEn: string;
  plans: SeedPlan[];
};

const settings = [
  ["contact_email", "fishertstudio@gmail.com"],
  ["phone_display", "+57 311 251 2939"],
  ["whatsapp_number", "573112512939"],
  ["location_es", "Colombia · Remoto global"],
  ["location_en", "Colombia · Global remote"],
  ["business_hours_weekdays_es", "Lun – Vie · 8:00 am – 9:00 pm"],
  ["business_hours_weekdays_en", "Mon – Fri · 8:00 am – 9:00 pm"],
  ["business_hours_weekend_es", "Sáb – Dom · 8:00 am – 2:00 pm"],
  ["business_hours_weekend_en", "Sat – Sun · 8:00 am – 2:00 pm"],
] as const;

const socials = [
  {
    platform: "instagram",
    labelEs: "Instagram",
    labelEn: "Instagram",
    url: "https://instagram.com",
    sortOrder: 1,
  },
  {
    platform: "github",
    labelEs: "GitHub",
    labelEn: "GitHub",
    url: "https://github.com/fishertstudio",
    sortOrder: 2,
  },
  {
    platform: "whatsapp",
    labelEs: "WhatsApp",
    labelEn: "WhatsApp",
    url: "https://wa.me/573112512939",
    sortOrder: 3,
  },
];

const categories: SeedCategory[] = [
  {
    slug: "desarrollo-web",
    nameEs: "Desarrollo Web",
    nameEn: "Web Development",
    plans: [
      {
        slug: "starter",
        name: "Starter",
        priceCop: 3500000,
        priceLabelEs: "3.500.000",
        priceLabelEn: "3,500,000",
        features: [
          { es: "Landing page de alto impacto", en: "High-impact landing page" },
          { es: "Diseño responsivo (mobile + desktop)", en: "Responsive design (mobile + desktop)" },
          { es: "SEO técnico básico", en: "Basic technical SEO" },
          { es: "Formulario de contacto funcional", en: "Functional contact form" },
          { es: "Dominio y hosting configurados", en: "Domain and hosting configured" },
          { es: "1 mes de soporte post-entrega", en: "1 month post-delivery support" },
        ],
      },
      {
        slug: "professional",
        name: "Professional",
        priceCop: 8500000,
        priceLabelEs: "8.500.000",
        priceLabelEn: "8,500,000",
        badgeEs: "Más popular",
        badgeEn: "Most popular",
        features: [
          { es: "Web corporativa multi-sección", en: "Multi-section corporate website" },
          { es: "CMS para gestión de contenido", en: "CMS for content management" },
          { es: "SEO avanzado + velocidad optimizada", en: "Advanced SEO + optimized speed" },
          { es: "Integraciones (analytics, chat, CRM)", en: "Integrations (analytics, chat, CRM)" },
          { es: "Blog o catálogo de productos", en: "Blog or product catalog" },
          { es: "3 meses de soporte y mantenimiento", en: "3 months of support & maintenance" },
        ],
      },
      {
        slug: "enterprise",
        name: "Enterprise",
        priceCop: 15000000,
        priceLabelEs: "Desde $15.000.000 COP",
        priceLabelEn: "From $15,000,000 COP",
        isCustom: true,
        features: [
          { es: "Plataforma web de escala", en: "Scalable web platform" },
          { es: "E-commerce o apps interactivas", en: "E-commerce or interactive apps" },
          { es: "Arquitectura personalizada", en: "Custom architecture" },
          { es: "Integraciones API complejas", en: "Complex API integrations" },
          { es: "Panel de administración a medida", en: "Custom admin panel" },
          { es: "Soporte y mantenimiento continuo", en: "Continuous support & maintenance" },
        ],
      },
    ],
  },
  {
    slug: "desarrollo-software",
    nameEs: "Desarrollo de Software",
    nameEn: "Software Development",
    plans: [
      {
        slug: "mvp",
        name: "MVP",
        priceCop: 15000000,
        priceLabelEs: "15.000.000",
        priceLabelEn: "15,000,000",
        features: [
          { es: "App funcional con features core", en: "Functional app with core features" },
          { es: "Backend + base de datos configurados", en: "Backend + database configured" },
          { es: "Autenticación de usuarios", en: "User authentication" },
          { es: "Panel de administración básico", en: "Basic administration panel" },
          { es: "Deploy en la nube incluido", en: "Cloud deployment included" },
          { es: "2 meses de desarrollo estimado", en: "Estimated 2 months of development" },
        ],
      },
      {
        slug: "growth",
        name: "Growth",
        priceCop: 35000000,
        priceLabelEs: "35.000.000",
        priceLabelEn: "35,000,000",
        badgeEs: "Más popular",
        badgeEn: "Most popular",
        features: [
          { es: "Plataforma con features completas", en: "Platform with complete features" },
          { es: "Integraciones con servicios externos", en: "Integrations with external services" },
          { es: "Panel de administración avanzado", en: "Advanced administration panel" },
          { es: "Notificaciones y automatizaciones", en: "Notifications and automations" },
          { es: "Reportes y analítica integrada", en: "Reports and integrated analytics" },
          { es: "4 meses de desarrollo estimado", en: "Estimated 4 months of development" },
        ],
      },
      {
        slug: "enterprise",
        name: "Enterprise",
        priceCop: 60000000,
        priceLabelEs: "Desde $60.000.000 COP",
        priceLabelEn: "From $60,000,000 COP",
        isCustom: true,
        features: [
          { es: "Plataforma de escala empresarial", en: "Enterprise-scale platform" },
          { es: "Arquitectura de microservicios", en: "Microservices architecture" },
          { es: "Alta disponibilidad y redundancia", en: "High availability and redundancy" },
          { es: "Seguridad y auditorías", en: "Security audits" },
          { es: "SLA de soporte garantizado", en: "Guaranteed support SLA" },
          { es: "Equipo dedicado al proyecto", en: "Dedicated project team" },
        ],
      },
    ],
  },
  {
    slug: "automatizacion-ia",
    nameEs: "Automatización + IA",
    nameEn: "Automation + AI",
    plans: [
      {
        slug: "essentials",
        name: "Essentials",
        priceCop: 5000000,
        priceLabelEs: "5.000.000",
        priceLabelEn: "5,000,000",
        features: [
          { es: "Automatización de 2–3 procesos clave", en: "Automation of 2–3 key processes" },
          { es: "Chatbot básico con IA (WhatsApp o web)", en: "Basic AI chatbot (WhatsApp or web)" },
          { es: "Integración con tus herramientas actuales", en: "Integration with your current tools" },
          { es: "Flujos de trabajo automatizados", en: "Automated workflows" },
          { es: "Documentación y capacitación", en: "Documentation and training" },
          { es: "1 mes de soporte post-entrega", en: "1 month post-delivery support" },
        ],
      },
      {
        slug: "advanced",
        name: "Advanced",
        priceCop: 15000000,
        priceLabelEs: "15.000.000",
        priceLabelEn: "15,000,000",
        badgeEs: "Más popular",
        badgeEn: "Most popular",
        features: [
          { es: "Automatización end-to-end de operaciones", en: "End-to-end operations automation" },
          { es: "Agente IA personalizado para tu negocio", en: "Custom AI agent for your business" },
          { es: "Procesamiento de documentos con IA", en: "AI-powered document processing" },
          { es: "Integraciones CRM, ERP o e-commerce", en: "CRM, ERP or e-commerce integrations" },
          { es: "Dashboard de métricas y control", en: "Metrics and control dashboard" },
          { es: "3 meses de soporte y mejora continua", en: "3 months of support and iteration" },
        ],
      },
      {
        slug: "custom",
        name: "Custom",
        priceCop: 30000000,
        priceLabelEs: "Desde $30.000.000 COP",
        priceLabelEn: "From $30,000,000 COP",
        isCustom: true,
        features: [
          { es: "Modelos de IA entrenados con tus datos", en: "AI models trained on your data" },
          { es: "Solución de IA enterprise a escala", en: "Enterprise-scale AI solution" },
          { es: "Automatización de cadenas completas", en: "Full-chain automation" },
          { es: "Integración con infraestructura existente", en: "Existing infrastructure integration" },
          { es: "Mantenimiento y reentrenamiento", en: "Maintenance and retraining" },
          { es: "Equipo de IA dedicado", en: "Dedicated AI team" },
        ],
      },
    ],
  },
  {
    slug: "marketing-digital",
    nameEs: "Marketing Digital",
    nameEn: "Digital Marketing",
    plans: [
      {
        slug: "starter",
        name: "Starter",
        priceCop: 2500000,
        priceLabelEs: "2.500.000",
        priceLabelEn: "2,500,000",
        periodEs: "/ mes",
        periodEn: "/ mo",
        features: [
          { es: "Gestión de 2 redes sociales", en: "Management of 2 social networks" },
          { es: "12 publicaciones mensuales", en: "12 monthly posts" },
          { es: "Diseño de contenido visual", en: "Visual content design" },
          { es: "Informe mensual de resultados", en: "Monthly results report" },
          { es: "Asesoría estratégica básica", en: "Basic strategic advisory" },
          { es: "Respuesta a comentarios incluida", en: "Comment responses included" },
        ],
      },
      {
        slug: "growth",
        name: "Growth",
        priceCop: 5000000,
        priceLabelEs: "5.000.000",
        priceLabelEn: "5,000,000",
        periodEs: "/ mes",
        periodEn: "/ mo",
        badgeEs: "Más popular",
        badgeEn: "Most popular",
        features: [
          { es: "Gestión de 4 redes sociales", en: "Management of 4 social networks" },
          { es: "Campañas de Meta Ads + Google Ads", en: "Meta Ads + Google Ads campaigns" },
          { es: "SEO on-page y off-page", en: "On-page and off-page SEO" },
          { es: "Email marketing automatizado", en: "Automated email marketing" },
          { es: "Contenido premium (reels, stories)", en: "Premium content (reels, stories)" },
          { es: "Reportes quincenales con KPIs", en: "Bi-weekly KPI reports" },
        ],
      },
      {
        slug: "full",
        name: "Full",
        priceCop: 10000000,
        priceLabelEs: "10.000.000",
        priceLabelEn: "10,000,000",
        periodEs: "/ mes",
        periodEn: "/ mo",
        features: [
          { es: "Estrategia de marketing 360°", en: "360° marketing strategy" },
          { es: "Performance marketing avanzado", en: "Advanced performance marketing" },
          { es: "Producción de contenido audiovisual", en: "Audiovisual content production" },
          { es: "Branding y comunicación de marca", en: "Brand communication & branding" },
          { es: "Consultoría de posicionamiento", en: "Positioning consultancy" },
          { es: "Account manager dedicado", en: "Dedicated account manager" },
        ],
      },
    ],
  },
  {
    slug: "cloud-devops",
    nameEs: "Cloud y DevOps",
    nameEn: "Cloud and DevOps",
    plans: [
      {
        slug: "essential",
        name: "Essential",
        priceCop: 3500000,
        priceLabelEs: "3.500.000",
        priceLabelEn: "3,500,000",
        features: [
          { es: "Configuración de servidor en la nube", en: "Cloud server configuration" },
          { es: "Pipeline CI/CD básico", en: "Basic CI/CD pipeline" },
          { es: "Monitoreo de uptime y alertas", en: "Uptime monitoring and alerts" },
          { es: "Certificados SSL y seguridad base", en: "SSL certificates and base security" },
          { es: "Backups automáticos", en: "Automatic backups" },
          { es: "1 mes de soporte incluido", en: "1 month of support included" },
        ],
      },
      {
        slug: "professional",
        name: "Professional",
        priceCop: 8500000,
        priceLabelEs: "8.500.000",
        priceLabelEn: "8,500,000",
        badgeEs: "Más popular",
        badgeEn: "Most popular",
        features: [
          { es: "Infraestructura cloud completa", en: "Complete cloud infrastructure" },
          { es: "CI/CD avanzado con tests automatizados", en: "Advanced CI/CD with automated tests" },
          { es: "Escalado automático (auto-scaling)", en: "Auto-scaling" },
          { es: "Seguridad y compliance básico", en: "Security and basic compliance" },
          { es: "Logs centralizados y trazabilidad", en: "Centralized logs and traceability" },
          { es: "3 meses de gestión y soporte", en: "3 months of management and support" },
        ],
      },
      {
        slug: "enterprise",
        name: "Enterprise",
        priceCop: 20000000,
        priceLabelEs: "Desde $20.000.000 COP",
        priceLabelEn: "From $20,000,000 COP",
        isCustom: true,
        features: [
          { es: "Arquitectura multi-cloud o híbrida", en: "Multi-cloud or hybrid architecture" },
          { es: "Alta disponibilidad y disaster recovery", en: "High availability and disaster recovery" },
          { es: "Seguridad avanzada y auditorías", en: "Advanced security and audits" },
          { es: "SLA de uptime garantizado", en: "Guaranteed uptime SLA" },
          { es: "Equipo DevOps dedicado", en: "Dedicated DevOps team" },
          { es: "Gestión y mantenimiento continuo", en: "Continuous management and maintenance" },
        ],
      },
    ],
  },
];

async function seed() {
  for (const [settingKey, value] of settings) {
    await db
      .insert(siteSettings)
      .values({ settingKey, value })
      .onConflictDoUpdate({
        target: siteSettings.settingKey,
        set: { value, updatedAt: new Date() },
      });
  }

  for (const social of socials) {
    const [existing] = await db
      .select({ id: socialLinks.id })
      .from(socialLinks)
      .where(eq(socialLinks.platform, social.platform))
      .limit(1);

    if (existing) {
      await db
        .update(socialLinks)
        .set({
          category: "social",
          label: social.labelEs,
          icon: social.platform,
          url: social.url,
          sortOrder: social.sortOrder,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(socialLinks.id, existing.id));
    } else {
      await db.insert(socialLinks).values({
        platform: social.platform,
        category: "social",
        label: social.labelEs,
        icon: social.platform,
        url: social.url,
        sortOrder: social.sortOrder,
      });
    }
  }

  for (const [categoryIndex, category] of categories.entries()) {
    await db
      .insert(serviceCategories)
      .values({
        slug: category.slug,
        nameEs: category.nameEs,
        nameEn: category.nameEn,
      })
      .onConflictDoUpdate({
        target: serviceCategories.slug,
        set: {
          nameEs: category.nameEs,
          nameEn: category.nameEn,
          updatedAt: new Date(),
        },
      });

    const [categoryRow] = await db
      .select({ id: serviceCategories.id })
      .from(serviceCategories)
      .where(eq(serviceCategories.slug, category.slug))
      .limit(1);

    if (!categoryRow) throw new Error(`Could not seed category ${category.slug}`);

    for (const [planIndex, plan] of category.plans.entries()) {
      const planValues = {
        categoryId: categoryRow.id,
        slug: plan.slug,
        nameEs: plan.name,
        nameEn: plan.name,
        price: plan.priceLabelEs,
        currency: "COP",
        periodEs: plan.periodEs,
        periodEn: plan.periodEn,
        badgeEs: plan.badgeEs,
        badgeEn: plan.badgeEn,
        isCustom: plan.isCustom ?? false,
        sortOrder: planIndex + 1,
        updatedAt: new Date(),
      };
      const [existingPlan] = await db
        .select({ id: servicePlans.id })
        .from(servicePlans)
        .where(and(eq(servicePlans.categoryId, categoryRow.id), eq(servicePlans.slug, plan.slug)))
        .limit(1);

      if (existingPlan) {
        await db
          .update(servicePlans)
          .set(planValues)
          .where(eq(servicePlans.id, existingPlan.id));
      } else {
        await db.insert(servicePlans).values(planValues);
      }

      const [planRow] = await db
        .select({ id: servicePlans.id })
        .from(servicePlans)
        .where(and(eq(servicePlans.categoryId, categoryRow.id), eq(servicePlans.slug, plan.slug)))
        .limit(1);

      if (!planRow) throw new Error(`Could not seed plan ${category.slug}/${plan.slug}`);

      const existingFeatures = await db
        .select({ id: planFeatures.id })
        .from(planFeatures)
        .where(eq(planFeatures.planId, planRow.id))
        .limit(1);

      if (existingFeatures.length === 0) {
        await db.insert(planFeatures).values(
          plan.features.map((feature, featureIndex) => ({
            planId: planRow.id,
            featureEs: feature.es,
            featureEn: feature.en,
            sortOrder: featureIndex + 1,
          })),
        );
      }
    }
  }

  console.info("Fishert Studio content seed completed.");
}

seed()
  .catch((error) => {
    console.error("Fishert Studio content seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });