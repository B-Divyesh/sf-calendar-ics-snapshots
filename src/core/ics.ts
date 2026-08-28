export type CalendarEvent = {
  key: string;
  uid: string;
  recurrenceId?: string;
  summary: string;
  start: string;
  end: string;
  startLabel: string;
  status: string;
  raw: string;
};

export type ParsedCalendar = {
  events: CalendarEvent[];
  timezones: string[];
  name: string;
};

export type CalendarChange = {
  id: string;
  kind: "added" | "moved" | "cancelled";
  title: string;
  detail: string;
  restoreRaw: string;
  eventKey: string;
};

const unescapeText = (value: string) => value
  .replace(/\\n/gi, " ")
  .replace(/\\,/g, ",")
  .replace(/\\;/g, ";")
  .replace(/\\\\/g, "\\");

export function unfoldIcs(input: string): string[] {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").reduce<string[]>((lines, line) => {
    if (/^[ \t]/.test(line) && lines.length) lines[lines.length - 1] += line.slice(1);
    else lines.push(line);
    return lines;
  }, []);
}

function property(lines: string[], name: string): { value: string; fullName: string } | undefined {
  const upper = `${name.toUpperCase()}`;
  const line = lines.find((entry) => {
    const head = entry.split(":", 1)[0].split(";", 1)[0].toUpperCase();
    return head === upper;
  });
  if (!line) return undefined;
  const colon = line.indexOf(":");
  return { value: colon >= 0 ? line.slice(colon + 1) : "", fullName: line.slice(0, colon) };
}

function blocks(input: string, component: string): string[] {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const expression = new RegExp(`BEGIN:${component}\\n[\\s\\S]*?END:${component}`, "gi");
  return normalized.match(expression) ?? [];
}

function readableDate(value: string, fullName = ""): string {
  if (!value) return "Time not supplied";
  const isDate = /VALUE=DATE/i.test(fullName) || /^\d{8}$/.test(value);
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?Z?)?/);
  if (!match) return value;
  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)));
  if (Number.isNaN(date.valueOf())) return value;
  const label = new Intl.DateTimeFormat(undefined, isDate
    ? { dateStyle: "medium" }
    : { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }
  ).format(date);
  const zone = fullName.match(/TZID=(?:"([^"]+)"|([^;:]+))/i)?.slice(1).find(Boolean);
  return zone ? `${label} (${zone})` : value.endsWith("Z") ? `${label} (UTC)` : label;
}

export function parseIcs(input: string): ParsedCalendar {
  if (!/BEGIN:VCALENDAR/i.test(input)) throw new Error("This file is not an iCalendar calendar.");
  const calendarLines = unfoldIcs(input);
  const name = unescapeText(property(calendarLines, "X-WR-CALNAME")?.value || "Imported calendar");
  const events = blocks(input, "VEVENT").map((raw, index) => {
    const lines = unfoldIcs(raw);
    const uid = property(lines, "UID")?.value.trim() || `missing-uid-${index}`;
    const recurrence = property(lines, "RECURRENCE-ID")?.value.trim();
    const startProperty = property(lines, "DTSTART");
    const endProperty = property(lines, "DTEND");
    const summary = unescapeText(property(lines, "SUMMARY")?.value || "Untitled event");
    return {
      key: recurrence ? `${uid}::${recurrence}` : uid,
      uid,
      recurrenceId: recurrence,
      summary,
      start: startProperty?.value || "",
      end: endProperty?.value || "",
      startLabel: readableDate(startProperty?.value || "", startProperty?.fullName),
      status: (property(lines, "STATUS")?.value || "CONFIRMED").toUpperCase(),
      raw: raw.replace(/\n/g, "\r\n")
    };
  });
  return { events, timezones: blocks(input, "VTIMEZONE").map((part) => part.replace(/\n/g, "\r\n")), name };
}

export function diffCalendars(previousIcs: string | undefined, currentIcs: string): CalendarChange[] {
  const current = parseIcs(currentIcs);
  if (!previousIcs) return current.events
    .filter((event) => event.status !== "CANCELLED")
    .map((event) => ({
      id: `added:${event.key}`,
      kind: "added",
      title: event.summary,
      detail: event.startLabel,
      restoreRaw: event.raw,
      eventKey: event.key
    }));
  const previous = parseIcs(previousIcs);
  const before = new Map(previous.events.map((event) => [event.key, event]));
  const after = new Map(current.events.map((event) => [event.key, event]));
  const changes: CalendarChange[] = [];

  for (const event of current.events) {
    const prior = before.get(event.key);
    if (!prior && event.status !== "CANCELLED") {
      changes.push({ id: `added:${event.key}`, kind: "added", title: event.summary, detail: event.startLabel, restoreRaw: event.raw, eventKey: event.key });
    } else if (prior && event.status === "CANCELLED" && prior.status !== "CANCELLED") {
      changes.push({ id: `cancelled:${event.key}`, kind: "cancelled", title: prior.summary, detail: `Was ${prior.startLabel}`, restoreRaw: prior.raw, eventKey: event.key });
    } else if (prior && (prior.start !== event.start || prior.end !== event.end)) {
      changes.push({ id: `moved:${event.key}`, kind: "moved", title: event.summary, detail: `${prior.startLabel} → ${event.startLabel}`, restoreRaw: prior.raw, eventKey: event.key });
    }
  }
  for (const event of previous.events) {
    if (!after.has(event.key) && event.status !== "CANCELLED") {
      changes.push({ id: `cancelled:${event.key}`, kind: "cancelled", title: event.summary, detail: `Was ${event.startLabel}`, restoreRaw: event.raw, eventKey: event.key });
    }
  }
  return changes.sort((a, b) => a.title.localeCompare(b.title));
}

export function buildRestoreCalendar(sourceIcs: string, changes: CalendarChange[], title = "Calendar Snapshotter restore"): string {
  const source = parseIcs(sourceIcs);
  const events = [...new Map(changes.map((change) => [change.eventKey, change.restoreRaw])).values()];
  if (!events.length) throw new Error("Select at least one event to restore.");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//Sociobot//Calendar Snapshotter 0.1//EN",
    `X-WR-CALNAME:${title.replace(/[,:;]/g, " ")}`,
    ...source.timezones,
    ...events,
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}

export function mergeCalDavResponse(response: string): string {
  if (/BEGIN:VCALENDAR/i.test(response) && !/<[^>]+>/i.test(response.slice(0, 200))) return response;
  const document = new DOMParser().parseFromString(response, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("The CalDAV server returned unreadable XML.");
  const fragments = Array.from(document.getElementsByTagNameNS("*", "calendar-data"))
    .map((node) => node.textContent || "")
    .filter((value) => /BEGIN:VCALENDAR/i.test(value));
  if (!fragments.length) throw new Error("No calendar data was returned. Check the calendar collection URL.");
  const timezones = fragments.flatMap((value) => blocks(value, "VTIMEZONE"));
  const events = fragments.flatMap((value) => blocks(value, "VEVENT"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sociobot//Calendar Snapshotter 0.1//EN", ...timezones, ...events, "END:VCALENDAR", ""].join("\r\n");
}
