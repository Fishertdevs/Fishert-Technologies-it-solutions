import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

export default function Works() {
  useEffect(() => {
    const track = document.querySelector(".works-track") as HTMLElement | null;
    if (!track) return;

    const totalWidth = track.scrollWidth - window.innerWidth;

    gsap.set(".works-item--6, .works-item--7, .works-item--8", {
      scaleX: 0.3,
      scaleY: 0.6,
      opacity: 0,
      transformOrigin: "bottom left",
    });

    const worksTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".works-section",
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
      },
    });

    worksTl.to(
      ".works-track",
      {
        x: -totalWidth,
        ease: "none",
        duration: 2,
      },
      0,
    );

    worksTl.to(
      ".works-item--6",
      {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.2,
    );
    worksTl.to(
      ".works-item--7",
      {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.5,
    );
    worksTl.to(
      ".works-item--8",
      {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.8,
    );

    return () => {
      worksTl.scrollTrigger?.kill();
      worksTl.kill();
    };
  }, []);

  return (
    <section className="works-section">
      <div className="works-track">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className={`works-item works-item--${n}`}>
            <img src={`${base}w${n}.png`} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
