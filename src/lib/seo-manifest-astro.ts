import { getCollection } from 'astro:content';
import { articleSeoInput, categorySeoInput } from './seo-content';
import { buildSeoManifest, findSeoDescriptor, type SeoManifest } from './seo-manifest';

let manifestPromise: Promise<SeoManifest> | undefined;

export function getSeoManifest(): Promise<SeoManifest> {
  manifestPromise ??= Promise.all([getCollection('articles'), getCollection('categories')]).then(
    ([articles, categories]) =>
      buildSeoManifest({
        articles: articles.map((article) => articleSeoInput(article.data)),
        categories: categories.map((category) => categorySeoInput(category.data)),
      }),
  );
  return manifestPromise;
}

export async function getSeoDescriptor(path: string) {
  return findSeoDescriptor(await getSeoManifest(), path);
}
