import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Welcome from "./Welcome";
import Servicios from "./Servicios";
import Socios from "./Socios";
import Nosotros from "./Nosotros";
import Portafolio from "./Portafolio";
import Resenas from "./Resenas";
import Footer from "./Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <About />
      <Welcome />
      <Servicios />
      <Socios />
      <Nosotros />
      <Portafolio />
      <Resenas />
      <Footer />
    </LanguageProvider>
  );
}
