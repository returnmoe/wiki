import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ARTICLE_KINDS } from './lib/config';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase kebab-case ID');
const locale = z.enum(['en', 'pt-BR']);

const linkedValue = z
  .object({
    text: z.string().min(1),
    article: id.optional(),
    url: z.url().optional(),
  })
  .strict()
  .refine((value) => !(value.article && value.url), 'Choose either article or url, not both');

const infoboxValue = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
  linkedValue,
  z.array(linkedValue).min(1),
]);

const image = z
  .object({
    src: z.string().startsWith('/media/'),
    alt: z.string().min(1),
    crop: z.boolean().optional(),
    surface: z.enum(['light', 'dark']).optional(),
    caption: z.string().optional(),
    credit: z.string().optional(),
    sourceUrl: z.url().optional(),
    license: z.string().default('Unlicense'),
  })
  .strict();

const infobox = z
  .object({
    image: image.optional(),
    fields: z
      .array(
        z
          .object({
            key: z.string().regex(/^[a-z][a-z0-9_]*$/),
            label: z.string().min(1).optional(),
            value: infoboxValue,
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

const gallery = z
  .object({
    items: z.array(image).default([]),
  })
  .strict();

const articleSchema = z
  .object({
    id,
    title: z.string().min(1),
    summary: z.string().min(1),
    locale,
    kind: z.enum(ARTICLE_KINDS),
    categories: z.array(id).min(1),
    aliases: z.array(z.string().min(1)).default([]),
    redirects: z.array(id).default([]),
    sortKey: z.string().min(1).optional(),
    related: z.array(id).default([]),
    authoritative: z.boolean().default(false),
    revision: z.number().int().positive().optional(),
    translatedFromRevision: z.number().int().positive().optional(),
    infobox: infobox.optional(),
    gallery: gallery.optional(),
  })
  .strict()
  .superRefine((article, context) => {
    if (article.locale === 'en') {
      if (!article.revision) {
        context.addIssue({
          code: 'custom',
          path: ['revision'],
          message: 'English articles require revision',
        });
      }
      if (article.translatedFromRevision) {
        context.addIssue({
          code: 'custom',
          path: ['translatedFromRevision'],
          message: 'English articles cannot use translatedFromRevision',
        });
      }
    } else {
      if (!article.translatedFromRevision) {
        context.addIssue({
          code: 'custom',
          path: ['translatedFromRevision'],
          message: 'Brazilian Portuguese articles require translatedFromRevision',
        });
      }
      if (article.revision) {
        context.addIssue({
          code: 'custom',
          path: ['revision'],
          message: 'Brazilian Portuguese articles use translatedFromRevision instead of revision',
        });
      }
    }
  });

const categorySchema = z
  .object({
    id,
    title: z.string().min(1),
    summary: z.string().min(1),
    locale,
    parent: id.optional(),
    order: z.number().int().nonnegative().default(100),
  })
  .strict();

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: articleSchema,
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: categorySchema,
});

export const collections = { articles, categories };
