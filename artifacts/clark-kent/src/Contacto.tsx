import { useState } from "react";
import { useLang } from "./LanguageContext";

const content = {
  es: {
    label: "¿Tienes un proyecto en mente?",
    title: "Hablemos.",
    sub: "Cuéntanos tu idea y construimos juntos la solución.",
    fields: {
      name: "Nombre completo",
      company: "Empresa o proyecto",
      email: "Correo electrónico",
      phone: "Teléfono (opcional)",
      type: "Tipo de proyecto",
      typeOptions: [
        "Sitio web / Landing page",
        "Aplicación web",
        "App móvil",
        "E-commerce",
        "Branding & Diseño",
        "Otro",
      ],
      message: "Cuéntanos tu idea",
      submit: "Enviar mensaje",
      sending: "Enviando…",
    },
    success: "¡Mensaje enviado! Te contactamos pronto.",
    info: [
      { label: "Email", value: "hola@fishertstudio.com" },
      { label: "WhatsApp", value: "+57 300 000 0000" },
      { label: "Ubicación", value: "Colombia · Remoto global" },
    ],
  },
  en: {
    label: "Have a project in mind?",
    title: "Let's talk.",
    sub: "Tell us your idea and we'll build the solution together.",
    fields: {
      name: "Full name",
      company: "Company or project",
      email: "Email address",
      phone: "Phone (optional)",
      type: "Project type",
      typeOptions: [
        "Website / Landing page",
        "Web application",
        "Mobile app",
        "E-commerce",
        "Branding & Design",
        "Other",
      ],
      message: "Tell us about your idea",
      submit: "Send message",
      sending: "Sending…",
    },
    success: "Message sent! We'll be in touch soon.",
    info: [
      { label: "Email", value: "hello@fishertstudio.com" },
      { label: "WhatsApp", value: "+57 300 000 0000" },
      { label: "Location", value: "Colombia · Global remote" },
    ],
  },
};

export default function Contacto() {
  const { lang } = useLang();
  const t = content[lang];
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <section id="contacto-form" className="contacto-section">
      <div className="contacto-inner">

        {/* Left — info */}
        <div className="contacto-left">
          <span className="contacto-label">{t.label}</span>
          <h2 className="contacto-title">{t.title}</h2>
          <p className="contacto-sub">{t.sub}</p>

          <ul className="contacto-info-list">
            {t.info.map((item) => (
              <li key={item.label} className="contacto-info-item">
                <span className="contacto-info-label">{item.label}</span>
                <span className="contacto-info-value">{item.value}</span>
              </li>
            ))}
          </ul>

          {/* Decorative checkerboard strip */}
          <div className="contacto-deco" aria-hidden="true" />
        </div>

        {/* Right — form */}
        <div className="contacto-right">
          {sent ? (
            <div className="contacto-success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C0001A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <p>{t.success}</p>
            </div>
          ) : (
            <form className="contacto-form" onSubmit={handleSubmit} noValidate>
              <div className="contacto-row">
                <div className="contacto-field">
                  <label className="contacto-field-label">{t.fields.name} *</label>
                  <input className="contacto-input" type="text" placeholder={t.fields.name} required />
                </div>
                <div className="contacto-field">
                  <label className="contacto-field-label">{t.fields.company}</label>
                  <input className="contacto-input" type="text" placeholder={t.fields.company} />
                </div>
              </div>
              <div className="contacto-row">
                <div className="contacto-field">
                  <label className="contacto-field-label">{t.fields.email} *</label>
                  <input className="contacto-input" type="email" placeholder={t.fields.email} required />
                </div>
                <div className="contacto-field">
                  <label className="contacto-field-label">{t.fields.phone}</label>
                  <input className="contacto-input" type="tel" placeholder={t.fields.phone} />
                </div>
              </div>
              <div className="contacto-field">
                <label className="contacto-field-label">{t.fields.type}</label>
                <select className="contacto-input contacto-select">
                  <option value="">— {t.fields.type} —</option>
                  {t.fields.typeOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="contacto-field">
                <label className="contacto-field-label">{t.fields.message} *</label>
                <textarea className="contacto-input contacto-textarea" rows={5}
                  placeholder={t.fields.message} required />
              </div>
              <button type="submit" className="contacto-submit" disabled={sending}>
                {sending ? t.fields.sending : t.fields.submit}
                {!sending && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
