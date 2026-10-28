const BOOKING_TIMEZONE = "America/Toronto";

function zoneOffsetMs(instant: Date, timeZone: string) {
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
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value ?? "0");
  const utcWallTime = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );
  return utcWallTime - instant.getTime();
}

function easternSlotToInstant(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  const offset = zoneOffsetMs(new Date(wallTime), BOOKING_TIMEZONE);
  let instant = wallTime - offset;
  const correctedOffset = zoneOffsetMs(new Date(instant), BOOKING_TIMEZONE);
  if (correctedOffset !== offset) instant = wallTime - correctedOffset;
  return new Date(instant);
}

function dateKey(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "00";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function slotSummary(date: string, time: string, timeZone: string) {
  const instant = easternSlotToInstant(date, time);
  const localDate = dateKey(instant, timeZone);
  const torontoDate = dateKey(instant, BOOKING_TIMEZONE);
  const localLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(instant);
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(instant);
  const shift = localDate > torontoDate ? 1 : localDate < torontoDate ? -1 : 0;
  return {
    localDate: localLabel,
    localTime,
    time: localTime,
    date: localLabel,
    torontoDate: new Intl.DateTimeFormat("en-US", {
      timeZone: BOOKING_TIMEZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(instant),
    torontoTime: new Intl.DateTimeFormat("en-US", {
      timeZone: BOOKING_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(instant),
    shift,
    dayShift: shift,
  };
}
