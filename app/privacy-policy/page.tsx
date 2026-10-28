import type { Metadata } from "next";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Privacy Policy | Future Canadian Immigration Inc.",
  description:
    "How Future Canadian Immigration Inc. handles information submitted through CanadaSpouseVisa.com, its consultation booking flow, and client services.",
};

const sections = [
  ["scope", "Introduction and scope"],
  ["information", "Information we collect"],
  ["documents", "Immigration information and documents"],
  ["use", "How we use information"],
  ["verification", "Email verification"],
  ["payments", "Payments and billing"],
  ["storage", "Database and document storage"],
  ["cookies", "Cookies, browser storage, analytics and logs"],
  ["providers", "Sharing and service providers"],
  ["transfers", "International processing"],
  ["retention", "Retention and deletion requests"],
  ["security", "Security"],
  ["rights", "Privacy choices and complaints"],
  ["children", "Children's information"],
  ["external-links", "Third-party links"],
  ["changes", "Policy updates"],
  ["contact", "Contact us"],
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="info-page privacy-page">
      <SiteHeader />

      <section className="payment-shell info-shell privacy-shell">
        <header className="privacy-header">
          <p className="eyebrow">Your information, handled with care</p>
          <h1>Privacy Policy</h1>
          <p className="privacy-updated">Effective date: October 22, 2026</p>
          <p className="privacy-lede">
            This policy explains how Future Canadian Immigration Inc. handles
            personal information when you visit CanadaSpouseVisa.com, contact
            us, request a consultation, make a payment, or use the client and
            administrative services connected with this website.
          </p>
        </header>

        <div className="privacy-layout">
          <nav className="privacy-toc" aria-label="Privacy policy sections">
            <h2>On this page</h2>
            <ol>
              {sections.map(([id, title]) => (
                <li key={id}>
                  <a href={`#${id}`}>{title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="privacy-content">
            <section id="scope">
              <h2>1. Introduction and scope</h2>
              <p>
                Future Canadian Immigration Inc. (“FCI,” “we,” “us,” or “our”)
                provides immigration consultation and related services for
                people and families considering Canadian immigration options.
                This policy applies to the public website at
                {" "}<a href="https://canadaspousevisa.com">canadaspousevisa.com</a>,
                its consultation and contact forms, hosted payment journey,
                and associated client or administrative features.
              </p>
              <p>
                This policy describes the practices reflected in the website
                implementation reviewed for this draft. Some provider and
                business settings depend on FCI’s account configuration and
                must be confirmed before this draft is published as final.
              </p>
            </section>

            <section id="information">
              <h2>2. Information we collect</h2>
              <p>
                Depending on how you use the website, information may include:
              </p>
              <ul>
                <li>
                  Contact and consultation details: your name, email address,
                  phone number, country or territory, selected time zone,
                  requested appointment date and time, and any optional
                  description you choose to provide.
                </li>
                <li>
                  Verification and account information: email verification
                  status, one-time-code hashes and expiry/attempt data, client
                  portal sign-in records, and session information.
                </li>
                <li>
                  Payment and booking records: booking reference, appointment
                  status, amount and currency, payment status, and Stripe
                  Checkout or payment identifiers.
                </li>
                <li>
                  Inquiry and service information you submit when contacting
                  FCI, including information needed to respond to your request.
                </li>
                <li>
                  If a document is added to an authorized client file, the
                  document itself and related file metadata, such as file name,
                  type, size, upload date, and review status.
                </li>
              </ul>
              <p>
                Please provide only information relevant to your request. The
                optional consultation description is not a secure document
                upload channel.
              </p>
            </section>

            <section id="documents">
              <h2>3. Immigration information and documents</h2>
              <p>
                The public consultation booking form does not accept passport
                copies or other uploaded documents. Do not enter passport
                numbers, identity-document details, or a detailed confidential
                case history in its optional description field.
              </p>
              <p>
                The application includes private document storage for
                authorized staff to manage documents associated with client
                records. Files are kept in a private Supabase Storage bucket;
                access is mediated by authenticated application routes, and
                files are not served through public file URLs. Signed-in
                clients can upload requested documents through the client
                portal. Ask FCI for the approved method before sending
                sensitive files any other way.
              </p>
              <p>
                If a parent or guardian contacts us about a family matter,
                please avoid sending a child’s sensitive documents unless FCI
                has requested them through an appropriate channel.
              </p>
            </section>

            <section id="use">
              <h2>4. How we use information</h2>
              <p>FCI uses information as needed to:</p>
              <ul>
                <li>respond to inquiries and provide requested assistance;</li>
                <li>schedule consultations and manage appointment availability;</li>
                <li>verify email access and protect booking and portal workflows;</li>
                <li>process payments and maintain booking, billing, and accounting records;</li>
                <li>
                  send appointment, payment, verification, and service
                  communications;
                </li>
                <li>
                  maintain and secure the website, identify abuse, and
                  troubleshoot service issues; and
                </li>
                <li>meet applicable legal, regulatory, and professional obligations.</li>
              </ul>
              <p>
                The project does not show an advertising or unrelated
                marketing use of booking information. FCI should confirm its
                communication practices and applicable legal bases before
                publication.
              </p>
            </section>

            <section id="verification">
              <h2>5. Email verification</h2>
              <p>
                Before a consultation can proceed to payment, the booking flow
                can send a six-digit one-time code to the email address you
                provide. The code helps confirm that you can access that
                mailbox and reduces errors in booking communications. It does
                not confirm your identity beyond access to the email account.
              </p>
              <p>
                Verification codes are generated on the server, stored as
                keyed hashes rather than readable codes, expire after ten
                minutes, and are subject to attempt and resend limits. Codes
                are not intended for reuse. Email delivery is handled by the
                configured provider described below.
              </p>
            </section>

            <section id="payments">
              <h2>6. Payments and billing</h2>
              <p>
                Consultation payments are collected using Stripe-hosted
                Checkout. Information needed to complete the transaction,
                which may include your email and billing details, is provided
                to Stripe under its own privacy terms. FCI’s application
                records booking and payment status, fee amount and currency,
                and relevant Stripe session or payment identifiers. Stripe
                processes payment credentials; the booking form does not ask
                you to enter card details directly into FCI’s website.
              </p>
              <p>
                Payment confirmation is based on server-verified Stripe
                notifications, not solely on a browser return page. Any
                applicable government filing charges are separate from FCI’s
                professional or consultation charges unless a written
                description expressly says otherwise. Review the checkout
                details and applicable service terms before paying.
              </p>
              <p>
                Stripe’s handling of information is governed by
                {" "}<a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">
                  Stripe’s Privacy Policy
                </a>.
              </p>
            </section>

            <section id="storage">
              <h2>7. Database and document storage</h2>
              <p>
                The website is hosted on Hostinger and uses a Supabase
                PostgreSQL database for booking, inquiry, verification, client
                portal, and administrative records. Private client documents
                are stored separately in a private Supabase Storage bucket.
                Access to private records and files is controlled through
                application authorization checks.
              </p>
              <p>
                The specific hosting and Supabase accounts, regions, backups,
                access permissions, and retention settings are account-level
                operational settings and are not established by the website
                source code alone.
              </p>
            </section>

            <section id="cookies">
              <h2>8. Cookies, browser storage, analytics and logs</h2>
              <p>
                The client portal and administrative area use essential
                session cookies to maintain authenticated sessions. The
                application sets these as HttpOnly and SameSite=Lax, with a
                twelve-hour maximum age and the Secure attribute on HTTPS.
                They are used for sign-in and security, not for advertising.
              </p>
              <p>
                The booking flow also uses browser session storage for
                short-lived workflow information, such as a pending Checkout
                session identifier and the email needed for the client portal
                sign-in journey. This data is held in the browser’s current
                tab session rather than in a persistent advertising profile.
              </p>
              <p>
                No third-party analytics or advertising tags were identified
                in the application source reviewed for this draft. Hostinger, Supabase,
                Stripe, and email providers may generate operational,
                delivery, fraud-prevention, or security logs under their own
                configurations. FCI should verify its deployed analytics,
                cookie, and provider-log settings before publication.
              </p>
            </section>

            <section id="providers">
              <h2>9. Sharing and service providers</h2>
              <p>
                FCI may disclose relevant information to service providers
                that operate or support the website and services, including:
              </p>
              <ul>
                <li>
                  Hostinger for website hosting;
                </li>
                <li>
                  Supabase for the database and private document storage;
                </li>
                <li>Stripe for hosted payment processing and payment status;</li>
                <li>
                  the transactional email provider configured for FCI’s
                  deployment (Resend) to deliver verification codes,
                  booking notices, and account communications; and
                </li>
                <li>
                  authorized FCI personnel who need access to respond to you,
                  manage a booking, or administer a client file.
                </li>
              </ul>
              <p>
                Email is delivered through Resend using server-side
                credentials. We do not publish or expose those credentials in the browser.
                Information may also be disclosed where required by law, to
                protect people or services, or in connection with a lawful
                business or professional obligation.
              </p>
            </section>

            <section id="transfers">
              <h2>10. International processing</h2>
              <p>
                FCI serves clients in different locations, and some service
                providers may process or store information in countries
                outside your province or country, including outside Canada.
                The actual locations and safeguards depend on the FCI accounts
                and provider configurations in use. Contact FCI for
                deployment-specific information before sending highly
                sensitive material.
              </p>
            </section>

            <section id="retention">
              <h2>11. Retention and deletion requests</h2>
              <p>
                FCI keeps information for as long as reasonably needed to
                respond to your request, administer consultations and client
                relationships, maintain payment and accounting records,
                protect the service, and meet applicable legal or professional
                obligations. The source code does not establish a complete
                retention schedule for bookings, inquiries, client files, and
                payment records; FCI must define and apply one.
              </p>
              <p>
                Booking email verification codes expire after ten minutes and
                are limited to one-time use. You may ask FCI to provide access
                to or correct information about you, or to delete information
                that is no longer required. Some records may need to be
                retained or deletion may be limited where law, dispute
                resolution, security, or professional obligations require
                retention. Requests can be sent to
                {" "}<a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>.
              </p>
            </section>

            <section id="security">
              <h2>12. Security</h2>
              <p>
                The application uses measures such as server-side access
                checks for private records, hashed one-time verification
                secrets, rate limits, protected session cookies, and private
                object storage routes. These safeguards reduce risk but cannot
                guarantee absolute security. You can help protect your
                information by using a private email account, keeping
                verification codes confidential, and avoiding sensitive
                details in optional booking fields.
              </p>
            </section>

            <section id="rights">
              <h2>13. Privacy choices and complaints</h2>
              <p>
                Depending on where you live and the circumstances of the
                information handling, privacy laws may provide rights to
                request access to or correction of personal information, ask
                questions about its use or disclosure, or raise a concern. You
                may also withdraw consent where consent is the basis for a
                particular activity, subject to legal and service requirements.
              </p>
              <p>
                Canadian federal or provincial private-sector privacy
                requirements may apply depending on FCI’s activities and
                location. The source does not establish which provincial
                statute applies or whether Indian privacy legislation applies
                to FCI’s operations. Contact FCI first at
                {" "}<a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>; you
                may also contact the privacy regulator with jurisdiction over
                your concern. FCI should confirm the correct regulator and
                request process before publication.
              </p>
            </section>

            <section id="children">
              <h2>14. Children’s information</h2>
              <p>
                This website is intended for adults seeking immigration
                information or acting for a family. It is not designed for
                children to use independently. A parent or legal guardian may
                provide relevant information about a child as part of a family
                inquiry or immigration matter. Please provide only what is
                necessary and do not submit a child’s identity documents
                through the public booking form.
              </p>
            </section>

            <section id="external-links">
              <h2>15. Third-party links</h2>
              <p>
                The website may link to external sites, including Stripe and
                social or government resources. Those sites are not controlled
                by FCI and have their own privacy practices. Review their
                policies before providing information or using their services.
              </p>
            </section>

            <section id="changes">
              <h2>16. Policy updates</h2>
              <p>
                We may revise this policy when our services, technology, or
                legal obligations change. The effective date at the top will
                be updated when a revised policy is posted. Material changes
                will be communicated through the website or another
                appropriate channel when required.
              </p>
            </section>

            <section id="contact">
              <h2>17. Contact us</h2>
              <p>
                For privacy questions, access or correction requests, or
                concerns about information handling, contact Future Canadian
                Immigration Inc. at
                {" "}<a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>.
                The website currently lists no dedicated privacy email or
                mailing address.
              </p>
            </section>

            <aside className="privacy-review-note" aria-labelledby="privacy-review-title">
              <h2 id="privacy-review-title">Owner review required before publication</h2>
              <p>
                This is a website-specific draft, not legal advice or a
                determination of compliance. Before treating it as final, FCI
                should confirm that <a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>
                {" "}is the correct privacy contact; identify the responsible
                privacy contact and applicable Canadian province; confirm the
                active email provider, hosting and Supabase regions and storage
                settings, Stripe billing configuration, analytics and log
                settings, and retention schedule; and obtain a review against
                the laws that apply to FCI’s actual operations, including
                whether any Indian privacy requirements apply.
              </p>
            </aside>

          </article>
        </div>
      </section>
    </main>
  );
}
