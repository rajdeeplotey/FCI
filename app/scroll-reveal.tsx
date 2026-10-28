"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      // The client portal (.cp-content) and admin panel (.ad-content) are app
      // shells, not marketing pages.
      "main:not(.cp-content):not(.ad-content) > section:not(.hero-section):not(.process-section)"
    );

    if (
      sections.length === 0 ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    sections.forEach((section) => section.classList.add("scroll-reveal"));
    document.documentElement.classList.add("has-scroll-reveal");

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
