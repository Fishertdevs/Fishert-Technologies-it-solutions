const base = import.meta.env.BASE_URL;

export default function About() {
  return (
    <section className="about">
      <div className="about-inner">
        <div className="about-line">FULL STACK</div>
        <div className="about-line">
          <span>CREA</span>
          <img src={`${base}1.png`} alt="" className="about-img" />
          <span>IVE</span>
        </div>
        <div className="about-line">SHOOTS &amp;</div>
        <div className="about-line">
          <span>DIR</span>
          <img src={`${base}2.png`} alt="" className="about-img" />
          <span>CTS</span>
        </div>
        <div className="about-line">DESIGNS &amp;</div>
        <div className="about-line">
          <span>BUI</span>
          <img src={`${base}3.png`} alt="" className="about-img" />
          <span>DS WITH AI</span>
        </div>
      </div>
    </section>
  );
}
