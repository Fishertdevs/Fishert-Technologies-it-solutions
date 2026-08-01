import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to all elements matching `selector`
 * inside `containerRef`. Elements gain `.revealed` when they enter the
 * viewport and lose it when they leave — so scrolling back up hides them.
 */
export function useScrollReveal(selector = ".reveal") {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll<HTMLElement>(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          } else {
            entry.target.classList.remove("revealed");
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);

  return containerRef;
}
