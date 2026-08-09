import type { APIRoute } from 'astro';
import { getSeoManifest } from '../lib/seo-manifest-astro';
import { renderSitemapIndex } from '../lib/seo-manifest';

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(renderSitemapIndex(await getSeoManifest()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
