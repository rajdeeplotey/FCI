"use client";

import { useState } from "react";
import { useBookingModal } from "./booking-modal-context";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  Globe2,
  HeartHandshake,
  LockKeyhole,
  MapPinned,
  Plane,
  Shield,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import CanadaFocusSection from "./canada-focus-section";
import ProcessStory from "./process-story";
import Reviews from "./reviews";
import SiteHeader from "./site-header";
import HeroBackgroundVideo from "./hero-background-video";

type Pathway = {
  id: "open-work-permit" | "pr-sponsorship" | "visitor-visa";
  title: string;
  icon: LucideIcon;
  link: string;
  description: string;
  for: string;
  support: string[];
  eligibility: string;
  processingTime: string;
  guidance: string;
};

const pathways: Pathway[] = [
  {
    id: "open-work-permit",
    title: "Spouse Open Work Permit",
    icon: FileCheck2,
    link: "/services/spouse-open-work-permit",
    description:
      "For eligible spouses and common-law partners seeking authorization to work in Canada under current rules.",
    for: "A review of whether an open work permit may fit your spouse or partner's situation and current eligibility rules.",
    support: [
      "Work in Canada only if eligible and authorized under current rules",
      "Build Canadian work experience if authorized to work",
      "Keep your family together",
      "Professional guidance at every step",
    ],
    eligibility:
      "Eligibility depends on your partner's status, your relationship, and current work-permit requirements.",
    processingTime:
      "Varies based on your situation and current application requirements.",
    guidance: "Personalized guidance at every step of your application.",
  },
  {
    id: "pr-sponsorship",
    title: "PR Spousal Sponsorship",
    icon: UsersRound,
    link: "/services/outland-spousal-sponsorship",
    description:
      "Build a stronger, clearer sponsorship package with professional guidance — from the first step to permanent residence.",
    for: "Guidance for Canadian citizens and permanent residents considering sponsorship of a spouse or partner for permanent residence.",
    support: [
      "Review sponsor and applicant requirements",
      "Plan relationship evidence",
      "Prepare forms and supporting documents",
      "Understand submission and follow-up steps",
    ],
    eligibility:
      "Canadian citizens and permanent residents may sponsor an eligible spouse or partner, subject to applicable requirements.",
    processingTime:
      "Varies based on the application, individual circumstances, and current processing information.",
    guidance:
      "Personalized support with evidence, forms, and practical next steps.",
  },
  {
    id: "visitor-visa",
    title: "Visitor Visa for Spouse",
    icon: Globe2,
    link: "/services/visitor-visa",
    description:
      "Present a thoughtful visitor application that explains purpose, ties, and family contact while addressing the relevant application requirements.",
    for: "Guidance for spouses outside Canada who are considering a temporary visit to see their family.",
    support: [
      "Clarify the purpose of the proposed visit",
      "Review ties and supporting documents",
      "Prepare invitation and explanation materials",
      "Plan next steps for your family",
    ],
    eligibility:
      "Applicants must meet the requirements for temporary residence, including those relevant to their individual circumstances.",
    processingTime:
      "Varies based on the applicant's circumstances and current application requirements.",
    guidance:
      "Personalized help presenting purpose, ties, and supporting information clearly.",
  },
];

const serviceBreakdowns = [
  {
    id: "open-work-permit",
    title: "Spouse Open Work Permit",
    category: "Temporary residence",
    icon: BriefcaseBusiness,
    description:
      "Understand the available work permit pathway for your spouse or partner.",
    support: [
      "Initial eligibility discussion",
      "Document checklist and review",
      "Application preparation guidance",
    ],
    href: "/services/spouse-open-work-permit",
  },
  {
    id: "pr-sponsorship",
    title: "PR Spousal Sponsorship",
    category: "Family reunification",
    icon: HeartHandshake,
    description:
      "Prepare a clear, organized sponsorship application with professional guidance.",
    support: [
      "Sponsor and applicant review",
      "Relationship evidence guidance",
      "Document preparation support",
    ],
    href: "/services/outland-spousal-sponsorship",
  },
  {
    id: "visitor-visa",
    title: "Visitor Visa for Spouse",
    category: "Visitor support",
    icon: Plane,
    description:
      "Plan a visitor visa application that clearly explains the purpose of the visit.",
    support: [
      "Application requirements review",
      "Supporting document checklist",
      "Guidance on visit purpose and ties",
    ],
    href: "/services/visitor-visa",
  },
];

