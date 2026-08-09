import type { APIRoute } from 'astro';
import { getSeoManifest } from '../lib/seo-manifest-astro';
import { renderRobotsTxt } from '../lib/seo-manifest';

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(renderRobotsTxt(await getSeoManifest()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
