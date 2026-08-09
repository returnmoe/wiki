import {
  articleUrl,
  categoryUrl,
  homeUrl,
  legacyArticleUrl,
  pageUrl,
  REPOSITORY_URL,
  SITE_URL,
  type ArticleKind,
  type WikiLocale,
} from './config';
import { kindLabels, languages, t } from './i18n';

export type PageKind = 'home' | 'article' | 'collection' | 'utility' | 'error';
export type Indexability = 'index' | 'noindex' | 'error';
export type SubjectType =
  | 'Person'
  | 'Organization'
  | 'Corporation'
  | 'GovernmentOrganization'
  | 'SoftwareApplication'
  | 'DefinedTerm'
  | 'Place'
  | 'Event'
  | 'CreativeWork'
  | 'Thing';

export interface SeoImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface SeoAlternate {
  locale: WikiLocale;
  path: string;
  url: string;
}

export interface SeoListItem {
  name: string;
  url: string;
}

export interface SeoSubject {
  type: SubjectType;
  name: string;
  description: string;
  aliases: string[];
  imageUrl?: string;
  sameAs: string[];
}

export interface SeoDescriptor {
  key: string;
  localizationKey: string;
  path: string;
  locale: WikiLocale;
  pageKind: PageKind;
  collectionKind?: 'archive' | 'category';
  title: string;
  documentTitle: string;
  description: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  indexability: Indexability;
  robots: string;
  image: SeoImage;
  ogType: 'website' | 'article';
  localizedCounterpartPath?: string;
  alternates: SeoAlternate[];
  xDefaultUrl?: string;
  kindTag?: string;
  categoryTags: string[];
  listItems?: SeoListItem[];
  subject?: SeoSubject;
  redirectAliases: string[];
  publishedAt?: string;
  modifiedAt?: string;
}

export interface SeoRedirect {
  source: string;
  destination: string;
  status: 301;
  kind: 'alias' | 'locale-prefix' | 'canonical-slash';
}

export interface SeoManifest {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  repositoryUrl: string;
  license: string;
  pages: SeoDescriptor[];
  redirects: SeoRedirect[];
}

export interface SeoArticleInput {
  id: string;
  title: string;
  summary: string;
  locale: WikiLocale;
  kind: ArticleKind;
  categories: string[];
  aliases?: string[];
  redirects?: string[];
  entityImagePath?: string;
  officialUrls?: string[];
  publishedAt?: string;
  modifiedAt?: string;
}

export interface SeoCategoryInput {
  id: string;
  title: string;
  summary: string;
  locale: WikiLocale;
  order?: number;
}

export interface SeoManifestInput {
  articles: SeoArticleInput[];
  categories: SeoCategoryInput[];
}

type JsonLdNode = Record<string, unknown>;

const SITE_NAME = 'return moe wiki';
const INDEX_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex,follow';

const SUBJECT_TYPES: Record<ArticleKind, SubjectType> = {
  character: 'Person',
  person: 'Person',
  place: 'Place',
  organization: 'Organization',
  company: 'Corporation',
  government: 'GovernmentOrganization',
  project: 'CreativeWork',
  software: 'SoftwareApplication',
  event: 'Event',
  work: 'CreativeWork',
  technology: 'DefinedTerm',
  concept: 'DefinedTerm',
  other: 'Thing',
};

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function socialImage(locale: WikiLocale): SeoImage {
  return {
    url: absoluteUrl('/og-image.png'),
    alt:
      locale === 'pt-BR'
        ? 'Cartão de compartilhamento da return moe wiki'
        : 'return moe wiki social sharing card',
    width: 1200,
    height: 630,
    mimeType: 'image/png',
  };
}

function pageDocumentTitle(
  title: string,
  locale: WikiLocale,
  pageKind: PageKind,
  articleKind?: ArticleKind,
): string {
  if (pageKind === 'home') return SITE_NAME;
  if (title === SITE_NAME) {
    const disambiguator = articleKind ? kindLabels[locale][articleKind] : t(locale).article;
    return `${disambiguator}: ${title}`;
  }
  return `${title} | ${SITE_NAME}`;
}