const professionalGuidanceStats = [
  {
    value: "100%",
    label: "Client Focused",
    icon: CalendarCheck,
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    icon: Globe2,
  },
  {
    value: "Personalized",
    label: "Guidance for Every Case",
    icon: BadgeCheck,
    isLongValue: true,
  },
];

const faqs = [
  {
    question: "Can my spouse get an open work permit?",
    answer:
      "Possibly. Eligibility depends on your status in Canada, your spouse or partner's situation, the type of application, and current immigration rules. A consultation helps confirm whether an open work permit is the right option before you prepare the package.",
  },
  {
    question: "Can a permanent resident or citizen sponsor their spouse?",
    answer:
      "Canadian permanent residents and citizens may be able to sponsor a spouse, common-law partner, or conjugal partner, but both sponsor and applicant must meet requirements. The right advice depends on your relationship history, residence, documents, and admissibility factors.",
  },
  {
    question: "Can my spouse visit Canada while outside Canada?",
    answer:
      "A spouse outside Canada may be able to apply for a visitor visa. The application should still show a clear temporary visit purpose, supporting documents, and the broader family context. Visitor approval is never guaranteed.",
  },
  {
    question: "Do you guarantee approval?",
    answer:
      "No. No ethical immigration professional can guarantee an approval. The goal is to provide authorized guidance, prepare the application carefully, and help you avoid common mistakes based on your individual circumstances.",
  },
  {
    question: "Why work with an RCIC?",
    answer:
      "A Regulated Canadian Immigration Consultant is licensed to provide Canadian immigration advice for a fee. Working with an RCIC gives you professional guidance, confidentiality, and a clearer process for a high-stakes family application.",
  },
  {
    question: "How do I start?",
    answer:
      "Click Book Now and share your name, phone number, and a few details about your situation. Bring your current status, your spouse or partner's location, your relationship timeline, and any previous immigration history so the first conversation is focused and useful.",
  },
];

function CanadianFlagMapleLeaf({ className = "about-maple-icon" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 4800 4800"
    >
      <path
        fill="currentColor"
        d="m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
      />
    </svg>
  );
}

