import {
  ArrowRight,
  Compass,
  FileCheck2,
  FileSearch,
  Files,
  MessagesSquare,
  Send,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { BookingTrigger } from "../booking-modal-provider";
import SiteHeader from "../site-header";

const steps = [
  {
    title: "Consultation",
    text: "We begin by understanding your current situation, relationship history, where you and your spouse or partner are located, and what you are trying to achieve.",
    Icon: UsersRound,
  },
  {
    title: "Eligibility and Pathway Review",
    text: "We review the information you provide to identify potentially relevant immigration pathways, applicable requirements, and issues that may need further attention.",
    Icon: FileSearch,
  },
  {
    title: "Document and Application Preparation",
    text: "We help organize the required forms, relationship evidence, supporting documents, and application materials according to the agreed scope of service.",
    Icon: Files,
  },
  {
    title: "Submission Guidance and Follow-Up",
    text: "We explain the next steps, provide guidance within the agreed scope of service, and help you understand relevant updates or requests as your case progresses.",
    Icon: Send,
  },
];

const benefits = [
  {
    title: "Clear guidance",
    text: "Clear explanations of relevant options and next steps based on your unique situation.",
    Icon: Compass,
  },
  {
    title: "Organized documentation",
    text: "Help with required forms and supporting documents within the agreed scope of service.",
    Icon: FileCheck2,
  },
  {
    title: "Ongoing communication",
    text: "Updates on your case progress and outstanding information, as applicable.",
    Icon: MessagesSquare,
  },
];

function CanadianMapleLeafDecoration() {
  return (
    <svg
      aria-hidden="true"
      className="process-cta-leaf"
      viewBox="0 0 5000 4500"
      fill="currentColor"
    >
      <path d="m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
    </svg>
  );
}

export default function ProcessPage() {
  return (
    <>
      <SiteHeader />
      <main className="process-page">
        <section aria-labelledby="process-hero-title" className="process-hero">
          <Image
            alt="Toronto waterfront skyline with the CN Tower"
            className="process-hero-image"
            fill
            priority
            sizes="100vw"
            src="/about-toronto.webp"
            unoptimized
          />
          <div className="process-hero-content">
            <p className="process-page-eyebrow process-hero-eyebrow">
              Our process
            </p>
            <h1 id="process-hero-title">
              A clear, step-by-step
              <br />{" "}
              pathway for family
              <br />{" "}
              immigration <span>decisions.</span>
            </h1>
            <p className="process-hero-description">
              Every application is different. We help you understand your
              options, organize the necessary information, and identify
              practical next steps based on your circumstances and applicable
              requirements.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="process-steps-title"
          className="process-timeline"
        >
          <div className="section-shell">
            <header className="process-page-heading">
              <p className="process-page-eyebrow">The process</p>
              <h2 id="process-steps-title">
                Four simple steps
                <br />
                to <span>get you there.</span>
              </h2>
            </header>
            <div className="process-page-steps">
              {steps.map(({ title, text, Icon }, index) => (
                <article className="process-page-step" key={title}>
                  <div className="process-page-step-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <span aria-label={`Step ${index + 1}`} className="process-page-step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="process-page-step-copy">
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="process-expect-title"
          className="process-expect"
        >
          <div className="section-shell process-expect-grid">
            <div className="process-expect-intro">
              <p className="process-page-eyebrow">What you can expect</p>
              <h2 id="process-expect-title">
                Support at every
                <br />{" "}
                stage of your journey.
              </h2>
              <p>
                We’re here to provide clear guidance, organized support, and
                consistent communication throughout your family immigration
                process.
              </p>
            </div>
            {benefits.map(({ title, text, Icon }) => (
              <article className="process-benefit" key={title}>
                <span className="process-benefit-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="process-cta-title" className="process-cta">
          <div aria-hidden="true" className="process-cta-dots" />
          <div className="process-cta-inner">
            <div className="process-cta-mark">
            <CanadianMapleLeafDecoration />
            </div>
            <div className="process-cta-copy">
              <p className="process-cta-eyebrow">Ready to begin?</p>
              <h2 id="process-cta-title">
                Book a consultation and talk
                <br />{" "}
                through <span>your family situation.</span>
              </h2>
              <p>
                Discuss your circumstances and learn what next steps may be
                appropriate for your situation.
              </p>
            </div>
            <BookingTrigger className="process-cta-button">
              Book a consultation <ArrowRight aria-hidden="true" />
            </BookingTrigger>
            <Image
              alt=""
              aria-hidden="true"
              className="process-cta-skyline-image"
              height={600}
              sizes="(max-width: 759px) 70vw, 44vw"
              src="/about-toronto.webp"
              unoptimized
              width={960}
            />
          </div>
        </section>
      </main>
    </>
  );
}
