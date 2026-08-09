import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { validateContentModel, type ContentDocument } from '../src/lib/validation';

const root = process.cwd();

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(target) : [target];
    }),
  );
  return files.flat();
}

async function documentsBelow(directory: string): Promise<ContentDocument[]> {
  const files = (await filesBelow(directory)).filter((file) => /\.mdx?$/.test(file));
  return Promise.all(
    files.map(async (file) => {
      const parsed = matter(await readFile(file, 'utf8'));
      return { file, body: parsed.content, data: parsed.data };
    }),
  );
}

const [articles, categories, publicFiles] = await Promise.all([
  documentsBelow(path.join(root, 'src/content/articles')),
  documentsBelow(path.join(root, 'src/content/categories')),
  filesBelow(path.join(root, 'public')),
]);

const errors = validateContentModel({
  articles,
  categories,
  publicFiles: new Set(
    publicFiles.map((file) => path.relative(root, file).split(path.sep).join('/')),
  ),
  root,
});

if (errors.length) {
  console.error(
    `Content validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`,
  );
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${articles.length} articles and ${categories.length} categories.`);
}