export default function Home() {
  const [activePathwayId, setActivePathwayId] =
    useState<Pathway["id"]>("open-work-permit");
  const [openFaq, setOpenFaq] = useState(0);
  const { openBookingForm } = useBookingModal();

  const activePathway =
    pathways.find((pathway) => pathway.id === activePathwayId) ?? pathways[0];

  return (
    <main>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <SiteHeader />

      <section className="hero-section" id="top">
        <HeroBackgroundVideo />
        <div className="hero-grid section-shell" id="main-content">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              Canadian Spousal Sponsorship &amp; Immigration
            </p>
            <h1>
              Bring Your Spouse
              <br className="hero-heading-break" /> Closer to Canada.
            </h1>
            <p className="hero-lede">
              Navigate your spouse sponsorship journey with clear guidance,
              personalised support, and a professional approach tailored to
              your circumstances.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={openBookingForm}
                type="button"
              >
                <CalendarCheck aria-hidden="true" />
                Book a Consultation
              </button>
              <Link className="button button-secondary" href="/services">
                Explore Our Services
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="trust-strip" aria-label="Trust signals">
              <span>
                <ShieldCheck aria-hidden="true" />
                RCIC #420375
              </span>
              <span>
                <MapPinned aria-hidden="true" />
                Canadian Spousal Sponsorship Focus
              </span>
              <span>
                <LockKeyhole aria-hidden="true" />
                Confidential Client Support
              </span>
            </div>
          </div>

        </div>
      </section>

      <section aria-labelledby="reunion-title" className="reunion-section">
        <div className="section-shell reunion-grid">
          <div className="reunion-copy">
            <p className="eyebrow reunion-eyebrow">
              <span aria-hidden="true" />
              Family reunion
            </p>
            <h2 id="reunion-title">
              Bring your loved ones closer to <span>Canada.</span>
            </h2>
            <p className="reunion-description">
              Family reunification is about more than just immigration — it&apos;s
              about building a future together. We help Canadian citizens and
              permanent residents sponsor their spouse, partner, or family
              members with clarity, care and professional guidance.
            </p>
            <ul aria-label="Our support" className="reunion-benefits">
              <li>
                <span aria-hidden="true" className="reunion-benefit-icon">
                  <UsersRound />
                </span>
                <span>Guidance tailored to your situation</span>
              </li>
              <li>
                <span aria-hidden="true" className="reunion-benefit-icon">
                  <FileText />
                </span>
                <span>Document preparation and review support</span>
              </li>
              <li>
                <span aria-hidden="true" className="reunion-benefit-icon">
                  <Shield />
                </span>
                <span>Clear steps and ongoing support</span>
              </li>
            </ul>
            <div className="reunion-actions">
              <button
                className="button button-primary reunion-button reunion-button-primary"
                onClick={openBookingForm}
                type="button"
              >
                Book a consultation
                <ArrowRight aria-hidden="true" />
              </button>
              <a className="button button-secondary reunion-button reunion-button-secondary" href="#process">
                Explore the process
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="reunion-photo">
            <Image
              alt="A happy couple beside Toronto's waterfront, with the skyline and Canadian flag behind them"
              className="reunion-photo-image"
              height={360}
              loading="lazy"
              src="/home%20page/family-couple.png"
              unoptimized
              sizes="(min-width: 1040px) 52vw, (min-width: 760px) 50vw, 100vw"
              width={540}
            />
            <figcaption className="reunion-photo-caption">
              <span>
                Together in
                <br />
                Canada
              </span>
              <CanadianFlagMapleLeaf className="reunion-photo-leaf" />
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-section" id="about">
        <div aria-hidden="true" className="about-landscape">
          <svg viewBox="0 0 720 190" preserveAspectRatio="xMidYMax meet">
            <path
              className="about-landscape-mountain"
              d="M0 176 115 130l55 19 112-80 83 48 65-43 88 52 49-18 153 69v14H0Z"
            />
            <path
              className="about-landscape-ground"
              d="M0 174 93 157l60 8 87-28 73 19 68-26 71 24 77-18 56 9 90-22 45 19v48H0Z"
            />
            <path
              className="about-landscape-city"
              d="M374 170v-20h8v-19h11v39h7v-28h13v28h8v-45h13v45h7v-26h10v26h8v-37h13v37h8v-22h12v22h8v-49h12v49h7v-31h13v31h9v-21h13v21h8v-40h13v40h7v-26h14v26h9v-34h12v34h8v-19h15v19h9v-31h13v31h18v20H374Z"
            />
            <path className="about-landscape-tower" d="m590 93 5-20 5 20h-3v14h-4V93Z" />
            <path className="about-landscape-tower" d="M596 107h8v63h-8z" />
            <path className="about-landscape-tower" d="M592 120h16v4h-16z" />
            <path className="about-landscape-tower" d="M594 133h12v3h-12z" />
            <path className="about-landscape-tower" d="M595 145h10v3h-10z" />
          </svg>
        </div>
        <div className="section-shell about-grid">
          <div className="about-intro">
            <p className="eyebrow about-eyebrow">
              About FCI
              <span aria-hidden="true" />
            </p>
            <h2>
              Reuniting spouses in Canada since <span className="about-year-highlight">2011.</span>
            </h2>
            <p>
              Future Canadian Immigration Inc. (FCI) was established in 2011
              with a simple focus: helping spouses and partners unite with
              their loved ones in Canada. For more than a decade, we have
              guided couples through the emotional, document-heavy journey of
              spousal and family immigration — with honest advice, careful
              preparation and a personalized approach.
            </p>
            <Link className="about-learn-link" href="/about">
              Learn more about FCI
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="about-stats-wrap">
            <div aria-label="About FCI at a glance" className="about-stats">
              <div className="about-stat">
                <CanadianFlagMapleLeaf />
                <strong>2011</strong>
                <span>Year established</span>
              </div>
              <div className="about-stat">
                <UsersRound aria-hidden="true" className="about-stat-icon" />
                <strong>Family Focus</strong>
                <span>Spousal &amp; family immigration</span>
              </div>
              <div className="about-stat">
                <Globe2 aria-hidden="true" className="about-stat-icon" />
                <strong>165+</strong>
                <span>Countries served</span>
              </div>
              <div className="about-stat">
                <ShieldCheck aria-hidden="true" className="about-stat-icon" />
                <strong>Professional Guidance</strong>
                <span>Every step of the way</span>
              </div>
            </div>
            <p className="about-family-priority">
              Your family.
              <br />
              Our priority.
              <CanadianFlagMapleLeaf className="about-priority-maple-icon" />
            </p>
          </div>
        </div>
      </section>

      <section className="pathway-section section-shell" id="pathways">
        <div className="section-heading pathway-heading">
          <p className="eyebrow pathway-eyebrow">
            <span aria-hidden="true" />
            Choose your pathway
            <span aria-hidden="true" />
          </p>
          <h2>
            Start with the route that matches your{" "}
            <span>family</span> situation.
          </h2>
          <p>
            Every spouse application is personal. These pathways help you begin
            with the right conversation instead of guessing your options.
          </p>
        </div>

        <div className="pathway-grid">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            const isActive = pathway.id === activePathwayId;

            return (
              <article
                className={`pathway-card ${isActive ? "is-active" : ""}`}
                key={pathway.id}
                onClick={() => setActivePathwayId(pathway.id)}
              >
                {pathway.id === "open-work-permit" && (
                  <span className="pathway-popular">Most Popular</span>
                )}
                <button
                  aria-pressed={isActive}
                  className="pathway-card-select"
                  onClick={() => setActivePathwayId(pathway.id)}
                  type="button"
                >
                  <span className="pathway-icon-tile">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="pathway-card-copy">
                    <strong>{pathway.title}</strong>
                    <span>{pathway.description}</span>
                  </span>
                </button>
                <Link
                  className="pathway-learn-link"
                  href={pathway.link}
                  onClick={(event) => event.stopPropagation()}
                >
                  Learn more <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="pathway-detail" aria-live="polite">
          <div className="pathway-overview">
            <p className="pathway-detail-label">
              <span>{activePathway.title}</span>
              <i aria-hidden="true" />
            </p>
            <h3>{activePathway.title}</h3>
            <p className="pathway-overview-copy">{activePathway.for}</p>
            <ul className="pathway-benefits">
              {activePathway.support.map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pathway-guidance">
            <div className="pathway-guidance-row">
              <span className="pathway-guidance-icon">
                <FileText aria-hidden="true" />
              </span>
              <p>
                <strong>Eligibility</strong>
                <span>{activePathway.eligibility}</span>
              </p>
            </div>
            <div className="pathway-guidance-row">
              <span className="pathway-guidance-icon">
                <Clock3 aria-hidden="true" />
              </span>
              <p>
                <strong>Processing Time</strong>
                <span>{activePathway.processingTime}</span>
              </p>
            </div>
            <div className="pathway-guidance-row">
              <span className="pathway-guidance-icon">
                <ShieldCheck aria-hidden="true" />
              </span>
              <p>
                <strong>Our Support</strong>
                <span>{activePathway.guidance}</span>
              </p>
            </div>
          </div>
          <div className="pathway-actions">
            <button
              className="button button-primary"
              onClick={openBookingForm}
              type="button"
            >
              Book Now <ArrowRight aria-hidden="true" />
            </button>
            <Link className="pathway-process-link" href="/process">
              Explore the process <ArrowRight aria-hidden="true" />
            </Link>
            <p className="pathway-reassurance">
              <Shield aria-hidden="true" />
              <span>Trusted guidance. No guarantees. Just honest advice.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="solution-section">
        <div className="section-shell solution-layout">
          <div className="solution-copy">
            <p className="eyebrow">Professional guidance</p>
            <h2>
              A clear application strategy before the paperwork
              <span>begins.</span>
            </h2>
            <p>
              <strong className="solution-consultant-name">
                Ms. Rajdeep Thandi
              </strong>{" "}
              helps clients understand the right spouse
              visa or sponsorship pathway, prepare stronger documents, and avoid
              common mistakes that create confusion or delay.
            </p>
            <div
              aria-label="FCI credentials and experience"
              className="solution-metrics"
            >
              {professionalGuidanceStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div className="solution-metric" key={stat.label}>
                    <Icon aria-hidden="true" />
                    <strong className={stat.isLongValue ? "is-long-value" : ""}>
                      {stat.value}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="solution-art">
            <div className="solution-art-scene">
              <Image
                alt=""
                aria-hidden="true"
                className="solution-art-illustration"
                height={600}
                src="/professional-guidance-illustration.svg"
                unoptimized
                width={780}
              />
              <p className="solution-art-note">
                Your goals.
                <br />
                Our guidance.
                <br />
                A clear path.
                <span aria-hidden="true" />
              </p>
              <p className="solution-art-mantra">
                <span>Clarity</span>
                <em>at every step.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CanadaFocusSection />

      <section className="service-section" id="services">
        <div className="section-shell">
          <div className="section-heading service-breakdown-heading">
            <p className="eyebrow service-breakdown-eyebrow">
              <span aria-hidden="true" />
              Service breakdown
              <span aria-hidden="true" />
            </p>
            <h2>
              Focused support for your spouse and family immigration{" "}
              <span>journey.</span>
            </h2>
            <p>
              Each service begins with a careful review of your specific facts.
              Eligibility and strategy depend on current rules and individual
              circumstances.
            </p>
          </div>

          <div
            className="service-stack"
          >
            {serviceBreakdowns.map((service) => {
              const Icon = service.icon;

              return (
                <article className="service-card" key={service.title}>
                  <span className="service-card-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <p className="service-card-category">{service.category}</p>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-description">{service.description}</p>
                  <ul className="service-card-support">
                    {service.support.map((item) => (
                      <li key={item}>
                        <CheckCircle2 aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="service-card-actions">
                    <Link className="service-card-explore" href={service.href}>
                      Explore Service <ArrowRight aria-hidden="true" />
                    </Link>
                    <button
                      aria-label={`Book a consultation about ${service.title}`}
                      className="button service-card-book"
                      onClick={openBookingForm}
                      type="button"
                    >
                      Book Now <ArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessStory />

      <Reviews />

      <section className="faq-section" id="faq">
        <div className="section-shell faq-grid">
          <div className="section-heading align-left">
            <p className="eyebrow">Common questions</p>
            <h2>Answers before you book.</h2>
            <p>
              These answers are general information only. Immigration advice
              depends on your facts and current program rules.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="faq-item" key={faq.question}>
                  <button
                    aria-controls={`faq-panel-${index}`}
                    aria-expanded={isOpen}
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown aria-hidden="true" />
                  </button>
                  <div
                    className="faq-answer"
                    hidden={!isOpen}
                    id={`faq-panel-${index}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="final-cta" id="book">
        <div className="section-shell final-cta-inner">
          <p className="eyebrow">Book your consultation</p>
          <h2>You do not have to sort through this alone.</h2>
          <p>
            Get a calm, professional review of your spouse visa or sponsorship
            options and leave with a clearer next step.
          </p>
          <button
            className="button button-primary"
            onClick={openBookingForm}
            type="button"
          >
            <CalendarCheck aria-hidden="true" />
            Book Now
          </button>
        </div>
      </section>

      <button
        className="mobile-consult"
        onClick={openBookingForm}
        type="button"
      >
        <CalendarCheck aria-hidden="true" />
        Book Now
      </button>

    </main>
  );
}
