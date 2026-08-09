import { loadSeoContent } from './load-seo-content';
import {
  buildSeoManifest,
  renderLlmsTxt,
  renderRobotsTxt,
  renderSitemap,
  renderSitemapIndex,
} from '../src/lib/seo-manifest';

const manifest = buildSeoManifest(await loadSeoContent());
const baseUrl = new URL(process.env.SEO_SMOKE_BASE_URL ?? manifest.siteUrl);
const errors: string[] = [];

function report(condition: unknown, message: string): asserts condition {
  if (!condition) errors.push(message);
}

async function request(pathOrUrl: string, init: RequestInit = {}): Promise<Response | undefined> {
  const url = new URL(pathOrUrl, baseUrl);
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(20_000),
      headers: {
        Accept: '*/*',
        ...(init.headers ?? {}),
      },
    });
  } catch (error) {
    errors.push(`${url}: request failed (${String(error)})`);
    return undefined;
  }
}

function contentType(response: Response): string {
  return response.headers.get('content-type')?.toLowerCase() ?? '';
}

report(baseUrl.protocol === 'https:', 'production smoke target must use HTTPS');

const rootResponse = await request('/');
if (!rootResponse) {
  console.error('Production SEO smoke test could not reach the production origin:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
report(
  rootResponse?.status === 200,
  `DNS/TLS/root check returned ${rootResponse?.status ?? 'no response'}`,
);

const artifactChecks = [
  {
    path: '/robots.txt',
    type: 'text/plain',
    expected: renderRobotsTxt(manifest),
  },
  {
    path: '/sitemap-index.xml',
    type: 'xml',
    expected: renderSitemapIndex(manifest),
  },
  {
    path: '/sitemap-0.xml',
    type: 'xml',
    expected: renderSitemap(manifest),
  },
  {
    path: '/llms.txt',
    type: 'text/plain',
    expected: renderLlmsTxt(manifest),
  },
];

for (const artifact of artifactChecks) {
  const response = await request(artifact.path);
  report(response?.status === 200, `${artifact.path}: expected 200, received ${response?.status}`);
  if (!response) continue;
  report(
    contentType(response).includes(artifact.type),
    `${artifact.path}: unexpected Content-Type ${contentType(response)}`,
  );
  const body = await response.text();
  report(body === artifact.expected, `${artifact.path}: production content drifted from source`);
  if (artifact.path === '/llms.txt') {
    report(
      response.headers.get('x-robots-tag')?.includes('noindex'),
      '/llms.txt: X-Robots-Tag noindex is missing',
    );
  }
}

for (const page of manifest.pages.filter((candidate) => candidate.canonicalPath)) {
  const response = await request(page.canonicalPath as string);
  report(
    response?.status === 200,
    `${page.canonicalPath}: canonical route returned ${response?.status ?? 'no response'}`,
  );
  if (!response) continue;
  const html = await response.text();
  report(
    html.includes(`<link rel="canonical" href="${page.canonicalUrl}">`),
    `${page.canonicalPath}: production self-canonical is missing`,
  );
}

const checkedDestinations = new Set<string>();
for (const redirect of manifest.redirects) {
  const response = await request(redirect.source, { redirect: 'manual' });
  report(
    response?.status === 301,
    `${redirect.source}: expected one-hop 301, received ${response?.status ?? 'no response'}`,
  );
  if (!response) continue;
  const location = response.headers.get('location');
  report(Boolean(location), `${redirect.source}: redirect Location is missing`);
  if (location) {
    const destination = new URL(location, baseUrl);
    report(
      destination.pathname === redirect.destination,
      `${redirect.source}: redirected to ${destination.pathname}, expected ${redirect.destination}`,
    );
  }
  if (!checkedDestinations.has(redirect.destination)) {
    checkedDestinations.add(redirect.destination);
    const destinationResponse = await request(redirect.destination, { redirect: 'manual' });
    report(
      destinationResponse?.status === 200,
      `${redirect.destination}: redirect target is not a terminal 200`,
    );
  }
}

for (const [missingPath, language] of [
  ['/seo-smoke-missing-page/', 'en'],
  ['/pt/seo-smoke-pagina-ausente/', 'pt-BR'],
] as const) {
  const response = await request(missingPath, { redirect: 'manual' });
  report(response?.status === 404, `${missingPath}: expected 404, received ${response?.status}`);
  if (response) {
    const html = await response.text();
    report(
      html.includes(`<html lang="${language}"`),
      `${missingPath}: nearest localized error document was not served`,
    );
  }
}

const crawlerUserAgents = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
  'OAI-SearchBot/1.0; +https://openai.com/searchbot',
  'ClaudeBot/1.0; +https://www.anthropic.com/bot',
  'PerplexityBot/1.0; +https://perplexity.ai/perplexitybot',
];
const crawlerPath =
  manifest.pages.find((page) => page.pageKind === 'article' && page.locale === 'en')?.path ?? '/';
for (const userAgent of crawlerUserAgents) {
  const response = await request(crawlerPath, { headers: { 'User-Agent': userAgent } });
  report(
    response?.status === 200,
    `${userAgent.split('/')[0]} crawler received ${response?.status ?? 'no response'}`,
  );
  report(
    response?.headers.get('cf-mitigated') !== 'challenge',
    `${userAgent.split('/')[0]} crawler received a Cloudflare challenge`,
  );
}

const configuredPagesUrls = process.env.SEO_SMOKE_PAGES_URLS?.split(',')
  .map((url) => url.trim())
  .filter(Boolean);
const pagesUrls = configuredPagesUrls?.length
  ? configuredPagesUrls
  : ['https://returnmoe-wiki.pages.dev'];
for (const pagesUrl of pagesUrls) {
  const response = await request(pagesUrl);
  report(response?.status === 200, `${pagesUrl}: pages.dev root did not return 200`);
  report(
    response?.headers.get('x-robots-tag')?.includes('noindex'),
    `${pagesUrl}: pages.dev X-Robots-Tag noindex is missing`,
  );
}
if (process.env.SEO_SMOKE_REQUIRE_PREVIEW === '1') {
  report(pagesUrls.length >= 2, 'a preview pages.dev URL is required but was not configured');
}

if (errors.length) {
  console.error(
    `Production SEO smoke test failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`,
  );
  for (const error of [...new Set(errors)].sort()) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Production SEO smoke test passed for ${baseUrl.origin}, ${manifest.redirects.length} redirects, and ${crawlerUserAgents.length} crawler user agents.`,
  );
}
