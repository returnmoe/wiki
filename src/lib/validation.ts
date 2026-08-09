import path from 'node:path';
import {
  KIND_FOLDERS,
  RESERVED_IDS,
  articleSourcePath,
  categorySourcePath,
  type ArticleKind,
  type WikiLocale,
} from './config';
import { isKnownField } from './infobox';

export interface ContentDocument {
  file: string;
  body: string;
  data: Record<string, any>;
}

export interface ValidationInput {
  articles: ContentDocument[];
  categories: ContentDocument[];
  publicFiles: Set<string>;
  root: string;
}

const keyFor = (locale: string, id: string) => `${locale}:${id}`;

const PRIMARY_CATEGORY_BY_KIND: Partial<Record<ArticleKind, string>> = {
  character: 'characters',
  person: 'people',
  organization: 'organizations',
  company: 'organizations',
  government: 'organizations',
  project: 'projects',
  software: 'software',
};

const ALLOWED_KINDS_BY_SUBJECT_CATEGORY: Record<string, readonly ArticleKind[]> = {
  characters: ['character'],
  people: ['person'],
  organizations: ['organization', 'company', 'government'],
  software: ['software', 'technology'],
};

function normalizedFile(root: string, file: string): string {
  return path.relative(root, file).split(path.sep).join('/');
}

function withoutCodeFences(body: string): string {
  return body.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');
}

function array(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function linkedArticles(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) =>
    item && typeof item === 'object' && typeof item.article === 'string' ? [item.article] : [],
  );
}

