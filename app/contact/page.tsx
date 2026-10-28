import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { getPublicPhone } from "../../lib/contact-info";
import { BookingTrigger } from "../booking-modal-provider";
import ContactInquiryForm from "./contact-inquiry-form";
import SiteHeader from "../site-header";

const contactSteps = [
  {
    title: "Tell us about your situation",
    description:
      "Share a few details about your relationship, goals and current situation.",
    action: "Get started",
    Icon: FileText,
    tone: "red",
  },
  {
    title: "Choose a consultation",
    description:
      "Pick a time that works for you. We offer flexible scheduling options across different time zones.",
    action: "Schedule now",
    Icon: CalendarDays,
    tone: "blue",
  },
  {
    title: "Prepare your questions",
    description:
      "Think about your goals, any specific concerns, or documents you may want to discuss.",
    action: "We're here to help",
    Icon: MessageCircle,
    tone: "red",
  },
];

function ContactMapleLeaf() {
  return (
    <svg
      aria-hidden="true"
      className="contact-maple-leaf"
      fill="currentColor"
      viewBox="0 0 5000 4500"
    >
      <path d="m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
    </svg>
  );
}

export default function ContactPage() {
  const phone = getPublicPhone();
  return (
    <>
      <SiteHeader className="contact-site-header" />
      <main className="contact-page">
        <section aria-labelledby="contact-hero-title" className="contact-hero">
          <Image
            alt="Toronto skyline and the CN Tower above the waterfront in warm daylight"
            className="contact-hero-image"
            fill
            priority
            sizes="100vw"
            src="/contactbackground.png"
            unoptimized
          />
          <div aria-hidden="true" className="contact-hero-shade" />
          <ContactMapleLeaf />
          <div className="contact-hero-inner section-shell">
            <div className="contact-hero-copy">
              <p className="contact-eyebrow">Contact us</p>
              <h1 id="contact-hero-title">
                Let&apos;s talk about your
                <br />
                family&apos;s future in Canada.
              </h1>
              <p className="contact-hero-description">
                We&apos;re here to answer your questions, provide guidance on
                your options, and help you take the next step in your
                immigration journey. Reach out using the details below or book
                a consultation at your convenience.
              </p>
              <div className="contact-hero-actions">
                <a
                  className="contact-action-card"
                  href="mailto:info@canadaspousevisa.com"
                >
                  <Mail aria-hidden="true" className="contact-action-icon" />
                  <span className="contact-action-copy">
                    <strong>Email Us</strong>
                    <span>info@canadaspousevisa.com</span>
                    <small>We typically respond within 1–2 business days.</small>
                  </span>
                </a>
                <BookingTrigger className="contact-action-card contact-booking-card">
                  <CalendarDays
                    aria-hidden="true"
                    className="contact-action-icon"
                  />
                  <span className="contact-action-copy">
                    <strong>Book a Consultation</strong>
                    <span>Schedule a time to discuss your situation.</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="contact-action-arrow"
                  />
                </BookingTrigger>
              </div>
              <p className="contact-hero-bookings">
                Booking or payment questions?{" "}
                <a href="mailto:bookings@canadaspousevisa.com">bookings@canadaspousevisa.com</a>
              </p>
            </div>

            <ContactInquiryForm />
          </div>
        </section>

        <section
          aria-label="How to prepare for a consultation"
          className="contact-guidance"
        >
          <div className="section-shell contact-guidance-grid">
            {contactSteps.map(({ title, description, action, Icon, tone }, index) => (
              <article
                className={`contact-guidance-card contact-guidance-card-${tone}`}
                key={title}
              >
                <span aria-hidden="true" className="contact-guidance-number">
                  0{index + 1}
                </span>
                <span className="contact-guidance-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h2>{title}</h2>
                <p>{description}</p>
                <span aria-hidden="true" className="contact-card-divider" />
                <BookingTrigger
                  aria-label={`${action} — open consultation booking`}
                  className="contact-guidance-link"
                >
                  {action}
                  <ArrowRight aria-hidden="true" />
                </BookingTrigger>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Contact details" className="contact-strip-section">
          <div className="contact-strip">
            <ul className="contact-strip-list">
              <li>
                <a className="contact-strip-item" href="mailto:info@canadaspousevisa.com">
                  <span aria-hidden="true" className="contact-strip-icon">
                    <Mail />
                  </span>
                  <span className="contact-strip-text">
                    <small>Email us</small>
                    <strong>info@canadaspousevisa.com</strong>
                  </span>
                </a>
              </li>
              <li>
                <a className="contact-strip-item" href="mailto:bookings@canadaspousevisa.com">
                  <span aria-hidden="true" className="contact-strip-icon">
                    <Mail />
                  </span>
                  <span className="contact-strip-text">
                    <small>Email us</small>
                    <strong>bookings@canadaspousevisa.com</strong>
                  </span>
                </a>
              </li>
              <li>
                {/* With FCI_PHONE_NUMBER set (lib/contact-info.ts) this is a
                    tap-to-call link; until then the placeholder is plain text. */}
                {phone.href ? (
                  <a className="contact-strip-item" href={phone.href}>
                    <span aria-hidden="true" className="contact-strip-icon">
                      <Phone />
                    </span>
                    <span className="contact-strip-text">
                      <small>Call us</small>
                      <strong>{phone.display}</strong>
                    </span>
                  </a>
                ) : (
                  <div className="contact-strip-item">
                    <span aria-hidden="true" className="contact-strip-icon">
                      <Phone />
                    </span>
                    <span className="contact-strip-text">
                      <small>Call us</small>
                      <strong>{phone.display}</strong>
                    </span>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
