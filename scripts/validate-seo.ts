import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { loadSeoContent } from './load-seo-content';
import {
  buildSeoManifest,
  renderHeaders,
  renderLlmsTxt,
  renderRedirects,
  renderRobotsTxt,
  renderSitemap,
  renderSitemapIndex,
  type SeoDescriptor,
} from '../src/lib/seo-manifest';

const root = process.cwd();
const dist = path.join(root, 'dist');
const manifest = buildSeoManifest(await loadSeoContent(root));
const errors: string[] = [];

function report(condition: unknown, message: string): asserts condition {
  if (!condition) errors.push(message);
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(target) : [target];
    }),
  );
  return nested.flat();
}

function outputFile(route: string): string {
  if (route.endsWith('.html')) return path.join(dist, route);
  if (route === '/') return path.join(dist, 'index.html');
  return path.join(dist, route, 'index.html');
}

function routeForHtmlFile(file: string): string {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function decodeHtml(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function attributes(source: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const match of source.matchAll(/([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    values[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3]);
  }
  return values;
}

function tags(html: string, name: string): Record<string, string>[] {
  return [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map((match) =>
    attributes(match[1]),
  );
}

function titled(html: string): string[] {
  return [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => decodeHtml(match[1]));
}

function jsonLdScripts(html: string): string[] {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type === 'application/ld+json')
    .map((match) => match[2]);
}

function jsonObject(value: string, route: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch (error) {
    errors.push(`${route}: JSON-LD is not valid JSON (${String(error)})`);
    return undefined;
  }
}

function graphNodes(data: Record<string, unknown>): Array<Record<string, unknown>> {
  return Array.isArray(data['@graph']) ? (data['@graph'] as Array<Record<string, unknown>>) : [];
}

function nodeWithType(nodes: Array<Record<string, unknown>>, type: string) {
  return nodes.find((node) => node['@type'] === type);
}

function keysBelow(value: unknown, keys = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) keysBelow(item, keys);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      keys.add(key);
      keysBelow(item, keys);
    }
  }
  return keys;
}

function robotsAllows(source: string, userAgent: string, pathname: string): boolean {
  const groups: Array<{
    userAgents: string[];
    rules: Array<{ directive: 'allow' | 'disallow'; value: string }>;
  }> = [];
  let current = {
    userAgents: [] as string[],
    rules: [] as Array<{ directive: 'allow' | 'disallow'; value: string }>,
  };
  for (const rawLine of source.split('\n')) {
    const line = rawLine.split('#', 1)[0].trim();
    if (!line.includes(':')) continue;
    const [rawDirective, ...valueParts] = line.split(':');
    const directive = rawDirective.toLowerCase();
    const value = valueParts.join(':').trim();
    if (directive === 'user-agent') {
      if (current.rules.length) {
        groups.push(current);
        current = { userAgents: [], rules: [] };
      }
      current.userAgents.push(value.toLowerCase());
    } else if ((directive === 'allow' || directive === 'disallow') && current.userAgents.length) {
      current.rules.push({ directive, value });
    }
  }
  if (current.userAgents.length) groups.push(current);

  const normalizedAgent = userAgent.toLowerCase();
  const matching = groups.filter((group) =>
    group.userAgents.some((agent) => agent === '*' || normalizedAgent.includes(agent)),
  );
  const rules = matching.flatMap((group) => group.rules).filter((rule) => rule.value !== '');
  const applicable = rules
    .filter((rule) => pathname.startsWith(rule.value))
    .sort((a, b) => b.value.length - a.value.length || (a.directive === 'allow' ? -1 : 1));
  return applicable[0]?.directive !== 'disallow';
}

