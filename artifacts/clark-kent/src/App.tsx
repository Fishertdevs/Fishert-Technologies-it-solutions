import { LanguageProvider } from "./LanguageContext";
import Navbar from "./Navbar";
import About from "./About";
import Works from "./Works";
import Section4 from "./Section4";
import Footer from "./Footer";

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <About />
      <Works />
      <Section4 />
      <Footer />
    </LanguageProvider>
  );
}
