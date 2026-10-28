import SiteHeader from "../site-header";

export default function RefundPolicyPage() {
  return (
    <main className="info-page">
      <SiteHeader />

      <section className="payment-shell info-shell">
        <p className="eyebrow">Cancellation &amp; Refund Policy</p>
        <h1>How consultation payments are handled.</h1>
        <div className="info-card">
          <p>
            Consultation fees are paid to secure a time with Future Canadian Immigration Inc. and to confirm
            your booked appointment. If a consultation is cancelled or rescheduled in advance, a refund or
            credit may be considered based on the circumstances and timing of the notice.
          </p>
          <p>
            If a payment was completed and the booking later needs to be changed, we will review the request
            in good faith. Refunds for failed or duplicate payments are processed through Stripe in accordance
            with the original payment and applicable charge conditions.
          </p>
          <p>
            For any payment-related questions, please contact <a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
