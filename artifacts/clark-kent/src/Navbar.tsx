import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [textOverlap, setTextOverlap] = useState(false);
  const { lang, toggle } = useLang();
  const links = navLinks[lang];

  useEffect(() => {
    // Fire exactly when .welcome-section reaches the top of the viewport
    const trigger = ScrollTrigger.create({
      trigger: ".welcome-section",
      start: "top top",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    // Add backdrop when hero text overlaps the navbar zone
    const check = () => {
      const lines = document.querySelector(".about-lines") as HTMLElement | null;
      if (!lines) return;
      const rect = lines.getBoundingClientRect();
      setTextOverlap(rect.top < NAVBAR_H && rect.bottom > 0);
    };
    window.addEventListener("scroll", check, { passive: true });
    // Also run on each animation frame while hero is active (GSAP scrub)
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
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const cls = scrolled
    ? "navbar navbar--scrolled"
    : textOverlap
    ? "navbar navbar--text-overlap"
    : "navbar";

  return (
    <nav className={cls}>
      <a className="navbar-logo" href="#inicio" onClick={(e) => handleClick(e, "#inicio")}>
        FISHERT STUDIO · SOFTWARE AGENCY
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
      <button className="navbar-lang-toggle" onClick={toggle} aria-label="Toggle language">
        <span className={lang === "es" ? "navbar-lang--active" : ""}>ES</span>
        <span className="navbar-lang-sep">/</span>
        <span className={lang === "en" ? "navbar-lang--active" : ""}>EN</span>
      </button>
    </nav>
  );
}
