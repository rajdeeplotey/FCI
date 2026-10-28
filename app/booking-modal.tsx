"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Globe2,
  Loader2,
  MailCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  BOOKING_START_INTERVAL_MINUTES,
  CONSULTATION_DURATION_MINUTES,
  VALID_BOOKING_STARTS,
} from "../lib/booking-schedule";
import { slotSummary } from "../lib/booking-time";
import { BOOKING_EMAIL_OTP_ENABLED } from "../lib/booking-email-verification";
import {
  isValidBookingEmail,
  validateBookingContact,
  type BookingContactErrors,
} from "../lib/booking-contact-validation";
import { COUNTRIES } from "../lib/countries";

const BOOKING_TIMEZONE = "America/Toronto";
const CLIENT_EMAIL_STORAGE_KEY = "fci_client_portal_email";

const SLOTS: string[] = [...VALID_BOOKING_STARTS];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const countrySearchCollator = new Intl.Collator("en", { sensitivity: "base" });

function normalizeCountrySearch(value: string) {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("en");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function countryMatchPriority(name: string, query: string) {
  const normalizedName = normalizeCountrySearch(name);
  if (normalizedName === query) return 0;
  if (normalizedName.startsWith(query)) return 1;
  let wordBoundaryIndex = normalizedName.indexOf(query);
  while (wordBoundaryIndex >= 0) {
    const previousCharacter = [...normalizedName.slice(0, wordBoundaryIndex)].at(-1);
    if (!previousCharacter || !/[\p{L}\p{N}]/u.test(previousCharacter)) return 2;
    wordBoundaryIndex = normalizedName.indexOf(query, wordBoundaryIndex + 1);
  }
  if (normalizedName.includes(query)) return 3;
  return Number.POSITIVE_INFINITY;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Step =
  | "country"
  | "when"
  | "details"
  | "payment"
  | "verifying"
  | "pending"
  | "not_completed"
  | "done";

type Payment = {
  enabled: boolean;
  required: boolean;
  amount: number;
  regular: number;
  currency: string;
  automaticTax: boolean;
  error?: string;
};
type BookingForm = {
  name: string;
  email: string;
  phone: string;
  details: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function saveClientPortalEmail(email: string) {
  try {
    sessionStorage.setItem(CLIENT_EMAIL_STORAGE_KEY, email.trim().toLowerCase());
  } catch (error) {
    console.error("Could not save the booking email for client portal sign-in.", error);
  }
}

function isoOf(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function torontoNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  return {
    iso: `${get("year")}-${pad(get("month"))}-${pad(get("day"))}`,
    minutes: get("hour") * 60 + get("minute"),
  };
}

function slotMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(cents / 100);
}

function clearPendingSession() {
  try {
    sessionStorage.removeItem("pendingStripeSession");
  } catch (error) {
    console.error("Could not clear the pending Checkout session.", error);
  }
}

// Representative zones supplement browser timezone data; country selection
// never assumes a visitor's exact timezone.
const COUNTRY_TIMEZONES: Record<string, string> = {
  India: "Asia/Kolkata",
  Canada: "America/Toronto",
  Philippines: "Asia/Manila",
  Pakistan: "Asia/Karachi",
  Nigeria: "Africa/Lagos",
  "United States": "America/New_York",
  "United Kingdom": "Europe/London",
  "United Arab Emirates": "Asia/Dubai",
  Australia: "Australia/Sydney",
  Afghanistan: "Asia/Kabul",
  Bangladesh: "Asia/Dhaka",
  Brazil: "America/Sao_Paulo",
  China: "Asia/Shanghai",
  Colombia: "America/Bogota",
  Egypt: "Africa/Cairo",
  Ethiopia: "Africa/Addis_Ababa",
  France: "Europe/Paris",
  Germany: "Europe/Berlin",
  Ghana: "Africa/Accra",
  Guyana: "America/Guyana",
  Iran: "Asia/Tehran",
  Iraq: "Asia/Baghdad",
  Ireland: "Europe/Dublin",
  Italy: "Europe/Rome",
  Jamaica: "America/Jamaica",
  Japan: "Asia/Tokyo",
  Jordan: "Asia/Amman",
  Kenya: "Africa/Nairobi",
  Lebanon: "Asia/Beirut",
  Malaysia: "Asia/Kuala_Lumpur",
  Mexico: "America/Mexico_City",
  Morocco: "Africa/Casablanca",
  Nepal: "Asia/Kathmandu",
  "New Zealand": "Pacific/Auckland",
  Qatar: "Asia/Qatar",
  Russia: "Europe/Moscow",
  "Saudi Arabia": "Asia/Riyadh",
  Singapore: "Asia/Singapore",
  "South Africa": "Africa/Johannesburg",
  "South Korea": "Asia/Seoul",
  Spain: "Europe/Madrid",
  "Sri Lanka": "Asia/Colombo",
  Sudan: "Africa/Khartoum",
  Syria: "Asia/Damascus",
  Tanzania: "Africa/Dar_es_Salaam",
  "Trinidad and Tobago": "America/Port_of_Spain",
  Turkey: "Europe/Istanbul",
  Uganda: "Africa/Kampala",
  Ukraine: "Europe/Kyiv",
  Vietnam: "Asia/Ho_Chi_Minh",
  Zimbabwe: "Africa/Harare",
};

type TimeZoneOption = { value: string; label: string; searchText: string };

const CANADIAN_TIME_ZONE_LABELS: Record<string, string> = {
  "America/St_Johns": "Newfoundland Time — St. John's, Newfoundland and Labrador",
  "America/Halifax": "Atlantic Time — Halifax, Nova Scotia",
  "America/Glace_Bay": "Atlantic Time — Glace Bay, Nova Scotia",
  "America/Moncton": "Atlantic Time — Moncton, New Brunswick",
  "America/Toronto": "Eastern Time — Toronto, Ontario",
  "America/Iqaluit": "Eastern Time — Iqaluit, Nunavut",
  "America/Winnipeg": "Central Time — Winnipeg, Manitoba",
  "America/Regina": "Central Time — Regina, Saskatchewan",
  "America/Edmonton": "Mountain Time — Edmonton, Alberta",
  "America/Yellowknife": "Mountain Time — Yellowknife, Northwest Territories",
  "America/Vancouver": "Pacific Time — Vancouver, British Columbia",
  "America/Whitehorse": "Yukon Time — Whitehorse, Yukon",
  "America/Dawson": "Yukon Time — Dawson City, Yukon",
};

const COMMON_TIME_ZONE_LABELS: Record<string, string> = {
  "America/Anchorage": "Alaska Time — Anchorage, United States",
  "America/Chicago": "Central Time — Chicago, United States",
  "America/Denver": "Mountain Time — Denver, United States",
  "America/Los_Angeles": "Pacific Time — Los Angeles, United States",
  "America/New_York": "Eastern Time — New York, United States",
  "America/Phoenix": "Mountain Standard Time — Phoenix, United States",
  "America/Sao_Paulo": "Brasilia Time — São Paulo, Brazil",
  "America/Bogota": "Colombia Time — Bogotá, Colombia",
  "America/Mexico_City": "Central Time — Mexico City, Mexico",
  "America/Port_of_Spain": "Atlantic Time — Port of Spain, Trinidad and Tobago",
  "Europe/London": "Greenwich Mean Time — London, United Kingdom",
  "Europe/Paris": "Central European Time — Paris, France",
  "Europe/Berlin": "Central European Time — Berlin, Germany",
  "Europe/Madrid": "Central European Time — Madrid, Spain",
  "Europe/Rome": "Central European Time — Rome, Italy",
  "Europe/Dublin": "Greenwich Mean Time — Dublin, Ireland",
  "Europe/Istanbul": "Turkey Time — Istanbul, Türkiye",
  "Europe/Kyiv": "Eastern European Time — Kyiv, Ukraine",
  "Europe/Moscow": "Moscow Time — Moscow, Russia",
  "Africa/Lagos": "West Africa Time — Lagos, Nigeria",
  "Africa/Cairo": "Eastern European Time — Cairo, Egypt",
  "Africa/Johannesburg": "South Africa Standard Time — Johannesburg, South Africa",
  "Africa/Nairobi": "East Africa Time — Nairobi, Kenya",
  "Asia/Kolkata": "India Standard Time — Kolkata, India",
  "Asia/Karachi": "Pakistan Standard Time — Karachi, Pakistan",
  "Asia/Dhaka": "Bangladesh Standard Time — Dhaka, Bangladesh",
  "Asia/Kathmandu": "Nepal Time — Kathmandu, Nepal",
  "Asia/Dubai": "Gulf Standard Time — Dubai, United Arab Emirates",
  "Asia/Riyadh": "Arabia Standard Time — Riyadh, Saudi Arabia",
  "Asia/Shanghai": "China Standard Time — Shanghai, China",
  "Asia/Hong_Kong": "Hong Kong Time — Hong Kong",
  "Asia/Singapore": "Singapore Time — Singapore",
  "Asia/Manila": "Philippine Time — Manila, Philippines",
  "Asia/Tokyo": "Japan Standard Time — Tokyo, Japan",
  "Asia/Seoul": "Korea Standard Time — Seoul, South Korea",
  "Asia/Bangkok": "Indochina Time — Bangkok, Thailand",
  "Asia/Jakarta": "Western Indonesia Time — Jakarta, Indonesia",
  "Australia/Perth": "Australian Western Time — Perth, Australia",
  "Australia/Adelaide": "Australian Central Time — Adelaide, Australia",
  "Australia/Sydney": "Australian Eastern Time — Sydney, Australia",
  "Australia/Brisbane": "Australian Eastern Time — Brisbane, Australia",
  "Australia/Melbourne": "Australian Eastern Time — Melbourne, Australia",
  "Pacific/Auckland": "New Zealand Time — Auckland, New Zealand",
  "Pacific/Honolulu": "Hawaii-Aleutian Time — Honolulu, United States",
  "Pacific/Fiji": "Fiji Time — Suva, Fiji",
};

const TIME_ZONE_ALIASES: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Europe/Kiev": "Europe/Kyiv",
  "Europe/Uzhgorod": "Europe/Kyiv",
  "Europe/Zaporozhye": "Europe/Kyiv",
};

function canonicalTimeZone(timeZone: string) {
  const canonical = TIME_ZONE_ALIASES[timeZone] ?? timeZone;
  try {
    new Intl.DateTimeFormat("en", { timeZone: canonical });
    return canonical;
  } catch {
    return "America/Toronto";
  }
}

function browserTimeZone() {
  try {
    return canonicalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return "America/Toronto";
  }
}

const TIME_ZONE_OPTIONS: TimeZoneOption[] = (() => {
  const supported =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : Object.values(COUNTRY_TIMEZONES);
  const countryByZone = new Map(
    Object.entries(COUNTRY_TIMEZONES).map(([country, zone]) => [canonicalTimeZone(zone), country]),
  );
  const zones = [...new Set([
    ...supported.map(canonicalTimeZone),
    ...Object.values(COUNTRY_TIMEZONES).map(canonicalTimeZone),
    browserTimeZone(),
  ])].filter((zone) => !zone.startsWith("Antarctica/") && !zone.startsWith("Etc/"));
  const now = new Date();
  return zones
    .sort((a, b) => {
      const offsetDifference = tzOffsetMs(now, a) - tzOffsetMs(now, b);
      return offsetDifference || getTimeZoneLabel(a, countryByZone)
        .localeCompare(getTimeZoneLabel(b, countryByZone), "en");
    })
    .map((value) => ({
      value,
      label: `(${utcOffsetLabel(value, now)}) ${getTimeZoneLabel(value, countryByZone)}`,
      searchText: `(${utcOffsetLabel(value, now)}) ${getTimeZoneLabel(value, countryByZone)} ${value.replaceAll("_", " ")}`,
    }));
})();

function utcOffsetLabel(timeZone: string, instant = new Date()) {
  const offsetMinutes = Math.round(tzOffsetMs(instant, timeZone) / 60_000);
  const sign = offsetMinutes < 0 ? "-" : "+";
  const absoluteOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const minutes = String(absoluteOffset % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

function getTimeZoneLabel(timeZone: string, countryByZone: Map<string, string>) {
  const curated = CANADIAN_TIME_ZONE_LABELS[timeZone] ?? COMMON_TIME_ZONE_LABELS[timeZone];
  if (curated) return curated;

  const segments = timeZone.split("/");
  const city = segments.at(-1)?.replaceAll("_", " ").replaceAll(/([a-z])([A-Z])/g, "$1 $2") ?? timeZone;
  const country = countryByZone.get(timeZone);
  if (country) return `${timeZoneName(timeZone)} — ${city}, ${country}`;
  const region = segments.length > 1 ? segments[0].replaceAll("_", " ") : "Other region";
  return `${city} — ${region}`;
}

function timeZoneName(timeZone: string, instant = new Date()) {
  return (
    new Intl.DateTimeFormat("en", {
      timeZone,
      timeZoneName: "longGeneric",
    })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value ?? timeZone
  );
}

function tzOffsetMs(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const g = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
  return asUtc - instant.getTime();
}

const OTP_LENGTH = 6;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Six single-digit boxes backed by one string (the existing verificationCode
// state). Digits always fill left to right, so the value never has gaps.
function OtpInput({
  value,
  onChange,
  disabled,
  invalid,
  firstInputRef,
  describedBy,
}: Readonly<{
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
  invalid: boolean;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
  describedBy?: string;
}>) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  // Latest code, updated synchronously on every edit so focus/keystroke
  // handlers never act on a stale render's value during fast typing.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  const update = (next: string) => {
    latest.current = next;
    onChange(next);
  };
  const focusBox = (index: number) => {
    const box = inputs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))];
    box?.focus();
    box?.select();
  };

  // Writes digits starting at `index` (typing, paste, or OS one-time-code autofill).
  const insertDigits = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const current = latest.current;
    const start = Math.min(index, current.length);
    const next = (current.slice(0, start) + digits + current.slice(start + digits.length))
      .slice(0, OTP_LENGTH);
    update(next);
    focusBox(Math.min(start + digits.length, OTP_LENGTH - 1));
  };

  return (
    <div
      className={`booking-otp-boxes${invalid ? " is-invalid" : ""}`}
      role="group"
      aria-label="Six-digit email verification code"
      aria-describedby={describedBy}
    >
      {Array.from({ length: OTP_LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
            if (index === 0) firstInputRef.current = element;
          }}
          className="booking-otp-box"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={index === 0 ? OTP_LENGTH : 1}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          aria-invalid={invalid}
          disabled={disabled}
          value={value[index] ?? ""}
          onFocus={(event) => {
            // Keep entry contiguous: jump to the first empty box.
            if (index > latest.current.length) focusBox(latest.current.length);
            else event.currentTarget.select();
          }}
          onChange={(event) => {
            const current = latest.current;
            const typed = event.currentTarget.value;
            if (!typed) {
              update(current.slice(0, index) + current.slice(index + 1));
              return;
            }
            // A replaced digit arrives with the old one; keep the newest input.
            insertDigits(index, typed.length > 1 && index < current.length ? typed.replace(current[index], "") || typed : typed);
          }}
          onPaste={(event) => {
            event.preventDefault();
            insertDigits(index, event.clipboardData.getData("text"));
          }}
          onKeyDown={(event) => {
            const current = latest.current;
            if (event.key === "Backspace" && !current[index] && index > 0) {
              event.preventDefault();
              update(current.slice(0, index - 1) + current.slice(index));
              focusBox(index - 1);
            } else if (event.key === "ArrowLeft" && index > 0) {
              event.preventDefault();
              focusBox(index - 1);
            } else if (event.key === "ArrowRight" && index < Math.min(latest.current.length, OTP_LENGTH - 1)) {
              event.preventDefault();
              focusBox(index + 1);
            }
          }}
        />
      ))}
    </div>
  );
}

