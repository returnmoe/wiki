# SEO deployment and operations

The repository build produces a static Cloudflare Pages bundle. Account-level controls cannot be
stored in the bundle and must be applied once in the Cloudflare, Google, and Bing consoles.

See [Cloudflare Pages deployment](deployment.md) for project creation, build settings, local Pages
preview, direct-upload fallback, release checks, and rollback.

## Cloudflare Pages project

Create the `returnmoe-wiki` Pages project from `returnmoe/wiki` with these settings:

- Production branch: `master`
- Build system: Version 3
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 24, selected by `.node-version`
- Functions: none
- Environment variables and bindings: none
- Custom domain: `wiki.return.moe`

Keep Always Use HTTPS enabled for the `return.moe` zone. The build writes `_redirects` and `_headers`
directly to `dist`; Cloudflare Pages applies those files to static responses. The header rules mark
both the production and preview `pages.dev` hosts as `noindex` without applying that directive to
the custom production domain.

In the Cloudflare dashboard:

1. Disable Managed `robots.txt`. It prepends Cloudflare policy to the repository-owned file when it
   is enabled.
2. In AI Crawl Control, set every crawler action to Allow and leave robots enforcement disabled.
3. Disable Block AI Bots. Review WAF and Bot Fight rules for verified-crawler challenges.
4. Enable Crawler Hints.
5. Enable Cloudflare Web Analytics for `wiki.return.moe` with privacy-first defaults.

The repository intentionally does not add a Worker, Pages Function, language redirect, or paid
Markdown-for-Agents content negotiation.

## Search engines

Create a Google Search Console Domain property for `return.moe`, publish its DNS verification TXT
record, and submit `https://wiki.return.moe/sitemap-index.xml`. Use URL Inspection on the homepage,
an article, and a category after the first production deployment.

Add `https://wiki.return.moe/` to Bing Webmaster Tools, verify ownership, and submit the same sitemap
index.

## Production checks

`npm run smoke:production` verifies DNS/TLS connectivity, crawler artifacts, canonical 200s,
one-hop 301s, localized 404s, `pages.dev` noindex headers, and normal responses for traditional and
AI crawler user agents. The scheduled GitHub Actions workflow runs it daily.

Set the repository variable `SEO_SMOKE_PAGES_URLS` to a comma-separated production and preview pair,
for example `https://returnmoe-wiki.pages.dev,https://preview-id.returnmoe-wiki.pages.dev`. Set
`SEO_SMOKE_REQUIRE_PREVIEW=1` once that preview URL is stable enough to monitor.

Review these dashboard signals weekly until indexing stabilizes, then monthly:

- Google Search Console page indexing, crawl stats, submitted-sitemap status, and enhancements
- Bing Webmaster Tools indexing and crawl errors
- Cloudflare Web Analytics traffic and top entry pages
- AI Crawl Control traffic, user agents, requested paths, and unsuccessful responses
- Security Events filtered for verified crawlers and HTTP 403 or 429 responses

Search coverage and AI citations are observations, not build acceptance criteria. The blocking
acceptance criteria are the manifest, build validator, and production HTTP smoke test.

## References

- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare Pages serving and nearest 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [Cloudflare AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/)
- [Cloudflare Web Analytics for Pages](https://developers.cloudflare.com/pages/how-to/web-analytics/)
- [Cloudflare Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Cloudflare SEO and Crawler Hints](https://developers.cloudflare.com/fundamentals/performance/improve-seo/)
- [Google Search Console Domain properties](https://support.google.com/webmasters/answer/34592)
- [Google Search Console Sitemaps report](https://support.google.com/webmasters/answer/7451001)
- [Bing site verification](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)
- [Bing sitemap submission](https://www.bing.com/webmasters/help/Sitemaps-3b5cf6ed)
