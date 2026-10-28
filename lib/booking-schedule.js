export const CONSULTATION_DURATION_MINUTES = 30;
export const BOOKING_START_INTERVAL_MINUTES = 15;

const OPENING_MINUTES = 11 * 60;
const CLOSING_MINUTES = 16 * 60;

const START_COUNT =
  Math.floor(
    (CLOSING_MINUTES - CONSULTATION_DURATION_MINUTES - OPENING_MINUTES) /
      BOOKING_START_INTERVAL_MINUTES,
  ) + 1;

export const VALID_BOOKING_STARTS = Array.from({ length: START_COUNT }, (_, index) => {
  const startMinutes = OPENING_MINUTES + index * BOOKING_START_INTERVAL_MINUTES;
  const hour = Math.floor(startMinutes / 60);
  const minute = startMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});
