"use client";

import { createContext, useContext } from "react";

export type BookingModalContextValue = {
  openBookingForm: () => void;
};

export const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return context;
}
