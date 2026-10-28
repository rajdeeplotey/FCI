import { env } from "./runtime-env";

// Shown until the official number is set: an obvious placeholder that is not
// dialable, so visitors can't mistake it for a working line.
// TODO: set FCI_PHONE_NUMBER in hPanel once FCI's real number is confirmed.
const PLACEHOLDER_PHONE = "+1 (XXX) XXX-XXXX";

// FCI's public phone number, shown in the footer and on the Contact page.
// Set FCI_PHONE_NUMBER in the server environment (hPanel), written the way it
// should appear, e.g. "+1 (416) 555-0123". Without it the placeholder is shown
// as plain text (href null). Pages read it at build time; Hostinger rebuilds
// on env changes.
export function getPublicPhone(): { display: string; href: string | null } {
  const configured = (env as Record<string, string | undefined>).FCI_PHONE_NUMBER
    ?.trim()
    .replace(/^["']|["']$/g, "");
  const dialable = configured?.replace(/[^\d+]/g, "") ?? "";
  if (!configured || dialable.replace(/\D/g, "").length < 7) {
    return { display: PLACEHOLDER_PHONE, href: null };
  }
  return { display: configured, href: `tel:${dialable}` };
}
