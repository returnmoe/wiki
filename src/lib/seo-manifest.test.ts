import { describe, expect, it } from 'vitest';
import { buildSeoManifest, buildStructuredData, findSeoDescriptor } from './seo-manifest';
import type { ArticleKind } from './config';

const categories = [
  {
    id: 'projects',
    title: 'Projects',
    summary: 'English projects.',
    locale: 'en' as const,
  },
  {
    id: 'projects',
    title: 'Projetos',
    summary: 'Projetos em português.',
    locale: 'pt-BR' as const,
  },
];

const englishArticle = {
  id: 'manual-page',
  title: 'Manual Page',
  summary: 'An English page written by an editor.',
  locale: 'en' as const,
  kind: 'project' as const,
  categories: ['projects'],
  aliases: ['Editor Page'],
  redirects: ['old-manual-page'],
  officialUrls: ['https://github.com/returnmoe/wiki'],
};

describe('SEO manifest locale policy', () => {
  it('does not create Portuguese articles or alternates from English content', () => {
    const manifest = buildSeoManifest({ articles: [englishArticle], categories });
    const english = findSeoDescriptor(manifest, '/manual-page/');

    expect(manifest.pages.some((page) => page.path === '/pt/manual-page/')).toBe(false);
    expect(english.alternates).toEqual([]);
    expect(english.localizedCounterpartPath).toBeUndefined();
    expect(findSeoDescriptor(manifest, '/pt/').indexability).toBe('noindex');
    expect(findSeoDescriptor(manifest, '/pt/all-pages/').indexability).toBe('noindex');
    expect(findSeoDescriptor(manifest, '/pt/category/projects/').indexability).toBe('noindex');
  });

  it('forms reciprocal locale clusters only from manually supplied content', () => {
    const portugueseArticle = {
      ...englishArticle,
      title: 'Página Manual',
      summary: 'Uma página escrita manualmente por uma pessoa.',
      locale: 'pt-BR' as const,
      aliases: ['Página do editor'],
      redirects: [],
    };
    const manifest = buildSeoManifest({
      articles: [englishArticle, portugueseArticle],
      categories,
    });
    const english = findSeoDescriptor(manifest, '/manual-page/');
    const portuguese = findSeoDescriptor(manifest, '/pt/manual-page/');

    expect(english.alternates.map((alternate) => alternate.locale)).toEqual(['en', 'pt-BR']);
    expect(portuguese.alternates).toEqual(english.alternates);
    expect(english.xDefaultUrl).toBe('https://wiki.return.moe/manual-page/');
    expect(portuguese.title).toBe('Página Manual');
    expect(portuguese.description).toBe('Uma página escrita manualmente por uma pessoa.');
    expect(findSeoDescriptor(manifest, '/pt/').indexability).toBe('index');
    expect(findSeoDescriptor(manifest, '/pt/all-pages/').indexability).toBe('index');
    expect(findSeoDescriptor(manifest, '/pt/category/projects/').indexability).toBe('index');
  });

  it('keeps noindex and error routes out of hreflang clusters', () => {
    const manifest = buildSeoManifest({ articles: [englishArticle], categories });
    expect(findSeoDescriptor(manifest, '/search/').alternates).toEqual([]);
    expect(findSeoDescriptor(manifest, '/pt/').alternates).toEqual([]);
    expect(findSeoDescriptor(manifest, '/404.html').canonicalUrl).toBeUndefined();
    expect(findSeoDescriptor(manifest, '/404.html').robots).toBe('noindex,follow');
    expect(findSeoDescriptor(manifest, '/contribute/').alternates).toHaveLength(2);
  });
});

describe('SEO entity and redirect generation', () => {
  it.each<[ArticleKind, string]>([
    ['character', 'Person'],
    ['person', 'Person'],
    ['organization', 'Organization'],
    ['company', 'Corporation'],
    ['government', 'GovernmentOrganization'],
    ['software', 'SoftwareApplication'],
    ['technology', 'DefinedTerm'],
    ['concept', 'DefinedTerm'],
    ['place', 'Place'],
    ['event', 'Event'],
    ['project', 'CreativeWork'],
    ['work', 'CreativeWork'],
    ['other', 'Thing'],
  ])('maps %s articles to Schema.org %s entities', (kind, expectedType) => {
    const manifest = buildSeoManifest({
      articles: [{ ...englishArticle, kind }],
      categories,
    });
    expect(findSeoDescriptor(manifest, '/manual-page/').subject?.type).toBe(expectedType);
  });

  it('uses only supplied subject facts and emits no author or dates', () => {
    const manifest = buildSeoManifest({ articles: [englishArticle], categories });
    const page = findSeoDescriptor(manifest, '/manual-page/');
    const graph = buildStructuredData(page);
    const serialized = JSON.stringify(graph);

    expect(serialized).toContain('https://github.com/returnmoe/wiki');
    expect(serialized).not.toContain('author');
    expect(serialized).not.toContain('datePublished');
    expect(serialized).not.toContain('dateModified');
    expect(serialized).not.toContain('revision');
  });

  it('points current and legacy aliases directly to the root canonical URL', () => {
    const manifest = buildSeoManifest({ articles: [englishArticle], categories });
    const aliases = manifest.redirects.filter((redirect) => redirect.kind === 'alias');
    expect(aliases).toEqual([
      {
        source: '/old-manual-page',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
      {
        source: '/old-manual-page/',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
      {
        source: '/wiki/manual-page',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
      {
        source: '/wiki/manual-page/',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
      {
        source: '/wiki/old-manual-page',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
      {
        source: '/wiki/old-manual-page/',
        destination: '/manual-page/',
        status: 301,
        kind: 'alias',
      },
    ]);
  });
});
