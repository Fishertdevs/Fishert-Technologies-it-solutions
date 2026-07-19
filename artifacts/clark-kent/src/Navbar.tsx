import { useEffect, useState } from "react";
import { useLang } from "./LanguageContext";

const navLinks = {
  es: [
    { label: "Nosotros", href: "#about" },
    { label: "Proyectos", href: "#works" },
    { label: "Servicios", href: "#services" },
    { label: "Contacto", href: "#contact" },
  ],
  en: [
    { label: "About", href: "#about" },
    { label: "Works", href: "#works" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle } = useLang();
  const links = navLinks[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <a className="navbar-logo" href="#about" onClick={(e) => handleClick(e, "#about")}>
        FISHERT<span className="navbar-logo-dot">.</span>
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