function descriptor(
  value: Omit<
    SeoDescriptor,
    | 'documentTitle'
    | 'canonicalUrl'
    | 'robots'
    | 'image'
    | 'ogType'
    | 'alternates'
    | 'categoryTags'
    | 'redirectAliases'
  > & {
    articleKind?: ArticleKind;
    categoryTags?: string[];
    redirectAliases?: string[];
  },
): SeoDescriptor {
  const canonicalUrl = value.canonicalPath ? absoluteUrl(value.canonicalPath) : undefined;
  return {
    ...value,
    documentTitle: pageDocumentTitle(value.title, value.locale, value.pageKind, value.articleKind),
    canonicalUrl,
    robots: value.indexability === 'index' ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    image: socialImage(value.locale),
    ogType: value.pageKind === 'article' ? 'article' : 'website',
    alternates: [],
    categoryTags: value.categoryTags ?? [],
    redirectAliases: value.redirectAliases ?? [],
  };
}

function compareLocalizedTitle(a: { title: string }, b: { title: string }, locale: WikiLocale) {
  return a.title.localeCompare(b.title, locale);
}

function addLocaleRelationships(pages: SeoDescriptor[]): void {
  const groups = new Map<string, SeoDescriptor[]>();
  for (const page of pages) {
    groups.set(page.localizationKey, [...(groups.get(page.localizationKey) ?? []), page]);
  }

  for (const group of groups.values()) {
    const english = group.find((page) => page.locale === 'en');
    const portuguese = group.find((page) => page.locale === 'pt-BR');
    if (!english || !portuguese) continue;

    english.localizedCounterpartPath = portuguese.path;
    portuguese.localizedCounterpartPath = english.path;

    if (
      english.indexability !== 'index' ||
      portuguese.indexability !== 'index' ||
      !english.canonicalUrl ||
      !portuguese.canonicalUrl
    ) {
      continue;
    }

    const alternates: SeoAlternate[] = [english, portuguese].map((page) => ({
      locale: page.locale,
      path: page.canonicalPath as string,
      url: page.canonicalUrl as string,
    }));
    for (const page of group) {
      page.alternates = alternates;
      page.xDefaultUrl = english.canonicalUrl;
    }
  }
}

function buildRedirects(pages: SeoDescriptor[]): SeoRedirect[] {
  const redirects: SeoRedirect[] = [];

  const addRedirectPair = (
    source: string,
    destination: string,
    kind: SeoRedirect['kind'],
  ): void => {
    const sourceWithSlash = source.endsWith('/') ? source : `${source}/`;
    redirects.push(
      {
        source: sourceWithSlash.slice(0, -1),
        destination,
        status: 301,
        kind,
      },
      {
        source: sourceWithSlash,
        destination,
        status: 301,
        kind,
      },
    );
  };

  for (const page of pages) {
    if (!page.canonicalPath) continue;

    for (const alias of page.redirectAliases) {
      addRedirectPair(alias, page.canonicalPath, 'alias');
      if (page.locale === 'en') {
        addRedirectPair(`/en${alias}`, page.canonicalPath, 'locale-prefix');
      }
    }

    if (page.locale === 'en') {
      const prefixedPath = page.canonicalPath === '/' ? '/en/' : `/en${page.canonicalPath}`;
      addRedirectPair(prefixedPath, page.canonicalPath, 'locale-prefix');
    }

    if (page.canonicalPath !== '/' && page.canonicalPath.endsWith('/')) {
      redirects.push({
        source: page.canonicalPath.slice(0, -1),
        destination: page.canonicalPath,
        status: 301,
        kind: 'canonical-slash',
      });
    }
  }

  const sourceToRedirect = new Map<string, SeoRedirect>();
  for (const redirect of redirects) {
    const existing = sourceToRedirect.get(redirect.source);
    if (existing) {
      throw new Error(
        `SEO redirect collision at ${redirect.source}: ${existing.destination} and ${redirect.destination}`,
      );
    }
    sourceToRedirect.set(redirect.source, redirect);
  }
  for (const redirect of redirects) {
    if (sourceToRedirect.has(redirect.destination)) {
      throw new Error(`SEO redirect chain from ${redirect.source} through ${redirect.destination}`);
    }
    if (redirect.source === redirect.destination) {
      throw new Error(`SEO redirect loop at ${redirect.source}`);
    }
  }

  const kindOrder: Record<SeoRedirect['kind'], number> = {
    alias: 0,
    'locale-prefix': 1,
    'canonical-slash': 2,
  };
  return redirects.sort(
    (a, b) => kindOrder[a.kind] - kindOrder[b.kind] || a.source.localeCompare(b.source),
  );
}

