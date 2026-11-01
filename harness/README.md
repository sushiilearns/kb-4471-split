# Build harness

The kb export ships `src/` only: no `package.json`, no Svelte or Vite config. These are the files
added to build it, and nothing in them changes the desk's own code.

- `package.json` — Svelte 5, SvelteKit 2, mdsvex, adapter-static.
- `svelte.config.js` — maps the `#lib` alias the export's imports use, registers `.svx`, and points
  mdsvex at the export's `runbook` layout. mdsvex reads that layout off disk and writes it into an
  import, so it needs an absolute path with forward slashes. mdsvex is also fenced to `.svx` files
  only; left loose it wraps plain components in the page layout too.
- `vite.config.js`, `app.html` — the minimum SvelteKit needs.

See the root README for the rebuild steps.
