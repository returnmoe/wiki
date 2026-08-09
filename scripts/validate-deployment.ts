import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const mebibyte = 1024 * 1024;

// Cloudflare Pages Free-plan limits. Keep these conservative even if the project moves to a paid
// plan so every artifact remains portable and preview deployments behave like production.
const limits = {
  files: 20_000,
  fileBytes: 25 * mebibyte,
  headerRules: 100,
  headerLineBytes: 2_000,
  staticRedirects: 2_000,
  dynamicRedirects: 100,
};

const requiredFiles = [
  'index.html',
  '404.html',
  'pt/404.html',
  '_headers',
  '_redirects',
  'robots.txt',
  'sitemap-index.xml',
  'pagefind/pagefind.js',
];

const errors: string[] = [];

function report(condition: unknown, message: string): asserts condition {
  if (!condition) errors.push(message);
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

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

function nonCommentLines(source: string): string[] {
  return source
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() && !line.trimStart().startsWith('#'));
}

function isDynamicRedirect(source: string): boolean {
  return source.includes('*') || /(^|\/):[A-Za-z_][A-Za-z0-9_]*/.test(source);
}

const files = await filesBelow(dist);
report(
  files.length <= limits.files,
  `bundle has ${files.length} files; Pages allows ${limits.files}`,
);

const sizes = await Promise.all(
  files.map(async (file) => ({
    file,
    bytes: (await stat(file)).size,
  })),
);
for (const item of sizes) {
  const relative = path.relative(dist, item.file).split(path.sep).join('/');
  report(
    item.bytes <= limits.fileBytes,
    `${relative} is ${(item.bytes / mebibyte).toFixed(2)} MiB; Pages allows 25 MiB per file`,
  );
}

for (const required of requiredFiles) {
  report(
    await exists(path.join(dist, required)),
    `required deployment file is missing: ${required}`,
  );
}

report(
  !files.some((file) => ['_worker.js', '_routes.json'].includes(path.basename(file))),
  'static deployment unexpectedly contains a Pages Functions or Worker routing artifact',
);

const headers = await readFile(path.join(dist, '_headers'), 'utf8');
const headerLines = nonCommentLines(headers);
const headerRules = headerLines.filter((line) => !/^\s/.test(line));
report(
  headerRules.length <= limits.headerRules,
  `_headers has ${headerRules.length} rules; Pages allows ${limits.headerRules}`,
);
for (const line of headers.split('\n')) {
  report(
    Buffer.byteLength(line, 'utf8') <= limits.headerLineBytes,
    `_headers contains a line longer than ${limits.headerLineBytes} bytes`,
  );
}

const redirects = nonCommentLines(await readFile(path.join(dist, '_redirects'), 'utf8'));
const dynamicRedirects = redirects.filter((line) => isDynamicRedirect(line.split(/\s+/, 1)[0]));
const staticRedirects = redirects.length - dynamicRedirects.length;
report(
  staticRedirects <= limits.staticRedirects,
  `_redirects has ${staticRedirects} static rules; Pages allows ${limits.staticRedirects}`,
);
report(
  dynamicRedirects.length <= limits.dynamicRedirects,
  `_redirects has ${dynamicRedirects.length} dynamic rules; Pages allows ${limits.dynamicRedirects}`,
);

if (errors.length) {
  console.error(
    `Cloudflare Pages artifact validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`,
  );
  for (const error of [...new Set(errors)].sort()) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const largest = sizes.reduce((current, item) => (item.bytes > current.bytes ? item : current));
  const largestPath = path.relative(dist, largest.file).split(path.sep).join('/');
  console.log(
    `Validated Cloudflare Pages bundle: ${files.length} files, largest ${largestPath} at ${(largest.bytes / mebibyte).toFixed(2)} MiB, ${staticRedirects} static redirects, ${dynamicRedirects.length} dynamic redirects, and ${headerRules.length} header rules.`,
  );
}