export function buildSeoManifest(input: SeoManifestInput): SeoManifest {
  const pages: SeoDescriptor[] = [];
  const articlesByLocale: Record<WikiLocale, SeoArticleInput[]> = {
    en: input.articles.filter((article) => article.locale === 'en'),
    'pt-BR': input.articles.filter((article) => article.locale === 'pt-BR'),
  };
  const categoriesByLocale: Record<WikiLocale, SeoCategoryInput[]> = {
    en: input.categories.filter((category) => category.locale === 'en'),
    'pt-BR': input.categories.filter((category) => category.locale === 'pt-BR'),
  };

  for (const locale of ['en', 'pt-BR'] as const) {
    const strings = t(locale);
    const localeArticles = [...articlesByLocale[locale]].sort((a, b) =>
      compareLocalizedTitle(a, b, locale),
    );
    const hasArticles = localeArticles.length > 0;

    pages.push(
      descriptor({
        key: `home:${locale}`,
        localizationKey: 'home',
        path: homeUrl(locale),
        locale,
        pageKind: 'home',
        title: strings.siteName,
        description: strings.siteDescription,
        canonicalPath: homeUrl(locale),
        indexability: hasArticles ? 'index' : 'noindex',
      }),
      descriptor({
        key: `archive:${locale}`,
        localizationKey: 'archive:all-pages',
        path: pageUrl('all-pages', locale),
        locale,
        pageKind: 'collection',
        collectionKind: 'archive',
        title: strings.allPages,
        description: strings.alphabeticalIndex,
        canonicalPath: pageUrl('all-pages', locale),
        indexability: hasArticles ? 'index' : 'noindex',
        listItems: localeArticles.map((article) => ({
          name: article.title,
          url: absoluteUrl(articleUrl(article.id, locale)),
        })),
      }),
      descriptor({
        key: `contribute:${locale}`,
        localizationKey: 'utility:contribute',
        path: pageUrl('contribute', locale),
        locale,
        pageKind: 'utility',
        title: strings.contribute,
        description: strings.contributeText,
        canonicalPath: pageUrl('contribute', locale),
        indexability: 'index',
      }),
      descriptor({
        key: `search:${locale}`,
        localizationKey: 'utility:search',
        path: pageUrl('search', locale),
        locale,
        pageKind: 'utility',
        title: strings.search,
        description: strings.searchIntro,
        canonicalPath: pageUrl('search', locale),
        indexability: 'noindex',
      }),
      descriptor({
        key: `error:${locale}`,
        localizationKey: 'error:404',
        path: locale === 'en' ? '/404.html' : '/pt/404.html',
        locale,
        pageKind: 'error',
        title: strings.notFound,
        description: strings.notFoundText,
        indexability: 'error',
      }),
    );

    const categoryLookup = new Map(
      categoriesByLocale[locale].map((category) => [category.id, category]),
    );
    for (const category of [...categoriesByLocale[locale]].sort(
      (a, b) => (a.order ?? 100) - (b.order ?? 100) || compareLocalizedTitle(a, b, locale),
    )) {
      const categoryArticles = localeArticles.filter((article) =>
        article.categories.includes(category.id),
      );
      pages.push(
        descriptor({
          key: `category:${locale}:${category.id}`,
          localizationKey: `category:${category.id}`,
          path: categoryUrl(category.id, locale),
          locale,
          pageKind: 'collection',
          collectionKind: 'category',
          title: category.title,
          description: category.summary,
          canonicalPath: categoryUrl(category.id, locale),
          indexability: categoryArticles.length > 0 ? 'index' : 'noindex',
          categoryTags: [category.title],
          listItems: categoryArticles.map((article) => ({
            name: article.title,
            url: absoluteUrl(articleUrl(article.id, locale)),
          })),
        }),
      );
    }

    for (const article of localeArticles) {
      const canonicalPath = articleUrl(article.id, locale);
      const categoryTags = article.categories
        .map((categoryId) => categoryLookup.get(categoryId)?.title)
        .filter((title): title is string => Boolean(title));
      const semanticAliases = unique(article.aliases ?? []).filter(
        (alias) => alias.localeCompare(article.title, locale, { sensitivity: 'accent' }) !== 0,
      );
      const officialUrls = unique(article.officialUrls ?? []).filter((url) =>
        url.startsWith('https://'),
      );
      pages.push(
        descriptor({
          key: `article:${locale}:${article.id}`,
          localizationKey: `article:${article.id}`,
          path: canonicalPath,
          locale,
          pageKind: 'article',
          articleKind: article.kind,
          title: article.title,
          description: article.summary,
          canonicalPath,
          indexability: 'index',
          kindTag: kindLabels[locale][article.kind],
          categoryTags,
          subject: {
            type: SUBJECT_TYPES[article.kind],
            name: article.title,
            description: article.summary,
            aliases: semanticAliases,
            imageUrl: article.entityImagePath ? absoluteUrl(article.entityImagePath) : undefined,
            sameAs: officialUrls,
          },
          redirectAliases: [
            ...(article.redirects ?? []).map((id) => articleUrl(id, locale)),
            legacyArticleUrl(article.id, locale),
            ...(article.redirects ?? []).map((id) => legacyArticleUrl(id, locale)),
          ],
          publishedAt: article.publishedAt,
          modifiedAt: article.modifiedAt,
        }),
      );
    }
  }

  const pathSet = new Set<string>();
  for (const page of pages) {
    if (pathSet.has(page.path)) throw new Error(`Duplicate SEO route ${page.path}`);
    pathSet.add(page.path);
  }
  addLocaleRelationships(pages);
  pages.sort((a, b) => a.path.localeCompare(b.path));

  return {
    siteUrl: SITE_URL,
    siteName: SITE_NAME,
    siteDescription: t('en').siteDescription,
    repositoryUrl: REPOSITORY_URL,
    license: 'Unlicense unless otherwise noted.',
    pages,
    redirects: buildRedirects(pages),
  };
}

