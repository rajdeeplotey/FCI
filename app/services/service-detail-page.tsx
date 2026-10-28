import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  FileText,
  HeartHandshake,
  MessageCircleMore,
} from "lucide-react";
import SiteHeader from "../site-header";
import { BookingTrigger } from "../booking-modal-provider";
import type { ServiceDetail } from "./service-content";

const supportIcons = [MessageCircleMore, FileText, HeartHandshake, FileCheck2];

export default function ServiceDetailPage({
  service,
}: {
  service: ServiceDetail;
}) {
  const imageSrc = service.image || "/placeholder-couple-passports.png";
  const imageAlt = service.imageAlt || "A couple preparing for their future";

  return (
    <main className="info-page service-detail-page">
      <SiteHeader />

      <section aria-labelledby="service-detail-title" className="service-detail-hero">
        <div className="section-shell service-detail-hero-grid">
          <div className="service-detail-hero-copy">
            <nav aria-label="Breadcrumb" className="service-breadcrumb">
              <Link href="/services">Services</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{service.title}</span>
            </nav>
            <p className="eyebrow service-detail-eyebrow">{service.eyebrow}</p>
            <h1 id="service-detail-title">{service.headline}</h1>
            <p className="service-detail-lede">{service.intro}</p>
            <ul className="service-benefits">
              {service.benefits.map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true" className="service-benefit-check">
                    <ClipboardCheck />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="service-detail-actions">
              <BookingTrigger className="button button-primary">
                Book a Consultation
                <ArrowRight aria-hidden="true" />
              </BookingTrigger>
              <a className="button button-secondary" href="#service-journey">
                Explore the Process
              </a>
            </div>
          </div>
          <div className="service-detail-visual">
            <div className="service-detail-image-wrap">
              <Image
                alt={imageAlt}
                className="service-detail-image"
                fill
                priority
                sizes="(min-width: 900px) 48vw, 100vw"
                src={imageSrc}
                unoptimized
              />
            </div>
            <p className="service-image-note">
              <span aria-hidden="true" />
              Guidance for your family’s next steps
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="service-overview-title" className="service-overview-section">
        <div className="section-shell service-overview-grid">
          <div className="service-section-heading">
            <p className="eyebrow">A clearer understanding</p>
            <h2 id="service-overview-title">{service.overviewHeading}</h2>
          </div>
          <div className="service-overview-copy">
            {service.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="service-eligibility-note">
              Eligibility and required documents depend on individual circumstances and current Canadian
              immigration rules.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="service-support-title" className="service-support-section">
        <div className="section-shell">
          <div className="service-section-heading service-section-heading-centered">
            <p className="eyebrow">How we can help</p>
            <h2 id="service-support-title">Support at every important stage</h2>
            <p>
              Practical guidance to help you understand your options and prepare information for your
              circumstances.
            </p>
          </div>
          <div className="service-support-grid">
            {service.helpItems.map(({ title, description }, index) => {
              const Icon = supportIcons[index % supportIcons.length];
              return (
                <article className="service-support-item" key={title}>
                  <span aria-hidden="true" className="service-support-icon">
                    <Icon />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="service-journey-title"
        className="service-journey-section"
        id="service-journey"
      >
        <div className="section-shell">
          <div className="service-section-heading">
            <p className="eyebrow">A considered process</p>
            <h2 id="service-journey-title">A practical application journey</h2>
            <p>
              Each case is different. These steps offer a general sense of how preparation and guidance
              may be organised.
            </p>
          </div>
          <ol className="service-journey-grid">
            {service.journey.map(({ title, description }, index) => (
              <li className="service-journey-step" key={title}>
                <span aria-hidden="true" className="service-journey-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="service-documents-title" className="service-documents-section">
        <div className="section-shell service-documents-grid">
          <div className="service-section-heading">
            <p className="eyebrow">Preparation</p>
            <h2 id="service-documents-title">{service.documentsHeading}</h2>
            <p>{service.documentsIntro}</p>
          </div>
          <div className="service-documents-panel">
            <ul>
              {service.documentExamples.map((example) => (
                <li key={example}>
                  <FileCheck2 aria-hidden="true" />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
            <p className="service-documents-caveat">
              These examples are general, not a complete checklist. Always follow the current IRCC
              instructions for your case.
            </p>
            <a
              className="service-official-link"
              href={service.officialUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {service.officialLinkLabel}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="service-values-title" className="service-values-section">
        <div className="section-shell service-values-grid">
          <div className="service-section-heading">
            <p className="eyebrow">Why work with FCI</p>
            <h2 id="service-values-title">Thoughtful support, centred on your situation</h2>
            <p>
              Get clear communication and a structured understanding of the application journey, without
              promises about government decisions.
            </p>
          </div>
          <ul className="service-values-list">
            {service.whyFci.map(({ title, description }) => (
              <li key={title}>
                <span aria-hidden="true" className="service-value-marker" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="service-faq-title" className="service-faq-section">
        <div className="section-shell service-faq-grid">
          <div className="service-section-heading">
            <p className="eyebrow">Common questions</p>
            <h2 id="service-faq-title">What to know before you begin</h2>
            <p>
              General information only. The right answer for your case depends on your circumstances
              and current IRCC requirements.
            </p>
          </div>
          <div className="service-faq-list">
            {service.faqs.map(({ question, answer }, index) => (
              <details className="service-faq-item" key={question} open={index === 0}>
                <summary>
                  <span>{question}</span>
                  <span aria-hidden="true" className="service-faq-toggle" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-cta-title" className="service-detail-cta" id="book">
        <div className="section-shell service-detail-cta-inner">
          <div>
            <p className="eyebrow">{service.ctaEyebrow}</p>
            <h2 id="service-cta-title">{service.ctaHeading}</h2>
            <p>{service.ctaDescription}</p>
          </div>
          <div className="service-detail-cta-actions">
            <BookingTrigger className="button button-primary">
              Book Your Consultation
              <ArrowRight aria-hidden="true" />
            </BookingTrigger>
            <Link className="service-all-link" href="/services">
              Explore all services
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
