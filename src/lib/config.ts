export const SITE_URL = 'https://wiki.return.moe';
export const REPOSITORY_URL = 'https://github.com/returnmoe/wiki';
export const REPOSITORY_BRANCH = 'master';

export const ARTICLE_KINDS = [
  'character',
  'person',
  'place',
  'organization',
  'company',
  'government',
  'project',
  'software',
  'event',
  'work',
  'technology',
  'concept',
  'other',
] as const;

export type ArticleKind = (typeof ARTICLE_KINDS)[number];
export type WikiLocale = 'en' | 'pt-BR';

export const KIND_FOLDERS: Record<ArticleKind, string> = {
  character: 'characters',
  person: 'people',
  place: 'places',
  organization: 'organizations',
  company: 'companies',
  government: 'governments',
  project: 'projects',
  software: 'software',
  event: 'events',
  work: 'works',
  technology: 'technologies',
  concept: 'concepts',
  other: 'other',
};

export const RESERVED_IDS = new Set([
  'all-pages',
  'category',
  'contribute',
  'en',
  'index',
  'pt',
  'search',
  'wiki',
]);

export function localeDirectory(locale: WikiLocale): 'en' | 'pt' {
  return locale === 'pt-BR' ? 'pt' : 'en';
}

export function localePrefix(locale: WikiLocale): '' | '/pt' {
  return locale === 'pt-BR' ? '/pt' : '';
}

export function articleUrl(id: string, locale: WikiLocale): string {
  return `${localePrefix(locale)}/${id}/`;
}

export function legacyArticleUrl(id: string, locale: WikiLocale): string {
  return `${localePrefix(locale)}/wiki/${id}/`;
}

export function categoryUrl(id: string, locale: WikiLocale): string {
  return `${localePrefix(locale)}/category/${id}/`;
}

export function pageUrl(page: 'all-pages' | 'contribute' | 'search', locale: WikiLocale): string {
  return `${localePrefix(locale)}/${page}/`;
}

export function homeUrl(locale: WikiLocale): string {
  return locale === 'pt-BR' ? '/pt/' : '/';
}

export function articleSourcePath(
  data: {
    id: string;
    kind: ArticleKind;
    locale: WikiLocale;
  },
  extension: 'md' | 'mdx' = 'md',
): string {
  return `src/content/articles/${localeDirectory(data.locale)}/${KIND_FOLDERS[data.kind]}/${data.id}.${extension}`;
}

export function categorySourcePath(data: { id: string; locale: WikiLocale }): string {
  return `src/content/categories/${localeDirectory(data.locale)}/${data.id}.md`;
}

export function repositoryEditUrl(sourcePath: string): string {
  return `${REPOSITORY_URL}/edit/${REPOSITORY_BRANCH}/${sourcePath}`;
}

export function repositoryHistoryUrl(sourcePath: string): string {
  return `${REPOSITORY_URL}/commits/${REPOSITORY_BRANCH}/${sourcePath}`;
}

export function repositoryDiscussionUrl(): string {
  return `${REPOSITORY_URL}/discussions`;
}

export function repositoryReportUrl(articleId: string, title: string): string {
  const issueTitle = encodeURIComponent(`[article:${articleId}] Correction for ${title}`);
  const body = encodeURIComponent(
    `Article: ${SITE_URL}${articleUrl(articleId, 'en')}\n\nWhat should be corrected or clarified?\n\n`,
  );
  return `${REPOSITORY_URL}/issues/new?title=${issueTitle}&body=${body}`;
}

export function repositoryTranslationUrl(articleId: string): string {
  const title = encodeURIComponent(
    `[article:${articleId}] Brazilian Portuguese translation request`,
  );
  const body = encodeURIComponent(
    `Please translate the article "${articleId}" into Brazilian Portuguese.\n`,
  );
  return `${REPOSITORY_URL}/issues/new?title=${title}&body=${body}`;
}