export function findSeoDescriptor(manifest: SeoManifest, path: string): SeoDescriptor {
  const page = manifest.pages.find((candidate) => candidate.path === path);
  if (!page) throw new Error(`No SEO descriptor exists for ${path}`);
  return page;
}

function breadcrumbNode(page: SeoDescriptor): JsonLdNode {
  const home = absoluteUrl(homeUrl(page.locale));
  const pageId = `${page.canonicalUrl}#webpage`;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${page.canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t(page.locale).mainPage,
        item: home,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
        item: page.canonicalUrl,
      },
    ],
    about: { '@id': pageId },
  };
}

function itemListNode(page: SeoDescriptor): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': `${page.canonicalUrl}#itemlist`,
    numberOfItems: page.listItems?.length ?? 0,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: (page.listItems ?? []).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildStructuredData(page: SeoDescriptor): JsonLdNode | undefined {
  if (!page.canonicalUrl || page.indexability === 'error') return undefined;

  const organizationId = 'https://return.moe/#organization';
  const websiteId = `${SITE_URL}/#website`;
  const pageId = `${page.canonicalUrl}#webpage`;
  const graph: JsonLdNode[] = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'return moe',
      url: 'https://return.moe/',
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: t('en').siteDescription,
      inLanguage: ['en', 'pt-BR'],
      publisher: { '@id': organizationId },
    },
  ];

  const pageType =
    page.pageKind === 'article'
      ? 'Article'
      : page.pageKind === 'collection'
        ? 'CollectionPage'
        : 'WebPage';
  const pageNode: JsonLdNode = {
    '@type': pageType,
    '@id': pageId,
    url: page.canonicalUrl,
    name: page.documentTitle,
    description: page.description,
    inLanguage: page.locale,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
    image: {
      '@type': 'ImageObject',
      url: page.image.url,
      width: page.image.width,
      height: page.image.height,
      caption: page.image.alt,
    },
  };
  if (page.pageKind === 'article') pageNode.headline = page.title;
  if (page.publishedAt) pageNode.datePublished = page.publishedAt;
  if (page.modifiedAt) pageNode.dateModified = page.modifiedAt;
  if (page.indexability === 'index' && page.pageKind !== 'home') {
    pageNode.breadcrumb = { '@id': `${page.canonicalUrl}#breadcrumb` };
  }
  if (page.collectionKind) {
    pageNode.mainEntity = { '@id': `${page.canonicalUrl}#itemlist` };
  }
  if (page.subject) {
    pageNode.mainEntity = { '@id': `${page.canonicalUrl}#entity` };
  }
  graph.push(pageNode);

  if (page.indexability === 'index' && page.pageKind !== 'home') {
    graph.push(breadcrumbNode(page));
  }
  if (page.collectionKind) graph.push(itemListNode(page));
  if (page.subject) {
    const subject: JsonLdNode = {
      '@type': page.subject.type,
      '@id': `${page.canonicalUrl}#entity`,
      name: page.subject.name,
      description: page.subject.description,
      url: page.canonicalUrl,
      mainEntityOfPage: { '@id': pageId },
    };
    if (page.subject.aliases.length) subject.alternateName = page.subject.aliases;
    if (page.subject.imageUrl) subject.image = page.subject.imageUrl;
    if (page.subject.sameAs.length) subject.sameAs = page.subject.sameAs;
    graph.push(subject);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderSitemap(manifest: SeoManifest): string {
  const pages = manifest.pages.filter((page) => page.indexability === 'index');
  const urls = pages
    .map((page) => {
      const alternates = page.alternates
        .map(
          (alternate) =>
            `<xhtml:link rel="alternate" hreflang="${alternate.locale}" href="${xmlEscape(alternate.url)}"/>`,
        )
        .join('');
      const xDefault = page.xDefaultUrl
        ? `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(page.xDefaultUrl)}"/>`
        : '';
      const lastmod = page.modifiedAt ?? page.publishedAt;
      return `<url><loc>${xmlEscape(page.canonicalUrl as string)}</loc>${lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : ''}${alternates}${xDefault}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>\n`;
}

export function renderSitemapIndex(manifest: SeoManifest): string {
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${xmlEscape(`${manifest.siteUrl}/sitemap-0.xml`)}</loc></sitemap></sitemapindex>\n`;
}

export function renderRobotsTxt(manifest: SeoManifest): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    '',
    `Sitemap: ${manifest.siteUrl}/sitemap-index.xml`,
    '',
  ].join('\n');
}

export function renderLlmsTxt(manifest: SeoManifest): string {
  const articles = manifest.pages.filter(
    (page) => page.pageKind === 'article' && page.indexability === 'index',
  );
  const contributions = manifest.pages.filter(
    (page) => page.localizationKey === 'utility:contribute' && page.indexability === 'index',
  );
  return [
    `# ${manifest.siteName}`,
    '',
    `> ${manifest.siteDescription}`,
    '',
    'This file supplements the canonical HTML pages and their structured data.',
    '',
    '## Knowledge pages',
    '',
    ...articles.map(
      (page) =>
        `- [${page.title}](${page.canonicalUrl}) — ${languages[page.locale]}: ${page.description}`,
    ),
    '',
    '## Contributing',
    '',
    ...contributions.map(
      (page) => `- [${page.title}](${page.canonicalUrl}) — ${languages[page.locale]}`,
    ),
    '',
    '## Resources',
    '',
    `- Repository: ${manifest.repositoryUrl}`,
    `- Sitemap: ${manifest.siteUrl}/sitemap-index.xml`,
    '',
    '## License',
    '',
    manifest.license,
    '',
  ].join('\n');
}

export function renderRedirects(manifest: SeoManifest): string {
  return `${manifest.redirects
    .map((redirect) => `${redirect.source} ${redirect.destination} ${redirect.status}`)
    .join('\n')}\n`;
}

export function renderHeaders(): string {
  return [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  X-Frame-Options: DENY',
    '  Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(), usb=()',
    '',
    '/_astro/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/robots.txt',
    '  Content-Type: text/plain; charset=utf-8',
    '  Cache-Control: public, max-age=0, s-maxage=300, must-revalidate',
    '',
    '/sitemap-index.xml',
    '  Content-Type: application/xml; charset=utf-8',
    '  Cache-Control: public, max-age=0, s-maxage=300, must-revalidate',
    '',
    '/sitemap-0.xml',
    '  Content-Type: application/xml; charset=utf-8',
    '  Cache-Control: public, max-age=0, s-maxage=300, must-revalidate',
    '',
    '/llms.txt',
    '  Content-Type: text/plain; charset=utf-8',
    '  Cache-Control: public, max-age=0, s-maxage=300, must-revalidate',
    '  X-Robots-Tag: noindex',
    '',
    'https://:project.pages.dev/*',
    '  X-Robots-Tag: noindex',
    '',
    'https://:version.:project.pages.dev/*',
    '  X-Robots-Tag: noindex',
    '',
  ].join('\n');
}
