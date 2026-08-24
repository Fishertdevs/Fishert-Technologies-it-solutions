import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const navLinks = {
  es: [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Portafolio", href: "#portafolio" },
    { label: "Contacto", href: "#contacto" },
  ],
  en: [
    { label: "Home", href: "#inicio" },
    { label: "Services", href: "#servicios" },
    { label: "About", href: "#nosotros" },
    { label: "Portfolio", href: "#portafolio" },
    { label: "Contact", href: "#contacto" },
  ],
};

const NAVBAR_H = 72; // px — approximate navbar height

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [textOverlap, setTextOverlap] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggle } = useLang();
  const [location] = useLocation();
  const links = navLinks[lang];

  // On policy pages there is no dark hero — force light style immediately
  const isPolicyPage = ["/terminos", "/cookies", "/privacidad"].includes(location);
  const isServiceDetail = location.startsWith("/servicios/");


  useEffect(() => {
    // Only create the trigger when the welcome section actually exists (main page)
    if (!document.querySelector(".welcome-section")) return;
    const trigger = ScrollTrigger.create({
      trigger: ".welcome-section",
      start: "top top",
      onEnter: () => setPastHero(true),
      onLeaveBack: () => setPastHero(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    // Only run the RAF loop when the hero text element exists (main page)
    if (!document.querySelector(".about-lines")) return;
    const check = () => {
      const lines = document.querySelector(".about-lines") as HTMLElement | null;
      if (!lines) return;
      const rect = lines.getBoundingClientRect();
      setTextOverlap(rect.top < NAVBAR_H && rect.bottom > 0);
    };
    window.addEventListener("scroll", check, { passive: true });
    let rafId: number;
    const loop = () => { check(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", check);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const cls = isPolicyPage || isServiceDetail || pastHero
    ? "navbar navbar--light"
    : textOverlap
    ? "navbar navbar--text-overlap"
    : "navbar";

  return (
    <nav className={cls}>
      <a className="navbar-logo" href="#inicio" onClick={(e) => handleClick(e, "#inicio")}>
        <span className="navbar-logo-short">FISHERT STUDIO</span>
        <span className="navbar-logo-full"> · SOFTWARE AGENCY</span>
      </a>
      <ul className="navbar-links">
        {links.map((l) => (
          <li key={l.label}>
            <a className="navbar-link" href={l.href} onClick={(e) => handleClick(e, l.href)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className={`navbar-menu-toggle ${menuOpen ? "navbar-menu-toggle--open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="navbar-menu-line" />
        <span className="navbar-menu-line" />
        <span className="navbar-menu-line" />
      </button>

      <button className="navbar-lang-toggle" onClick={toggle} aria-label="Toggle language">
        <span
          className="navbar-lang-slider"
          style={{ transform: lang === "en" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
        />
        <span className={`navbar-lang-opt ${lang === "es" ? "navbar-lang-opt--active" : ""}`}>ES</span>
        <span className={`navbar-lang-opt ${lang === "en" ? "navbar-lang-opt--active" : ""}`}>EN</span>
      </button>

      <div
        className={`navbar-mobile-backdrop ${menuOpen ? "navbar-mobile-backdrop--open" : ""}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      <aside
        id="mobile-navigation"
        className={`navbar-mobile-panel ${menuOpen ? "navbar-mobile-panel--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar-mobile-links">
          {links.map((l) => (
            <li key={l.label}>
              <a className="navbar-mobile-link" href={l.href} onClick={(e) => handleClick(e, l.href)}>
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>

      </aside>
    </nav>
  );
}
