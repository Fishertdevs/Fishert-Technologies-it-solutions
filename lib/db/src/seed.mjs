import pg from "pg";

const { Pool } = pg;
const connectionString =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL must be set");
}

const pool = new Pool({ connectionString });

const categories = [
  {
    slug: "desarrollo-web",
    nameEs: "Desarrollo Web",
    nameEn: "Web Development",
    plans: [
      ["starter", "Starter", "Starter", "3.500.000", false, [
        ["Landing page de alto impacto", "High-impact landing page"],
        ["Diseño responsivo (mobile + desktop)", "Responsive design (mobile + desktop)"],
        ["SEO técnico básico", "Basic technical SEO"],
        ["Formulario de contacto funcional", "Functional contact form"],
        ["Dominio y hosting configurados", "Domain and hosting configured"],
        ["1 mes de soporte post-entrega", "1 month post-delivery support"],
      ]],
      ["professional", "Professional", "Professional", "8.500.000", false, [
        ["Web corporativa multi-sección", "Multi-section corporate website"],
        ["CMS para gestión de contenido", "CMS for content management"],
        ["SEO avanzado + velocidad optimizada", "Advanced SEO + optimized speed"],
        ["Integraciones (analytics, chat, CRM)", "Integrations (analytics, chat, CRM)"],
        ["Blog o catálogo de productos", "Blog or product catalog"],
        ["3 meses de soporte y mantenimiento", "3 months of support & maintenance"],
      ]],
      ["enterprise", "Enterprise", "Enterprise", "Desde $15.000.000 COP", true, [
        ["Plataforma web de escala", "Scalable web platform"],
        ["E-commerce o apps interactivas", "E-commerce or interactive apps"],
        ["Arquitectura personalizada", "Custom architecture"],
        ["Integraciones API complejas", "Complex API integrations"],
        ["Panel de administración a medida", "Custom admin panel"],
        ["Soporte y mantenimiento continuo", "Continuous support & maintenance"],
      ]],
    ],
  },
  {
    slug: "desarrollo-software",
    nameEs: "Desarrollo de Software",
    nameEn: "Software Development",
    plans: [
      ["mvp", "MVP", "MVP", "15.000.000", false, [
        ["App funcional con features core", "Functional app with core features"],
        ["Backend + base de datos configurados", "Backend + database configured"],
        ["Autenticación de usuarios", "User authentication"],
        ["Panel de administración básico", "Basic admin panel"],
        ["Deploy en la nube incluido", "Cloud deploy included"],
        ["2 meses de desarrollo estimado", "Estimated 2-month build"],
      ]],
      ["growth", "Growth", "Growth", "35.000.000", false, [
        ["Plataforma con features completas", "Platform with full feature set"],
        ["Integraciones con servicios externos", "External service integrations"],
        ["Panel de administración avanzado", "Advanced admin panel"],
        ["Notificaciones y automatizaciones", "Notifications and automations"],
        ["Reportes y analítica integrada", "Reporting and built-in analytics"],
        ["4 meses de desarrollo estimado", "Estimated 4-month build"],
      ]],
      ["enterprise", "Enterprise", "Enterprise", "Desde $60.000.000 COP", true, [
        ["Plataforma de escala empresarial", "Enterprise-scale platform"],
        ["Arquitectura de microservicios", "Microservices architecture"],
        ["Alta disponibilidad y redundancia", "High availability & redundancy"],
        ["Seguridad y auditorías", "Security audits"],
        ["SLA de soporte garantizado", "Guaranteed support SLA"],
        ["Equipo dedicado al proyecto", "Dedicated project team"],
      ]],
    ],
  },
  {
    slug: "automatizacion-ia",
    nameEs: "Automatización + IA",
    nameEn: "Automation & AI",
    plans: [
      ["essentials", "Essentials", "Essentials", "5.000.000", false, [
        ["Automatización de 2–3 procesos clave", "Automation of 2–3 key processes"],
        ["Chatbot básico con IA (WhatsApp o web)", "Basic AI chatbot (WhatsApp or web)"],
        ["Integración con tus herramientas actuales", "Integration with your current tools"],
        ["Flujos de trabajo automatizados", "Automated workflows"],
        ["Documentación y capacitación", "Documentation and training"],
        ["1 mes de soporte post-entrega", "1 month post-delivery support"],
      ]],
      ["advanced", "Advanced", "Advanced", "15.000.000", false, [
        ["Automatización end-to-end de operaciones", "End-to-end operations automation"],
        ["Agente IA personalizado para tu negocio", "Custom AI agent for your business"],
        ["Procesamiento de documentos con IA", "AI-powered document processing"],
        ["Integraciones CRM, ERP o e-commerce", "CRM, ERP or e-commerce integrations"],
        ["Dashboard de métricas y control", "Metrics and control dashboard"],
        ["3 meses de soporte y mejora continua", "3 months of support and iteration"],
      ]],
      ["custom", "Custom", "Custom", "Desde $30.000.000 COP", true, [
        ["Modelos de IA entrenados con tus datos", "AI models trained on your data"],
        ["Solución de IA enterprise a escala", "Enterprise-scale AI solution"],
        ["Automatización de cadenas completas", "Full-chain automation"],
        ["Integración con infraestructura existente", "Existing infrastructure integration"],
        ["Mantenimiento y reentrenamiento", "Maintenance and retraining"],
        ["Equipo de IA dedicado", "Dedicated AI team"],
      ]],
    ],
  },
  {
    slug: "marketing-digital",
    nameEs: "Marketing Digital",
    nameEn: "Digital Marketing",
    plans: [
      ["starter", "Starter", "Starter", "2.500.000", false, [
        ["Gestión de 2 redes sociales", "Management of 2 social networks"],
        ["12 publicaciones mensuales", "12 monthly posts"],
        ["Diseño de contenido visual", "Visual content design"],
        ["Informe mensual de resultados", "Monthly results report"],
        ["Asesoría estratégica básica", "Basic strategic advisory"],
        ["Respuesta a comentarios incluida", "Comment responses included"],
      ]],
      ["growth", "Growth", "Growth", "5.000.000", false, [
        ["Gestión de 4 redes sociales", "Management of 4 social networks"],
        ["Campañas de Meta Ads + Google Ads", "Meta Ads + Google Ads campaigns"],
        ["SEO on-page y off-page", "On-page and off-page SEO"],
        ["Email marketing automatizado", "Automated email marketing"],
        ["Contenido premium (reels, stories)", "Premium content (reels, stories)"],
        ["Reportes quincenales con KPIs", "Bi-weekly KPI reports"],
      ]],
      ["full", "Full", "Full", "10.000.000", true, [
        ["Estrategia de marketing 360°", "360° marketing strategy"],
        ["Performance marketing avanzado", "Advanced performance marketing"],
        ["Producción de contenido audiovisual", "Audiovisual content production"],
        ["Branding y comunicación de marca", "Brand communication & branding"],
        ["Consultoría de posicionamiento", "Positioning consultancy"],
        ["Account manager dedicado", "Dedicated account manager"],
      ]],
    ],
  },
  {
    slug: "cloud-devops",
    nameEs: "Cloud y DevOps",
    nameEn: "Cloud & DevOps",
    plans: [
      ["essential", "Essential", "Essential", "3.500.000", false, [
        ["Configuración de servidor en la nube", "Cloud server configuration"],
        ["Pipeline CI/CD básico", "Basic CI/CD pipeline"],
        ["Monitoreo de uptime y alertas", "Uptime monitoring and alerts"],
        ["Certificados SSL y seguridad base", "SSL certificates and base security"],
        ["Backups automáticos", "Automatic backups"],
        ["1 mes de soporte incluido", "1 month of support included"],
      ]],
      ["professional", "Professional", "Professional", "8.500.000", false, [
        ["Infraestructura cloud completa", "Complete cloud infrastructure"],
        ["CI/CD avanzado con tests automatizados", "Advanced CI/CD with automated tests"],
        ["Escalado automático (auto-scaling)", "Auto-scaling"],
        ["Seguridad y compliance básico", "Security and basic compliance"],
        ["Logs centralizados y trazabilidad", "Centralized logs and traceability"],
        ["3 meses de gestión y soporte", "3 months of management and support"],
      ]],
      ["enterprise", "Enterprise", "Enterprise", "Desde $20.000.000 COP", true, [
        ["Arquitectura multi-cloud o híbrida", "Multi-cloud or hybrid architecture"],
        ["Alta disponibilidad y disaster recovery", "High availability and disaster recovery"],
        ["Seguridad avanzada y auditorías", "Advanced security and audits"],
        ["SLA de uptime garantizado", "Guaranteed uptime SLA"],
        ["Equipo DevOps dedicado", "Dedicated DevOps team"],
        ["Gestión y mantenimiento continuo", "Continuous management and maintenance"],
      ]],
    ],
  },
];

