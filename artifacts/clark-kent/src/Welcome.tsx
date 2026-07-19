import { useLang } from "./LanguageContext";

const content = {
  es: {
    title: "Bienvenidos a Fishert Studio",
    body: "Somos una agencia de software que diseña, construye y escala productos digitales que transforman negocios en líderes de su industria.",
  },
  en: {
    title: "Welcome to Fishert Studio",
    body: "We are a software agency that designs, builds and scales digital products — turning businesses into leaders of their industry.",
  },
};

export default function Welcome() {
  const { lang } = useLang();
  const t = content[lang];

  return (
    <section className="welcome-section">
      <div className="welcome-inner">
        <h2 className="welcome-title">{t.title}</h2>
        <p className="welcome-body">{t.body}</p>
      </div>
    </section>
  );
}
