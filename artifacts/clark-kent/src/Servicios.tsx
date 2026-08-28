import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLang } from "./LanguageContext";
import webDevelopmentCover from "@assets/image_1786122218586.png";
import softwareDevelopmentCover from "@assets/image_1786122258578.png";
import automationCover from "@assets/image_1786122289910.png";
import marketingCover from "@assets/image_1786122274168.png";

const base = import.meta.env.BASE_URL || "/";

const galleryData = [
  { id: 1, img: webDevelopmentCover, num: "I",    pos: "center center", es: "Desarrollo Web",         en: "Web Development",       slug: "desarrollo-web" },
  { id: 2, img: softwareDevelopmentCover, num: "II",   pos: "center bottom", es: "Desarrollo de Software", en: "Software Development",  slug: "desarrollo-software" },
  { id: 3, img: automationCover, num: "III",  pos: "center center", es: "Automatización e IA",    en: "Automation & AI",       slug: "automatizacion-ia" },
  { id: 4, img: marketingCover, num: "IV",   pos: "center center", es: "Marketing Digital",      en: "Digital Marketing",     slug: "marketing-digital" },
  { id: 5, img: "svc5_2.jpg", num: "V",    pos: "center bottom", es: "Cloud y DevOps",         en: "Cloud & DevOps",        slug: "cloud-devops" },
];

export default function Servicios() {
  const mobileTouchStart = useRef<{ x: number; y: number } | null>(null);
  const mobileSwipeMoved = useRef(false);
  const mobileJustSwiped = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const { lang } = useLang();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const syncMobile = () => setIsMobile(media.matches);
    syncMobile();
    media.addEventListener("change", syncMobile);
    return () => media.removeEventListener("change", syncMobile);
  }, []);

  const changeMobileSlide = (direction: number) => {
    setMobileIndex((current) => (current + direction + galleryData.length) % galleryData.length);
  };

  const finishMobileSwipe = (endX: number, endY: number) => {
    const start = mobileTouchStart.current;
    mobileTouchStart.current = null;
    mobileSwipeMoved.current = false;
    if (!start) return;

    const deltaX = start.x - endX;
    const deltaY = start.y - endY;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    changeMobileSlide(deltaX > 0 ? 1 : -1);
  };

  const activeMobileService = galleryData[mobileIndex];

  return (
    <section
      id="servicios"
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "repeating-conic-gradient(#111111 0% 25%, #333333 0% 50%) center / 52px 52px",
        position: "relative",
        borderRadius: "56px",
      }}
    >
      {/* Top wave — white to match the section above */}
      <svg
        style={{ position: "absolute", top: -1, left: 0, width: "100%", height: 80, zIndex: 20, display: "block", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,32 C1200,72 960,2 720,32 C480,72 240,2 0,32 Z" fill="#ffffff" />
      </svg>

      <div className="works-text-block">
        <h2 className="works-heading">
          {lang === "es" ? "NUESTROS SERVICIOS." : "OUR SERVICES."}
        </h2>
        <p className="works-tagline">
          <span className="works-tagline-desktop">
            {lang === "es"
              ? <>Diseñamos, desarrollamos y escalamos<br />soluciones digitales para marcas<br />que buscan liderar.</>
              : <>We design, build and scale digital<br />solutions for brands that aim to lead.</>}
          </span>
          <span className="works-tagline-mobile">
            {lang === "es"
              ? <>Diseñamos, desarrollamos y<br />escalamos soluciones digitales<br />para marcas que buscan liderar.</>
              : <>We design, build and scale<br />digital solutions for brands<br />that aim to lead.</>}
          </span>
        </p>
      </div>

      {isMobile ? (
        <div
          className="svc-mobile-carousel"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
             if ((event.target as HTMLElement).closest("a, button")) return;
             mobileTouchStart.current = { x: event.clientX, y: event.clientY };
             mobileSwipeMoved.current = false;
             event.currentTarget.setPointerCapture?.(event.pointerId);
           }}
           onPointerMove={(event) => {
             const start = mobileTouchStart.current;
             if (!start) return;
             const deltaX = Math.abs(start.x - event.clientX);
             const deltaY = Math.abs(start.y - event.clientY);
             if (deltaX > 12 && deltaX > deltaY) {
               mobileSwipeMoved.current = true;
               event.preventDefault();
             }
          }}
          onPointerUp={(event) => {
             const didSwipe = mobileSwipeMoved.current;
             finishMobileSwipe(event.clientX, event.clientY);
             if (didSwipe) {
               mobileJustSwiped.current = true;
               event.preventDefault();
             }
          }}
          onPointerCancel={() => {
            mobileTouchStart.current = null;
             mobileSwipeMoved.current = false;
             mobileJustSwiped.current = false;
          }}
           onClick={(event) => {
             if (mobileJustSwiped.current) {
               event.preventDefault();
               mobileJustSwiped.current = false;
             }
           }}
        >
          <article className="svc-mobile-card" key={activeMobileService.id}>
            <img
              src={/^(https?:)?\/\//.test(activeMobileService.img) || activeMobileService.img.startsWith("/") ? activeMobileService.img : `${base}${activeMobileService.img}`}
              alt={lang === "es" ? activeMobileService.es : activeMobileService.en}
            />
            <div className="svc-label-overlay">
              <span className="svc-label-num">{activeMobileService.num}</span>
              <div className="svc-label-bottom">
                <span className="svc-label-title">{lang === "es" ? activeMobileService.es : activeMobileService.en}</span>
                <Link
                  href={`/servicios/${activeMobileService.slug}`}
                  className="svc-ver-mas"
                  onClick={(event) => event.stopPropagation()}
                >
                  {lang === "es" ? "Ver más" : "View more"}
                </Link>
              </div>
            </div>
          </article>

          <div className="svc-mobile-nav" aria-label={lang === "es" ? "Navegación de servicios" : "Service navigation"}>
            <div className="svc-mobile-dots">
              {galleryData.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`svc-mobile-dot${index === mobileIndex ? " svc-mobile-dot--active" : ""}`}
                  onClick={() => setMobileIndex(index)}
                  aria-label={`${lang === "es" ? "Ir al servicio" : "Go to service"} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="svc-desktop-grid">
          {galleryData.map((item) => (
            <div
              key={item.id}
              className={`svc-item svc-item--${item.id}`}
            >
              <img
                src={/^(https?:)?\/\//.test(item.img) || item.img.startsWith("/") ? item.img : `${base}${item.img}`}
                alt={lang === "es" ? item.es : item.en}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: item.pos,
                  display: "block",
                }}
              />
              <div className="svc-label-overlay">
                <span className="svc-label-num">{item.num}</span>
                <div className="svc-label-bottom">
                  <span className="svc-label-title">{lang === "es" ? item.es : item.en}</span>
                  <Link
                    href={`/servicios/${item.slug}`}
                    className="svc-ver-mas"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lang === "es" ? "Ver más" : "View more"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
