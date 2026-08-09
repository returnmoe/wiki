import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(target) : [target];
    }),
  );
  return nested.flat();
}

function outputPath(urlPath: string): string {
  const decoded = decodeURIComponent(urlPath);
  if (decoded === '/') return path.join(dist, 'index.html');
  if (decoded.endsWith('/')) return path.join(dist, decoded, 'index.html');
  return path.join(dist, decoded);
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const htmlFiles = (await filesBelow(dist)).filter((file) => file.endsWith('.html'));
const errors: string[] = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const source = path.relative(dist, file).split(path.sep).join('/');
  const references = html.matchAll(/(?:href|src)=["'](\/[^"']*)["']/g);

  for (const match of references) {
    const reference = match[1];
    if (reference.startsWith('//')) continue;
    const [pathname, fragment] = reference.split('#', 2);
    const cleanPath = pathname.split('?', 1)[0];
    if (!cleanPath) {
      if (fragment && !html.includes(`id="${fragment}"`)) {
        errors.push(`${source}: missing local anchor #${fragment}`);
      }
      continue;
    }

    const target = outputPath(cleanPath);
    if (!(await exists(target))) {
      errors.push(`${source}: ${reference} does not resolve in dist`);
      continue;
    }

    if (fragment && target.endsWith('.html')) {
      const targetHtml = target === file ? html : await readFile(target, 'utf8');
      if (!targetHtml.includes(`id="${fragment}"`)) {
        errors.push(`${source}: ${reference} points to a missing anchor`);
      }
    }
  }
}

if (errors.length) {
  console.error(
    `Built-link validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`,
  );
  for (const error of errors.sort()) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated internal links across ${htmlFiles.length} generated pages.`);
}
