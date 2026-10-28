import { parsePhoneNumberFromString } from "libphonenumber-js";

export const CONTACT_SERVICES = [
  "Spouse Sponsorship",
  "Spousal Open Work Permit",
  "Visitor Visa",
  "PR Pathways",
  "Consultation",
  "Other",
] as const;

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  service: (typeof CONTACT_SERVICES)[number];
  message: string;
};

export type ContactInquiryErrors = Partial<
  Record<keyof ContactInquiry | "consent" | "website", string>
>;

export type ContactInquiryParseResult =
  | { ok: true; inquiry: ContactInquiry }
  | {
      ok: false;
      error: string;
      fieldErrors: ContactInquiryErrors;
    };

function isValidContactPhone(phone: string) {
  if (!phone || phone.length > 40 || /[\u0000-\u001f\u007f]/.test(phone)) {
    return false;
  }
  try {
    const defaultCountry = phone.startsWith("+") ? undefined : "CA";
    return Boolean(parsePhoneNumberFromString(phone, defaultCountry)?.isValid());
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function parseContactInquiry(value: unknown): ContactInquiryParseResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Please review your information and try again.",
      fieldErrors: {},
    };
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone.trim() : "";
  const service = typeof value.service === "string" ? value.service.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const errors: ContactInquiryErrors = {};

  if (!name || [...name].filter((character) => /\p{L}/u.test(character)).length < 2) {
    errors.name = "Enter your full name.";
  }
  else if (name.length > 120) errors.name = "Your name must be 120 characters or fewer.";
  else if (/[\u0000-\u001f\u007f]/.test(name)) errors.name = "Your name contains invalid characters.";

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (/[\u0000-\u001f\u007f]/.test(email)) {
    errors.email = "Your email address contains invalid characters.";
  }

  if (!phone) errors.phone = "Enter your phone number.";
  else if (!isValidContactPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!CONTACT_SERVICES.includes(service as (typeof CONTACT_SERVICES)[number])) {
    errors.service = "Select a service.";
  }

  if (message.length > 3000) errors.message = "Your message must be 3,000 characters or fewer.";
  else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)) {
    errors.message = "Your message contains invalid characters.";
  }

  if (value.consent !== true) {
    errors.consent = "Please agree before submitting.";
  }

  const website = typeof value.website === "string" ? value.website.trim() : "";
  if (website) errors.website = "Unable to submit this inquiry.";

  if (Object.keys(errors).length > 0) {
    const onlySpamError = Object.keys(errors).length === 1 && Boolean(errors.website);
    return {
      ok: false,
      error: onlySpamError ? "Unable to submit this inquiry." : "Please review the highlighted fields.",
      fieldErrors: errors,
    };
  }

  return {
    ok: true,
    inquiry: {
      name,
      email,
      phone,
      service: service as ContactInquiry["service"],
      message,
    },
  };
}
