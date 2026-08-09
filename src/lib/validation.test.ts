import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateContentModel, type ContentDocument } from './validation';

const root = '/repo';

const category = (id = 'characters', parent?: string, locale = 'en'): ContentDocument => ({
  file: path.join(root, `src/content/categories/${locale === 'pt-BR' ? 'pt' : 'en'}/${id}.md`),
  body: 'Category description.',
  data: { id, title: id, summary: id, locale, parent },
});

const article = (overrides: Record<string, any> = {}): ContentDocument => {
  const data = {
    id: 'soraya',
    title: 'Soraya',
    summary: 'Character',
    locale: 'en',
    kind: 'character',
    revision: 1,
    categories: ['characters'],
    redirects: [],
    related: [],
    infobox: { fields: [{ key: 'role', value: 'Brand ambassador' }] },
    ...overrides,
  };
  return {
    file: path.join(
      root,
      `src/content/articles/${data.locale === 'pt-BR' ? 'pt' : 'en'}/${data.kind === 'character' ? 'characters' : 'other'}/${data.id}.md`,
    ),
    body: 'Article body.',
    data,
  };
};

const validate = (articles: ContentDocument[], categories: ContentDocument[] = [category()]) =>
  validateContentModel({ articles, categories, publicFiles: new Set(), root });

describe('content model validation', () => {
  it('accepts a consistent article and category graph', () => {
    expect(validate([article()])).toEqual([]);
  });

  it('rejects duplicate IDs and redirect collisions', () => {
    const errors = validate([
      article({ redirects: ['alternate'] }),
      article({ title: 'Duplicate', redirects: [] }),
      article({ id: 'alternate', title: 'Collision', redirects: [] }),
    ]);
    expect(errors.some((error) => error.includes('duplicate article ID'))).toBe(true);
    expect(errors.some((error) => error.includes('collides with a redirect'))).toBe(true);
  });

  it('rejects invalid infobox keys and raw HTML', () => {
    const invalid = article({ infobox: { fields: [{ key: 'headquarters', value: 'Nowhere' }] } });
    invalid.body = '<script>alert(1)</script>';
    const errors = validate([invalid]);
    expect(errors.some((error) => error.includes('not valid for kind'))).toBe(true);
    expect(errors.some((error) => error.includes('raw HTML'))).toBe(true);
  });

  it('allows component markup in MDX while still rejecting raw HTML', () => {
    const componentArticle = article();
    componentArticle.file = componentArticle.file.replace(/\.md$/, '.mdx');
    componentArticle.body = '<SpoilerSection summary="Spoilers">Content.</SpoilerSection>';
    expect(validate([componentArticle])).toEqual([]);

    componentArticle.body = '<script>alert(1)</script>';
    expect(validate([componentArticle]).some((error) => error.includes('raw HTML'))).toBe(true);
  });

  it('requires gallery media to exist in the public directory', () => {
    const errors = validate([
      article({
        gallery: {
          items: [{ src: '/media/characters/soraya/missing.jpg', alt: 'Missing art' }],
        },
      }),
    ]);
    expect(errors.some((error) => error.includes('missing.jpg'))).toBe(true);
  });

  it('requires Portuguese entries to reference an English source', () => {
    const translated = article({
      locale: 'pt-BR',
      revision: undefined,
      translatedFromRevision: 1,
    });
    expect(validate([translated]).some((error) => error.includes('no English source'))).toBe(true);
  });

  it('enforces subject-category compatibility and category ordering', () => {
    const wrongSubject = article({ kind: 'concept', categories: ['characters'] });
    const wrongOrder = article({
      categories: ['artificial-intelligence', 'characters', 'characters'],
    });
    const errors = validate(
      [wrongSubject, wrongOrder],
      [category(), category('artificial-intelligence')],
    );

    expect(errors.some((error) => error.includes('not valid for kind "concept"'))).toBe(true);
    expect(errors.some((error) => error.includes('must not contain duplicates'))).toBe(true);
    expect(errors.some((error) => error.includes('requires "characters" as its first'))).toBe(true);
    expect(errors.some((error) => error.includes('"artificial-intelligence" must be last'))).toBe(
      true,
    );
  });

  it('requires translations to preserve source categories and order', () => {
    const translated = article({
      locale: 'pt-BR',
      revision: undefined,
      translatedFromRevision: 1,
      categories: ['characters', 'artificial-intelligence'],
    });
    const errors = validate(
      [article(), translated],
      [
        category(),
        category('characters', undefined, 'pt-BR'),
        category('artificial-intelligence', undefined, 'pt-BR'),
      ],
    );

    expect(errors.some((error) => error.includes('must match the English source'))).toBe(true);
  });

  it('detects category parent cycles', () => {
    const errors = validate(
      [article()],
      [category('characters', 'research'), category('research', 'characters')],
    );
    expect(errors.some((error) => error.includes('category parent cycle'))).toBe(true);
  });
});
