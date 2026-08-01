import { useEffect } from "react";
import { Link } from "wouter";
import { useLang } from "../LanguageContext";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Props {
  title: string;
  date: string;
  sections: { heading?: string; subheading?: string; body: string }[];
}

export default function PolicyLayout({ title, date, sections }: Props) {
  const { lang } = useLang();

  // Always start at the top of the page
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Scroll-reveal on the article body
  const bodyRef = useScrollReveal(".reveal");

  return (
    <>
      <Navbar />
      <main className="policy-page">
        {/* Back link */}
        <div className="policy-back-wrap">
          <Link href="/" className="policy-back">
            ← {lang === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
        </div>

        {/* Body with reveal — hero is first child so it's observed too */}
        <article
          className="policy-body"
          ref={bodyRef as React.RefObject<HTMLElement>}
        >
          <header className="policy-hero reveal">
            <h1 className="policy-title">{title}</h1>
            <p className="policy-date">{date}</p>
          </header>

          {sections.map((s, i) => (
            <div key={i} className="policy-section reveal">
              {s.heading && <h2>{s.heading}</h2>}
              {s.subheading && <h3>{s.subheading}</h3>}
              <p>{s.body}</p>
            </div>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
