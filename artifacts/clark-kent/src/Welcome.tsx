import { useLang } from "./LanguageContext";

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    body: "Somos una agencia de software especializada en diseñar, construir y escalar productos digitales de alto impacto. Convertimos ideas ambiciosas en experiencias reales que posicionan a los negocios como líderes de su industria.",
  },
  en: {
    title: "Welcome to Fishert Studio",
    body: "We are a software agency specialized in designing, building and scaling high-impact digital products. We turn ambitious ideas into real experiences that position businesses as leaders of their industry.",
  },
};

export default function Welcome() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <section className="welcome-section">
      <div className="welcome-inner">
        <h2 className="wlc-title">{t.title}</h2>
        <p className="wlc-body">{t.body}</p>
      </div>
    </section>
  );
}
