import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Welcome from "./Welcome";
import Servicios from "./Servicios";
import Nosotros from "./Nosotros";
import Portafolio from "./Portafolio";
import Section4 from "./Section4";
import Footer from "./Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <About />
      <Welcome />
      <Servicios />
      <Nosotros />
      <Portafolio />
      <Section4 />
      <Footer />
    </LanguageProvider>
  );
}
