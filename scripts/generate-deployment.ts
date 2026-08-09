import { access, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadSeoContent } from './load-seo-content';
import { buildSeoManifest, renderHeaders, renderRedirects } from '../src/lib/seo-manifest';

const root = process.cwd();
const dist = path.join(root, 'dist');
const portugueseRouteDirectory = path.join(dist, 'pt/404');
const portugueseRouteDocument = path.join(portugueseRouteDirectory, 'index.html');
const portugueseErrorDocument = path.join(dist, 'pt/404.html');

await access(portugueseRouteDocument);
await mkdir(path.dirname(portugueseErrorDocument), { recursive: true });
await rename(portugueseRouteDocument, portugueseErrorDocument);
await rm(portugueseRouteDirectory, { recursive: true });

const manifest = buildSeoManifest(await loadSeoContent(root));
await Promise.all([
  writeFile(path.join(dist, '_redirects'), renderRedirects(manifest), 'utf8'),
  writeFile(path.join(dist, '_headers'), renderHeaders(), 'utf8'),
]);

console.log(
  `Generated ${manifest.redirects.length} Cloudflare redirects, headers, and localized error documents.`,
);
