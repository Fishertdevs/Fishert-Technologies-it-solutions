import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const floatingImages = [
  { src: `${base}1.png`, className: "about-float about-float--1" },
  { src: `${base}3.png`, className: "about-float about-float--2" },
  { src: `${base}2.png`, className: "about-float about-float--3" },
];

const lines = [
  "WE BUILD",
  "DIGITAL",
  "PRODUCTS",
  "THAT SCALE",
  "& PERFORM",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".about-line-inner", { yPercent: 105 });
      gsap.set(".about-float", {
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
      });
      gsap.set(".about-agency-badge", { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });

      // Lines stagger in
      tl.to(
        ".about-line-inner",
        {
          yPercent: 0,
          duration: 1.2,
          ease: "none",
          stagger: 0.18,
        },
        0,
      );

      // Badge fades in
      tl.to(
        ".about-agency-badge",
        { opacity: 1, y: 0, duration: 0.6, ease: "none" },
        0.3,
      );

      // Floating images reveal with clip-path — spaced out in time
      tl.to(
        ".about-float--1",
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.9,
          ease: "none",
        },
        0.2,
      );
      tl.to(
        ".about-float--2",
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.9,
          ease: "none",
        },
        0.55,
      );
      tl.to(
        ".about-float--3",
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.9,
          ease: "none",
        },
        0.85,
      );

      // Subtle parallax drift on images
      tl.to(".about-float--1", { y: -40, duration: 2, ease: "none" }, 0);
      tl.to(".about-float--2", { y: -60, duration: 2, ease: "none" }, 0);
      tl.to(".about-float--3", { y: -30, duration: 2, ease: "none" }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* Floating image cards — positioned absolutely, not breaking words */}
      {floatingImages.map((img, i) => (
        <div key={i} className={img.className}>
          <img src={img.src} alt="" />
        </div>
      ))}

      <div className="about-content">
        <div className="about-agency-badge">
          FISHERT SOFTWARE AGENCY &nbsp;/&nbsp; EST. 2020
        </div>

        <div className="about-lines">
          {lines.map((line, i) => (
            <div className="about-line" key={i}>
              <span className="about-line-inner">{line}</span>
            </div>
          ))}
        </div>

        <p className="about-descriptor">
          We craft end-to-end digital products — from strategy and design
          to engineering and deployment — for teams that refuse to ship mediocre software.
        </p>
      </div>
    </section>
  );
}
