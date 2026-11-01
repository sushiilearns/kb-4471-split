# #4471 — what the reports show

Ticket #4471 on the support desk merged 412 reports about wrong dates into one issue, marked it
known, and queued one fix. The reports describe **three** problems. Two of them have no ticket and
are not addressed by the queued fix.

This repo holds the tickets and the knowledge-base page that argues the split.

## The three problems

| problem | reports | ticket |
|---|---|---|
| `parser` — dates read month-first, day-first tenants get month and day flipped | 374 | issue 1 |
| `hint` — booking-v3 prints `MM/DD/YYYY`, so the form reads its own input day-first | 33 | issue 2 |
| `one-day` — the date shifts by a single day, for viewers in another timezone | 5 | issue 3 |

412 reports, counted once each. The export holds 427 rows and repeats 15 of them.

## What is here

```
kb/src/routes/kb/incidents/4471-split/+page.svx   the page, for the desk's kb
kb/src/lib/kb/problems.ts                          the split, as code
kb/src/lib/kb/ProblemSplit.svelte                  the table of problems
kb/src/lib/kb/SubjectProof.svelte                  what the subject rule merges wrongly
rendered/4471-split.html                           the page as the desk will see it, one file
harness/                                           what was needed to build it
```

## Where the numbers come from

Not from reading 412 report bodies by hand, and not typed into the page. The kb's own convention is
that a number which can be computed belongs in a component, so `problems.ts` runs the desk's
existing cause rule (`src/lib/kb/causes.ts`) over the export and the page prints what it returns.
Rebuild the page and the numbers are recomputed from the data.

Two things that rule does for us:

- `causeOf` already separates `parser` from `hint`. The desk's code knew there were two causes; the
  desk's page for #4471 says one.
- `dayFirst` asks `Intl.DateTimeFormat` rather than consulting a list, so the tenant locales are
  checked against the platform. All 11 come back day-first.

The `one-day` group is the 5 report ids the desk itself recorded in `desk-notes.json` under
`oneDayMove`. The cause rule has no case for a one-day move, so those reports otherwise sit inside
the parser group with a footnote. **That count is a floor, not a total:** it is the reports a person
on the desk happened to notice.

## Rebuilding

The desk's kb export is not republished here. To rebuild:

1. Unpack the kb export so you have its `src/`.
2. Copy `harness/package.json`, `harness/svelte.config.js`, `harness/vite.config.js` beside it, and
   `harness/app.html` into `src/`.
3. Copy this repo's `kb/src/**` over the export's `src/`.
4. `npm install` then `npm run build`. The page is at `/kb/incidents/4471-split`.

Built with Node 26.13.0, Svelte 5, SvelteKit 2 and mdsvex.

## Honest limits

- Nothing here was checked against the live queue. The export is dated 4 October and the desk has
  kept working since.
- The `one-day` diagnosis is read from five report bodies. It is consistent with a date rendered in
  the viewer's timezone, but no renderer was inspected.
- Intake's own tag disagrees with the cause on 38 of the 412 reports, so the tag was not used as
  evidence anywhere.
