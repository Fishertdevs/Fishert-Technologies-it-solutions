import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL || "/";

const phase1 = [
  "LIMITS ARE NOT",
  "REAL THEY ARE",
  "JUST SOMEONE",
  "ELSE'S OPINION.",
];

const phase2 = [
  "CREATE BEYOND",
  "WHAT EYES CAN",
  "SEE AND MINDS",
  "DARE TO DREAM.",
];

const phase3 = [
  "ART IS NOT WHAT",
  "YOU SEE BUT WHAT",
  "YOU MAKE OTHERS",
  "SEE FEEL AND",
  "DARE TO BECOME.",
];

export default function Section4() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=600%",
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    });

    gsap.set(".sweep-bar", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".phase1-line", { opacity: 1 });
    gsap.set(".phase2-line", { opacity: 0 });
    gsap.set(".phase3-line", { opacity: 0 });
    gsap.set(".p3-bar", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".line-wrapper", { overflow: "hidden", position: "relative" });

    tl.to(
      ".p1-bar",
      {
        scaleX: 1,
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      0,
    );

    tl.to(
      ".p1-bar",
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      0.8,
    );

    tl.to(".phase1-line", { opacity: 0, duration: 0.2 }, 1.6);
    tl.to(".phase2-line", { opacity: 1, duration: 0.2 }, 1.7);

    tl.to(
      ".indicator-circle[data-num='1']",
      {
        borderColor: "rgba(255,255,255,0.3)",
        color: "rgba(255,255,255,0.3)",
        duration: 0.1,
      },
      1.6,
    );
    tl.to(
      ".line-1-2",
      { "--line-progress": "100%", duration: 0.3 },
      1.6,
    );
    tl.to(
      ".indicator-circle[data-num='2']",
      {
        borderColor: "rgba(255,255,255,0.9)",
        color: "rgba(255,255,255,0.9)",
        duration: 0.1,
      },
      1.9,
    );

    tl.to(
      ".p2-bar",
      {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      2.0,
    );

    tl.to(
      ".p2-bar",
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      2.8,
    );

    tl.to(".phase2-line", { opacity: 0, duration: 0.2 }, 3.6);
    tl.to(".phase3-line", { opacity: 1, duration: 0.2 }, 3.7);

    tl.to(
      ".indicator-circle[data-num='2']",
      {
        borderColor: "rgba(255,255,255,0.3)",
        color: "rgba(255,255,255,0.3)",
        duration: 0.1,
      },
      3.6,
    );
    tl.to(
      ".line-2-3",
      { "--line-progress": "100%", duration: 0.3 },
      3.6,
    );
    tl.to(
      ".indicator-circle[data-num='3']",
      {
        borderColor: "rgba(255,255,255,0.9)",
        color: "rgba(255,255,255,0.9)",
        duration: 0.1,
      },
      3.9,
    );

    tl.to(
      ".p3-bar",
      {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      4.0,
    );

    tl.to(
      ".p3-bar",
      {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        stagger: 0.15,
        ease: "none",
      },
      4.8,
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const lineStyle = {
    display: "block",
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontWeight: 700,
    fontSize: "clamp(47px, 6.5vw, 94px)",
    color: "#fff",
    textTransform: "uppercase" as const,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  };

  return (
    <section
      ref={sectionRef}
      className="section4"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src={`${base}section4.png`}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 1,
        }}
      />

      <div className="section4-indicator">
        <div className="indicator-item">
          <div className="indicator-circle active" data-num="1">1</div>
          <div className="indicator-line line-1-2"></div>
        </div>
        <div className="indicator-item">
          <div className="indicator-circle" data-num="2">2</div>
          <div className="indicator-line line-2-3"></div>
        </div>
        <div className="indicator-item">
          <div className="indicator-circle" data-num="3">3</div>
        </div>
      </div>

      <div
        className="text-block"
        style={{
          position: "absolute",
          right: "40px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          textAlign: "right",
        }}
      >
        {phase3.map((p3line, i) => {
          const hasP1P2 = i < phase1.length;
          return (
            <div
              key={i}
              className="line-wrapper"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {hasP1P2 ? (
                <div className="phase1-line">
                  <span style={lineStyle}>{phase1[i]}</span>
                </div>
              ) : (
                <div style={{ visibility: "hidden" }}>
                  <span style={lineStyle}>{p3line}</span>
                </div>
              )}
              {hasP1P2 && (
                <div
                  className="phase2-line"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                  }}
                >
                  <span style={lineStyle}>{phase2[i]}</span>
                </div>
              )}
              <div
                className="phase3-line"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                <span style={lineStyle}>{p3line}</span>
              </div>
              {hasP1P2 && (
                <>
                  <div
                    className="sweep-bar p1-bar"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#FF0000",
                      zIndex: 3,
                    }}
                  />
                  <div
                    className="sweep-bar p2-bar"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#FF0000",
                      zIndex: 3,
                      transform: "scaleX(0)",
                    }}
                  />
                </>
              )}
              <div
                className="sweep-bar p3-bar"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#FF0000",
                  zIndex: 3,
                  transform: "scaleX(0)",
                }}
              />
            </div>
          );
        })}
      </div>

      <p className="section4-year">Portfolio 2026</p>
    </section>
  );
}