const socialLinks = [
  ["contact", "Instagram", "instagram", "https://instagram.com", 1],
  ["contact", "GitHub", "github", "https://github.com/fishertstudio", 2],
  ["contact", "WhatsApp", "whatsapp", "https://wa.me/573112512939", 3],
];

const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(
    `INSERT INTO contact_settings (
       slug, email, phone, whatsapp_number, location_es, location_en,
       business_hours_weekdays_es, business_hours_weekdays_en,
       business_hours_weekend_es, business_hours_weekend_en
     )
     VALUES (
       'main', 'fishertstudio@gmail.com', '+57 311 251 2939', '573112512939',
       'Colombia · Remoto global', 'Colombia · Global remote',
       'Lun – Vie · 8:00 am – 9:00 pm', 'Mon – Fri · 8:00 am – 9:00 pm',
       'Sáb – Dom · 8:00 am – 2:00 pm', 'Sat – Sun · 8:00 am – 2:00 pm'
     )
     ON CONFLICT (slug) DO UPDATE SET
       email = EXCLUDED.email,
       phone = EXCLUDED.phone,
       whatsapp_number = EXCLUDED.whatsapp_number,
       location_es = EXCLUDED.location_es,
       location_en = EXCLUDED.location_en,
       business_hours_weekdays_es = EXCLUDED.business_hours_weekdays_es,
       business_hours_weekdays_en = EXCLUDED.business_hours_weekdays_en,
       business_hours_weekend_es = EXCLUDED.business_hours_weekend_es,
       business_hours_weekend_en = EXCLUDED.business_hours_weekend_en,
       updated_at = NOW()`,
  );

  for (const [category, label, icon, url, sortOrder] of socialLinks) {
    await client.query(
      `INSERT INTO social_links (category, label, icon, url, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [category, label, icon, url, sortOrder],
    );
  }

  for (const category of categories) {
    const savedCategory = await client.query(
      `INSERT INTO service_categories (slug, name_es, name_en)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name_es = EXCLUDED.name_es, name_en = EXCLUDED.name_en
       RETURNING id`,
      [category.slug, category.nameEs, category.nameEn],
    );
    const categoryId = savedCategory.rows[0].id;

    for (const [sortOrder, plan] of category.plans.entries()) {
      const [slug, nameEs, nameEn, price, isCustom, features] = plan;
      const savedPlan = await client.query(
        `INSERT INTO plans (service_category_id, slug, name_es, name_en, price, currency, period_es, period_en, badge_es, badge_en, is_custom, sort_order)
         VALUES ($1, $2, $3, $4, $5, 'COP', 'por proyecto', 'per project', $6, $7, $8, $9)
         ON CONFLICT (service_category_id, slug) DO UPDATE SET name_es = EXCLUDED.name_es, name_en = EXCLUDED.name_en, price = EXCLUDED.price, is_custom = EXCLUDED.is_custom, sort_order = EXCLUDED.sort_order
         RETURNING id`,
        [categoryId, slug, nameEs, nameEn, price, sortOrder === 1 ? "Más popular" : null, sortOrder === 1 ? "Most popular" : null, isCustom, sortOrder],
      );
      const planId = savedPlan.rows[0].id;
      const existing = await client.query(
        "SELECT 1 FROM plan_features WHERE plan_id = $1 LIMIT 1",
        [planId],
      );
      if (existing.rowCount === 0) {
        for (const [featureOrder, [textEs, textEn]] of features.entries()) {
          await client.query(
            `INSERT INTO plan_features (plan_id, text_es, text_en, sort_order)
             VALUES ($1, $2, $3, $4)`,
            [planId, textEs, textEn, featureOrder],
          );
        }
      }
    }
  }
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}