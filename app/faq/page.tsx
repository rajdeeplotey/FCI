import { BookingTrigger } from "../booking-modal-provider";
import SiteHeader from "../site-header";
import FaqContent from "./faq-content";

export default function FaqPage() {
  return (
    <main className="faq-page">
      <SiteHeader
        className="faq-site-header"
        includeReviewsLink
        lightBranding
      />
      <FaqContent />

      <section className="final-cta faq-final-cta" id="book">
        <div className="section-shell final-cta-inner">
          <p className="eyebrow">Still unsure?</p>
          <h2>Talk through your situation with a licensed RCIC.</h2>
          <BookingTrigger className="button button-primary">
            Book a consultation
          </BookingTrigger>
        </div>
      </section>
    </main>
  );
}
