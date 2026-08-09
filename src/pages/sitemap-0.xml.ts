import type { APIRoute } from 'astro';
import { getSeoManifest } from '../lib/seo-manifest-astro';
import { renderSitemap } from '../lib/seo-manifest';

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(renderSitemap(await getSeoManifest()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
