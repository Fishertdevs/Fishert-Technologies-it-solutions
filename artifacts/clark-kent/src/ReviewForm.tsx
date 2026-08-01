import { useState, useRef } from "react";
import { useLang } from "./LanguageContext";

interface Props {
  onClose: () => void;
}

const copy = {
  es: {
    tabs: ["Calificación", "Tus datos", "Tu reseña"],
    step1: {
      title: "¿Cómo fue tu experiencia?",
      sub: "Selecciona una calificación para continuar.",
      labels: ["", "Muy malo", "Regular", "Bueno", "Muy bueno", "Excelente"],
    },
    step2: {
      title: "Cuéntanos quién eres.",
      sub: "Tu nombre aparecerá junto a tu reseña.",
      name: "Nombre completo",
      company: "Empresa o proyecto (opcional)",
      namePh: "Ej. Carlos M.",
      companyPh: "Ej. Alterego Store",
    },
    step3: {
      title: "Comparte tu experiencia.",
      sub: "Tu opinión ayuda a otros a conocer nuestro trabajo.",
      label: "Tu reseña",
      ph: "Cuéntanos qué fue lo que más valoraste del trabajo con Fishert Studio…",
    },
    back: "Atrás",
    next: "Continuar",
    submit: "Publicar reseña",
    required: "Este campo es requerido.",
    success: {
      title: "¡Gracias por tu reseña!",
      sub: "Tu opinión es muy valiosa para nosotros.",
      cta: "Cerrar",
    },
  },
  en: {
    tabs: ["Rating", "Your info", "Your review"],
    step1: {
      title: "How was your experience?",
      sub: "Select a rating to continue.",
      labels: ["", "Very bad", "Poor", "Good", "Very good", "Excellent"],
    },
    step2: {
      title: "Tell us who you are.",
      sub: "Your name will appear alongside your review.",
      name: "Full name",
      company: "Company or project (optional)",
      namePh: "E.g. Carlos M.",
      companyPh: "E.g. Alterego Store",
    },
    step3: {
      title: "Share your experience.",
      sub: "Your feedback helps others discover our work.",
      label: "Your review",
      ph: "Tell us what you valued most about working with Fishert Studio…",
    },
    back: "Back",
    next: "Continue",
    submit: "Publish review",
    required: "This field is required.",
    success: {
      title: "Thank you for your review!",
      sub: "Your opinion means a lot to us.",
      cta: "Close",
    },
  },
};

