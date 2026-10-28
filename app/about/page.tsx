import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  FileCheck2,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import SiteHeader from "../site-header";
import { BookingTrigger } from "../booking-modal-provider";

export const metadata: Metadata = {
  title: "About FCI | Future Canadian Immigration Inc.",
  description:
    "Learn about FCI's focus on Canadian spouse and family immigration, established in 2011.",
};

export default function AboutPage() {
  return (
    <main className="info-page about-page">
      <SiteHeader />

      <section className="about-hero" aria-labelledby="about-hero-title">
        <Image
          alt="Toronto skyline at dusk, including the CN Tower"
          className="about-hero-image"
          fill
          priority
          sizes="100vw"
          src="/about-toronto.webp"
          unoptimized
        />
        <div className="section-shell about-hero-content">
          <div className="about-hero-copy">
            <p className="eyebrow">About FCI</p>
            <h1 id="about-hero-title">
              Helping couples and families navigate life in Canada with clarity.
            </h1>
            <p className="about-hero-lede">
              Future Canadian Immigration Inc. provides guidance for spouse and
              family pathways, documentation, and application preparation shaped
              around each client&apos;s circumstances.
            </p>
            <div className="about-hero-actions">
              <BookingTrigger className="button button-primary">
                <CalendarCheck aria-hidden="true" />
                Book a consultation
                <ArrowRight aria-hidden="true" />
              </BookingTrigger>
              <Link className="button button-secondary" href="/services">
                Explore our services
              </Link>
            </div>
            <div className="about-hero-country">
              <span aria-hidden="true" className="about-canadian-flag">
                <svg viewBox="0 0 60 40" focusable="false">
                  <rect fill="#fff" height="40" width="60" />
                  <path d="M0 0h14v40H0zm46 0h14v40H46z" fill="#c8102e" />
                  <path
                    d="m30 5 3.2 7.1 4.9-2.5-1.4 7 5.5-1.2-4.1 5.8 4.4 1.6-8.2 1.1 1.4 9.1h-7.4l1.4-9.1-8.2-1.1 4.4-1.6-4.1-5.8 5.5 1.2-1.4-7 4.9 2.5z"
                    fill="#c8102e"
                  />
                </svg>
              </span>
              <span>Canadian spouse and family immigration</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story" aria-labelledby="about-story-title">
        <div className="section-shell about-story-grid">
          <div className="about-story-copy">
            <p className="eyebrow">Our story</p>
            <h2 id="about-story-title">Trusted guidance for your Canadian journey.</h2>
            <p>
              Future Canadian Immigration Inc. (FCI) was established in 2011
              with a dedicated focus on spouse and family immigration. The
              company helps couples and families understand their options and
              prepare clear, carefully organized applications.
            </p>
            <p>
              Every relationship is different. FCI considers each client&apos;s
              relationship history, status in Canada, timing, and personal
              circumstances when discussing possible pathways and practical
              next steps.
            </p>
            <blockquote>
              Immigration is not just a paperwork exercise. It is a life process
              shaped by relationship history, status in Canada, timing, and
              personal circumstances.
            </blockquote>
          </div>
          <figure className="about-story-image">
            <Image
              alt="Parliament Hill in Ottawa, Ontario, with the Peace Tower"
              fill
              loading="lazy"
              sizes="(min-width: 900px) 48vw, 100vw"
              src="/about-parliament.webp"
              unoptimized
            />
            <figcaption>Parliament Hill, Ottawa</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-highlights" aria-label="FCI's approach">
        <div className="section-shell about-highlights-grid">
          <article className="about-highlight">
            <HeartHandshake aria-hidden="true" />
            <p className="about-highlight-label">Our focus</p>
            <h3>Spouse and family immigration</h3>
            <p>Support for partner and family pathways to Canada.</p>
          </article>
          <article className="about-highlight">
            <UserRoundCheck aria-hidden="true" />
            <p className="about-highlight-label">Our approach</p>
            <h3>Individual circumstances</h3>
            <p>Guidance shaped around each relationship and situation.</p>
          </article>
          <article className="about-highlight">
            <MessageCircle aria-hidden="true" />
            <p className="about-highlight-label">Our communication</p>
            <h3>Clear next steps</h3>
            <p>Practical explanations without promises about outcomes.</p>
          </article>
          <article className="about-highlight">
            <FileCheck2 aria-hidden="true" />
            <p className="about-highlight-label">Our preparation</p>
            <h3>Careful documentation</h3>
            <p>Organized application materials and supporting evidence.</p>
          </article>
        </div>
      </section>

      <section className="about-leadership" aria-labelledby="about-leadership-title">
        <div className="section-shell about-leadership-grid">
          <div
            aria-label="Portrait placeholder; portrait not supplied"
            className="about-profile-placeholder"
            role="img"
          >
            <UserRound aria-hidden="true" />
            <span>Portrait not supplied</span>
          </div>
          <div className="about-leadership-copy">
            <p className="eyebrow">Company leadership</p>
            <h2 id="about-leadership-title">Ms. Rajdeep Thandi</h2>
            <p className="about-profile-role">Founder / CEO</p>
            <p>
              An approved biographical profile has not yet been supplied. FCI
              focuses on spouse and family immigration, helping clients
              understand possible pathways and prepare clear, carefully
              organized applications.
            </p>
          </div>
          <aside className="about-credentials" aria-label="Consultant credentials">
            <BadgeCheck aria-hidden="true" />
            <p className="eyebrow">Immigration consultant</p>
            <p className="about-credential-designation">
              Regulated Canadian Immigration Consultant
            </p>
            <p className="about-credential-number">RCIC <strong>#420375</strong></p>
            <p className="about-credential-note">
              Member of Law Society of Upper Canada
              <br />
              Immigration Counsel &amp; Commissioner of Oaths
            </p>
          </aside>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="section-shell about-values-layout">
          <div className="about-values-intro">
            <p className="eyebrow">Our values</p>
            <h2 id="about-values-title">Guided by integrity. Focused on you.</h2>
            <p>
              Clear communication and careful preparation shape how FCI works
              with clients through important family immigration decisions.
            </p>
          </div>
          <div className="about-values-list">
            <article>
              <ShieldCheck aria-hidden="true" />
              <h3>Clarity &amp; transparency</h3>
              <p>Understand the process, requirements, and possible next steps.</p>
            </article>
            <article>
              <HeartHandshake aria-hidden="true" />
              <h3>Individualized guidance</h3>
              <p>Consider the facts and circumstances of each family.</p>
            </article>
            <article>
              <FileCheck2 aria-hidden="true" />
              <h3>Careful documentation</h3>
              <p>Prepare organized forms, evidence, and supporting materials.</p>
            </article>
            <article>
              <MessageCircle aria-hidden="true" />
              <h3>Ongoing support</h3>
              <p>Keep communication practical as the process moves forward.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-closing" aria-labelledby="about-closing-title">
        <Image
          alt="Canadian Rockies near Canmore, Alberta"
          className="about-closing-image"
          fill
          loading="lazy"
          sizes="100vw"
          src="/about-canmore.webp"
          unoptimized
        />
        <div className="section-shell about-closing-content">
          <div>
            <p className="eyebrow">Take the next step</p>
            <h2 id="about-closing-title">Your Canadian journey starts here.</h2>
            <p>
              Book a consultation to discuss your circumstances, possible
              pathways, and a practical next step for your family.
            </p>
          </div>
          <div className="about-closing-action">
            <BookingTrigger className="button button-primary">
              Book a consultation
              <ArrowRight aria-hidden="true" />
            </BookingTrigger>
            <span>Available appointment times appear during booking.</span>
          </div>
        </div>
      </section>

    </main>
  );
}
