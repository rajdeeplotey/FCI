"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { hasClientSessionHint } from "../lib/client-session-hint";
import { useBookingModal } from "./booking-modal-context";

const subscribeToNothing = () => () => {};

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Make a Payment", href: "/payment" },
] as const;

export default function SiteHeader({
  className,
  includeReviewsLink = false,
  lightBranding = false,
}: {
  className?: string;
  includeReviewsLink?: boolean;
  lightBranding?: boolean;
} = {}) {
  const pathname = usePathname();
  const { openBookingForm } = useBookingModal();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const mobileMenuOpen = openPath === pathname;
  // Signed-in clients skip the /login → /portal redirect hop, which otherwise
  // shows a blank page while the session is verified.
  const signedIn = useSyncExternalStore(
    subscribeToNothing,
    hasClientSessionHint,
    () => false,
  );
  // On the home page, a link to "/" is a no-op navigation, so scroll back to
  // the top ourselves (and drop any #section hash from the URL).
  const scrollHomeToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setOpenPath(null);
    if (pathname !== "/") return;
    event.preventDefault();
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", "/");
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };
  const displayedNavigationItems = includeReviewsLink
    ? navigationItems.flatMap((item) =>
        item.href === "/faq"
          ? [{ label: "Reviews", href: "/#reviews" }, item]
          : [item],
      )
    : navigationItems;

  return (
    <header
      className={`site-header${className ? ` ${className}` : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenPath(null);
      }}
    >
      <Link
        className="brand-mark"
        href="/"
        aria-label="Future Canadian Immigration Inc."
        onClick={scrollHomeToTop}
      >
        <Image
          className="brand-logo"
          src={lightBranding ? "/fci-logo-footer.png" : "/fci-logo.png"}
          alt="FCI — Future Canadian Immigration Inc. logo"
          width={1402}
          height={1007}
          priority
          unoptimized
        />
        <Image
          className="brand-wordmark"
          src={
            lightBranding ? "/fci-wordmark-footer.png" : "/fci-wordmark.png"
          }
          alt="Future Canadian Immigration Inc."
          width={1654}
          height={118}
          priority
          unoptimized
        />
      </Link>

      <nav
        className={`desktop-nav${mobileMenuOpen ? " is-open" : ""}`}
        aria-label="Primary navigation"
        id="primary-navigation"
      >
        {displayedNavigationItems.map(({ label, href }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className="site-nav-link"
              href={href}
              key={href}
              onClick={href === "/" ? scrollHomeToTop : () => setOpenPath(null)}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        <Link className="header-login" href={signedIn ? "/portal" : "/login"}>
          Login
        </Link>
        <button className="header-cta" onClick={openBookingForm} type="button">
          Book Now
        </button>
        <button
          aria-controls="primary-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="nav-toggle"
          onClick={() => setOpenPath(mobileMenuOpen ? null : pathname)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