export function validateContentModel(input: ValidationInput): string[] {
  const errors: string[] = [];
  const articleKeys = new Map<string, ContentDocument>();
  const redirectKeys = new Map<string, string>();
  const categoryKeys = new Map<string, ContentDocument>();

  const error = (document: ContentDocument, message: string) => {
    errors.push(`${normalizedFile(input.root, document.file)}: ${message}`);
  };

  for (const category of input.categories) {
    const { id, locale } = category.data;
    if (typeof id !== 'string' || typeof locale !== 'string') continue;
    const key = keyFor(locale, id);
    if (categoryKeys.has(key)) error(category, `duplicate category ID "${id}" for ${locale}`);
    categoryKeys.set(key, category);

    const expected = categorySourcePath({ id, locale: locale as WikiLocale });
    if (normalizedFile(input.root, category.file) !== expected) {
      error(category, `expected category at ${expected}`);
    }
  }

  for (const article of input.articles) {
    const { id, locale, kind } = article.data;
    if (typeof id !== 'string' || typeof locale !== 'string' || typeof kind !== 'string') continue;
    const key = keyFor(locale, id);
    if (articleKeys.has(key)) error(article, `duplicate article ID "${id}" for ${locale}`);
    articleKeys.set(key, article);

    if (RESERVED_IDS.has(id)) error(article, `article ID "${id}" is reserved`);
    const sourceExtension = path.extname(article.file) === '.mdx' ? 'mdx' : 'md';
    const expected = articleSourcePath(
      {
        id,
        locale: locale as WikiLocale,
        kind: kind as ArticleKind,
      },
      sourceExtension,
    );
    if (normalizedFile(input.root, article.file) !== expected) {
      error(article, `expected article at ${expected}; folder and frontmatter must agree`);
    }

    for (const redirect of array(article.data.redirects)) {
      if (RESERVED_IDS.has(redirect)) error(article, `redirect "${redirect}" is reserved`);
      const redirectKey = keyFor(locale, redirect);
      const existing = redirectKeys.get(redirectKey);
      if (existing) error(article, `redirect "${redirect}" is already owned by ${existing}`);
      redirectKeys.set(redirectKey, id);
    }
  }

  for (const [key, owner] of redirectKeys) {
    if (articleKeys.has(key)) {
      const article = articleKeys.get(key)!;
      error(article, `article ID collides with a redirect owned by ${owner}`);
    }
  }

  for (const category of input.categories) {
    const { locale, parent } = category.data;
    if (parent && !categoryKeys.has(keyFor(locale, parent))) {
      error(category, `parent category "${parent}" does not exist in ${locale}`);
    }
    const cleanedBody = withoutCodeFences(category.body);
    if (/<\/?[A-Za-z][^>]*>/.test(cleanedBody)) {
      error(category, 'raw HTML is not allowed in Markdown content');
    }
  }

  for (const article of input.articles) {
    const { id, locale, kind } = article.data;
    if (typeof id !== 'string' || typeof locale !== 'string' || typeof kind !== 'string') continue;

    const assignedCategories = array(article.data.categories).filter(
      (category): category is string => typeof category === 'string',
    );
    if (new Set(assignedCategories).size !== assignedCategories.length) {
      error(article, 'categories must not contain duplicates');
    }

    const primaryCategory = PRIMARY_CATEGORY_BY_KIND[kind as ArticleKind];
    if (primaryCategory && assignedCategories[0] !== primaryCategory) {
      error(article, `kind "${kind}" requires "${primaryCategory}" as its first category`);
    }

    const aiIndex = assignedCategories.indexOf('artificial-intelligence');
    if (aiIndex !== -1 && aiIndex !== assignedCategories.length - 1) {
      error(
        article,
        'category "artificial-intelligence" must be last when combined with other categories',
      );
    }

    for (const category of assignedCategories) {
      if (!categoryKeys.has(keyFor(locale, category))) {
        error(article, `category "${category}" does not exist in ${locale}`);
      }
      const allowedKinds = ALLOWED_KINDS_BY_SUBJECT_CATEGORY[category];
      if (allowedKinds && !allowedKinds.includes(kind as ArticleKind)) {
        error(article, `category "${category}" is not valid for kind "${kind}"`);
      }
    }

    for (const related of array(article.data.related)) {
      if (!articleKeys.has(keyFor(locale, related))) {
        error(article, `related article "${related}" does not exist in ${locale}`);
      }
    }

    const fields = array(article.data.infobox?.fields);
    for (const field of fields) {
      if (!isKnownField(kind as ArticleKind, field.key)) {
        error(article, `infobox key "${field.key}" is not valid for kind "${kind}"`);
      }
      if (kind === 'other' && !field.label) {
        error(article, `generic infobox field "${field.key}" requires a label`);
      }
      for (const linked of linkedArticles(field.value)) {
        if (!articleKeys.has(keyFor(locale, linked))) {
          error(article, `infobox links to missing article "${linked}" in ${locale}`);
        }
      }
    }

    const mediaFiles = [
      article.data.infobox?.image?.src,
      ...array(article.data.gallery?.items).map((item) => item?.src),
    ];
    for (const media of mediaFiles) {
      if (typeof media !== 'string') continue;
      const publicPath = `public${media}`;
      if (!input.publicFiles.has(publicPath))
        error(article, `media file "${media}" does not exist`);
    }

    if (locale === 'pt-BR') {
      const source = articleKeys.get(keyFor('en', id));
      if (!source) {
        error(article, 'Brazilian Portuguese translation has no English source article');
      } else if ((article.data.translatedFromRevision ?? 0) > (source.data.revision ?? 0)) {
        error(article, 'translatedFromRevision cannot exceed the English revision');
      } else if (
        JSON.stringify(assignedCategories) !== JSON.stringify(array(source.data.categories))
      ) {
        error(article, 'categories must match the English source categories and order');
      }
    }

    const cleanedBody = withoutCodeFences(article.body);
    const rawHtmlPattern =
      path.extname(article.file) === '.mdx' ? /<\/?[a-z][^>]*>/ : /<\/?[A-Za-z][^>]*>/;
    if (rawHtmlPattern.test(cleanedBody)) {
      error(article, 'raw HTML is not allowed in Markdown content');
    }

    for (const match of cleanedBody.matchAll(/\]\((\/(?:pt\/)?([a-z0-9-]+)\/?)(?:#[^)]+)?\)/g)) {
      const targetLocale = match[1].startsWith('/pt/') ? 'pt-BR' : 'en';
      if (!articleKeys.has(keyFor(targetLocale, match[2]))) {
        error(
          article,
          `internal article link points to missing ${targetLocale} article "${match[2]}"`,
        );
      }
    }
    for (const match of cleanedBody.matchAll(
      /\]\((\/(?:pt\/)?category\/([a-z0-9-]+)\/?)(?:#[^)]+)?\)/g,
    )) {
      const targetLocale = match[1].startsWith('/pt/') ? 'pt-BR' : 'en';
      if (!categoryKeys.has(keyFor(targetLocale, match[2]))) {
        error(
          article,
          `internal category link points to missing ${targetLocale} category "${match[2]}"`,
        );
      }
    }
  }

  const categoryState = new Map<string, 0 | 1 | 2>();
  const visit = (key: string, trail: string[]) => {
    const state = categoryState.get(key) ?? 0;
    if (state === 2) return;
    if (state === 1) {
      const category = categoryKeys.get(key);
      if (category) error(category, `category parent cycle: ${[...trail, key].join(' -> ')}`);
      return;
    }
    categoryState.set(key, 1);
    const category = categoryKeys.get(key);
    if (category?.data.parent) {
      visit(keyFor(category.data.locale, category.data.parent), [...trail, key]);
    }
    categoryState.set(key, 2);
  };
  for (const key of categoryKeys.keys()) visit(key, []);

  return errors.sort();
}

export function expectedFolderForKind(kind: ArticleKind): string {
  return KIND_FOLDERS[kind];
}
