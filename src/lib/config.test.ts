import { describe, expect, it } from 'vitest';
import {
  articleSourcePath,
  articleUrl,
  categoryUrl,
  repositoryDiscussionUrl,
  repositoryEditUrl,
  repositoryHistoryUrl,
  repositoryReportUrl,
} from './config';

describe('wiki route helpers', () => {
  it('keeps English articles at the site root', () => {
    expect(articleUrl('soraya', 'en')).toBe('/soraya/');
    expect(categoryUrl('characters', 'en')).toBe('/category/characters/');
  });

  it('prefixes Brazilian Portuguese routes', () => {
    expect(articleUrl('soraya', 'pt-BR')).toBe('/pt/soraya/');
    expect(categoryUrl('characters', 'pt-BR')).toBe('/pt/category/characters/');
  });

  it('derives categorized Markdown paths', () => {
    expect(articleSourcePath({ id: 'soraya', locale: 'en', kind: 'character' })).toBe(
      'src/content/articles/en/characters/soraya.md',
    );
    expect(
      articleSourcePath({ id: 'informational-ontology', locale: 'en', kind: 'concept' }, 'mdx'),
    ).toBe('src/content/articles/en/concepts/informational-ontology.mdx');
  });

  it('always targets the master branch in repository links', () => {
    const path = 'src/content/articles/en/characters/soraya.md';
    expect(repositoryEditUrl(path)).toContain('/edit/master/');
    expect(repositoryHistoryUrl(path)).toContain('/commits/master/');
    expect(repositoryEditUrl(path)).not.toContain('/main/');
  });

  it('keeps discussions in the forum and correction reports in issues', () => {
    expect(repositoryDiscussionUrl()).toBe('https://github.com/returnmoe/wiki/discussions');
    const reportUrl = repositoryReportUrl('soraya', 'Soraya');
    expect(reportUrl).toContain('https://github.com/returnmoe/wiki/issues/new?');
    expect(decodeURIComponent(reportUrl)).toContain('Article: https://wiki.return.moe/soraya/');
  });
});
