import { useLang } from "./LanguageContext";

const content = {
  es: {
    heading: ["TRABAJEMOS", "JUNTOS."],
    copy: "© Fishert Software Agency 2026",
  },
  en: {
    heading: ["LET'S WORK", "TOGETHER."],
    copy: "© Fishert Software Agency 2026",
  },
};

export default function Footer() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <footer id="contact" className="footer-section">
      <div className="footer-inner">
        <div className="footer-top">
          <h2 className="footer-heading">
            {t.heading[0]}<br />{t.heading[1]}
          </h2>
          <a href="mailto:hola@fishert.io" className="footer-email">
            hola@fishert.io
          </a>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">{t.copy}</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link">Instagram</a>
            <a href="#" className="footer-social-link">Behance</a>
            <a href="#" className="footer-social-link">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
