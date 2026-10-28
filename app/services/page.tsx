import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  FileCheck2,
  Globe2,
  HeartHandshake,
  Plane,
  UsersRound,
} from "lucide-react";
import SiteHeader from "../site-header";
import { BookingTrigger } from "../booking-modal-provider";

const services = [
  {
    title: "Inland Spousal Sponsorship",
    description:
      "Support for couples living together in Canada who are preparing a sponsorship application from within the country.",
    href: "/services/inland-spousal-sponsorship",
    icon: HeartHandshake,
  },
  {
    title: "Outland Spousal Sponsorship",
    description:
      "Guidance for couples where the sponsored spouse or partner is applying from outside Canada.",
    href: "/services/outland-spousal-sponsorship",
    icon: Globe2,
  },
  {
    title: "Common-Law Sponsorship",
    description:
      "Support for common-law partners who need to document their relationship and prepare an application.",
    href: "/services/common-law-sponsorship",
    icon: UsersRound,
  },
  {
    title: "Conjugal Partner Sponsorship",
    description:
      "Careful, evidence-based guidance for couples who may qualify under the conjugal partner class.",
    href: "/services/conjugal-partner-sponsorship",
    icon: FileCheck2,
  },
  {
    title: "Spouse Open Work Permit",
    description:
      "A review of whether an open work permit may fit your spouse or partner's situation and current eligibility rules.",
    href: "/services/spouse-open-work-permit",
    icon: BriefcaseBusiness,
  },
  {
    title: "Visitor Visa",
    description:
      "Planning support for spouses and family members outside Canada who may need a temporary visitor visa.",
    href: "/services/visitor-visa",
    icon: Plane,
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <SiteHeader />

      <section aria-labelledby="services-hero-title" className="services-hero">
        <div className="services-hero-copy">
          <div className="services-hero-inner">
            <p className="services-eyebrow">
              <span />
              Our services
            </p>
            <h1 id="services-hero-title">
              Immigration support for your family&apos;s brighter future in{" "}
              <span>Canada.</span>
            </h1>
            <p className="services-hero-description">
              We provide thoughtful guidance for Canadian spouse and family
              immigration, helping you understand your options and navigate the
              process with clarity and care.
            </p>
            <div className="services-hero-actions">
              <a className="services-button services-button-primary" href="#services">
                Explore our services
                <ArrowRight aria-hidden="true" />
              </a>
              <BookingTrigger className="services-button services-button-secondary">
                Book a consultation
                <CalendarCheck aria-hidden="true" />
              </BookingTrigger>
            </div>
          </div>
        </div>
        <div className="services-hero-image">
          <Image
            alt="Toronto skyline across Lake Ontario at dusk"
            className="services-hero-photo"
            height={1080}
            priority
            sizes="(min-width: 1040px) 56vw, 100vw"
            src="/about-toronto.webp"
            unoptimized
            width={1920}
          />
          <div aria-hidden="true" className="services-hero-image-shade" />
          <p className="services-hero-caption">
            Toronto, Canada
            <span>Supporting your next chapter</span>
          </p>
        </div>
        <div aria-hidden="true" className="services-hero-divider">
          <span className="services-hero-divider-line services-hero-divider-line-top" />
          <span className="services-hero-divider-line services-hero-divider-line-bottom" />
          <span className="services-hero-flag">
            <Image
              alt=""
              aria-hidden="true"
              className="services-hero-flag-image services-hero-flag-image-animated"
              height={72}
              src="/canada-flag-wave.gif"
              unoptimized
              width={144}
            />
            <Image
              alt=""
              aria-hidden="true"
              className="services-hero-flag-image services-hero-flag-image-still"
              height={72}
              src="/canada-flag-wave-still.png"
              unoptimized
              width={144}
            />
          </span>
        </div>
      </section>

      <section
        aria-labelledby="services-list-title"
        className="services-content"
        id="services"
      >
        <div className="section-shell services-content-grid">
          <div className="services-list-column">
            <p className="services-eyebrow services-eyebrow-light">
              <span />
              Our services
            </p>
            <h2 id="services-list-title">Guidance for your next chapter.</h2>
            <p className="services-intro">
              FCI helps couples and families understand Canadian immigration
              pathways and plan practical next steps for their situation.
            </p>
            <div aria-label="Family immigration services" className="services-list">
              {services.map(({ title, description, href, icon: Icon }) => (
                <Link className="services-list-item" href={href} key={href}>
                  <span aria-hidden="true" className="services-list-icon">
                    <Icon />
                  </span>
                  <span className="services-list-copy">
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="services-list-arrow" />
                </Link>
              ))}
            </div>
          </div>

          <article className="services-feature">
            <Image
              alt="A couple holding their passports together"
              className="services-feature-photo"
              fill
              loading="lazy"
              sizes="(min-width: 1040px) 43vw, 100vw"
              src="/placeholder-couple-passports.png"
              unoptimized
            />
            <div aria-hidden="true" className="services-feature-shade" />
            <div className="services-feature-content">
              <p>Family immigration builds stronger communities</p>
              <h2>Together, we build what&apos;s next.</h2>
              <Link href="/services/inland-spousal-sponsorship">
                Explore sponsorship support
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="services-cta-title" className="services-cta">
        <div className="section-shell services-cta-inner">
          <div className="services-cta-copy">
            <p className="services-eyebrow">
              <span />
              Start with a conversation
            </p>
            <h2 id="services-cta-title">
              Have questions about your spouse or family immigration journey?
            </h2>
            <p>
              Book a consultation to discuss your circumstances, possible
              pathways, and practical next steps for your family.
            </p>
          </div>
          <div className="services-cta-action">
            <ul>
              <li>
                <HeartHandshake aria-hidden="true" />
                Personalized guidance
              </li>
              <li>
                <FileCheck2 aria-hidden="true" />
                Careful document preparation
              </li>
              <li>
                <UsersRound aria-hidden="true" />
                Support for your family&apos;s next steps
              </li>
            </ul>
            <BookingTrigger className="services-button services-button-primary">
              <CalendarCheck aria-hidden="true" />
              Book a consultation
              <ArrowRight aria-hidden="true" />
            </BookingTrigger>
          </div>
        </div>
      </section>

    </main>
  );
}
