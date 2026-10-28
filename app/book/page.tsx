"use client";

import { BookingTrigger } from "../booking-modal-provider";
import SiteHeader from "../site-header";

export default function BookPage() {
  return (
    <main className="info-page">
      <SiteHeader />

      <section className="payment-shell info-shell">
        <p className="eyebrow">Book a consultation</p>
        <h1>Choose a time that works for your family situation.</h1>
        <div className="info-card">
          <p>
            The consultation helps you understand your spouse visa or sponsorship route, ask questions,
            and decide on the next step with more confidence. The booking flow asks for your country of
            residence, preferred date and time, and basic contact details.
          </p>
          <p>
            A temporary slot hold is not a confirmed reservation. You will review the consultation fee
            and appointment details on the payment page. The consultation is confirmed only after
            Stripe verifies your payment.
          </p>
          <BookingTrigger className="button button-primary">
            Start booking
          </BookingTrigger>
        </div>
      </section>
    </main>
  );
}
