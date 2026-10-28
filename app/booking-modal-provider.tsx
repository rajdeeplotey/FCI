"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import BookingModal from "./booking-modal";
import { BookingModalContext, useBookingModal } from "./booking-modal-context";

export { useBookingModal } from "./booking-modal-context";

export function BookingTrigger({
  "aria-label": ariaLabel,
  children,
  className,
}: {
  "aria-label"?: string;
  children: ReactNode;
  className: string;
}) {
  const { openBookingForm } = useBookingModal();
  return (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={openBookingForm}
      type="button"
    >
      {children}
    </button>
  );
}

export default function BookingModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [resumeSessionId, setResumeSessionId] = useState<string | null>(null);
  const [resumeBookingReference, setResumeBookingReference] = useState<string | null>(null);
  const [resumeCancelled, setResumeCancelled] = useState(false);

  const openBookingForm = useCallback(() => {
    setResumeSessionId(null);
    setResumeBookingReference(null);
    setResumeCancelled(false);
    setBookingOpen(true);
  }, []);

  const closeBookingForm = useCallback(() => {
    setBookingOpen(false);
    setResumeSessionId(null);
    setResumeBookingReference(null);
    setResumeCancelled(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const booking = params.get("booking");
    if (booking === "paid") {
      // Restore verified checkout state after Stripe returns to any page.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResumeSessionId(params.get("session_id"));
      setResumeBookingReference(params.get("reference"));
      setBookingOpen(true);
    } else if (booking === "cancelled") {
      setResumeCancelled(true);
      setBookingOpen(true);
    }
    if (booking) {
      params.delete("booking");
      params.delete("session_id");
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash,
      );
    }
  }, []);

  const contextValue = useMemo(
    () => ({ openBookingForm }),
    [openBookingForm],
  );

  return (
    <BookingModalContext.Provider value={contextValue}>
      {children}
      <BookingModal
        open={bookingOpen}
        onClose={closeBookingForm}
        resumeSessionId={resumeSessionId}
        resumeBookingReference={resumeBookingReference}
        resumeCancelled={resumeCancelled}
      />
    </BookingModalContext.Provider>
  );
}
