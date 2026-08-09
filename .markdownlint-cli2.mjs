export default {
  config: {
    'line-length': false,
    'no-duplicate-heading': { siblings_only: true },
    'first-line-h1': false,
    'no-inline-html': { allowed_elements: ['SpoilerSection'] },
  },
  globs: ['README.md', 'CONTRIBUTING.md', 'docs/**/*.md', 'src/content/**/*.{md,mdx}'],
  ignores: ['node_modules/**', 'dist/**', '.astro/**'],
};
