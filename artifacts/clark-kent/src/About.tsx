import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

export default function About() {
  useEffect(() => {
    gsap.set(".about-box", { width: 0, height: 0, opacity: 0 });
    gsap.set(".about-row", { gap: 0 });
    gsap.set(".about-sweep", { scaleX: 0, transformOrigin: "left center" });

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
      },
    });

    aboutTl.to(
      ".about-sweep",
      {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.15,
      },
      0,
    );

    aboutTl.to(
      ".about-sweep",
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.15,
      },
      0.6,
    );

    aboutTl.to(
      ".about-row",
      {
        gap: 20,
        duration: 0.8,
        ease: "power2.out",
      },
      1.2,
    );

    aboutTl.to(
      ".about-box",
      {
        width: 150,
        height: 150,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
      },
      1.2,
    );

    return () => {
      aboutTl.scrollTrigger?.kill();
      aboutTl.kill();
    };
  }, []);

  return (
    <section className="about-section">
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">FULL STACK</span>
      </div>
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">CREA</span>
        <img className="about-box" src={`${base}1.png`} alt="" />
        <span className="about-text">TIVE</span>
      </div>
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">SHOOTS &amp;</span>
      </div>
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">DIR</span>
        <img className="about-box" src={`${base}3.png`} alt="" />
        <span className="about-text">CTS</span>
      </div>
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">DESIGNS &amp;</span>
      </div>
      <div className="about-row">
        <span className="about-sweep"></span>
        <span className="about-text">BUI</span>
        <img className="about-box" src={`${base}2.png`} alt="" />
        <span className="about-text">DS WITH AI</span>
      </div>
    </section>
  );
}
