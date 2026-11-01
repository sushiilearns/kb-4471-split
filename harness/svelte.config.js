import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Build harness for the desk's kb export, which ships src/ only.
// mdsvex reads the layout off disk and then writes it into an import, so it needs an absolute path
// with forward slashes: a Windows path would put escapes in the generated import.
const url = new URL('./src/lib/layouts/runbook.svelte', import.meta.url);
const asPath = decodeURIComponent(url.pathname);
const runbook = asPath.charAt(2) === ':' ? asPath.slice(1) : asPath;

const md = mdsvex({ extensions: ['.svx'], layout: { runbook } });

// Run mdsvex on .svx only; it otherwise wraps plain components in the page layout too.
const svxOnly = {
  name: 'mdsvex-svx-only',
  markup: (args) => (args.filename?.endsWith('.svx') ? md.markup(args) : undefined)
};

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [vitePreprocess(), svxOnly],
  kit: {
    adapter: adapter({ strict: false }),
    alias: { '#lib': 'src/lib' },
    prerender: { handleHttpError: 'warn', handleMissingId: 'warn' }
  }
};
