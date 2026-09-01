import { describe, expect, it } from "vitest";
import { buildRestoreCalendar, diffCalendars, parseIcs, unfoldIcs } from "./ics";

const calendar = (events: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VTIMEZONE\r\nTZID:Europe/Paris\r\nEND:VTIMEZONE\r\n${events}END:VCALENDAR\r\n`;
const event = (uid: string, start: string, summary: string, extra = "") => `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART;TZID=Europe/Paris:${start}\r\nDTEND;TZID=Europe/Paris:${start.slice(0, 9)}110000\r\nSUMMARY:${summary}\r\n${extra}END:VEVENT\r\n`;

describe("iCalendar core", () => {
  it("unfolds folded content lines", () => {
    expect(unfoldIcs("SUMMARY:Long\r\n title")).toEqual(["SUMMARY:Longtitle"]);
  });

  it("@claim:recurrence-timezones preserves recurrence overrides as distinct instances", () => {
    const parsed = parseIcs(calendar(event("weekly", "20260828T100000", "Weekly") + event("weekly", "20260904T120000", "Weekly moved", "RECURRENCE-ID;TZID=Europe/Paris:20260904T100000\r\n")));
    expect(parsed.events).toHaveLength(2);
    expect(parsed.events[1].key).toContain("20260904T100000");
  });

  it("summarizes added, moved, and deleted events", () => {
    const before = calendar(event("a", "20260828T100000", "Review") + event("b", "20260828T100000", "Removed"));
    const after = calendar(event("a", "20260828T120000", "Review") + event("c", "20260828T140000", "Added"));
    expect(diffCalendars(before, after).map((change) => change.kind).sort()).toEqual(["added", "cancelled", "moved"]);
  });

  it("exports the prior form of a moved event with its timezone", () => {
    const before = calendar(event("a", "20260828T100000", "Review"));
    const after = calendar(event("a", "20260828T120000", "Review"));
    const restored = buildRestoreCalendar(before, diffCalendars(before, after));
    expect(restored).toContain("BEGIN:VTIMEZONE");
    expect(restored).toContain("DTSTART;TZID=Europe/Paris:20260828T100000");
  });
});
