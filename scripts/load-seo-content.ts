import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  articleSeoInput,
  categorySeoInput,
  type SeoArticleSource,
  type SeoCategorySource,
} from '../src/lib/seo-content';
import type { SeoManifestInput } from '../src/lib/seo-manifest';

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

async function frontmatterBelow<T>(directory: string): Promise<T[]> {
  const files = (await filesBelow(directory)).filter((file) => /\.mdx?$/.test(file)).sort();
  return Promise.all(files.map(async (file) => matter(await readFile(file, 'utf8')).data as T));
}

export async function loadSeoContent(root = process.cwd()): Promise<SeoManifestInput> {
  const [articles, categories] = await Promise.all([
    frontmatterBelow<SeoArticleSource>(path.join(root, 'src/content/articles')),
    frontmatterBelow<SeoCategorySource>(path.join(root, 'src/content/categories')),
  ]);
  return {
    articles: articles.map(articleSeoInput),
    categories: categories.map(categorySeoInput),
  };
}
