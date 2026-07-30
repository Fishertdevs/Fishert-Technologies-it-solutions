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
  const { lang, toggle } = useLang();
  const [location] = useLocation();
  const links = navLinks[lang];

  // On policy pages there is no dark hero — force light style immediately
  const isPolicyPage = ["/terminos", "/cookies", "/privacidad"].includes(location);


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
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const cls = isPolicyPage || pastHero
    ? "navbar navbar--light"
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
