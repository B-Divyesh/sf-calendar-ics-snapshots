import { describe, expect, it } from "vitest";
import { buildRestoreCalendar, diffCalendars, parseIcs, unfoldIcs } from "./ics";

const calendar = (events: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VTIMEZONE\r\nTZID:Europe/Paris\r\nEND:VTIMEZONE\r\n${events}END:VCALENDAR\r\n`;
const event = (uid: string, start: string, summary: string, extra = "") => `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART;TZID=Europe/Paris:${start}\r\nDTEND;TZID=Europe/Paris:${start.slice(0, 9)}110000\r\nSUMMARY:${summary}\r\n${extra}END:VEVENT\r\n`;

describe("iCalendar core", () => {
  it("unfolds folded content lines", () => {
    expect(unfoldIcs("SUMMARY:Long\r\n title")).toEqual(["SUMMARY:Longtitle"]);
  });

  it("rejects a truncated calendar instead of treating it as an empty copy", () => {
    const truncated = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:truncated-1\r\nSUMMARY:Still open\r\n";
    expect(() => parseIcs(truncated)).toThrow("This iCalendar file is incomplete or malformed. Export it again, then choose the complete file.");
  });

  it("rejects mismatched component endings", () => {
    const mismatched = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:mismatch\r\nEND:VCALENDAR\r\n";
    expect(() => parseIcs(mismatched)).toThrow("incomplete or malformed");
  });

  it("accepts a complete calendar with no events", () => {
    expect(parseIcs("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n").events).toEqual([]);
  });

  it("@claim:recurrence-timezones preserves a recurring override and timezone in a restore file", () => {
    const before = calendar(event("weekly", "20260828T100000", "Weekly") + event("weekly", "20260904T100000", "Weekly", "RECURRENCE-ID;TZID=Europe/Paris:20260904T100000\r\n"));
    const after = calendar(event("weekly", "20260828T100000", "Weekly") + event("weekly", "20260904T120000", "Weekly moved", "RECURRENCE-ID;TZID=Europe/Paris:20260904T100000\r\n"));
    const parsed = parseIcs(before);
    expect(parsed.events).toHaveLength(2);
    expect(parsed.events[1].key).toContain("20260904T100000");
    const restored = buildRestoreCalendar(before, diffCalendars(before, after));
    expect(restored).toContain("BEGIN:VTIMEZONE");
    expect(restored).toContain("RECURRENCE-ID;TZID=Europe/Paris:20260904T100000");
    expect(restored).toContain("DTSTART;TZID=Europe/Paris:20260904T100000");
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
