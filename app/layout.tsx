import type { Metadata } from "next";
import localFont from "next/font/local";
import ScrollReveal from "./scroll-reveal";
import BookingModalProvider from "./booking-modal-provider";
import SiteFooter from "./site-footer";
import FooterVisibility from "./footer-visibility";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Variable.woff2",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/GeneralSans-VariableItalic.woff2",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-general-sans",
  display: "fallback",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://canadaspousevisa.com"),
  referrer: "no-referrer",
  title: "Canada Spouse Visa & Sponsorship Guidance | Rajdeep Thandi RCIC",
  description:
    "Canada spouse visa, open work permit, visitor visa, and PR spousal sponsorship guidance from Mrs. Rajdeep Thandi, RCIC #420375.",
  openGraph: {
    title: "CanadaSpouseVisa.com",
    description:
      "Authorized RCIC guidance for spouse visa, visitor visa, open work permit, and PR spousal sponsorship applications.",
    url: "https://canadaspousevisa.com",
    siteName: "CanadaSpouseVisa.com",
    images: [
      {
        url: "/placeholder-hero.png",
        width: 1001,
        height: 601,
        alt: "A smiling couple holding passports and travel documents",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CanadaSpouseVisa.com",
    description:
      "Authorized RCIC guidance for spouse visa and sponsorship applications.",
    images: ["/placeholder-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={generalSans.variable}>
        <BookingModalProvider>
          {children}
          <FooterVisibility>
            <SiteFooter />
          </FooterVisibility>
          <ScrollReveal />
        </BookingModalProvider>
      </body>
    </html>
  );
}
