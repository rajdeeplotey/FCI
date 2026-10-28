import { parsePhoneNumberFromString } from "libphonenumber-js";
import validator from "validator";
import { getBookingCountryCode } from "./countries";

export type BookingContactField = "name" | "email" | "phone";
export type BookingContactErrors = Partial<Record<BookingContactField, string>>;

export function isValidBookingEmail(email: string) {
  const normalized = email.trim();
  return normalized.length > 0 &&
    normalized.length <= 254 &&
    validator.isEmail(normalized, { allow_utf8_local_part: true, require_tld: true });
}

export function normalizedPhone(phone: string, country: string) {
  const region = getBookingCountryCode(country);
  const trimmed = phone.trim();
  if (!trimmed.startsWith("+")) return null;
  try {
    const parsed = parsePhoneNumberFromString(trimmed);
    if (!parsed?.isValid() || (region && parsed.country !== region)) return null;
    return parsed.number;
  } catch {
    return null;
  }
}

export function validateBookingContact(
  values: { name: string; email: string; phone: string },
  country: string,
): BookingContactErrors {
  const errors: BookingContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name || [...name].filter((character) => /\p{L}/u.test(character)).length < 2) {
    errors.name = "Enter your full name.";
  } else if (name.length > 120 || /[\u0000-\u001f\u007f]/u.test(name)) {
    errors.name = "Enter a name under 120 characters without control characters.";
  }
  if (!isValidBookingEmail(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.phone.trim() || values.phone.length > 40 || !normalizedPhone(values.phone, country)) {
    errors.phone = "Enter a valid phone number.";
  }
  return errors;
}
