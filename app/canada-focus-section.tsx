import { MapPinned } from "lucide-react";
import EarthGlobe from "./about/earth-globe";

export default function CanadaFocusSection() {
  return (
    <section
      aria-labelledby="about-canada-title"
      className="about-canada about-page"
    >
      <div className="section-shell about-canada-grid">
        <div className="about-canada-copy">
          <div aria-hidden="true" className="about-canada-watermark">
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              viewBox="2300 250 5000 4300"
            >
              <path
                d="M4890 4430l-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
                fill="#7893a5"
              />
            </svg>
          </div>
          <p className="eyebrow">Our focus</p>
          <h2 id="about-canada-title">Canada is our focus.</h2>
          <p>
            FCI concentrates on Canadian spouse and family immigration,
            helping clients understand relevant pathways and prepare their
            next steps with care.
          </p>
          <div className="about-canada-tag">
            <MapPinned aria-hidden="true" />
            <span>Canada-focused guidance</span>
          </div>
        </div>
        <figure className="about-globe">
          <EarthGlobe />
        </figure>
      </div>
    </section>
  );
}
