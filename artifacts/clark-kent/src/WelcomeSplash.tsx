import { useEffect, useState } from "react";

const splashDuration = 5000;
const fadeDuration = 500;

export default function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    document.body.classList.add("welcome-splash-active");

    const fadeTimer = window.setTimeout(() => setIsLeaving(true), splashDuration - fadeDuration);
    const closeTimer = window.setTimeout(() => setIsVisible(false), splashDuration);

    return () => {
      document.body.classList.remove("welcome-splash-active");
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  if (!isVisible) return null;

  const socialImageUrl = `${import.meta.env.BASE_URL}og-image-social.png`;

  return (
    <div
      className={`welcome-splash${isLeaving ? " welcome-splash--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando Fishert Studio"
    >
      <div className="welcome-splash-inner">
        <img
          className="welcome-splash-logo"
          src={socialImageUrl}
          alt="Fishert Studio"
        />
        <div className="welcome-splash-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}