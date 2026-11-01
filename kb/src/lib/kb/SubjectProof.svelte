<script lang="ts">
  // Decision 0001 merges on the subject line alone. These are the desk's own argued pairs, run
  // through the desk's own cause rule: where the two disagree, merging on subject merged two bugs.
  import { DEDUPE_CASES } from '#lib/kb/dedupe-cases';
  import { causeOf } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  type Side = (typeof DEDUPE_CASES)[number]['a'];
  const cause = (s: Side) => causeOf(s, tenantOf(s));
  const rows = DEDUPE_CASES.map((c) => ({
    why: c.why,
    sameSubject: c.a.subject === c.b.subject,
    a: cause(c.a),
    b: cause(c.b),
    sameCause: cause(c.a) !== null && cause(c.a) === cause(c.b)
  }));
  const wrong = rows.filter((r) => r.sameSubject && !r.sameCause);
</script>

<table>
  <thead><tr><th>pair</th><th>same subject</th><th>cause A</th><th>cause B</th><th>subject rule says</th></tr></thead>
  <tbody>
    {#each rows as r (r.why)}
      <tr class:wrong={r.sameSubject && !r.sameCause}>
        <td>{r.why}</td>
        <td>{r.sameSubject ? 'yes' : 'no'}</td>
        <td><code>{r.a ?? 'none'}</code></td>
        <td><code>{r.b ?? 'none'}</code></td>
        <td>{r.sameSubject ? 'merge' : 'keep apart'}{r.sameSubject && !r.sameCause ? ' — wrongly' : ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  {wrong.length} of {rows.length} pairs the desk argued about share a subject but do not share a
  cause. On those, the subject rule merges two bugs into one ticket.
</p>

<style>
  .note { color: var(--muted); font-size: 0.85em; }
  .wrong td { background: var(--warn-bg); }
  .wrong td:last-child { color: var(--warn); font-weight: 600; }
</style>
