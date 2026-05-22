import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

export default function Works() {
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const itemCount = 5;
    const itemWidth = viewportWidth / itemCount;

    gsap.set(".works-item--1", { width: itemWidth * 0.7 });
    gsap.set(".works-item--2", { width: itemWidth * 0.85 });
    gsap.set(".works-item--3", { width: itemWidth });
    gsap.set(".works-item--4", { width: itemWidth * 0.85 });
    gsap.set(".works-item--5", { width: itemWidth * 0.7 });

    gsap.set(".works-item--6, .works-item--7, .works-item--8", {
      width: 0,
      opacity: 1,
    });

    const worksTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".works-section",
        start: "top top",
        end: "+=400%",
        scrub: 1,
        pin: true,
      },
    });

    worksTl.to(
      ".works-item--6",
      { width: itemWidth * 1.2, duration: 1, ease: "power2.out" },
      0,
    );
    worksTl.to(
      ".works-item--7",
      { width: itemWidth * 1.1, duration: 1, ease: "power2.out" },
      1,
    );
    worksTl.to(
      ".works-item--8",
      { width: itemWidth, duration: 1, ease: "power2.out" },
      2,
    );

    return () => {
      worksTl.scrollTrigger?.kill();
      worksTl.kill();
    };
  }, []);

  return (
    <section className="works-section">
      <div className="works-track">
        <div className="works-item works-item--6">
          <img src={`${base}w6.png`} alt="" />
        </div>
        <div className="works-item works-item--7">
          <img src={`${base}w7.png`} alt="" />
        </div>
        <div className="works-item works-item--8">
          <img src={`${base}w8.png`} alt="" />
        </div>
        <div className="works-item works-item--1">
          <img src={`${base}w1.png`} alt="" />
        </div>
        <div className="works-item works-item--2">
          <img src={`${base}w2.png`} alt="" />
        </div>
        <div className="works-item works-item--3">
          <img src={`${base}w3.png`} alt="" />
        </div>
        <div className="works-item works-item--4">
          <img src={`${base}w4.png`} alt="" />
        </div>
        <div className="works-item works-item--5">
          <img src={`${base}w5.png`} alt="" />
        </div>
      </div>
    </section>
  );
}
