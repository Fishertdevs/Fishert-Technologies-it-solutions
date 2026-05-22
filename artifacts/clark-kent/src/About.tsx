import { useEffect, useRef, useState } from "react";

const base = import.meta.env.BASE_URL;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let rafId = 0;
    let pending = false;

    const compute = () => {
      pending = false;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      setProgress(clamp01(scrolled / total));
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const p1 = clamp01(progress / 0.33);
  const p2 = clamp01((progress - 0.33) / 0.33);
  const p3 = clamp01((progress - 0.66) / 0.34);

  const imgStyle = (p: number): React.CSSProperties => ({
    width: `${0.75 * p}em`,
    opacity: p,
    transform: `translateX(${-100 * (1 - p)}%)`,
  });

  return (
    <div className="about-wrapper" ref={wrapperRef}>
      <section className="about">
        <div className="about-inner">
          <div className="about-line">FULL STACK</div>
          <div className="about-line">
            <span>CREA</span>
            <img
              src={`${base}1.png`}
              alt=""
              className="about-img"
              style={imgStyle(p1)}
            />
            <span>IVE</span>
          </div>
          <div className="about-line">SHOOTS &amp;</div>
          <div className="about-line">
            <span>DIR</span>
            <img
              src={`${base}3.png`}
              alt=""
              className="about-img"
              style={imgStyle(p2)}
            />
            <span>CTS</span>
          </div>
          <div className="about-line">DESIGNS &amp;</div>
          <div className="about-line">
            <span>BUI</span>
            <img
              src={`${base}2.png`}
              alt=""
              className="about-img"
              style={imgStyle(p3)}
            />
            <span>DS WITH AI</span>
          </div>
        </div>
      </section>
    </div>
  );
}