export default function ReviewForm({ onClose }: Props) {
  const { lang } = useLang();
  const t = copy[lang];

  const [step, setStep] = useState(0);           // 0-based: 0,1,2
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [reviewErr, setReviewErr] = useState(false);
  const [done, setDone] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const TOTAL = 3;
  const slidePercent = `${step * -(100 / TOTAL)}%`;

  function goNext() {
    if (step === 0 && rating === 0) return;
    if (step === 1) {
      if (!name.trim()) { setNameErr(true); return; }
      setNameErr(false);
    }
    if (step === 2) {
      if (!review.trim()) { setReviewErr(true); return; }
      setReviewErr(false);
      setDone(true);
      return;
    }
    setStep(s => s + 1);
  }

  function goBack() {
    if (step > 0) setStep(s => s - 1);
  }

  const display = hovered || rating;

  return (
    <div
      className="rf-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rf-modal">

        {/* Close */}
        <button className="rf-close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {done ? (
          /* ── SUCCESS ─────────────────────────────────────── */
          <div className="rf-success">
            <div className="rf-success-check">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#C0001A" strokeWidth="1.5"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#C0001A" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="rf-success-title">{t.success.title}</h3>
            <p className="rf-success-sub">{t.success.sub}</p>
            <div className="rf-success-stars">
              {Array.from({ length: rating }).map((_, i) => (
                <span key={i} className="rf-star-static">★</span>
              ))}
            </div>
            <button className="rf-txt-btn" onClick={onClose}>
              {t.success.cta}
            </button>
          </div>
        ) : (
          <>
            {/* ── TABS (cslider style) ─────────────────────── */}
            <div className="rf-tabs">
              {t.tabs.map((label, i) => (
                <button
                  key={i}
                  className={`rf-tab${step === i ? " rf-tab--active" : ""}${step > i ? " rf-tab--done" : ""}`}
                  onClick={() => { if (step > i) setStep(i); }}
                  tabIndex={step > i ? 0 : -1}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── SLIDING TRACK ────────────────────────────── */}
            <div className="rf-track-wrap">
              <div
                ref={trackRef}
                className="rf-track"
                style={{ transform: `translateX(${slidePercent})` }}
              >
                {/* ── STEP 0: Rating ── */}
                <div className="rf-slide">
                  <div className="rf-slide-inner">
                    <h3 className="rf-title">{t.step1.title}</h3>
                    <p className="rf-sub">{t.step1.sub}</p>
                    <div className="rf-star-row">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          className={`rf-star${n <= display ? " rf-star--on" : ""}`}
                          onMouseEnter={() => setHovered(n)}
                          onMouseLeave={() => setHovered(0)}
                          onClick={() => setRating(n)}
                          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                        >★</button>
                      ))}
                    </div>
                    {display > 0 && (
                      <p className="rf-star-label">{t.step1.labels[display]}</p>
                    )}
                  </div>
                </div>

                {/* ── STEP 1: Info ── */}
                <div className="rf-slide">
                  <div className="rf-slide-inner">
                    <h3 className="rf-title">{t.step2.title}</h3>
                    <p className="rf-sub">{t.step2.sub}</p>
                    <div className="rf-field">
                      <label className="rf-label">
                        {t.step2.name} <span className="rf-req">*</span>
                      </label>
                      <input
                        className={`rf-input${nameErr ? " rf-input--err" : ""}`}
                        placeholder={t.step2.namePh}
                        value={name}
                        onChange={e => { setName(e.target.value); setNameErr(false); }}
                      />
                      {nameErr && <span className="rf-err-msg">{t.required}</span>}
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">{t.step2.company}</label>
                      <input
                        className="rf-input"
                        placeholder={t.step2.companyPh}
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ── STEP 2: Review ── */}
                <div className="rf-slide">
                  <div className="rf-slide-inner">
                    <h3 className="rf-title">{t.step3.title}</h3>
                    <p className="rf-sub">{t.step3.sub}</p>
                    {/* Mini recap */}
                    <div className="rf-recap">
                      {Array.from({ length: rating }).map((_, i) => (
                        <span key={i} className="rf-star-static">★</span>
                      ))}
                      {name && <span className="rf-recap-name">{name}</span>}
                    </div>
                    <div className="rf-field">
                      <label className="rf-label">
                        {t.step3.label} <span className="rf-req">*</span>
                      </label>
                      <textarea
                        className={`rf-input rf-textarea${reviewErr ? " rf-input--err" : ""}`}
                        placeholder={t.step3.ph}
                        rows={4}
                        value={review}
                        onChange={e => { setReview(e.target.value); setReviewErr(false); }}
                      />
                      {reviewErr && <span className="rf-err-msg">{t.required}</span>}
                    </div>
                  </div>
                </div>

              </div>{/* .rf-track */}
            </div>{/* .rf-track-wrap */}

            {/* ── ACTIONS ─────────────────────────────────── */}
            <div className="rf-actions">
              <button
                className={`rf-txt-btn rf-txt-btn--dim${step === 0 ? " rf-txt-btn--hidden" : ""}`}
                onClick={goBack}
                tabIndex={step === 0 ? -1 : 0}
              >
                {t.back}
              </button>
              <button
                className={`rf-txt-btn${step === 0 && rating === 0 ? " rf-txt-btn--disabled" : ""}`}
                onClick={goNext}
              >
                {step === 2 ? t.submit : t.next}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