function validateStructuredData(page: SeoDescriptor, data: Record<string, unknown>): void {
  const source = page.path;
  report(
    data['@context'] === 'https://schema.org',
    `${source}: JSON-LD context must be Schema.org`,
  );
  const nodes = graphNodes(data);
  report(nodes.length >= 3, `${source}: JSON-LD @graph is missing required nodes`);
  report(Boolean(nodeWithType(nodes, 'Organization')), `${source}: Organization node is missing`);
  report(Boolean(nodeWithType(nodes, 'WebSite')), `${source}: WebSite node is missing`);

  const expectedPageType =
    page.pageKind === 'article'
      ? 'Article'
      : page.pageKind === 'collection'
        ? 'CollectionPage'
        : 'WebPage';
  const pageNode = nodeWithType(nodes, expectedPageType);
  report(Boolean(pageNode), `${source}: ${expectedPageType} node is missing`);
  if (pageNode) {
    report(pageNode['@id'] === `${page.canonicalUrl}#webpage`, `${source}: unstable page @id`);
    report(pageNode.url === page.canonicalUrl, `${source}: structured page URL is not canonical`);
    report(pageNode.description === page.description, `${source}: structured description drifted`);
  }

  const breadcrumb = nodeWithType(nodes, 'BreadcrumbList');
  const expectsBreadcrumb = page.indexability === 'index' && page.pageKind !== 'home';
  report(
    Boolean(breadcrumb) === expectsBreadcrumb,
    `${source}: BreadcrumbList presence does not match page policy`,
  );
  if (breadcrumb) {
    report(
      breadcrumb['@id'] === `${page.canonicalUrl}#breadcrumb`,
      `${source}: unstable breadcrumb @id`,
    );
  }

  const itemList = nodeWithType(nodes, 'ItemList');
  report(
    Boolean(itemList) === Boolean(page.collectionKind),
    `${source}: ItemList presence does not match collection policy`,
  );
  if (itemList) {
    report(itemList['@id'] === `${page.canonicalUrl}#itemlist`, `${source}: unstable ItemList @id`);
    report(
      itemList.numberOfItems === (page.listItems?.length ?? 0),
      `${source}: ItemList count drifted from the manifest`,
    );
  }

  if (page.subject) {
    const subject = nodes.find((node) => node['@id'] === `${page.canonicalUrl}#entity`);
    report(Boolean(subject), `${source}: ${page.subject.type} mainEntity is missing`);
    if (subject) {
      report(subject['@id'] === `${page.canonicalUrl}#entity`, `${source}: unstable entity @id`);
      report(subject['@type'] === page.subject.type, `${source}: mainEntity type drifted`);
      report(subject.name === page.subject.name, `${source}: entity name drifted`);
      report(subject.description === page.subject.description, `${source}: entity summary drifted`);
      const allowedSubjectKeys = new Set([
        '@type',
        '@id',
        'name',
        'description',
        'url',
        'mainEntityOfPage',
        'alternateName',
        'image',
        'sameAs',
      ]);
      for (const key of Object.keys(subject)) {
        report(allowedSubjectKeys.has(key), `${source}: unapproved entity property ${key}`);
      }
    }
  }

  const allKeys = keysBelow(data);
  report(!allKeys.has('author'), `${source}: fabricated author data is forbidden`);
  report(
    allKeys.has('datePublished') === Boolean(page.publishedAt),
    `${source}: datePublished does not match trusted manifest data`,
  );
  report(
    allKeys.has('dateModified') === Boolean(page.modifiedAt),
    `${source}: dateModified does not match trusted manifest data`,
  );
  const serialized = JSON.stringify(data);
  report(!serialized.includes('translatedFromRevision'), `${source}: translation revision leaked`);
  report(!serialized.includes('"revision"'), `${source}: editorial revision leaked`);
  for (const url of serialized.match(/https?:\\?\/\\?\/[^"\\\s]+/g) ?? []) {
    report(url.startsWith('https:'), `${source}: non-HTTPS structured URL ${url}`);
  }
}

const actualHtmlFiles = (await filesBelow(dist)).filter((file) => file.endsWith('.html'));
const actualRoutes = new Set(actualHtmlFiles.map(routeForHtmlFile));
const expectedRoutes = new Set(manifest.pages.map((page) => page.path));
for (const route of expectedRoutes)
  report(actualRoutes.has(route), `${route}: generated HTML is missing`);
for (const route of actualRoutes)
  report(expectedRoutes.has(route), `${route}: unexpected HTML route exists`);
report(!actualRoutes.has('/pt/404/'), 'Portuguese 404 must not be a public 200 route');

const titlesByLocale = new Map<string, string>();
const descriptionsByLocale = new Map<string, string>();
for (const page of manifest.pages) {
  const file = outputFile(page.path);
  if (!(await exists(file))) continue;
  const html = await readFile(file, 'utf8');
  const source = page.path;

  const titleValues = titled(html);
  report(titleValues.length === 1, `${source}: expected exactly one title`);
  report(titleValues[0] === page.documentTitle, `${source}: title does not match the manifest`);

  const descriptions = tags(html, 'meta').filter((tag) => tag.name === 'description');
  report(descriptions.length === 1, `${source}: expected exactly one meta description`);
  report(
    descriptions[0]?.content === page.description,
    `${source}: description does not match the manifest`,
  );

  const robots = tags(html, 'meta').filter((tag) => tag.name === 'robots');
  report(robots.length === 1, `${source}: expected exactly one robots directive`);
  report(robots[0]?.content === page.robots, `${source}: robots directive does not match policy`);

  const canonicals = tags(html, 'link').filter((tag) => tag.rel === 'canonical');
  report(
    canonicals.length === (page.canonicalUrl ? 1 : 0),
    `${source}: canonical presence does not match policy`,
  );
  if (page.canonicalUrl) {
    report(
      canonicals[0]?.href === page.canonicalUrl,
      `${source}: canonical is not self-referential`,
    );
    const canonical = new URL(page.canonicalUrl);
    report(canonical.protocol === 'https:', `${source}: canonical must use HTTPS`);
    report(
      canonical.search === '' && canonical.hash === '',
      `${source}: canonical has query or hash`,
    );
    report(
      canonical.pathname === '/' || canonical.pathname.endsWith('/'),
      `${source}: canonical is not trailing-slash normalized`,
    );
  }

  const hreflang = tags(html, 'link').filter(
    (tag) => tag.rel === 'alternate' && Boolean(tag.hreflang),
  );
  const expectedAlternates = [
    ...page.alternates.map((alternate) => [alternate.locale, alternate.url] as const),
    ...(page.xDefaultUrl ? ([['x-default', page.xDefaultUrl]] as const) : []),
  ];
  report(
    hreflang.length === expectedAlternates.length,
    `${source}: hreflang count does not match reciprocal manifest cluster`,
  );
  for (const [locale, url] of expectedAlternates) {
    report(
      hreflang.some((tag) => tag.hreflang === locale && tag.href === url),
      `${source}: missing hreflang ${locale} -> ${url}`,
    );
  }

  const scripts = jsonLdScripts(html);
  const expectsGraph = page.indexability !== 'error';
  report(
    scripts.length === (expectsGraph ? 1 : 0),
    `${source}: JSON-LD graph presence does not match policy`,
  );
  if (scripts[0]) {
    const data = jsonObject(scripts[0], source);
    if (data) validateStructuredData(page, data);
  }

  const titleKey = `${page.locale}\0${page.documentTitle}`;
  const existingTitle = titlesByLocale.get(titleKey);
  report(!existingTitle, `${source}: duplicate locale title also used by ${existingTitle}`);
  titlesByLocale.set(titleKey, source);
  const descriptionKey = `${page.locale}\0${page.description}`;
  const existingDescription = descriptionsByLocale.get(descriptionKey);
  report(
    !existingDescription,
    `${source}: duplicate locale description also used by ${existingDescription}`,
  );
  descriptionsByLocale.set(descriptionKey, source);
}

for (const page of manifest.pages) {
  for (const alternate of page.alternates) {
    const counterpart = manifest.pages.find(
      (candidate) => candidate.canonicalUrl === alternate.url,
    );
    report(Boolean(counterpart), `${page.path}: hreflang target ${alternate.url} is missing`);
    report(counterpart?.indexability === 'index', `${page.path}: hreflang target is not indexable`);
    report(
      counterpart?.alternates.some((alternatePage) => alternatePage.url === page.canonicalUrl),
      `${page.path}: hreflang target is not reciprocal`,
    );
  }
  if (page.alternates.length) {
    report(
      page.xDefaultUrl === page.alternates.find((alternate) => alternate.locale === 'en')?.url,
      `${page.path}: x-default is not English`,
    );
  }
}

const [sitemap, sitemapIndex, robots, llms, redirects, headers] = await Promise.all([
  readFile(path.join(dist, 'sitemap-0.xml'), 'utf8'),
  readFile(path.join(dist, 'sitemap-index.xml'), 'utf8'),
  readFile(path.join(dist, 'robots.txt'), 'utf8'),
  readFile(path.join(dist, 'llms.txt'), 'utf8'),
  readFile(path.join(dist, '_redirects'), 'utf8'),
  readFile(path.join(dist, '_headers'), 'utf8'),
]);

report(sitemap === renderSitemap(manifest), 'sitemap-0.xml drifted from the SEO manifest');
report(
  sitemapIndex === renderSitemapIndex(manifest),
  'sitemap-index.xml drifted from the SEO manifest',
);
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const expectedSitemapLocations = manifest.pages
  .filter((page) => page.indexability === 'index')
  .map((page) => page.canonicalUrl as string);
report(
  new Set(sitemapLocations).size === sitemapLocations.length,
  'sitemap contains duplicate canonical URLs',
);
report(
  sitemapLocations.length === expectedSitemapLocations.length &&
    expectedSitemapLocations.every((url) => sitemapLocations.includes(url)),
  'sitemap does not have exact parity with the indexable manifest',
);
report(!sitemap.includes('<lastmod>'), 'sitemap must not fabricate build-time lastmod values');
report(!sitemap.includes('/llms.txt'), 'llms.txt must not be in the sitemap');

report(robots === renderRobotsTxt(manifest), 'robots.txt drifted from crawler policy');
report(/^User-agent: \*$/m.test(robots), 'robots.txt is missing the wildcard user-agent');
report(/^Allow: \/$/m.test(robots), 'robots.txt is not allow-all');
report(!/^Disallow:/m.test(robots), 'robots.txt must not disallow crawlable noindex pages');
report(
  /^Content-Signal: search=yes, ai-input=yes, ai-train=yes$/m.test(robots),
  'robots.txt Content Signals are incomplete',
);
report(
  robots.includes(`Sitemap: ${manifest.siteUrl}/sitemap-index.xml`),
  'robots.txt sitemap declaration is missing',
);
for (const userAgent of [
  'Googlebot',
  'bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'PerplexityBot',
]) {
  for (const pathname of ['/', '/search/?q=seo', '/pt/', '/llms.txt']) {
    report(
      robotsAllows(robots, userAgent, pathname),
      `robots.txt blocks ${userAgent} from ${pathname}`,
    );
  }
}

report(llms === renderLlmsTxt(manifest), 'llms.txt drifted from the SEO manifest');
const internalLlmsUrls = llms.match(/https:\/\/wiki\.return\.moe\/[^\s)]+/g) ?? [];
const allowedLlmsUrls = new Set([
  ...manifest.pages
    .filter((page) => page.indexability === 'index')
    .map((page) => page.canonicalUrl as string),
  `${manifest.siteUrl}/sitemap-index.xml`,
]);
for (const url of internalLlmsUrls) {
  report(allowedLlmsUrls.has(url), `llms.txt links to a non-canonical or nonindex URL: ${url}`);
}
for (const page of manifest.pages.filter((candidate) => candidate.pageKind === 'article')) {
  report(llms.includes(page.canonicalUrl as string), `llms.txt omits article ${page.path}`);
  report(llms.includes(page.description), `llms.txt omits the summary for ${page.path}`);
}

report(redirects === renderRedirects(manifest), '_redirects drifted from the SEO manifest');
const redirectLines = redirects.trim().split('\n').filter(Boolean);
const redirectSources = new Set<string>();
const canonicalPaths = new Set(
  manifest.pages.flatMap((page) => (page.canonicalPath ? [page.canonicalPath] : [])),
);
for (const line of redirectLines) {
  const [source, destination, status, ...extra] = line.split(/\s+/);
  report(extra.length === 0, `_redirects has an invalid rule: ${line}`);
  report(status === '301', `_redirects rule is not permanent: ${line}`);
  report(!redirectSources.has(source), `_redirects has duplicate source ${source}`);
  report(source !== destination, `_redirects loop at ${source}`);
  report(canonicalPaths.has(destination), `_redirects target is not canonical: ${destination}`);
  redirectSources.add(source);
}
for (const line of redirectLines) {
  const [, destination] = line.split(/\s+/);
  report(!redirectSources.has(destination), `_redirects contains a chain through ${destination}`);
}
for (const page of manifest.pages) {
  for (const alias of page.redirectAliases) {
    report(!(await exists(outputFile(alias))), `alias HTML still exists at ${alias}`);
  }
}

report(headers === renderHeaders(), '_headers drifted from deployment policy');
report(
  headers.includes('https://:project.pages.dev/*') &&
    headers.includes('https://:version.:project.pages.dev/*'),
  '_headers does not noindex both production and preview pages.dev hosts',
);
report(
  /\/llms\.txt[\s\S]*?X-Robots-Tag: noindex/.test(headers),
  '_headers does not mark llms.txt noindex',
);
const globalHeaders = headers.split('\n\n')[0];
report(
  !globalHeaders.includes('X-Robots-Tag'),
  'global custom-domain headers must not accidentally noindex production',
);

if (errors.length) {
  console.error(
    `SEO validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`,
  );
  for (const error of [...new Set(errors)].sort()) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${manifest.pages.length} SEO descriptors, ${expectedSitemapLocations.length} sitemap URLs, and ${manifest.redirects.length} redirects.`,
  );
}
