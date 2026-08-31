import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLang } from "./LanguageContext";
import ReviewForm from "./ReviewForm";
import resenasBust from "@assets/resenas_bust.png";
import { useListPublishedReviews } from "@workspace/api-client-react";

type Review = {
  quote: string;
  author: string;
  company: string;
  stars: number;
};

/* Blue Twitter-style verified badge */
function BlueBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      aria-label="Verificado" style={{ flexShrink: 0 }}>
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z"
        fill="#1D9BF0"
        stroke="none"
      />
      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const Stars = ({ count, lang }: { count: number; lang: "es" | "en" }) => (
  <div
    className="resena-stars"
    aria-label={`${lang === "es" ? "Calificación" : "Rating"}: ${count} de 5`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="resena-star">★</span>
    ))}
    <span className="resena-rating-score">{count}/5</span>
    <span className="resena-verified">
      {lang === "es" ? "Usuario verificado" : "Verified user"}
      <BlueBadge />
    </span>
  </div>
);

const VISIBLE = 2;

function useMobileReviewsLayout() {
  const query = "(max-width: 768px)";
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  return isMobile;
}

function RatingSummary({ list, lang }: { list: Review[]; lang: "es" | "en" }) {
  if (list.length === 0) return null;

  const average = list.reduce((total, review) => total + review.stars, 0) / list.length;
  const formattedAverage = average.toFixed(1);

  return (
    <div
      className="resenas-rating-summary"
      aria-label={`${lang === "es" ? "Calificación promedio" : "Average rating"}: ${formattedAverage} ${lang === "es" ? "de 5" : "out of 5"}, ${list.length} ${lang === "es" ? "reseñas" : "reviews"}`}
    >
      <span>{formattedAverage}</span>
      <span className="resenas-rating-summary-star" aria-hidden="true">★</span>
      <span>({list.length})</span>
      <span aria-hidden="true">·</span>
      <span>{lang === "es" ? "Agencia de software" : "Software agency"}</span>
    </div>
  );
}

function ReviewsCarousel({
  list,
  lang,
  isLoading,
  isError,
  onAddReview,
}: {
  list: Review[];
  lang: "es" | "en";
  isLoading: boolean;
  isError: boolean;
  onAddReview: () => void;
}) {
  const [start, setStart] = useState(0);
  const isMobile = useMobileReviewsLayout();
  const swipeStartX = useRef<number | null>(null);
  const itemsPerPage = isMobile ? 1 : VISIBLE;
  const pages = Math.max(1, list.length - itemsPerPage + 1);
  const clamp = (n: number) => Math.max(0, Math.min(n, pages - 1));
  const goPrev = () => setStart(clamp(start - 1));
  const goNext = () => setStart(clamp(start + 1));
  const visible = isMobile ? list : list.slice(start, start + VISIBLE);

  useEffect(() => {
    setStart(0);
  }, [isMobile, lang]);

  const handleSwipeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isMobile || event.pointerType === "mouse") return;
    swipeStartX.current = event.clientX;
  };

  const handleSwipeEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return;

    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  return (
    <>
      <div
        className={`resenas-grid${isMobile ? " resenas-grid--mobile" : ""}`}
        onPointerDown={handleSwipeStart}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        {isLoading ? (
          <p className="resenas-empty">
            {lang === "es" ? "Cargando reseñas…" : "Loading reviews…"}
          </p>
        ) : isError ? (
          <p className="resenas-empty">
            {lang === "es"
              ? "No se pudieron cargar las reseñas."
              : "Reviews could not be loaded."}
          </p>
        ) : list.length === 0 ? (
          <p className="resenas-empty">
            {lang === "es"
              ? "Aún no se tienen reseñas disponibles."
              : "No reviews are available yet."}
          </p>
        ) : (
          <div
            className="resenas-track"
            style={isMobile ? { transform: `translateX(-${start * 100}%)` } : undefined}
          >
            {visible.map((r, i) => (
              <div key={`${isMobile ? "mobile" : start}-${r.author}-${i}`} className="resena-card">
                <Stars count={r.stars} lang={lang} />
                <blockquote className="resena-quote">"{r.quote}"</blockquote>
                <div className="resena-author">
                  <span className="resena-name">{r.author}</span>
                  <span className="resena-company">{r.company}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="resenas-controls">
        <button type="button" className="resenas-cta-btn" onClick={onAddReview}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {lang === "es" ? "Agregar reseña" : "Add a review"}
        </button>

        {list.length > 0 && <div className="resenas-nav">
          <button
            type="button"
            className="resenas-arrow"
            onClick={goPrev}
            disabled={start === 0}
            aria-label={lang === "es" ? "Anterior" : "Previous"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="resenas-dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={`resenas-dot${i === start ? " resenas-dot--active" : ""}`}
                onClick={() => setStart(clamp(i))}
                aria-label={`${lang === "es" ? "Ir a" : "Go to"} ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="resenas-arrow"
            onClick={goNext}
            disabled={start >= pages - 1}
            aria-label={lang === "es" ? "Siguiente" : "Next"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>}
      </div>
    </>
  );
}

export default function Resenas() {
  const { lang } = useLang();
  const { data: publishedReviews, isLoading, isError } = useListPublishedReviews();
  const reviewRows = Array.isArray(publishedReviews) ? publishedReviews : [];
  const list: Review[] = reviewRows.map((review) => ({
    quote: review.text,
    author: review.name,
    company: review.company ?? "",
    stars: review.rating,
  }));
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="resenas"
      ref={sectionRef}
      className={`resenas-section${isVisible ? " resenas-section--visible" : ""}`}
    >
      <div className="resenas-inner">
        <div className="resenas-layout">
          <div className="resenas-content">
            <div className="resenas-header">
              <h2 className="resenas-heading">
                <span className="resenas-heading-desktop">
                  {lang === "es" ? "Lo que dicen nuestros clientes." : "What our clients say."}
                </span>
                <span className="resenas-heading-mobile">
                  {lang === "es" ? "Nuestros clientes" : "Our clients"}
                </span>
              </h2>
              <p className="resenas-sub">
                {lang === "es"
                  ? "Clientes satisfechos que hablan de nuestro trabajo."
                  : "Satisfied clients who speak about our work."}
              </p>
              <RatingSummary list={list} lang={lang} />
            </div>

            <ReviewsCarousel
              list={list}
              lang={lang}
              isLoading={isLoading}
              isError={isError}
              onAddReview={() => setShowForm(true)}
            />
          </div>

          <div className="resenas-bust" aria-hidden="true">
            <img src={resenasBust} alt="" className="resenas-bust-img" />
          </div>
        </div>
      </div>

      {/* Bottom wave — single boundary into Preguntas Frecuentes (orange).
          Same signature wave used across the FAQ section. */}
      <svg
        className="resenas-wave resenas-wave--bottom"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#E8621E" />
      </svg>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </section>
  );
}