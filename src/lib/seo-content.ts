import type { ArticleKind, WikiLocale } from './config';
import type { SeoArticleInput, SeoCategoryInput } from './seo-manifest';

interface LinkedValue {
  url?: string;
}

interface SourceInfobox {
  image?: { src: string };
  fields?: Array<{ key: string; value: unknown }>;
}

export interface SeoArticleSource {
  id: string;
  title: string;
  summary: string;
  locale: WikiLocale;
  kind: ArticleKind;
  categories: string[];
  aliases?: string[];
  redirects?: string[];
  infobox?: SourceInfobox;
}

export interface SeoCategorySource {
  id: string;
  title: string;
  summary: string;
  locale: WikiLocale;
  order?: number;
}

function linkedUrls(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(linkedUrls);
  if (!value || typeof value !== 'object') return [];
  const url = (value as LinkedValue).url;
  return typeof url === 'string' ? [url] : [];
}

export function articleSeoInput(source: SeoArticleSource): SeoArticleInput {
  const officialUrls = (source.infobox?.fields ?? [])
    .filter((field) => field.key === 'website' || field.key === 'repository')
    .flatMap((field) => linkedUrls(field.value));
  return {
    id: source.id,
    title: source.title,
    summary: source.summary,
    locale: source.locale,
    kind: source.kind,
    categories: source.categories,
    aliases: source.aliases ?? [],
    redirects: source.redirects ?? [],
    entityImagePath: source.infobox?.image?.src,
    officialUrls,
  };
}

export function categorySeoInput(source: SeoCategorySource): SeoCategoryInput {
  return {
    id: source.id,
    title: source.title,
    summary: source.summary,
    locale: source.locale,
    order: source.order,
  };
}