export default function BookingModal({
  open,
  onClose,
  resumeSessionId,
  resumeBookingReference,
  resumeCancelled,
}: {
  open: boolean;
  onClose: () => void;
  resumeSessionId?: string | null;
  resumeBookingReference?: string | null;
  resumeCancelled?: boolean;
}) {
  const today = torontoNow();
  const [step, setStep] = useState<Step>("country");
  const [country, setCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryListOpen, setCountryListOpen] = useState(false);
  const [activeCountryIndex, setActiveCountryIndex] = useState(-1);
  const [clientTimeZone, setClientTimeZone] = useState(browserTimeZone);
  const [timeZoneQuery, setTimeZoneQuery] = useState("");
  const [timeZoneListOpen, setTimeZoneListOpen] = useState(false);
  const [activeTimeZoneIndex, setActiveTimeZoneIndex] = useState(-1);
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<BookingContactErrors>({});
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  // When the current code expires (from the server's expiresInSeconds) and a
  // 1s clock to display it; the clock runs only while a code is pending.
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  const [otpNow, setOtpNow] = useState(() => Date.now());
  const [otpAction, setOtpAction] = useState<"send" | "verify" | null>(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [error, setError] = useState("");
  const [shakeAttempt, setShakeAttempt] = useState(0);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [leadBookingReference, setLeadBookingReference] = useState<string | null>(null);
  const [confirmedReference, setConfirmedReference] = useState<string | null>(null);
  const [retryBookingReference, setRetryBookingReference] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    bookingReference: string;
    country: string;
    date: string;
    time: string;
    timeZone: string;
    name: string;
    email: string;
    amountCents: number;
    currency: string;
  } | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [pendingBookingReference, setPendingBookingReference] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const verificationInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const slotRequestId = useRef(0);
  const submissionLock = useRef(false);

  const filteredCountries = useMemo(() => {
    const query = normalizeCountrySearch(countryQuery);
    const matches = COUNTRIES
      .map((name) => ({ name, priority: query ? countryMatchPriority(name, query) : 0 }))
      .filter((match) => Number.isFinite(match.priority))
      .sort((a, b) =>
        a.priority - b.priority || countrySearchCollator.compare(a.name, b.name),
      )
      .map((match) => match.name);
    return query ? matches.slice(0, 12) : matches;
  },
    [countryQuery],
  );
  const selectedTimeZoneLabel = TIME_ZONE_OPTIONS.find((option) => option.value === clientTimeZone)?.label
    ?? clientTimeZone.replaceAll("_", " ");
  const detectedTimeZone = browserTimeZone();
  const filteredTimeZones = useMemo(
    () => TIME_ZONE_OPTIONS
      .filter((option) =>
        option.searchText.toLocaleLowerCase().includes(timeZoneQuery.trim().toLocaleLowerCase()),
      )
      .sort((a, b) =>
        Number(b.value === detectedTimeZone) - Number(a.value === detectedTimeZone),
      ),
    [detectedTimeZone, timeZoneQuery],
  );

  const paymentsOn = payment?.enabled ?? false;
  const paymentUnavailable = !payment;

  const loadSlots = useCallback(async (date: string) => {
    const requestId = ++slotRequestId.current;
    setLoadingSlots(true);
    setAvailabilityError("");
    setError("");
    try {
      const response = await fetch(`/api/bookings?date=${date}`, { cache: "no-store" });
      const data = (await response.json()) as { booked?: unknown; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load availability.");
      if (!isStringArray(data.booked)) {
        throw new Error("Availability could not be verified. Please try again.");
      }
      const booked = data.booked;
      if (requestId === slotRequestId.current) {
        setBooked(booked);
        setSelectedTime((current) => booked.includes(current) ? "" : current);
      }
    } catch (loadError) {
      if (requestId === slotRequestId.current) {
        const message = loadError instanceof Error
          ? loadError.message
          : "Could not load availability. Please try again.";
        setBooked([]);
        setAvailabilityError(message);
        setError(message);
      }
    } finally {
      if (requestId === slotRequestId.current) setLoadingSlots(false);
    }
  }, []);

  const verifyPayment = useCallback(async (sessionId: string, bookingReference: string) => {
    setStep("verifying");
    setPendingSessionId(sessionId);
    setPendingBookingReference(bookingReference);
    setError("");
    try {
      const params = new URLSearchParams({ session_id: sessionId, reference: bookingReference });
      const response = await fetch(`/api/checkout/verify?${params.toString()}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await response.json()) as {
        status?: string;
        bookingReference?: string;
        booking?: {
          bookingReference: string;
          country: string;
          date: string;
          time: string;
          timeZone: string;
          name: string;
          email: string;
          amountCents: number;
          currency: string;
        };
        error?: string;
      };
      if (
        data.status === "paid" &&
        data.bookingReference === bookingReference &&
        data.booking?.bookingReference === bookingReference
      ) {
        clearPendingSession();
        setPendingSessionId(null);
        setConfirmedReference(data.bookingReference ?? null);
        setConfirmedAppointment(data.booking ?? null);
        setStep("done");
      } else if (data.status === "unpaid" || data.status === "failed") {
        clearPendingSession();
        setPendingSessionId(null);
        setRetryBookingReference(data.bookingReference ?? null);
        setStep("not_completed");
        setError("");
      } else if (data.status === "pending") {
        setStep("pending");
      } else if (data.status === "confirmation_delayed" || data.status === "unverified") {
        setStep("pending");
        setError(data.error || "Payment confirmation is delayed. Do not pay again.");
      } else {
        throw new Error(data.error || "We couldn't confirm your payment.");
      }
    } catch (verifyError) {
      setStep("pending");
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "We couldn't confirm your payment. Please try again; don't submit another payment."
      );
    }
  }, []);

  // Reset / initialise each time the modal opens.
  useEffect(() => {
    if (!open) return;
    const now = torontoNow();
    const [year, month] = now.iso.split("-").map(Number);
    // Reset modal state when its visibility prop opens a new booking session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountry("");
    setCountryQuery("");
    setCountryListOpen(false);
    setTimeZoneQuery("");
    setTimeZoneListOpen(false);
    setActiveTimeZoneIndex(-1);
    setClientTimeZone(browserTimeZone());
    setViewYear(year);
    setViewMonth(month - 1);
    setSelectedDate("");
    setSelectedTime("");
    setBooked([]);
    setAvailabilityError("");
    setForm({
      name: "",
      email: "",
      phone: "",
      details: "",
    });
    setFieldErrors({});
    setVerificationId("");
    setVerificationCode("");
    setVerifiedEmail("");
    setVerifiedEmail("");
    setResendSeconds(0);
    setVerificationMessage("");
    setVerificationError("");
    setLeadBookingReference(null);
    setConfirmedReference(null);
    setRetryBookingReference(null);
    setConfirmedAppointment(null);
    setPendingSessionId(null);
    setPendingBookingReference(null);
    submissionLock.current = false;
    setSubmitting(false);
    slotRequestId.current += 1;

    // Fetch payment config (whether Stripe is on).
    setPayment(null);
    fetch("/api/checkout", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Payment settings are unavailable.");
        return response.json();
      })
      .then((data: Payment) => {
        setPayment(data);
        if (data.error) setError(data.error);
      })
      .catch(() => {
        setPayment(null);
        setError("Payment settings couldn't be loaded. Please refresh and try again.");
      });

    if (resumeCancelled) {
      clearPendingSession();
      setPendingSessionId(null);
      setPendingBookingReference(null);
      setStep("not_completed");
      setError("Payment was not completed. Do not submit the booking form again; return to the payment page to retry this booking.");
    } else {
      clearPendingSession();
      if (
        resumeSessionId &&
        resumeBookingReference &&
        /^FCI-[A-F0-9]{16}$/.test(resumeBookingReference)
      ) {
        void verifyPayment(resumeSessionId, resumeBookingReference);
      } else {
        setStep("country");
        setError("");
      }
    }
  }, [open, resumeSessionId, resumeBookingReference, resumeCancelled, verifyPayment]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-booking-autofocus]")?.focus();
      if (document.activeElement === document.body) dialogRef.current?.focus();
    });
    return () => previouslyFocused?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const target = dialogRef.current?.querySelector<HTMLElement>("[data-booking-step-focus]");
    target?.focus();
  }, [open, step]);

  useEffect(() => {
    if (!timeZoneListOpen || activeTimeZoneIndex < 0) return;
    document
      .getElementById(`booking-timezone-option-${activeTimeZoneIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeTimeZoneIndex, timeZoneListOpen]);

  useEffect(() => {
    if (!open || !verificationId || !codeExpiresAt || verifiedEmail) return;
    const timer = window.setInterval(() => setOtpNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [open, verificationId, codeExpiresAt, verifiedEmail]);

  useEffect(() => {
    if (!open || resendSeconds <= 0) return;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [open, resendSeconds]);

  // Keep keyboard focus within the modal and restore it to the booking trigger on close.
  useEffect(() => {
    if (!open) return;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
    };
  }, [open]);

  const selectCountry = (name: string) => {
    setCountry(name);
    setCountryQuery(name);
    setCountryListOpen(false);
    setActiveCountryIndex(-1);
    const countryTimeZone = COUNTRY_TIMEZONES[name];
    if (countryTimeZone) setClientTimeZone(canonicalTimeZone(countryTimeZone));
  };

  const selectTimeZone = (timeZone: string) => {
    setClientTimeZone(canonicalTimeZone(timeZone));
    setTimeZoneQuery("");
    setTimeZoneListOpen(false);
    setActiveTimeZoneIndex(-1);
  };

  const chooseDate = (iso: string) => {
    if (selectedDate === iso) {
      slotRequestId.current += 1;
      setSelectedDate("");
      setSelectedTime("");
      setBooked([]);
      setLoadingSlots(false);
      setAvailabilityError("");
      return;
    }
    setSelectedDate(iso);
    setSelectedTime("");
    void loadSlots(iso);
  };

  const bookingPayload = () => ({
    country,
    date: selectedDate,
    time: selectedTime,
    timeZone: clientTimeZone,
    name: form.name,
    email: form.email,
    phone: form.phone,
    details: form.details,
  });

  const validateField = (field: keyof BookingContactErrors) => {
    const fieldError = validateBookingContact(form, country)[field];
    setFieldErrors((current) => ({ ...current, [field]: fieldError }));
  };

  const shakeInvalidFields = (
    invalidFields: BookingContactErrors,
    emailVerificationInvalid: boolean,
  ) => {
    setShakeAttempt((attempt) => attempt + 1);
    const firstInvalidInput = invalidFields.name
      ? nameInputRef.current
      : invalidFields.email
        ? emailInputRef.current
        : emailVerificationInvalid && verificationId
          ? verificationInputRef.current
          : emailVerificationInvalid
            ? emailInputRef.current
            : invalidFields.phone
              ? phoneInputRef.current
              : null;
    firstInvalidInput?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const clearEmailVerification = async (challengeId = verificationId) => {
    setVerificationId("");
    setVerificationCode("");
    setVerifiedEmail("");
    setResendSeconds(0);
    setVerificationMessage("");
    setVerificationError("");
    if (!challengeId) return;
    if (!BOOKING_EMAIL_OTP_ENABLED) return;

    const response = await fetch("/api/booking-email-verification", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ verificationId: challengeId }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Could not invalidate email verification.");
    }
  };

  const updateBookingField = (field: keyof BookingForm, value: string) => {
    const changed = form[field] !== value;
    const nextForm = { ...form, [field]: value };
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "name" || field === "email" || field === "phone") {
      const fieldError = fieldErrors[field]
        ? validateBookingContact(nextForm, country)[field]
        : undefined;
      setFieldErrors((current) => ({ ...current, [field]: fieldError }));
      if (
        !fieldError &&
        !Object.entries(fieldErrors).some(([name, message]) => name !== field && Boolean(message)) &&
        !verificationError
      ) {
        setError("");
      }
    }
    if (field === "email" && changed) {
      setVerificationError("");
    }
    if (field === "email" && changed && verificationId) {
      void clearEmailVerification().catch((invalidationError: unknown) => {
        setVerificationError(
          invalidationError instanceof Error
            ? invalidationError.message
            : "Could not invalidate email verification. Please retry before continuing.",
        );
      });
    }
  };

  const sendVerificationCode = async () => {
    if (submissionLock.current) return;
    if (!isValidBookingEmail(form.email)) {
      setFieldErrors((current) => ({
        ...current,
        email: "Enter a valid email address before requesting a code.",
      }));
      return;
    }
    submissionLock.current = true;
    setSubmitting(true);
    setOtpAction("send");
    setVerificationError("");
    const isResend = Boolean(verificationId);
    try {
      const response = await fetch("/api/booking-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      });
      const data = (await response.json()) as {
        verificationId?: string;
        message?: string;
        expiresInSeconds?: number;
        error?: string;
      };
      if (!response.ok || !data.verificationId) {
        if (response.status === 429) setResendSeconds(60);
        throw new Error(data.error || "Could not send the verification code.");
      }
      setVerificationId(data.verificationId);
      setVerificationCode("");
      setResendSeconds(60);
      setVerifiedEmail("");
      const sentAt = Date.now();
      setOtpNow(sentAt);
      setCodeExpiresAt(sentAt + (data.expiresInSeconds ?? 600) * 1000);
      setVerificationMessage(isResend ? "A new code has been sent. Earlier codes no longer work." : "");
      window.setTimeout(() => verificationInputRef.current?.focus(), 260);
    } catch (verificationError) {
      setVerificationError(
        verificationError instanceof Error
          ? verificationError.message
          : "Could not send the verification code.",
      );
    } finally {
      setSubmitting(false);
      setOtpAction(null);
      submissionLock.current = false;
    }
  };

  const verifyBookingEmail = async () => {
    if (submissionLock.current || !verificationId || verificationCode.length !== OTP_LENGTH) return;
    submissionLock.current = true;
    setSubmitting(true);
    setOtpAction("verify");
    setError("");
    setVerificationMessage("");
    try {
      const response = await fetch("/api/booking-email-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          verificationId,
          code: verificationCode,
        }),
      });
      const data = (await response.json()) as { verified?: boolean; error?: string };
      if (!response.ok || !data.verified) {
        throw new Error(data.error || "Email verification was not successful.");
      }
      if (BOOKING_EMAIL_OTP_ENABLED) {
        setVerifiedEmail(form.email.trim().toLowerCase());
      }
      setVerificationCode("");
      setVerificationError("");
      setVerificationMessage("Your email is verified.");
    } catch (verificationError) {
      setError("Email verification was not successful. Check the code and try again.");
      setVerificationError(
        verificationError instanceof Error
          ? verificationError.message
          : "Email verification was not successful.",
      );
      shakeInvalidFields({}, true);
    } finally {
      setSubmitting(false);
      setOtpAction(null);
      submissionLock.current = false;
    }
  };

  const returnToDetails = () => {
    if (submissionLock.current) return;
    setError("");
    setFieldErrors({});
    setStep("details");
  };

  const goBackToWhen = async () => {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setSubmitting(true);
    setError("");
    try {
      await clearEmailVerification();
      setStep("when");
    } catch (invalidationError) {
      setError(
        invalidationError instanceof Error
          ? invalidationError.message
          : "Could not clear email verification. Please retry.",
      );
    } finally {
      setSubmitting(false);
      submissionLock.current = false;
    }
  };

  // Start checkout after the server has saved the consultation details.
  const startCheckout = async () => {
    if (
      submissionLock.current ||
      !verificationId ||
      !leadBookingReference
    ) return;
    submissionLock.current = true;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingPayload(),
          verificationId,
          leadBookingReference,
        }),
      });
      const data = (await response.json()) as {
        bookingReference?: string;
        url?: string;
        code?: string;
        error?: string;
      };
      if (data.code === "email_already_registered") {
        const message = data.error ||
          "This email is already registered for a paid consultation. Please sign in to your client portal or contact FCI for help.";
        setFieldErrors((current) => ({ ...current, email: message }));
        setStep("details");
        setError("");
        emailInputRef.current?.focus();
        return;
      }
      if (response.status === 409) {
        if (BOOKING_EMAIL_OTP_ENABLED && verificationId) {
          const invalidation = await fetch("/api/booking-email-verification", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({ verificationId }),
          });
          if (!invalidation.ok) {
            const invalidationData = (await invalidation.json()) as { error?: string };
            throw new Error(invalidationData.error || "Could not clear email verification.");
          }
          setVerificationId("");
          setVerificationCode("");
          setResendSeconds(0);
          setVerificationMessage("");
        }
        setSelectedTime("");
        await loadSlots(selectedDate);
        setStep("when");
        setError("Sorry — that slot was just taken. Please pick another time.");
        return;
      }
      if (!response.ok || !data.bookingReference || !data.url) {
        if (response.status === 403 && BOOKING_EMAIL_OTP_ENABLED) {
          setVerifiedEmail("");
          setVerificationError(data.error || "Your email verification expired. Send a new OTP.");
          setVerificationId("");
          setVerificationCode("");
          setStep("details");
        }
        throw new Error(data.error || "Could not start the consultation payment.");
      }
      saveClientPortalEmail(form.email);
      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Could not start checkout.");
    } finally {
      setSubmitting(false);
      submissionLock.current = false;
    }
  };

  const calendar = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ iso: string; day: number; disabled: boolean } | null> = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = isoOf(viewYear, viewMonth, day);
      const weekday = new Date(viewYear, viewMonth, day).getDay();
      // Bookable Tuesday–Friday only (2..5); past dates disabled.
      const disabled = iso < today.iso || weekday < 2 || weekday > 5;
      cells.push({ iso, day, disabled });
    }
    return cells;
  }, [viewYear, viewMonth, today.iso]);

  const atFirstMonth =
    viewYear < Number(today.iso.slice(0, 4)) ||
    (viewYear === Number(today.iso.slice(0, 4)) &&
      viewMonth <= Number(today.iso.slice(5, 7)) - 1);

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  if (!open) return null;

  const stepIndex =
    step === "country" ? 0
      : step === "when" ? 1
        : step === "details" ? 2
          : step === "payment" ? 3
            : 0;
  const currency = payment?.currency ?? "USD";
  const priceLabel = payment ? money(payment.amount, currency) : money(7900, currency);
  const regularLabel = payment ? money(payment.regular, currency) : money(9900, currency);
  const appointment = selectedDate && selectedTime
    ? slotSummary(selectedDate, selectedTime, clientTimeZone)
    : null;
  const isEmailVerified =
    Boolean(verificationId) &&
    verifiedEmail === form.email.trim().toLowerCase() &&
    isValidBookingEmail(form.email);
  const otpSecondsLeft = codeExpiresAt
    ? Math.max(0, Math.ceil((codeExpiresAt - otpNow) / 1000))
    : 0;
  const otpExpired = Boolean(verificationId && codeExpiresAt && otpSecondsLeft === 0);
  const shakeClass = (invalid: boolean) =>
    invalid ? ` booking-invalid-shake-${shakeAttempt % 2}` : "";
  const emailNeedsVerification = Boolean(verificationError && !verificationId);
  const otpNeedsVerification = Boolean(verificationError && verificationId && !isEmailVerified);
  const confirmedLocalAppointment = confirmedAppointment
    ? slotSummary(confirmedAppointment.date, confirmedAppointment.time, clientTimeZone)
    : null;

  return (
    <div className="booking-modal">
      <button
        aria-label="Close booking form"
        className="booking-backdrop"
        onClick={step === "verifying" ? undefined : onClose}
        type="button"
      />
      <div
        ref={dialogRef}
        className="booking-card booking-card-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape" && step !== "verifying") {
            event.preventDefault();
            onClose();
            return;
          }
          if (event.key !== "Tab" || !dialogRef.current) return;
          const focusable = Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((element) => !element.hidden);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="booking-card-header">
          <div>
            <p className="eyebrow">Book your consultation</p>
            <h2 id="booking-title">
              {step === "done"
                ? "Payment confirmed"
                : step === "verifying"
                  ? "Confirming payment"
                  : step === "pending"
                    ? "Payment confirmation pending"
                    : step === "not_completed"
                      ? "Payment not completed"
                      : "Reserve a time"}
            </h2>
          </div>
          <button
            aria-label="Close booking form"
            className="booking-close"
            onClick={step === "verifying" ? undefined : onClose}
            disabled={step === "verifying"}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {step !== "done" && step !== "verifying" && step !== "pending" && step !== "not_completed" ? (
          <ol className="booking-steps" aria-label="Booking steps">
            {["Country", "Date & time", "Your details", "Payment"].map((label, index) => (
              <li
                key={label}
                className={`booking-step ${index === stepIndex ? "is-active" : ""} ${
                  index < stepIndex ? "is-done" : ""
                }`}
              >
                <span className="booking-step-dot">
                  {index < stepIndex ? <Check aria-hidden="true" /> : index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        ) : null}

        {error && step !== "details" ? <p className="booking-error" role="alert">{error}</p> : null}

        {/* STEP 1 — COUNTRY */}
        {step === "country" ? (
          <div className="booking-body">
            <div className="booking-country-intro">
              <h3 tabIndex={-1} data-booking-step-focus>Where do you currently live?</h3>
              <p>This helps us display consultation times in your local time zone.</p>
            </div>
            <label className="booking-field booking-country-field">
              <span>Country or territory</span>
              <input
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={countryListOpen}
                aria-controls="booking-country-options"
                aria-activedescendant={
                  countryListOpen && activeCountryIndex >= 0
                    ? `booking-country-option-${activeCountryIndex}`
                    : undefined
                }
                autoComplete="off"
                placeholder="Search countries and territories"
                value={countryQuery}
                onFocus={() => setCountryListOpen(true)}
                // Reopen when the already-focused input is pressed (e.g. after Escape).
                // mousedown, not click: the list sits in a <label>, which forwards
                // option clicks to this input and would reopen it after a selection.
                onMouseDown={() => setCountryListOpen(true)}
                onBlur={() => setCountryListOpen(false)}
                onChange={(event) => {
                  setCountryQuery(event.target.value);
                  setCountry("");
                  setActiveCountryIndex(-1);
                  setCountryListOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setCountryListOpen(true);
                    setActiveCountryIndex((current) => Math.min(
                      current < 0 ? 0 : current + 1,
                      filteredCountries.length - 1,
                    ));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setCountryListOpen(true);
                    setActiveCountryIndex((current) => Math.max(
                      current < 0 ? filteredCountries.length - 1 : current - 1,
                      0,
                    ));
                  } else if (event.key === "Enter" && countryListOpen && filteredCountries.length) {
                    const exactMatch = filteredCountries.find(
                      (name) => normalizeCountrySearch(name) === normalizeCountrySearch(countryQuery),
                    );
                    const selectedName = activeCountryIndex >= 0
                      ? filteredCountries[activeCountryIndex]
                      : exactMatch;
                    if (selectedName) {
                      event.preventDefault();
                      selectCountry(selectedName);
                    }
                  } else if (event.key === "Escape" && countryListOpen) {
                    event.preventDefault();
                    // Close only the list; a second Escape closes the modal.
                    event.stopPropagation();
                    setCountryListOpen(false);
                  }
                }}
              />
              {countryListOpen ? (
                <ul
                  id="booking-country-options"
                  className="booking-country-options"
                  role="listbox"
                  // Keep focus in the search input while the list (including its
                  // scrollbar) is pressed; otherwise the input's onBlur closes it.
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {filteredCountries.length ? filteredCountries.map((name, index) => (
                    <li
                      key={name}
                      id={`booking-country-option-${index}`}
                      role="option"
                      aria-selected={country === name}
                      className={`${activeCountryIndex === index ? "is-active" : ""} ${country === name ? "is-selected" : ""}`}
                      onClick={() => selectCountry(name)}
                    >
                      {name}
                    </li>
                  )) : (
                    <li className="booking-country-empty">No matching country or territory.</li>
                  )}
                </ul>
              ) : null}
            </label>
            <div className="booking-field">
              <span id="booking-timezone-label">Your local time zone</span>
              <input
                type="text"
                role="combobox"
                aria-labelledby="booking-timezone-label"
                aria-autocomplete="list"
                aria-expanded={timeZoneListOpen}
                aria-controls="booking-timezone-options"
                aria-activedescendant={
                  timeZoneListOpen && activeTimeZoneIndex >= 0
                    ? `booking-timezone-option-${activeTimeZoneIndex}`
                    : undefined
                }
                autoComplete="off"
                placeholder="Search city, country, or UTC offset"
                value={timeZoneListOpen ? timeZoneQuery : selectedTimeZoneLabel}
                onFocus={() => {
                  setTimeZoneQuery("");
                  setActiveTimeZoneIndex(-1);
                  setTimeZoneListOpen(true);
                }}
                // Reopen when the already-focused input is pressed (e.g. after Escape).
                onMouseDown={() => {
                  if (timeZoneListOpen) return;
                  setTimeZoneQuery("");
                  setActiveTimeZoneIndex(-1);
                  setTimeZoneListOpen(true);
                }}
                onBlur={() => setTimeZoneListOpen(false)}
                onChange={(event) => {
                  setTimeZoneQuery(event.target.value);
                  setActiveTimeZoneIndex(-1);
                  setTimeZoneListOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" && filteredTimeZones.length) {
                    event.preventDefault();
                    setTimeZoneListOpen(true);
                    setActiveTimeZoneIndex((current) => Math.min(
                      current < 0 ? 0 : current + 1,
                      filteredTimeZones.length - 1,
                    ));
                  } else if (event.key === "ArrowUp" && filteredTimeZones.length) {
                    event.preventDefault();
                    setTimeZoneListOpen(true);
                    setActiveTimeZoneIndex((current) => Math.max(
                      current < 0 ? filteredTimeZones.length - 1 : current - 1,
                      0,
                    ));
                  } else if (event.key === "Enter" && timeZoneListOpen && filteredTimeZones.length) {
                    event.preventDefault();
                    selectTimeZone(filteredTimeZones[Math.max(activeTimeZoneIndex, 0)].value);
                  } else if (event.key === "Escape" && timeZoneListOpen) {
                    event.preventDefault();
                    // Close only the list; a second Escape closes the modal.
                    event.stopPropagation();
                    setTimeZoneListOpen(false);
                    setTimeZoneQuery("");
                  }
                }}
              />
              {timeZoneListOpen ? (
                <ul
                  id="booking-timezone-options"
                  className="booking-country-options booking-timezone-options"
                  role="listbox"
                  // Keep focus in the search input while the list (including its
                  // scrollbar) is pressed; otherwise the input's onBlur closes it.
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {filteredTimeZones.length ? filteredTimeZones.map((option, index) => (
                    <li
                      key={option.value}
                      id={`booking-timezone-option-${index}`}
                      role="option"
                      aria-selected={clientTimeZone === option.value}
                      className={`${activeTimeZoneIndex === index ? "is-active" : ""} ${clientTimeZone === option.value ? "is-selected" : ""}`}
                      onClick={() => selectTimeZone(option.value)}
                    >
                      <span>{option.label}</span>
                      {option.value === detectedTimeZone ? (
                        <small className="booking-timezone-device">Your device</small>
                      ) : null}
                    </li>
                  )) : (
                    <li className="booking-country-empty">No matching time zone found.</li>
                  )}
                </ul>
              ) : null}
              <small>Times are shown in your device time zone by default. You can choose another zone.</small>
            </div>
            <div className="booking-actions">
              <span />
              <button
                className="button button-primary"
                type="button"
                disabled={!country}
                onClick={() => {
                  setError("");
                  setStep("when");
                }}
              >
                Continue
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}

        {/* STEP 2 — DATE & TIME */}
        {step === "when" ? (
          <div
            className="booking-body"
            onClick={(event) => {
              const target = event.target;
              if (
                target instanceof HTMLElement &&
                !target.closest("button, a, input, select, textarea, [role='button']")
              ) {
                setSelectedTime("");
              }
            }}
          >
            <div className="booking-when">
              <div className="booking-calendar">
                <div className="booking-calendar-head">
                  <button
                    type="button"
                    className="booking-nav"
                    onClick={() => goMonth(-1)}
                    disabled={atFirstMonth}
                    aria-label="Previous month"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <strong tabIndex={-1} data-booking-step-focus>
                    {MONTHS[viewMonth]} {viewYear}
                  </strong>
                  <button
                    type="button"
                    className="booking-nav"
                    onClick={() => goMonth(1)}
                    aria-label="Next month"
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>
                <div className="booking-weekdays">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="booking-days">
                  {calendar.map((cell, index) =>
                    cell ? (
                      <button
                        key={cell.iso}
                        type="button"
                        className={`booking-day ${selectedDate === cell.iso ? "is-selected" : ""} ${
                          cell.iso === today.iso ? "is-today" : ""
                        }`}
                        aria-current={cell.iso === today.iso ? "date" : undefined}
                        disabled={cell.disabled}
                        onClick={() => chooseDate(cell.iso)}
                      >
                        {cell.day}
                      </button>
                    ) : (
                      <span key={`empty-${index}`} className="booking-day booking-day-empty" />
                    )
                  )}
                </div>
                <p className="booking-duration">
                  <Clock3 aria-hidden="true" />
                  {CONSULTATION_DURATION_MINUTES}-minute consultation · starts every{" "}
                  {BOOKING_START_INTERVAL_MINUTES} minutes
                </p>
                <p className="booking-hint">
                  Tuesday–Friday, 11:00 AM–4:00 PM Toronto time ({timeZoneName(BOOKING_TIMEZONE)}).
                </p>
              </div>

              <div className="booking-slots">
                <p className="booking-slots-title">
                  <Clock3 aria-hidden="true" className="booking-inline-icon" />
                  {selectedDate ? appointment?.localDate : "Select a date"}
                </p>
                <p className="booking-tz">
                  Your local time ({clientTimeZone}) · Toronto time ({timeZoneName(BOOKING_TIMEZONE)})
                </p>
                {!selectedDate ? (
                  <p className="booking-empty">Choose a date to see open times.</p>
                ) : loadingSlots ? (
                  <p className="booking-empty">
                    <Loader2 aria-hidden="true" className="booking-spin" /> Loading availability…
                  </p>
                ) : availabilityError ? (
                  <div className="booking-availability-error" role="alert">
                    <p>{availabilityError}</p>
                    <button className="button button-secondary" type="button" onClick={() => void loadSlots(selectedDate)}>
                      Try again
                    </button>
                  </div>
                ) : (
                  <div className="booking-slot-grid">
                    {SLOTS.map((time) => {
                      const isBooked = booked.includes(time);
                      const isPast = selectedDate === today.iso && slotMinutes(time) <= today.minutes;
                      const disabled = isBooked || isPast;
                      const display = slotSummary(selectedDate, time, clientTimeZone);
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`booking-slot ${selectedTime === time ? "is-selected" : ""} ${
                            isBooked ? "is-booked" : ""
                          }`}
                          disabled={disabled}
                          onClick={() => setSelectedTime((current) => current === time ? "" : time)}
                        >
                          <span>{display.time}</span>
                          {isBooked ? (
                            <small>Booked</small>
                          ) : display.shift ? (
                            <small>{display.date} · next day</small>
                          ) : (
                            <small>{display.torontoTime} Toronto</small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {!loadingSlots && !availabilityError && selectedDate &&
                SLOTS.every((time) => booked.includes(time) || (selectedDate === today.iso && slotMinutes(time) <= today.minutes)) ? (
                  <p className="booking-empty">There are no remaining consultation times on this date. Please choose another date.</p>
                ) : null}
                {selectedTime ? (
                  <p className="booking-selected-time" aria-live="polite">
                    <strong>Your local time:</strong> {appointment?.localDate} at {appointment?.localTime}
                    <br />
                    <strong>Toronto time:</strong> {appointment?.torontoDate} at {appointment?.torontoTime}
                    <br />
                    {CONSULTATION_DURATION_MINUTES}-minute consultation
                  </p>
                ) : null}
              </div>
            </div>

            <div className="booking-actions">
              <button className="button button-ghost" type="button" onClick={() => setStep("country")}>
                <ArrowLeft aria-hidden="true" />
                Back
              </button>
              <button
                className="button button-primary"
                type="button"
                disabled={!selectedDate || !selectedTime || loadingSlots || Boolean(availabilityError)}
                onClick={() => {
                  setError("");
                  setStep("details");
                }}
              >
                Continue
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}

        {/* STEP 3 — DETAILS */}
        {step === "details" ? (
          <form
            className="booking-body"
            noValidate
            onSubmit={async (event) => {
              event.preventDefault();
              const errors = validateBookingContact(form, country);
              setFieldErrors(errors);
              if (Object.keys(errors).length) {
                setError("");
                shakeInvalidFields(errors, false);
                return;
              }
              if (BOOKING_EMAIL_OTP_ENABLED && !isEmailVerified) {
                const message = "Verify your email address with the OTP before continuing to payment.";
                setError("");
                setVerificationError(message);
                shakeInvalidFields({}, true);
                return;
              }
              if (submissionLock.current) return;
              submissionLock.current = true;
              setSubmitting(true);
              setError("");
              try {
                const submissionVerificationId =
                  verificationId || crypto.randomUUID();
                const response = await fetch("/api/consultation-leads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...bookingPayload(),
                    verificationId: submissionVerificationId,
                  }),
                });
                const result = await response.json() as {
                  bookingReference?: string;
                  code?: string;
                  error?: string;
                };
                if (!response.ok || !result.bookingReference) {
                  if (result.code === "email_already_registered") {
                    const message = result.error ||
                      "This email is already registered for a paid consultation. Please sign in to your client portal or contact FCI for help.";
                    setFieldErrors((current) => ({ ...current, email: message }));
                    setError("");
                    emailInputRef.current?.focus();
                    return;
                  }
                  throw new Error(result.error || "Could not save your consultation details.");
                }
                setVerificationId(submissionVerificationId);
                if (BOOKING_EMAIL_OTP_ENABLED) {
                  setVerifiedEmail(form.email.trim().toLowerCase());
                }
                setLeadBookingReference(result.bookingReference);
                setStep("payment");
                if (!payment) {
                  setError("Payment settings couldn't be loaded. Your consultation details are saved. Please refresh before continuing to payment.");
                }
              } catch (saveError) {
                setError(
                  saveError instanceof Error
                    ? saveError.message
                    : "Could not save your consultation details. Please try again.",
                );
              } finally {
                setSubmitting(false);
                submissionLock.current = false;
              }
            }}
          >
            <div className="booking-summary">
              <span>
                <Globe2 aria-hidden="true" /> {country}
              </span>
              <span>
                <CalendarCheck aria-hidden="true" /> {appointment?.localDate}
              </span>
              <span className="booking-summary-time">
                <Clock3 aria-hidden="true" />
                <span>
                  <strong>Your local time:</strong> {appointment?.localDate} at {appointment?.localTime}
                  <br />
                  <strong>Toronto time:</strong> {appointment?.torontoDate} at {appointment?.torontoTime}
                </span>
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" /> {CONSULTATION_DURATION_MINUTES}-minute spouse and family immigration consultation
              </span>
            </div>

            <label className={`booking-field${shakeClass(Boolean(fieldErrors.name))}`}>
              <span>Full name</span>
              <input
                ref={nameInputRef}
                required
                disabled={submitting}
                type="text"
                autoComplete="name"
                maxLength={120}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "booking-name-error" : undefined}
                value={form.name}
                onBlur={() => validateField("name")}
                onChange={(event) => {
                  updateBookingField("name", event.target.value);
                }}
                data-booking-step-focus
              />
              {fieldErrors.name ? <span className="booking-field-error" id="booking-name-error" role="alert">{fieldErrors.name}</span> : null}
            </label>
            <div className="booking-email-control">
              <div className="booking-email-row">
                <label className={`booking-field booking-email-input${shakeClass(Boolean(fieldErrors.email))}`}>
                  <span>Email address</span>
                  <input
                    ref={emailInputRef}
                    required
                    disabled={submitting}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    aria-invalid={Boolean(fieldErrors.email || emailNeedsVerification)}
                    aria-describedby={
                      fieldErrors.email
                        ? "booking-email-error"
                        : emailNeedsVerification
                          ? "booking-email-verification-error"
                          : undefined
                    }
                    value={form.email}
                    onBlur={() => validateField("email")}
                    onChange={(event) => updateBookingField("email", event.target.value)}
                  />
                </label>
                {/* While a code is pending, resending happens inside the verification card. */}
                {BOOKING_EMAIL_OTP_ENABLED && (!verificationId || isEmailVerified) ? (
                  <div className={`booking-email-actions ${isEmailVerified ? "is-verified" : ""}${shakeClass(emailNeedsVerification)}`}>
                    {isEmailVerified ? (
                      <span className="booking-email-verified">
                        <CheckCircle2 aria-hidden="true" /> Email verified
                      </span>
                    ) : (
                      <button
                        className="button button-secondary booking-send-otp"
                        type="button"
                        disabled={!isValidBookingEmail(form.email) || submitting || resendSeconds > 0}
                        onClick={() => void sendVerificationCode()}
                      >
                        {otpAction === "send" ? (
                          <><Loader2 aria-hidden="true" className="booking-spin" /> Sending…</>
                        ) : resendSeconds > 0 ? (
                          `Send OTP (${resendSeconds}s)`
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
              {fieldErrors.email ? (
                <span className="booking-field-error" id="booking-email-error" role="alert">{fieldErrors.email}</span>
              ) : null}
              {BOOKING_EMAIL_OTP_ENABLED ? (
                <div className="booking-otp-panel" aria-hidden={!verificationId || isEmailVerified}>
                  <div className="booking-otp-panel-inner">
                    {verificationId ? (
                      <div className={`booking-otp-card${shakeClass(otpNeedsVerification)}`}>
                        <span className="booking-otp-icon" aria-hidden="true">
                          <MailCheck />
                        </span>
                        <h4 className="booking-otp-title">Verify your email</h4>
                        <p className="booking-otp-lead">Enter the six-digit code sent to</p>
                        <p className="booking-otp-email">{form.email.trim().toLowerCase()}</p>
                        <OtpInput
                          value={verificationCode}
                          onChange={(next) => {
                            setVerificationCode(next);
                            setVerificationError("");
                            setError("");
                          }}
                          disabled={submitting || isEmailVerified}
                          invalid={otpNeedsVerification}
                          firstInputRef={verificationInputRef}
                          describedBy={`booking-otp-meta${verificationError ? " booking-otp-error" : ""}`}
                        />
                        <p className="booking-otp-meta" id="booking-otp-meta">
                          {otpExpired
                            ? "This code has expired. Request a new code."
                            : `Code expires in ${formatCountdown(otpSecondsLeft)}`}
                          {resendSeconds > 0 ? ` · Resend available in ${resendSeconds}s` : null}
                        </p>
                        {verificationError ? (
                          <p className="booking-otp-feedback is-error" id="booking-otp-error" role="alert">{verificationError}</p>
                        ) : verificationMessage ? (
                          <p className="booking-otp-feedback is-success" role="status">{verificationMessage}</p>
                        ) : null}
                        <button
                          className="booking-otp-verify"
                          type="button"
                          disabled={submitting || verificationCode.length !== OTP_LENGTH || isEmailVerified || otpExpired}
                          aria-busy={otpAction === "verify"}
                          onClick={() => void verifyBookingEmail()}
                        >
                          {otpAction === "verify" ? (
                            <><Loader2 aria-hidden="true" className="booking-spin" /> Verifying…</>
                          ) : (
                            "Verify email"
                          )}
                        </button>
                        <p className="booking-otp-resend">
                          Didn’t receive the code?{" "}
                          <button
                            type="button"
                            disabled={submitting || resendSeconds > 0 || isEmailVerified}
                            onClick={() => void sendVerificationCode()}
                          >
                            {otpAction === "send" ? "Sending…" : "Resend code"}
                          </button>
                        </p>
                        <p className="booking-otp-footer">
                          <ShieldCheck aria-hidden="true" />
                          Your email verification helps protect your booking.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="booking-fineprint">Email verification by code is temporarily disabled. Enter an email address you can access.</p>
              )}
              {BOOKING_EMAIL_OTP_ENABLED && verificationError && (!verificationId || isEmailVerified) ? (
                <p
                  className="booking-field-error"
                  id="booking-email-verification-error"
                  role="alert"
                >
                  {verificationError}
                </p>
              ) : null}
            </div>
            <label className={`booking-field${shakeClass(Boolean(fieldErrors.phone))}`}>
              <span>Phone number</span>
              <input
                required
                disabled={submitting}
                ref={phoneInputRef}
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +1"
                inputMode="tel"
                maxLength={40}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? "booking-phone-error" : undefined}
                value={form.phone}
                onBlur={() => validateField("phone")}
                onChange={(event) => {
                  updateBookingField("phone", event.target.value);
                }}
              />
              {fieldErrors.phone ? <span className="booking-field-error" id="booking-phone-error" role="alert">{fieldErrors.phone}</span> : null}
            </label>
            <label className="booking-field">
              <span>Details (optional)</span>
              <textarea
                rows={4}
                maxLength={1000}
                value={form.details}
                disabled={submitting}
                onChange={(event) => updateBookingField("details", event.target.value)}
                placeholder="Briefly describe what you want to discuss. Please don't include documents or detailed case history."
              />
            </label>
            <p className="booking-fineprint">
              We collect only the information needed to arrange your consultation. Please do not
              include passport numbers, identity documents, or detailed confidential case information
              in this form. See our{" "}
              <Link href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</Link>.
            </p>

            <div className="booking-actions">
              <button
                className="button button-ghost"
                type="button"
                onClick={() => void goBackToWhen()}
                disabled={submitting}
              >
                <ArrowLeft aria-hidden="true" />
                Back
              </button>
              <button
                className="button button-primary"
                type="submit"
                disabled={submitting || paymentUnavailable}
              >
                {submitting ? (
                  <>
                    <Loader2 aria-hidden="true" className="booking-spin" />
                    Continuing…
                  </>
                ) : paymentsOn ? (
                  <>
                    <ArrowRight aria-hidden="true" />
                    Continue to Payment
                  </>
                ) : (
                  <>
                    <ArrowRight aria-hidden="true" />
                    Continue to Payment
                  </>
                )}
              </button>
            </div>
            <p className="booking-fineprint">
              {BOOKING_EMAIL_OTP_ENABLED
                ? "Verify your email with the Send OTP control before continuing. This step does not book or confirm a consultation."
                : "Email verification is temporarily disabled. This step saves your consultation details but does not book or confirm it."}
            </p>
            </form>
        ) : null}

        {/* STEP 4 — PAYMENT */}
        {step === "payment" ? (
            <div className="booking-body">
              <div className="booking-country-intro">
                <h3 tabIndex={-1} data-booking-step-focus>Review your consultation</h3>
                <p>
                  {BOOKING_EMAIL_OTP_ENABLED
                    ? "Your email is verified. Review the fee and appointment before continuing to Stripe."
                    : "Review your email, fee, and appointment before continuing to Stripe."}
                </p>
              </div>
              <div className="booking-summary">
                <span><CheckCircle2 aria-hidden="true" /> {form.name}</span>
                <span>
                  <CreditCard aria-hidden="true" /> {form.email.trim().toLowerCase()} ·{" "}
                  {BOOKING_EMAIL_OTP_ENABLED ? "verified" : "provided"}
                </span>
                <span><Globe2 aria-hidden="true" /> {country}</span>
                <span><CalendarCheck aria-hidden="true" /> {appointment?.localDate} at {appointment?.localTime}</span>
                <span className="booking-summary-time">
                  <Clock3 aria-hidden="true" />
                  <span><strong>Toronto time:</strong> {appointment?.torontoDate} at {appointment?.torontoTime}</span>
                </span>
                <span><CheckCircle2 aria-hidden="true" /> {CONSULTATION_DURATION_MINUTES}-minute spouse and family immigration consultation</span>
              </div>
              {paymentsOn ? (
                <>
                  <div className="booking-price">
                    <div>
                      <span className="booking-price-label">Consultation fee · {CONSULTATION_DURATION_MINUTES} minutes</span>
                      <span className="booking-price-sub">Regular fee {regularLabel}</span>
                    </div>
                    <div className="booking-price-amounts">
                      <span className="booking-price-was">{regularLabel}</span>
                      <span className="booking-price-now">{priceLabel}</span>
                    </div>
                  </div>
                  <div className="booking-order-note">
                    <p><strong>Tax:</strong> Calculated by Stripe based on your billing address.</p>
                    <p><strong>Total payable:</strong> Stripe will show the final amount, including applicable tax, before you pay.</p>
                    <p>Cancellation and refund requests follow our{" "}
                      <a href="/refund-policy" target="_blank" rel="noreferrer">published policy</a>.
                    </p>
                  </div>
                </>
              ) : (
                <p className="booking-fineprint" role="status">
                  {paymentUnavailable
                    ? "Payment settings are unavailable. Please refresh and try again."
                    : "Secure checkout is temporarily unavailable. The booking cannot be confirmed without payment."}
                </p>
              )}
              <p className="booking-fineprint">
                Your booking is not confirmed until the server verifies the Stripe payment and saves the confirmation.
              </p>
              <div className="booking-actions">
                <button
                  className="button button-ghost"
                  type="button"
                  disabled={submitting}
                  onClick={returnToDetails}
                >
                  <ArrowLeft aria-hidden="true" /> Change details
                </button>
                <button
                  className="button button-primary"
                  type="button"
                  disabled={
                    submitting ||
                    !paymentsOn ||
                    !verificationId
                  }
                  onClick={() => void startCheckout()}
                >
                  {submitting ? (
                    <><Loader2 aria-hidden="true" className="booking-spin" /> Preparing payment…</>
                  ) : (
                    <><CreditCard aria-hidden="true" /> Continue to secure payment</>
                  )}
                </button>
              </div>
            </div>
        ) : null}

        {/* VERIFYING */}
        {step === "verifying" ? (
          <div className="booking-body booking-done">
            <span className="booking-done-icon">
              <Loader2 aria-hidden="true" className="booking-spin" />
            </span>
            <h3>Confirming your payment…</h3>
            <p>Checking Stripe payment and waiting for its verified confirmation.</p>
          </div>
        ) : null}

        {step === "pending" ? (
          <div className="booking-body booking-done" aria-live="polite">
            <span className="booking-done-icon">
              <Loader2 aria-hidden="true" className="booking-spin" />
            </span>
            <h3>Payment confirmation is still pending.</h3>
            <p>
              Do not pay again or select another consultation time. Stripe&apos;s verified payment
              notification has not yet confirmed this booking. You can check again shortly.
            </p>
            {error ? <p className="booking-error" role="alert">{error}</p> : null}
            <button
              className="button button-primary"
              type="button"
              disabled={!pendingSessionId}
              onClick={() => pendingSessionId && pendingBookingReference &&
                void verifyPayment(pendingSessionId, pendingBookingReference)}
            >
              Check payment confirmation
            </button>
          </div>
        ) : null}

        {step === "not_completed" ? (
          <div className="booking-body booking-done" aria-live="polite">
            <h3>Payment not completed.</h3>
            <p>Your consultation is not confirmed. Do not submit a second booking.</p>
            {retryBookingReference ? (
              <a
                className="button button-primary"
                href={`/payment?reference=${encodeURIComponent(retryBookingReference)}&payment=cancelled`}
              >
                Retry payment for this booking
                <ArrowRight aria-hidden="true" />
              </a>
            ) : (
              <p>Please return to your original payment page or contact FCI for help.</p>
            )}
          </div>
        ) : null}

        {/* DONE */}
        {step === "done" ? (
          <div className="booking-body booking-done">
            <span className="booking-done-icon">
              <CheckCircle2 aria-hidden="true" />
            </span>
            <h3>Your consultation is confirmed.</h3>
            {confirmedReference ? (
              <p><strong>Booking reference:</strong> {confirmedReference}</p>
            ) : null}
            {confirmedAppointment && confirmedLocalAppointment ? (
              <div className="booking-confirmed-summary">
                <p><strong>Name:</strong> {confirmedAppointment.name}</p>
                <p><strong>Email:</strong> {confirmedAppointment.email}</p>
                <p><strong>Country:</strong> {confirmedAppointment.country}</p>
                <p><strong>Your local time:</strong> {confirmedLocalAppointment.localDate} at {confirmedLocalAppointment.localTime}</p>
                <p><strong>Toronto time:</strong> {confirmedLocalAppointment.torontoDate} at {confirmedLocalAppointment.torontoTime}</p>
                <p><strong>Duration:</strong> {CONSULTATION_DURATION_MINUTES} minutes</p>
                {confirmedAppointment.amountCents > 0 ? (
                  <p>
                    <strong>Consultation fee:</strong>{" "}
                    {new Intl.NumberFormat("en-CA", {
                      style: "currency",
                      currency: confirmedAppointment.currency.toUpperCase(),
                    }).format(confirmedAppointment.amountCents / 100)}
                  </p>
                ) : null}
              </div>
            ) : null}
            <p>
              {payment?.enabled
                ? "Your payment was verified and your consultation is confirmed."
                : "Your consultation is confirmed."}{" "}
              We&apos;ll use the contact details you provided if we need to reach you.
            </p>
            {payment?.enabled ? (
                <p className="booking-fineprint">
                  The consultation fee is separate from professional-service fees and government fees.
                  Save your booking reference for portal sign-in.
                </p>
            ) : null}
            <a className="button button-primary" href="/login">
              Sign in to your client portal
              <ArrowRight aria-hidden="true" />
            </a>
            {confirmedReference ? (
              <a
                className="button button-secondary"
                href={`/payment?reference=${encodeURIComponent(confirmedReference)}`}
              >
                View booking and payment details
              </a>
            ) : null}
            <button className="button button-secondary" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
