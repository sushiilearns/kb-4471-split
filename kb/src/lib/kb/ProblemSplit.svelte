<script lang="ts">
  import { mergedInto, misTagged, problems, repeatedRows } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const merged = $derived(mergedInto(ticket));
  const rows = $derived(problems(ticket));
  const tags = (p: { taggedAs: Record<string, number> }) =>
    Object.entries(p.taggedAs)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{rows.length}</strong> {rows.length === 1 ? 'problem' : 'problems'} ·
  <strong>{rows.length}</strong> {rows.length === 1 ? 'ticket' : 'tickets'} needed, one was filed
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>what it is</th><th>tenants</th><th>channels</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each rows as p (p.key)}
      <tr>
        <td><code>{p.key}</code></td>
        <td class="n">{p.reports.length}</td>
        <td>{p.what}</td>
        <td class="n">{p.tenants}</td>
        <td class="tags">{p.channels.join(', ')}</td>
        <td class="tags">{p.firstSeen} → {p.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  Intake's own tag disagrees with the cause on <strong>{misTagged(ticket)}</strong> of {merged.length}
  reports, so the tag is not evidence of anything. Tags on record:
  {#each rows as p, i (p.key)}<code>{p.key}</code> &rarr; {tags(p)}{i < rows.length - 1 ? ' · ' : ''}{/each}
</p>

<p class="note">
  The export holds {repeatedRows()} repeated rows, counted once here.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .n { text-align: right; font-variant-numeric: tabular-nums; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
