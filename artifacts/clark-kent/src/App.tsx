import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Servicios from "./Servicios";
import Nosotros from "./Nosotros";
import Portafolio from "./Portafolio";
import Footer from "./Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <About />
      <Servicios />
      <Nosotros />
      <Portafolio />
      <Footer />
    </LanguageProvider>
  );
}
