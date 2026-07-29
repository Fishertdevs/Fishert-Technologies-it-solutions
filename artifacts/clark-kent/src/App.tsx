import { Router, Route, Switch } from "wouter";
import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Welcome from "./Welcome";
import Servicios from "./Servicios";
import Socios from "./Socios";
import Nosotros from "./Nosotros";
import Portafolio from "./Portafolio";
import Resenas from "./Resenas";
import Contacto from "./Contacto";
import Footer from "./Footer";
import CookieBanner from "./components/CookieBanner";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import NotFound from "./pages/not-found";

const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function MainPage() {
  return (
    <>
      <Navbar />
      <About />
      <Welcome />
      <Servicios />
      <Socios />
      <Nosotros />
      <Portafolio />
      <Resenas />
      <Contacto />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router base={base}>
        <Switch>
          <Route path="/" component={MainPage} />
          <Route path="/terminos" component={TerminosCondiciones} />
          <Route path="/cookies" component={PoliticaCookies} />
          <Route path="/privacidad" component={PoliticaPrivacidad} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <CookieBanner />
    </LanguageProvider>
  );
}
