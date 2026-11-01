// The problems inside one ticket. Pages explain them; this file is what runs.
//
// The desk's cause rule (causes.ts) already knows two: `parser` and `hint`. It has no case for a
// date that moves by a single day, so those reports land under whichever cause their tenant has.
// The desk noticed them anyway and listed them in desk-notes.json. Here they are their own
// problem, because a ticket is a problem and that is a different problem.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export type ProblemKey = 'parser' | 'hint' | 'one-day' | 'unplaced';

export type Problem = {
  key: ProblemKey;
  what: string;
  reports: Report[];
  tenants: number;
  channels: string[];
  firstSeen: string;
  lastSeen: string;
  taggedAs: Record<string, number>;
};

const WHAT: Record<ProblemKey, string> = {
  parser: 'the shared parser reads every date month-first; a day-first tenant gets month and day flipped',
  hint: 'booking-v3 prints MM/DD/YYYY under its date field, so what people type there is read day-first',
  'one-day': 'the date moves by one day, not by a month',
  unplaced: 'no cause: no tenant on file, or a tenant who does not write the day first'
};

export function mergedInto(ticket: number): Report[] {
  return uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
}

// How many rows the export repeats. One id, one report: the difference is the export's, not the desk's.
export function repeatedRows(): number {
  return (reports as Report[]).length - uniqueById(reports as Report[]).length;
}

function keyOf(r: Report): ProblemKey {
  if ((notes.oneDayMove as readonly string[]).includes(r.id)) return 'one-day';
  return causeOf(r, tenantOf(r)) ?? 'unplaced';
}

export function problems(ticket: number): Problem[] {
  const by = new Map<ProblemKey, Report[]>();
  for (const r of mergedInto(ticket)) by.set(keyOf(r), [...(by.get(keyOf(r)) ?? []), r]);
  return [...by.entries()]
    .map(([key, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        key,
        what: WHAT[key],
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        channels: [...new Set(rs.map((r) => r.channel))].sort(),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        taggedAs: rs.reduce<Record<string, number>>(
          (n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }),
          {}
        )
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}

// Intake tags a report from the reporter's browser, before anyone knows the tenant. How often that
// guess disagrees with the cause the tenant implies.
export function misTagged(ticket: number): number {
  return mergedInto(ticket).filter((r) => {
    const c = causeOf(r, tenantOf(r));
    return c !== null && r.meta.intakeTag !== c;
  }).length;
}
