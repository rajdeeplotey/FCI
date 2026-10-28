import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Mail, MapPin, Phone } from "lucide-react";
import { siFacebook, siInstagram, siWhatsapp } from "simple-icons";
import { getPublicPhone } from "../lib/contact-info";

const quickLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Process", "/process"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Privacy Policy", "/privacy-policy"],
  ["Make a Payment", "/payment"],
] as const;

const serviceLinks = [
  ["Spouse Visa", "/services"],
  ["Spousal Sponsorship", "/services/inland-spousal-sponsorship"],
  ["Visitor Visa", "/services/visitor-visa"],
  ["PR Pathways", "/services"],
  ["Consultation", "/book"],
] as const;

function CanadaFlag() {
  return (
    <svg
      aria-label="Canada"
      className="footer-canada-flag"
      role="img"
      viewBox="0 0 60 30"
    >
      <path d="M0 0h60v30H0z" fill="#fff" />
      <path d="M0 0h15v30H0zm45 0h15v30H45z" fill="var(--maple)" />
      <path
        d="m30 5 2.2 5.1 3.1-1.8-.8 4.3 3.4.8-3.6 3.2 1.1 2.1H24.6l1.1-2.1-3.6-3.2 3.4-.8-.8-4.3 3.1 1.8L30 5Zm-1.4 13.7h2.8l.6 6h-4l.6-6Z"
        fill="var(--maple)"
      />
    </svg>
  );
}

function FooterMapleLeaf() {
  return (
    <svg
      aria-hidden="true"
      className="footer-maple-watermark"
      fill="currentColor"
      viewBox="0 0 5000 4500"
    >
      <path d="m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
    </svg>
  );
}

function FooterSocialIcons() {
  const socialIcons = [
    { label: "Instagram", className: "footer-social-instagram", icon: siInstagram },
    { label: "Facebook", className: "footer-social-facebook", icon: siFacebook },
    { label: "WhatsApp", className: "footer-social-whatsapp", icon: siWhatsapp },
  ] as const;

  return (
    <div aria-label="Social media: Instagram, Facebook, and WhatsApp" className="footer-social-icons">
      {socialIcons.map(({ label, className, icon }) => (
        <span
          aria-label={label}
          className={`footer-social-icon ${className}`}
          key={label}
          role="img"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill={`#${icon.hex}`}
          >
            <path d={icon.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  const phone = getPublicPhone();
  return (
    <footer className="site-footer">
      <FooterMapleLeaf />
      <div className="section-shell">
        <div className="footer-grid">
          <section aria-label="Future Canadian Immigration Inc." className="footer-column footer-brand-column">
            <div className="footer-brand-lockup">
              <Image
                alt="FCI logo"
                className="footer-logo"
                height={1007}
                loading="lazy"
                src="/fci-logo-footer.png"
                unoptimized
                width={1402}
              />
              <Image
                alt="Future Canadian Immigration Inc."
                className="footer-wordmark"
                height={118}
                loading="lazy"
                src="/fci-wordmark-footer.png"
                unoptimized
                width={1654}
              />
            </div>
            <p className="footer-tagline">Your Family. Our Priority.</p>
            <span aria-hidden="true" className="footer-brand-rule" />
            <p className="footer-description">
              We provide trusted immigration guidance and support for families,
              couples and individuals looking to build their future in Canada.
            </p>
            <div className="footer-credentials">
              <strong>Ms. Rajdeep Thandi</strong>
              <span>RCIC #420375</span>
              <span>Member of Law Society of Upper Canada</span>
              <span>Immigration Counsel &amp; Commissioner of Oaths</span>
            </div>
          </section>

          <nav aria-label="Footer quick links" className="footer-column footer-link-column">
            <h2>Quick Links</h2>
            {quickLinks.map(([label, href]) => (
              <Link className="footer-nav-link" href={href} key={href}>
                <ArrowRight aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Our services" className="footer-column footer-link-column">
            <h2>Our Services</h2>
            {serviceLinks.map(([label, href]) => (
              <Link className="footer-nav-link" href={href} key={label}>
                <ArrowRight aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          <section aria-labelledby="footer-contact-title" className="footer-column footer-contact-column">
            <h2 id="footer-contact-title">Get In Touch</h2>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <Mail aria-hidden="true" />
              </span>
              <a href="mailto:info@canadaspousevisa.com">info@canadaspousevisa.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <CalendarCheck aria-hidden="true" />
              </span>
              <a href="mailto:bookings@canadaspousevisa.com">bookings@canadaspousevisa.com</a>
            </div>
            {/* Placeholder text until FCI_PHONE_NUMBER is set (lib/contact-info.ts). */}
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <Phone aria-hidden="true" />
              </span>
              {phone.href ? <a href={phone.href}>{phone.display}</a> : <p>{phone.display}</p>}
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <MapPin aria-hidden="true" />
              </span>
              <p>We are based in Canada and serve clients across the globe.</p>
            </div>
            <span aria-hidden="true" className="footer-contact-rule" />
            <h3 className="footer-follow-heading">Follow Us</h3>
            <FooterSocialIcons />
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-legal">
            <p>© 2026 Future Canadian Immigration Inc. All rights reserved.</p>
            <a
              className="footer-credit"
              href="https://diginexxa.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Website by Diginexxa Studios
            </a>
          </div>
          <div aria-label="Countries served: Canada" className="footer-countries">
            <span>Countries Served</span>
            <CanadaFlag />
          </div>
        </div>
      </div>
    </footer>
  );
}
