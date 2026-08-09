# Cloudflare Pages deployment

The wiki is a fully static Astro site. Cloudflare Pages only receives the finished `dist/` bundle;
there are no Pages Functions, server-rendered routes, runtime bindings, secrets, or required
environment variables.

## Repository deployment contract

- `.node-version` pins Node.js 24 for local, Cloudflare, and GitHub builds.
- `package-lock.json` makes `npm ci` reproducible.
- `wrangler.jsonc` records the Pages project name and output directory for local emulation and
  intentional direct uploads.
- `npm run build` type-checks and validates content, builds Astro, generates deployment metadata,
  validates SEO and internal links, creates the Pagefind index, and checks the final artifact
  against Cloudflare Pages limits.
- `.github/workflows/ci.yml` runs `npm run verify` plus the browser, accessibility, and visual suite
  for pull requests and changes to `master`.

The build fails before upload if a required error page or control file is missing, a file exceeds 25
MiB, the Free-plan file limit is exceeded, or `_headers` or `_redirects` outgrows the Pages rule
limits.

## Recommended setup: Git integration

Create a Pages project from the `returnmoe/wiki` GitHub repository and use these settings:

| Setting                | Value            |
| ---------------------- | ---------------- |
| Project name           | `returnmoe-wiki` |
| Framework preset       | Astro            |
| Production branch      | `master`         |
| Build system           | Version 3        |
| Build command          | `npm run build`  |
| Build output directory | `dist`           |
| Root directory         | Repository root  |

Cloudflare installs dependencies before invoking the build command, so do not prefix the command
with a second `npm ci`. The checked-in `.node-version` selects Node.js 24. Leave build variables,
runtime variables, bindings, and Functions unset.

After the first successful deployment:

1. Add `wiki.return.moe` under the Pages project's custom domains.
2. Confirm the custom domain reaches the production deployment over HTTPS.
3. Keep automatic production deployments enabled for `master` and preview deployments enabled for
   pull-request branches.
4. Apply the account-level crawler and analytics settings in
   [SEO deployment and operations](seo-operations.md).

Cloudflare marks preview deployments `noindex` by default. The generated `_headers` also marks both
the project-level and branch-level `pages.dev` hosts `noindex`, preventing the permanent
`returnmoe-wiki.pages.dev` alias from competing with the custom canonical domain.

## Preview and release flow

For a normal change:

1. Run `npm run verify` locally.
2. Open a pull request and review the GitHub CI result and the Cloudflare preview.
3. Merge to `master`; the Git-integrated Pages project builds and promotes that commit.
4. Run the production smoke check after the deployment is live.

```sh
npm run smoke:production
```

The smoke check exercises TLS and the production origin, crawler artifacts, all canonical routes,
one-hop redirects, localized 404 responses, crawler user agents, and the `pages.dev` noindex policy.

## Local Cloudflare preview

For fast page rendering, use `npm run preview`. To exercise the finished bundle through Cloudflare's
local Pages runtime, including `_headers`, `_redirects`, and nearest-404 handling, use:

```sh
npm run preview:cloudflare
```

Both commands serve an already built site; the Cloudflare command rebuilds first so it cannot serve
a stale bundle.

## Intentional direct upload

Git integration is the normal deployment path. Wrangler is available as a pinned fallback for a
manual deployment or a project that intentionally uses Direct Upload:

```sh
npx wrangler login
npm run deploy:cloudflare -- --branch master
```

For a non-production upload, pass a non-production branch name instead. The deployment script always
builds and validates before uploading. When `wrangler.jsonc` is deployed, it becomes the Pages
configuration source of truth; reconcile it first if an existing project has dashboard-managed
bindings or variables.

## Rollback and post-deployment checks

If a production deployment is unhealthy, use the Pages deployment history to roll back to the last
known-good production deployment, then fix forward in `master`.

For every first deployment or domain change, confirm:

- `https://wiki.return.moe/` and a representative article return `200`.
- An unknown root path returns the English `404.html` with status `404`.
- An unknown `/pt/` path returns `pt/404.html` with status `404`.
- `/search/` finds both English and Portuguese content.
- `/robots.txt`, `/sitemap-index.xml`, and `/llms.txt` have the expected content types.
- `https://returnmoe-wiki.pages.dev/` returns `X-Robots-Tag: noindex`.
- A legacy article alias makes one permanent redirect directly to its canonical trailing-slash URL.

The scheduled production monitor repeats the HTTP-level crawler checks daily. It does not replace
the build checks or the first-release inspection.

## References

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages Astro build settings](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare Pages build image and version pins](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages Wrangler configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages serving and nearest-404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
