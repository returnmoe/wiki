# return moe wiki

The source for the return moe reference wiki at `wiki.return.moe`.

The site is a static Astro project. Articles and categories are plain Markdown files under
`src/content/`; the production build adds a Pagefind search index without a backend.

## Local development

```sh
npm install
npm run dev
```

Search is generated after the Astro build, so test it from the built preview:

```sh
npm run build
npm run preview
```

Run the full local verification suite with `npm run verify`. `npm run test:e2e` builds the site,
starts a temporary local preview, and runs the browser, accessibility, and visual-regression suite.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the content model and editing workflow.

## Deployment

Cloudflare Pages is the production target. Every production build generates Pagefind search,
Cloudflare `_headers` and `_redirects`, English and Portuguese error documents, crawler artifacts,
and then validates the finished bundle against Pages limits.

Use the Astro preview for a quick built-site check, or the Cloudflare runtime for redirects,
headers, and nearest-404 behavior:

```sh
npm run build
npm run preview
npm run preview:cloudflare
```

The recommended production path is Cloudflare's Git integration: production branch `master`, build
command `npm run build`, and output directory `dist`. No runtime, Functions, secrets, or build-time
environment variables are required.

See [docs/deployment.md](docs/deployment.md) for the complete deployment and rollback runbook. See
[docs/seo-operations.md](docs/seo-operations.md) for search-engine setup and the scheduled
production crawl checks.

## License

Repository-authored code, prose, and original media are released under the Unlicense unless a
specific asset states otherwise.
