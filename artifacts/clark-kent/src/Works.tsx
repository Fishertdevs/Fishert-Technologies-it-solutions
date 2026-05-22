import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

export default function Works() {
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const heights = [
      vh * 0.35,
      vh * 0.48,
      vh * 0.62,
      vh * 0.76,
      vh * 0.9,
    ];

    const itemW = vw / 5;

    for (let i = 1; i <= 5; i++) {
      gsap.set(`.works-item--${i}`, {
        width: itemW,
        height: heights[i - 1],
        opacity: 1,
      });
    }

    gsap.set(".works-item--6, .works-item--7, .works-item--8", {
      width: 0,
      height: heights[0],
      opacity: 1,
    });

    gsap.set(".works-track", { x: 0 });

    const worksTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".works-section",
        start: "top top",
        end: "+=500%",
        scrub: 1,
        pin: true,
      },
    });

    // Cycle 1 — item 6 enters
    worksTl.to(
      ".works-item--6",
      { width: itemW, duration: 0.6, ease: "power2.out" },
      0,
    );
    worksTl.to(".works-item--1", { height: heights[1], duration: 0.6 }, 0);
    worksTl.to(".works-item--2", { height: heights[2], duration: 0.6 }, 0);
    worksTl.to(".works-item--3", { height: heights[3], duration: 0.6 }, 0);
    worksTl.to(".works-item--4", { height: heights[4], duration: 0.6 }, 0);
    worksTl.to(
      ".works-track",
      { x: `+=${itemW}`, duration: 0.6, ease: "power2.inOut" },
      0,
    );

    // Cycle 2 — item 7 enters
    worksTl.to(
      ".works-item--7",
      { width: itemW, duration: 0.6, ease: "power2.out" },
      1.2,
    );
    worksTl.to(".works-item--6", { height: heights[1], duration: 0.6 }, 1.2);
    worksTl.to(".works-item--1", { height: heights[2], duration: 0.6 }, 1.2);
    worksTl.to(".works-item--2", { height: heights[3], duration: 0.6 }, 1.2);
    worksTl.to(".works-item--3", { height: heights[4], duration: 0.6 }, 1.2);
    worksTl.to(
      ".works-track",
      { x: `+=${itemW}`, duration: 0.6, ease: "power2.inOut" },
      1.2,
    );

    // Cycle 3 — item 8 enters
    worksTl.to(
      ".works-item--8",
      { width: itemW, duration: 0.6, ease: "power2.out" },
      2.4,
    );
    worksTl.to(".works-item--7", { height: heights[1], duration: 0.6 }, 2.4);
    worksTl.to(".works-item--6", { height: heights[2], duration: 0.6 }, 2.4);
    worksTl.to(".works-item--1", { height: heights[3], duration: 0.6 }, 2.4);
    worksTl.to(".works-item--2", { height: heights[4], duration: 0.6 }, 2.4);
    worksTl.to(
      ".works-track",
      { x: `+=${itemW}`, duration: 0.6, ease: "power2.inOut" },
      2.4,
    );

    return () => {
      worksTl.scrollTrigger?.kill();
      worksTl.kill();
    };
  }, []);

  return (
    <section className="works-section">
      <div className="works-track">
        <div className="works-item works-item--8">
          <img src={`${base}w8.png`} alt="" />
        </div>
        <div className="works-item works-item--7">
          <img src={`${base}w7.png`} alt="" />
        </div>
        <div className="works-item works-item--6">
          <img src={`${base}w6.png`} alt="" />
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
