import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <a className="navbar-logo" href="#about" onClick={(e) => handleClick(e, "#about")}>
        FISHERT<span className="navbar-logo-dot">.</span>
      </a>
      <ul className="navbar-links">
        {links.map((l) => (
          <li key={l.label}>
            <a
              className="navbar-link"
              href={l.href}
              onClick={(e) => handleClick(e, l.href)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="navbar-cta" href="#contact" onClick={(e) => handleClick(e, "#contact")}>
        Get in touch
      </a>
    </nav>
  );
}
