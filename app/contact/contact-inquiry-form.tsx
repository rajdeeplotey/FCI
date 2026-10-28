"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CONTACT_SERVICES,
  parseContactInquiry,
  type ContactInquiryErrors,
} from "../../lib/contact-inquiry";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  website: string;
};

type FieldErrors = ContactInquiryErrors;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  consent: false,
  website: "",
};

const fieldOrder: (keyof FormValues)[] = [
  "name",
  "email",
  "phone",
  "service",
  "consent",
];

function readFormValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    phone: String(data.get("phone") ?? ""),
    service: String(data.get("service") ?? ""),
    message: String(data.get("message") ?? ""),
    consent: data.has("consent"),
    website: String(data.get("fci_hp_check") ?? ""),
  };
}

// Errors that render next to a visible field; anything else (e.g. the
// honeypot) must surface as a request error so the submit never fails silently.
function visibleErrors(errors: FieldErrors): FieldErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => field !== "website"),
  ) as FieldErrors;
}

function focusFirstError(errors: FieldErrors) {
  const firstInvalid = fieldOrder.find((field) => errors[field]);
  if (firstInvalid) {
    window.requestAnimationFrame(() => {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
    });
  }
}

export default function ContactInquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  // The confirmation renders above the form, out of view of the submit button.
  useEffect(() => {
    if (submitted) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    const nextValues = { ...values, [field]: value };
    const parsed = parseContactInquiry(nextValues);
    const fieldError = parsed.ok ? undefined : parsed.fieldErrors[field];
    setValues(nextValues);
    setErrors((current) => {
      if (fieldError) {
        return current[field] ? { ...current, [field]: fieldError } : current;
      }
      if (!(field in current)) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
    setRequestError("");
    setSubmitted(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const submittedValues = readFormValues(event.currentTarget);
    const parsed = parseContactInquiry(submittedValues);
    const fieldErrors = parsed.ok ? {} : visibleErrors(parsed.fieldErrors);
    setErrors(fieldErrors);
    setRequestError("");
    setSubmitted(false);
    if (!parsed.ok) {
      if (Object.keys(fieldErrors).length > 0) {
        focusFirstError(fieldErrors);
      } else {
        setRequestError(parsed.error);
      }
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.inquiry,
          consent: submittedValues.consent,
          website: submittedValues.website,
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string; fieldErrors?: FieldErrors }
        | null;

      if (!response.ok) {
        if (result?.fieldErrors) {
          const visibleFieldErrors = visibleErrors(result.fieldErrors);
          setErrors(visibleFieldErrors);
          if (Object.keys(visibleFieldErrors).length > 0) {
            focusFirstError(visibleFieldErrors);
            return;
          }
          setRequestError("Unable to submit this inquiry.");
          return;
        }
        setRequestError(
          result?.error || "We couldn’t send your inquiry. Please try again.",
        );
        return;
      }

      setSubmitted(true);
      setValues(initialValues);
    } catch {
      setRequestError(
        "We couldn’t reach the server. Your information is still here—please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const fieldError = (field: keyof FormValues) =>
    errors[field] ? (
      <span className="contact-form-error" id={`contact-${field}-error`}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <section aria-labelledby="contact-form-title" className="contact-form-card">
      <div className="contact-form-heading">
        <p>We’re here to help</p>
        <h2 id="contact-form-title">Send Us a Free Inquiry</h2>
        <span>Tell us a little about how we can support you.</span>
      </div>

      {submitted ? (
        <div className="contact-form-success" ref={successRef} role="status">
          <strong>Thank you for reaching out.</strong>
          <span>
            Your inquiry was saved. Our team will get back to you soon.
          </span>
        </div>
      ) : null}

      <form
        className="contact-inquiry-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <label className="contact-form-honeypot" aria-hidden="true">
          Leave this field empty
          <input
            autoComplete="off"
            name="fci_hp_check"
            onChange={(event) => update("website", event.target.value)}
            tabIndex={-1}
            value={values.website}
          />
        </label>

        <div className="contact-form-fields">
          <label className="contact-form-field" htmlFor="contact-name">
            <span>Full Name <b aria-hidden="true">*</b></span>
            <input
              autoComplete="name"
              id="contact-name"
              maxLength={120}
              name="name"
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              required
              value={values.name}
            />
            {fieldError("name")}
          </label>

          <label className="contact-form-field" htmlFor="contact-email">
            <span>Email Address <b aria-hidden="true">*</b></span>
            <input
              autoComplete="email"
              id="contact-email"
              maxLength={254}
              name="email"
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              required
              type="email"
              value={values.email}
            />
            {fieldError("email")}
          </label>

          <label className="contact-form-field" htmlFor="contact-phone">
            <span>Phone Number <b aria-hidden="true">*</b></span>
            <input
              autoComplete="tel"
              id="contact-phone"
              maxLength={40}
              name="phone"
              onChange={(event) => update("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? "contact-phone-error" : undefined
              }
              required
              type="tel"
              value={values.phone}
            />
            {fieldError("phone")}
          </label>

          <label className="contact-form-field" htmlFor="contact-service">
            <span>Service Interested In <b aria-hidden="true">*</b></span>
            <select
              id="contact-service"
              name="service"
              onChange={(event) => update("service", event.target.value)}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={
                errors.service ? "contact-service-error" : undefined
              }
              required
              value={values.service}
            >
              <option value="">Select a service</option>
              {CONTACT_SERVICES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {fieldError("service")}
          </label>
        </div>

        <label className="contact-form-field contact-form-message" htmlFor="contact-message">
          <span>Message / Tell Us About Your Situation <small>(optional)</small></span>
          <textarea
            id="contact-message"
            maxLength={3000}
            name="message"
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            rows={3}
            value={values.message}
          />
          {fieldError("message")}
        </label>

        <label className="contact-form-consent" htmlFor="contact-consent">
          <input
            checked={values.consent}
            id="contact-consent"
            name="consent"
            onChange={(event) => update("consent", event.target.checked)}
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={
              errors.consent ? "contact-consent-error" : undefined
            }
            required
          />
          <span>
            I agree to be contacted by Future Canadian Immigration Inc.
            regarding my inquiry.
          </span>
        </label>
        {fieldError("consent")}

        {requestError ? (
          <p className="contact-form-request-error" role="alert">
            {requestError}
          </p>
        ) : null}

        <button
          className="contact-form-submit"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Send Free Inquiry"}
          {!isSubmitting ? <ArrowRight aria-hidden="true" /> : null}
        </button>
        <p className="contact-form-note">
          No booking required. Send your question and our team will get back to
          you.
        </p>
      </form>
    </section>
  );
}
