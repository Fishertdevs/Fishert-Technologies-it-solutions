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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
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
