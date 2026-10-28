const encoder = new TextEncoder();

export const BOOKING_EMAIL_OTP_ENABLED = true;
// A verified email stays usable for checkout this long after the code is accepted.
export const BOOKING_EMAIL_VERIFIED_TTL_MS = 60 * 60 * 1000;

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function generateBookingEmailCode() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
}

export function hashBookingEmailAddress(email: string, secret: string) {
  return hmac(`booking-email-address:${email.trim().toLowerCase()}`, secret);
}

export function hashBookingEmailCode(
  id: string,
  email: string,
  code: string,
  secret: string,
) {
  return hmac(`booking-email:${id}:${email}:${code}`, secret);
}

export function isOpenBookingEmailChallenge(
  challenge: {
    expiresAt: string;
    attempts: number;
    verifiedAt: string | null;
    usedAt: string | null;
  } | null | undefined,
  now = new Date().toISOString(),
) {
  return Boolean(
    challenge &&
    challenge.attempts < 5 &&
    !challenge.verifiedAt &&
    !challenge.usedAt &&
    challenge.expiresAt > now
  );
}

export async function isUsableBookingEmailVerification(
  challenge: {
    email: string;
    bookingDataHash: string;
    expiresAt: string;
    verifiedAt: string | null;
    usedAt: string | null;
  } | null | undefined,
  email: string,
  secret: string,
  now = new Date().toISOString(),
) {
  if (
    !challenge ||
    challenge.email !== email.trim().toLowerCase() ||
    !challenge.verifiedAt ||
    challenge.usedAt ||
    challenge.expiresAt <= now
  ) {
    return false;
  }
  return constantTimeEqual(
    challenge.bookingDataHash,
    await hashBookingEmailAddress(email, secret),
  );
}

export function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
