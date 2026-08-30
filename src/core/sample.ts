import { fingerprint, type Snapshot, type VaultData } from "./vault";

const line = (value: string) => `${value}\r\n`;
const calendar = (events: string) => line("BEGIN:VCALENDAR") + line("VERSION:2.0") + line("X-WR-CALNAME:Northstar studio week") + line("BEGIN:VTIMEZONE") + line("TZID:Europe/Paris") + line("END:VTIMEZONE") + events + line("END:VCALENDAR");
const event = (uid: string, start: string, end: string, summary: string) => line("BEGIN:VEVENT") + line(`UID:${uid}`) + line(`DTSTART;TZID=Europe/Paris:${start}`) + line(`DTEND;TZID=Europe/Paris:${end}`) + line(`SUMMARY:${summary}`) + line("END:VEVENT");

const before = calendar(
  event("planning", "20260902T090000", "20260902T100000", "Planning review") +
  event("train", "20260903T081500", "20260903T093000", "Airport train") +
  event("notes", "20260904T140000", "20260904T143000", "Project notes")
);
const after = calendar(
  event("planning", "20260902T110000", "20260902T120000", "Planning review") +
  event("notes", "20260904T140000", "20260904T143000", "Project notes")
);

export const sampleRestoreTitle = "Airport train";

export async function sampleVaultData(): Promise<VaultData> {
  const makeSnapshot = async (id: string, createdAt: string, ics: string): Promise<Snapshot> => ({
    id,
    createdAt,
    source: "file",
    sourceName: "Northstar studio week",
    ics,
    fingerprint: await fingerprint(ics)
  });
  return {
    version: 1,
    snapshots: [
      await makeSnapshot("demo-edition-001", "2026-09-01T08:00:00.000Z", before),
      await makeSnapshot("demo-edition-002", "2026-09-02T08:00:00.000Z", after)
    ]
  };
}
