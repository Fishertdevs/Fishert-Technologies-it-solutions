import { Router, Route, Switch } from "wouter";
import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Welcome from "./Welcome";
import Servicios from "./Servicios";
import Socios from "./Socios";
import Nosotros from "./Nosotros";
import Portafolio from "./Portafolio";
import PortfolioCTA from "./PortfolioCTA";
import Resenas from "./Resenas";
import PreguntasFrecuentes from "./PreguntasFrecuentes";
import Contacto from "./Contacto";
import Footer from "./Footer";
import CookieBanner from "./components/CookieBanner";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import ServicioDetalle from "./pages/ServicioDetalle";
import QuienesSomos from "./pages/QuienesSomos";
import CasoEstudio from "./pages/CasoEstudio";
import ComoTrabajamos from "./ComoTrabajamos";
import WhatsAppButton from "./components/WhatsAppButton";
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
      <PortfolioCTA />
      <ComoTrabajamos />
      <Resenas />
      <PreguntasFrecuentes />
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
          <Route path="/servicios/:slug" component={ServicioDetalle} />
          <Route path="/quienes-somos" component={QuienesSomos} />
          <Route path="/portafolio/:slug" component={CasoEstudio} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <WhatsAppButton />
      <CookieBanner />
    </LanguageProvider>
  );
}
