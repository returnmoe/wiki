import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Main Page presents the wiki portals and passes an accessibility scan', async ({ page }) => {
  await page.goto('/');
  const homeTitle = page.getByRole('heading', { level: 1, name: 'return moe wiki' });
  await expect(homeTitle).toBeVisible();
  const homeTitleSize = await homeTitle.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(homeTitleSize).toBeGreaterThanOrEqual(30);
  await expect(page.locator('.article-total')).toHaveText(/^\d+ articles$/);
  await expect(page.getByRole('link', { name: 'Characters', exact: true }).first()).toBeVisible();
  await expect(
    page.locator('.global-sidebar').getByRole('link', { name: 'AI', exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('.global-sidebar').getByRole('link', { name: 'Philosophy', exact: true }),
  ).toHaveAttribute('href', '/category/philosophy/');
  await expect(
    page.locator('.global-sidebar').getByRole('link', { name: 'Wiki', exact: true }),
  ).toHaveAttribute('href', '/category/wiki/');
  await expect(
    page.locator('.global-sidebar').getByRole('link', { name: 'Search', exact: true }),
  ).toHaveCount(0);
  const firstProjectCard = page.locator('.project-card').first();
  const projectCardBox = await firstProjectCard.boundingBox();
  const projectKindBox = await firstProjectCard.locator('small').boundingBox();
  expect((projectKindBox?.y ?? 0) - (projectCardBox?.y ?? 0)).toBeLessThan(30);
  await expect(page.locator('.global-sidebar .navigation-heading')).not.toContainText('return moe');
  const headerBox = await page.locator('.header-inner').boundingBox();
  const headerSearchBox = await page.locator('.header-search').boundingBox();
  expect(
    Math.abs(
      (headerBox?.x ?? 0) +
        (headerBox?.width ?? 0) / 2 -
        ((headerSearchBox?.x ?? 0) + (headerSearchBox?.width ?? 0) / 2),
    ),
  ).toBeLessThan(2);

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(serious).toEqual([]);

  await expect(page).toHaveScreenshot('main-page-dark.png', { fullPage: true });
});

test('Soraya article renders its infobox, contents, and master-branch actions', async ({
  page,
}) => {
  await page.goto('/soraya/');
  await expect(page.getByRole('heading', { level: 1, name: 'Soraya' })).toBeVisible();
  const authorityNotice = page.locator('.authority-notice');
  await expect(authorityNotice).toContainText('Authoritative article');
  await expect(authorityNotice).toContainText(
    'This page is a primary source published by return moe and is authoritative within the scope it describes',
  );
  await expect(authorityNotice).toContainText('Only articles displaying this notice');
  await expect(authorityNotice).not.toContainText('Soraya');
  const authorityIcon = authorityNotice.locator('.authority-notice-icon');
  const authorityTitle = authorityNotice.locator('strong');
  const authorityDetail = authorityNotice.locator('.authority-notice-copy > span');
  await expect(authorityIcon.locator('svg')).toBeVisible();
  await expect(authorityIcon).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(authorityIcon).toHaveCSS('border-top-width', '0px');
  expect(await authorityTitle.evaluate((element) => getComputedStyle(element).color)).toBe(
    await authorityDetail.evaluate((element) => getComputedStyle(element).color),
  );
  const authorityIconBox = await authorityIcon.boundingBox();
  const authorityTitleBox = await authorityTitle.boundingBox();
  expect(
    Math.abs(
      (authorityIconBox?.y ?? 0) +
        (authorityIconBox?.height ?? 0) / 2 -
        ((authorityTitleBox?.y ?? 0) + (authorityTitleBox?.height ?? 0) / 2),
    ),
  ).toBeLessThan(2);
  await expect(
    authorityNotice.getByRole('link', { name: 'What this designation means' }),
  ).toHaveAttribute('href', '/authoritative-articles/');
  await expect(page.getByRole('complementary', { name: /Soraya Character/ })).toContainText(
    'Brand ambassador',
  );
  await expect(page.locator('.infobox-header span')).toHaveText('Character');
  await expect(page.locator('.infobox-header span')).toHaveCSS('text-transform', 'none');
  const infoboxCaption = page.locator('.infobox-image-caption');
  const infoboxSource = page.locator('.infobox-image-source');
  await expect(infoboxCaption).toHaveText("Soraya's profile portrait");
  await expect(infoboxSource).toHaveText('Source: return moe');
  await expect(infoboxSource.locator('.image-source-label')).toHaveCSS('font-weight', '500');
  const infoboxCaptionBox = await infoboxCaption.boundingBox();
  const infoboxSourceBox = await infoboxSource.boundingBox();
  expect(infoboxSourceBox?.y ?? 0).toBeGreaterThanOrEqual(
    (infoboxCaptionBox?.y ?? 0) + (infoboxCaptionBox?.height ?? 0),
  );
  await expect(page.locator('.infobox-image figcaption')).not.toContainText(' · ');
  await expect(page.getByRole('navigation', { name: 'Contents' })).toContainText('Identity');
  await expect(page.getByRole('navigation', { name: 'Contents' })).toContainText('Gallery');
  await expect(page.getByRole('complementary', { name: /Soraya Character/ })).toContainText(
    'March 1, 2023',
  );
  await expect(page.locator('.article-copy')).toContainText(
    'currently exists as an interactive chatbot on Telegram',
  );
  await expect(page.getByRole('link', { name: 'Rapport Engine' }).first()).toBeVisible();
  const externalVideoLink = page
    .locator('a[href="https://www.youtube.com/watch?v=ujhweyWjPM0"]')
    .first();
  await expect(externalVideoLink).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=ujhweyWjPM0',
  );
  await expect(externalVideoLink).toHaveAttribute('target', '_blank');
  await expect(externalVideoLink).toHaveAttribute('rel', /noopener/);
  await expect(externalVideoLink).toHaveAttribute('rel', /noreferrer/);
  await expect(page.locator('.header-links a[href="https://return.moe/"]')).toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(page.getByRole('link', { name: 'Rapport Engine' }).first()).not.toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(page.getByRole('heading', { level: 2, name: 'Gallery' })).toBeVisible();
  const gallery = page.locator('[data-article-gallery]');
  const firstGalleryItem = gallery.locator('[data-gallery-open]').first();
  await expect(gallery.locator('[data-gallery-open]')).toHaveCount(16);
  await expect(firstGalleryItem).toContainText('Default pose and uniform');
  await expect(gallery).not.toContainText('Unlicense');
  await expect(gallery.locator('.article-gallery-item small')).toHaveCount(0);

  await firstGalleryItem.scrollIntoViewIfNeeded();
  const scrollBeforeLightbox = await page.evaluate(() => window.scrollY);
  await firstGalleryItem.click();
  const lightbox = page.locator('[data-gallery-lightbox]');
  await expect(lightbox).toHaveJSProperty('open', true);
  await expect(lightbox).toBeVisible();
  await expect(lightbox).toHaveCSS('position', 'fixed');
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBeforeLightbox);
  const lightboxImage = lightbox.locator('[data-gallery-lightbox-image]');
  await expect(lightboxImage).toHaveAttribute(
    'src',
    '/media/characters/soraya/references/default-pose.jpg',
  );
  await expect(lightboxImage).toHaveAttribute(
    'alt',
    'Soraya pointing toward the viewer in her sailor uniform.',
  );
  await expect(lightboxImage).toHaveCSS('opacity', '1');
  await expect(lightbox).toContainText('Default pose and uniform');
  await expect(lightbox).toContainText(
    'Source: Echoes in the Latent Space (Reference Image Draft for Promotional Video)',
  );
  await expect(lightbox.locator('.image-source-label')).toHaveCSS('font-weight', '500');
  const lightboxSource = lightbox.locator('[data-gallery-lightbox-source-link]');
  await expect(lightboxSource).toHaveAttribute('target', '_blank');
  await expect(lightboxSource).toHaveAttribute('rel', /noopener/);
  await expect(lightboxSource).toHaveAttribute('rel', /noreferrer/);
  await expect(lightbox).not.toContainText('Unlicense');
  const lightboxBox = await lightbox.boundingBox();
  const closeBox = await lightbox.getByRole('button', { name: 'Close' }).boundingBox();
  expect(
    (lightboxBox?.x ?? 0) +
      (lightboxBox?.width ?? 0) -
      ((closeBox?.x ?? 0) + (closeBox?.width ?? 0)),
  ).toBeLessThan(20);
  expect((closeBox?.y ?? 0) - (lightboxBox?.y ?? 0)).toBeLessThan(20);
  const lightboxAccessibility = await new AxeBuilder({ page }).analyze();
  const lightboxSerious = lightboxAccessibility.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(lightboxSerious).toEqual([]);
  await lightbox.getByRole('button', { name: 'Next image' }).click();
  await expect(lightboxImage).toHaveAttribute(
    'alt',
    'Soraya in her sailor uniform before a painted-wing mural.',
  );
  await page.keyboard.press('ArrowRight');
  await expect(lightboxImage).toHaveAttribute('alt', 'Soraya in uniform beneath cherry blossoms.');
  await page.keyboard.press('Escape');
  await expect(lightbox).toHaveJSProperty('open', false);
  await expect(firstGalleryItem).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBeforeLightbox);
  const galleryBeforeReferences = await page.locator('.article-copy').evaluate((copy) => {
    const gallery = copy.querySelector('[data-article-gallery]');
    const references = copy.querySelector('#references');
    if (!gallery || !references) return false;
    return Boolean(gallery.compareDocumentPosition(references) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(galleryBeforeReferences).toBe(true);
  await expect(page.locator('.article-copy > .table-of-contents')).toBeVisible();
  await expect(page.locator('.toc-sidebar')).toHaveCount(0);
  const contentsOrder = await page.locator('.article-copy').evaluate((copy) => {
    const lead = copy.querySelector('p');
    const contents = copy.querySelector('.table-of-contents');
    const firstSection = copy.querySelector('h2');
    if (!lead || !contents || !firstSection) return false;
    return Boolean(
      lead.compareDocumentPosition(contents) & Node.DOCUMENT_POSITION_FOLLOWING &&
      contents.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
  expect(contentsOrder).toBe(true);
  expect(
    await page
      .getByRole('heading', { level: 1, name: 'Soraya' })
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain('Source Serif 4');
  expect(
    await page
      .getByRole('heading', { level: 2, name: 'Identity' })
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain('Inter');
  const italicFaceStatus = await page.evaluate(async () => {
    const italicFace = [...document.fonts].find(
      (face) => face.family === 'Inter' && face.style === 'italic' && face.weight === '400',
    );
    if (!italicFace) return 'missing';
    await italicFace.load();
    return italicFace.status;
  });
  expect(italicFaceStatus).toBe('loaded');
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveAttribute(
    'href',
    /\/edit\/master\/src\/content\/articles\/en\/characters\/soraya\.md$/,
  );
  await expect(page.getByRole('link', { name: 'History' })).toHaveAttribute(
    'href',
    /\/commits\/master\/src\/content\/articles\/en\/characters\/soraya\.md$/,
  );
  await expect(page.locator('a[href*="/main/"]')).toHaveCount(0);
  const editBox = await page.getByRole('link', { name: 'Edit' }).boundingBox();
  const reportLink = page.getByRole('link', { name: 'Report an issue' });
  const reportBox = await reportLink.boundingBox();
  expect(Math.abs((editBox?.y ?? 0) - (reportBox?.y ?? 0))).toBeLessThan(2);
  const editFontSize = await page
    .getByRole('link', { name: 'Edit' })
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  const reportFontSize = await reportLink.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(reportFontSize).toBeLessThan(editFontSize);
  await expect(reportLink).toHaveCSS('font-weight', '400');
  const editLineHeight = await page
    .getByRole('link', { name: 'Edit' })
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).lineHeight));
  const reportLineHeight = await reportLink.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).lineHeight),
  );
  expect(reportLineHeight / reportFontSize).toBeCloseTo(editLineHeight / editFontSize, 2);

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(serious).toEqual([]);

  await expect(page).toHaveScreenshot('soraya-article-dark.png', { fullPage: true });
});

test('authoritative status is explicit and its policy page explains the boundary', async ({
  page,
}) => {
  await page.goto('/rina/');
  await expect(page.locator('.authority-notice')).toContainText('Authoritative article');

  await page.goto('/pt/rina/');
  await expect(page.locator('.authority-notice')).toContainText('Artigo autoritativo');
  await expect(page.getByRole('navigation', { name: 'Ferramentas do artigo' })).toBeVisible();

  await page.goto('/evangeline-laneth/');
  await expect(page.locator('.authority-notice')).toHaveCount(0);

  await page.goto('/authoritative-articles/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Authoritative articles' }),
  ).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText(
    'A page has this status only when it displays an Authoritative article notice',
  );
  await expect(page.locator('.article-copy')).toContainText(
    'a character created by return moe is not automatically authoritative on the wiki',
  );
  await expect(page.locator('.article-copy')).toContainText(
    'if a character is defined primarily through a visual novel',
  );
  await expect(page.locator('.article-copy')).toContainText(
    'This authority is evidentiary and branch-relative',
  );
  const authoritativeList = page.locator('.authoritative-article-list');
  await expect(
    authoritativeList.getByRole('heading', { name: 'List of authoritative articles' }),
  ).toBeVisible();
  await expect(authoritativeList.locator('li')).toHaveCount(3);
  await expect(authoritativeList.locator('li').getByRole('link')).toHaveText([
    'Informational Ontology Framework (return moe)',
    'Rina',
    'Soraya',
  ]);
  await expect(
    authoritativeList.getByRole('link', { name: 'Informational Ontology Framework (return moe)' }),
  ).toHaveAttribute('href', '/informational-ontology/');
  await expect(authoritativeList.getByRole('link', { name: 'Rina' })).toHaveAttribute(
    'href',
    '/rina/',
  );
  await expect(authoritativeList.getByRole('link', { name: 'Soraya' })).toHaveAttribute(
    'href',
    '/soraya/',
  );

  await page.goto('/informational-ontology/');
  const ontologyTitle = page.getByRole('heading', {
    level: 1,
    name: 'Informational Ontology Framework (return moe)',
  });
  await expect(ontologyTitle).toBeVisible();
  const titleMetrics = await ontologyTitle.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
    };
  });
  expect(titleMetrics.height).toBeLessThan(titleMetrics.lineHeight * 1.25);
  await expect(page.locator('.authority-notice')).toContainText('Authoritative article');
  await expect(page.getByRole('heading', { level: 3, name: /^The Ship of Theseus/ })).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText(
    'No fixed percentage of shared information determines whether two branches still present the same subject',
  );
  await expect(
    page.getByRole('heading', { level: 3, name: /^Canon(?: as a social layer)?$/ }),
  ).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText(
    'A fan-maintained branch and a creator-maintained branch therefore have equal ontological standing as branches',
  );
  await expect(page.locator('.article-copy')).not.toContainText('Canon as a privileged branch');
  await expect(
    page.locator('img[src="/media/concepts/kubernetes-iof-comparison.svg"]'),
  ).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText(
    'Reality and the virtual world cannot fully serve as markers of existence',
  );
  const spoilerNotice = page.locator('.spoiler-notice').first();
  await expect(spoilerNotice).not.toHaveAttribute('open', '');
  await expect(spoilerNotice.locator('summary')).toContainText('Major spoiler warning');
  await expect(spoilerNotice.locator('summary')).not.toContainText('Lilith');
  await expect(spoilerNotice.locator('.spoiler-notice-content')).toBeHidden();
  await spoilerNotice.locator('summary').click();
  await expect(spoilerNotice).toHaveAttribute('open', '');
  const spoilerContent = spoilerNotice.locator('.spoiler-notice-content');
  await expect(spoilerContent).toBeVisible();
  const spoilerColors = await spoilerNotice.evaluate((notice) => {
    const summary = notice.querySelector('summary');
    const content = notice.querySelector('.spoiler-notice-content');
    const paragraph = content?.querySelector('p');
    return {
      summaryBackground: summary ? getComputedStyle(summary).backgroundColor : '',
      contentBackground: content ? getComputedStyle(content).backgroundColor : '',
      contentText: paragraph ? getComputedStyle(paragraph).color : '',
      articleText: getComputedStyle(notice.closest('.article-copy')!).color,
    };
  });
  expect(spoilerColors.contentBackground).not.toBe(spoilerColors.summaryBackground);
  expect(spoilerColors.contentText).toBe(spoilerColors.articleText);
  await expect(page.getByRole('heading', { level: 3, name: /public personas/i })).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText('NEEDY GIRL OVERDOSE');
  await expect(page.getByRole('heading', { level: 3, name: 'NEVER' })).toBeVisible();
  await expect(page.locator('.article-copy blockquote')).toHaveCount(2);
  await expect(
    page.locator('.article-copy a[href="/persona-selection-model/"]').first(),
  ).toBeVisible();
  await page.locator('.language-menu > summary').click();
  await expect(
    page.locator('.language-menu').getByRole('link', { name: 'Português (Brasil)' }),
  ).toHaveAttribute('href', '/pt/informational-ontology/');

  await page.goto('/category/philosophy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Philosophy' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Informational Ontology Framework (return moe)' }),
  ).toHaveAttribute('href', '/informational-ontology/');

  await page.goto('/category/wiki/');
  await expect(page.getByRole('heading', { level: 1, name: 'Wiki' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Authoritative articles' })).toHaveAttribute(
    'href',
    '/authoritative-articles/',
  );
  await expect(page.locator('a[href="/return-moe-wiki/"]')).toBeVisible();

  await page.goto('/pt/authoritative-articles/');
  const portugueseAuthoritativeList = page.locator('.authoritative-article-list');
  await expect(portugueseAuthoritativeList.locator('li')).toHaveCount(3);
  await expect(
    portugueseAuthoritativeList.getByRole('link', {
      name: 'Estrutura de Ontologia Informacional (return moe)',
    }),
  ).toHaveAttribute('href', '/pt/informational-ontology/');

  await page.goto('/pt/informational-ontology/');
  const portugueseSpoilerNotice = page.locator('.spoiler-notice').first();
  await expect(portugueseSpoilerNotice.locator('summary')).toContainText(
    'Aviso de spoilers importantes',
  );
  await expect(portugueseSpoilerNotice.locator('summary')).not.toContainText(
    'Major spoiler warning',
  );
});

test('gallery lightbox keeps its size during rapid keyboard navigation', async ({ page }) => {
  let releaseDelayedImage!: () => void;
  const delayedImage = new Promise<void>((resolve) => {
    releaseDelayedImage = resolve;
  });
  await page.route('**/painted-wings-a.jpg', async (route) => {
    await delayedImage;
    await route.continue();
  });

  await page.goto('/soraya/');
  const firstGalleryItem = page.locator('[data-gallery-open]').first();
  await firstGalleryItem.scrollIntoViewIfNeeded();
  await firstGalleryItem.click();

  const lightbox = page.locator('[data-gallery-lightbox]');
  const lightboxImage = lightbox.locator('[data-gallery-lightbox-image]');
  await expect(lightboxImage).toHaveAttribute(
    'src',
    '/media/characters/soraya/references/default-pose.jpg',
  );
  const loadedBox = await lightbox.boundingBox();

  await page.keyboard.press('ArrowRight');
  await expect(lightbox).toHaveAttribute('data-loading', 'true');
  const loadingBox = await lightbox.boundingBox();
  expect(Math.abs((loadingBox?.width ?? 0) - (loadedBox?.width ?? 0))).toBeLessThan(2);
  expect(Math.abs((loadingBox?.height ?? 0) - (loadedBox?.height ?? 0))).toBeLessThan(2);

  await page.keyboard.press('ArrowRight');
  await expect(lightboxImage).toHaveAttribute(
    'src',
    '/media/characters/soraya/references/cherry-blossoms.jpg',
  );
  await expect(lightbox).not.toHaveAttribute('data-loading', 'true');

  const delayedResponsePromise = page.waitForResponse('**/painted-wings-a.jpg');
  releaseDelayedImage();
  const delayedResponse = await delayedResponsePromise;
  await delayedResponse.finished();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(lightboxImage).toHaveAttribute(
    'src',
    '/media/characters/soraya/references/cherry-blossoms.jpg',
  );
});

test('Soraya has a compact, complete print layout at physical-page width', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 960 });
  await page.goto('/soraya/');

  const gallery = page.locator('[data-article-gallery]');
  const galleryImages = gallery.locator('[data-gallery-open] img');
  await expect(galleryImages.first()).toHaveAttribute('loading', 'lazy');

  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.skip-link')).toBeHidden();
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.global-sidebar')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('.article-tools-row')).toBeHidden();
  await expect(page.locator('.pagefind-data')).toBeHidden();
  await expect(page.locator('[data-gallery-lightbox]')).toBeHidden();
  await expect(page.locator('[data-gallery-close]')).toBeHidden();

  const article = page.locator('.wiki-article');
  const infobox = page.locator('.infobox');
  await expect(infobox).toHaveCSS('float', 'right');
  await expect(infobox).toHaveCSS('overflow', 'visible');
  const articleBox = await article.boundingBox();
  const infoboxBox = await infobox.boundingBox();
  expect((infoboxBox?.width ?? 0) / (articleBox?.width ?? 1)).toBeGreaterThan(0.35);
  expect((infoboxBox?.width ?? 0) / (articleBox?.width ?? 1)).toBeLessThan(0.4);
  expect(await infobox.evaluate((element) => getComputedStyle(element).breakInside)).toMatch(
    /^avoid/,
  );

  const contents = page.getByRole('navigation', { name: 'Contents' });
  await expect(contents).toBeVisible();
  await expect(contents.locator(':scope > ol')).toHaveCSS('column-count', '2');

  await expect(gallery.locator('.article-gallery-grid')).toHaveCSS('display', 'grid');
  const galleryColumns = await gallery
    .locator('.article-gallery-grid')
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(galleryColumns).toBe(3);
  await expect(galleryImages.first()).toHaveAttribute('loading', 'eager');
  await expect
    .poll(
      () =>
        galleryImages.evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);

  const bodyLink = page.getByRole('link', { name: 'Rapport Engine' }).first();
  const referenceLink = page.locator('.footnotes a[href="https://return.moe/"]').first();
  expect(await bodyLink.evaluate((element) => getComputedStyle(element, '::after').content)).toBe(
    'none',
  );
  expect(
    await referenceLink.evaluate((element) => getComputedStyle(element, '::after').content),
  ).toContain('https://return.moe/');
  await expect(page.locator('.footnotes [data-footnote-backref]').first()).toBeHidden();

  const printPalette = async () =>
    page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      const articleStyle = getComputedStyle(document.querySelector('.wiki-article')!);
      return {
        colorScheme: rootStyle.colorScheme,
        rootBackground: rootStyle.backgroundColor,
        bodyBackground: bodyStyle.backgroundColor,
        articleBackground: articleStyle.backgroundColor,
        text: articleStyle.color,
        primary: rootStyle.getPropertyValue('--color-primary').trim(),
      };
    });

  const darkPrintPalette = await printPalette();
  expect(darkPrintPalette).toEqual({
    colorScheme: 'light',
    rootBackground: 'rgb(255, 255, 255)',
    bodyBackground: 'rgb(255, 255, 255)',
    articleBackground: 'rgb(255, 255, 255)',
    text: 'rgb(17, 17, 17)',
    primary: '#0645ad',
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  const darkPrintPixels = await page.screenshot({ animations: 'disabled' });
  await page.locator('html').evaluate((element) => {
    element.dataset.theme = 'light';
  });
  expect(await printPalette()).toEqual(darkPrintPalette);
  const lightPrintPixels = await page.screenshot({ animations: 'disabled' });
  expect(lightPrintPixels.equals(darkPrintPixels)).toBe(true);

  await expect(page).toHaveScreenshot('soraya-article-print.png', {
    animations: 'disabled',
    fullPage: true,
  });
});

test('technical articles print tables and code without mobile clipping', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 960 });
  await page.goto('/model-training/');
  await page.emulateMedia({ media: 'print' });

  const table = page.locator('.article-copy table').first();
  const tableHeader = table.locator('thead');
  const tableRow = table.locator('tbody tr').first();
  const tableCell = table.locator('td').first();
  await expect(table).toBeVisible();
  await expect(table).toHaveCSS('display', 'table');
  await expect(table).toHaveCSS('overflow', 'visible');
  await expect(table).toHaveCSS('table-layout', 'fixed');
  await expect(tableHeader).toHaveCSS('display', 'table-header-group');
  await expect(tableCell).toHaveCSS('white-space', 'normal');
  await expect(tableCell).toHaveCSS('overflow-wrap', 'anywhere');
  expect(await tableRow.evaluate((element) => getComputedStyle(element).breakInside)).toMatch(
    /^avoid/,
  );

  const codeBlock = page.locator('.article-copy pre').first();
  await expect(codeBlock).toBeVisible();
  await expect(codeBlock).toHaveCSS('background-color', 'rgb(243, 243, 243)');
  await expect(codeBlock).toHaveCSS('color', 'rgb(17, 17, 17)');
  await expect(codeBlock).toHaveCSS('overflow', 'visible');
  await expect(codeBlock).toHaveCSS('white-space', 'pre-wrap');
  expect(await codeBlock.evaluate((element) => getComputedStyle(element).breakInside)).toMatch(
    /^avoid/,
  );
  const codeDimensions = await codeBlock.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(codeDimensions.scrollWidth).toBeLessThanOrEqual(codeDimensions.clientWidth + 1);

  await expect(page).toHaveScreenshot('model-training-article-print.png', {
    animations: 'disabled',
    fullPage: true,
  });
});

test('studio and repository facts use their canonical display forms', async ({ page }) => {
  await page.goto('/return-moe/');
  await expect(page.getByRole('heading', { level: 1, name: 'return moe' })).toBeVisible();
  await expect(
    page.getByText('one-person creative studio', { exact: false }).first(),
  ).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText('founded the studio');
  await expect(page.locator('.article-copy')).toContainText('They develop its projects');
  await expect(page.locator('.article-copy')).not.toContainText('He works');
  const keyPeople = page.locator('.infobox-facts > div').filter({ hasText: 'Key people' });
  await expect(keyPeople).toContainText('Rodrigo Laneth');
  await expect(keyPeople).not.toContainText('Soraya');

  await page.goto('/rapport-engine/');
  await expect(
    page.getByRole('link', { name: 'github.com/returnmoe/rapport_engine' }),
  ).toBeVisible();
  await expect(page.getByRole('complementary', { name: /Rapport Engine Software/ })).toContainText(
    'Discontinued',
  );
  await expect(page.locator('.article-copy')).toContainText(
    'rather than being the software used for her March 2023 release',
  );
});

test('Rodrigo Laneth article distinguishes the representative OC and keeps its return moe scope', async ({
  page,
}) => {
  await page.goto('/rodrigo-laneth/');

  const infobox = page.getByRole('complementary', { name: /Rodrigo Laneth Person/ });
  await expect(infobox).toContainText('they/them');
  await expect(infobox).toContainText('Miralium Research');
  await expect(infobox).toContainText('return moe');
  await expect(infobox.getByRole('link', { name: 'rlaneth.com' })).toHaveAttribute(
    'href',
    'https://rlaneth.com/',
  );
  await expect(
    infobox.getByRole('img', {
      name: /Anime-style original character with long charcoal hair/,
    }),
  ).toBeVisible();
  await expect(infobox).toContainText('original character used by Rodrigo');
  await expect(page.locator('.article-copy')).toContainText(
    'portrait depicts an anime-style original character',
  );
  await expect(page.locator('.article-copy')).toContainText('wider biography');
  await expect(page.locator('.article-copy')).not.toContainText('CVE-2026-40460');
});

test('Miru has one-hop deployment aliases and a canonical merged article', async ({ page }) => {
  const redirects = await readFile('dist/_redirects', 'utf8');
  expect(redirects).toContain('/miru /miru-tracer/ 301');
  expect(redirects).toContain('/miru/ /miru-tracer/ 301');
  expect(redirects).toContain('/wiki/miru /miru-tracer/ 301');
  expect(redirects).toContain('/wiki/miru/ /miru-tracer/ 301');
  expect(redirects).toContain('/wiki/miru-tracer /miru-tracer/ 301');
  expect(redirects).toContain('/wiki/miru-tracer/ /miru-tracer/ 301');

  await page.goto('/miru-tracer/');
  await expect(page.getByRole('heading', { level: 1, name: 'Miru Tracer' })).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText('only released tool to use the name');
});

test('the wiki meta article defines scope, authority, and editing', async ({ page }) => {
  await page.goto('/return-moe-wiki/');
  await expect(page.getByRole('heading', { level: 1, name: 'return moe wiki' })).toBeVisible();
  await expect(page.locator('.article-copy')).toContainText(
    'Only an article displaying the explicit authoritative designation is a primary source',
  );
  await expect(page.locator('.article-copy')).toContainText('pull requests targeting the master');
  await expect(page.getByRole('link', { name: 'github.com/returnmoe/wiki' })).toBeVisible();
});

test('Characters covers the shared universe without a duplicate category label', async ({
  page,
}) => {
  await page.goto('/category/characters/');
  await expect(page.getByRole('heading', { level: 1, name: 'Characters' })).toBeVisible();
  await expect(page.locator('.breadcrumbs')).toContainText('Categories');
  await expect(page.locator('.special-page-header .namespace-label')).toHaveCount(0);
  await expect(page.locator('.category-description')).toContainText(
    'fictional identities and interactive personas',
  );
  const categoryWidth = (await page.locator('.wiki-main').boundingBox())?.width ?? 0;

  await page.goto('/soraya/');
  const articleWidth = (await page.locator('.wiki-main').boundingBox())?.width ?? 0;
  expect(Math.abs(categoryWidth - articleWidth)).toBeLessThan(1);

  await page.goto('/category/artificial-intelligence/');
  await expect(page.getByRole('heading', { level: 1, name: 'AI' })).toBeVisible();

  await page.goto('/category/organizations/');
  await expect(page.locator('.category-description')).toContainText(
    'activities, services, research, technologies',
  );
});

test('contribution controls remain compact and legible in the light theme', async ({ page }) => {
  await page.goto('/contribute/');
  if ((await page.locator('html').getAttribute('data-theme')) !== 'light') {
    await page.locator('[data-theme-toggle]').click();
  }

  const repositoryButton = page.locator('.prose-page .button-link');
  await expect(page.locator('.special-page-header .namespace-label')).toHaveCount(0);
  await expect(repositoryButton).toHaveCSS('color', 'rgb(255, 255, 255)');
  const codeBlockPadding = await page
    .locator('.prose-page pre')
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop));
  expect(codeBlockPadding).toBeLessThanOrEqual(13);
  expect(await page.locator('.prose-page pre').textContent()).toBe(
    [
      'git clone https://github.com/returnmoe/wiki.git',
      'cd wiki',
      'git switch master',
      'git pull --ff-only',
      'git switch -c article/my-change',
      'npm install',
      'npm run verify',
    ].join('\n'),
  );
  const codeBlockBox = await page.locator('.prose-page pre').boundingBox();
  expect(codeBlockBox?.width ?? 0).toBeLessThan(600);
  const mainBox = await page.locator('.wiki-main').boundingBox();
  expect(mainBox?.width ?? 0).toBeCloseTo(960, 0);

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );
  expect(serious).toEqual([]);

  await expect(page).toHaveScreenshot('contribute-page-light.png', { fullPage: true });
});

test('Pagefind search returns an article by title', async ({ page }) => {
  await page.goto('/search/?q=Soraya');
  await expect(page.locator('[data-search-results] a', { hasText: 'Soraya' })).toBeVisible();
  await expect(page.locator('.search-interface-page [data-search-status]')).toContainText('result');

  await page.goto('/pt/search/?q=Soraya');
  await expect(page.locator('[data-search-results] a', { hasText: 'Soraya' })).toBeVisible();
  await expect(page.locator('.search-interface-page [data-search-status]')).toHaveText(
    /^\d+ resultados?$/,
  );
});

test('theme selection persists after navigation', async ({ page }) => {
  await page.goto('/');
  const initial = await page.locator('html').getAttribute('data-theme');
  await page.locator('[data-theme-toggle]').click();
  const expected = initial === 'light' ? 'dark' : 'light';
  await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
});

test('light theme retains the return moe visual hierarchy', async ({ page }) => {
  await page.goto('/');
  if ((await page.locator('html').getAttribute('data-theme')) !== 'light') {
    await page.locator('[data-theme-toggle]').click();
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveScreenshot('main-page-light.png', { fullPage: true });
});

test('mobile navigation and infobox collapse into a single column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/soraya/');
  await page.locator('[data-open-navigation]').click();
  await expect(page.locator('#mobile-navigation')).toHaveJSProperty('open', true);
  await expect(
    page.locator('#mobile-navigation').getByRole('link', { name: 'Main Page' }),
  ).toBeVisible();
  await page.locator('[data-close-navigation]').click();
  await expect(page.getByRole('complementary', { name: /Soraya Character/ })).toHaveCSS(
    'float',
    'none',
  );
  const reportLink = page.getByRole('link', { name: 'Report an issue' });
  await expect(reportLink).toBeVisible();
  await expect(reportLink).toHaveAttribute('href', /github\.com\/returnmoe\/wiki\/issues\/new/);
  const reportBox = await reportLink.boundingBox();
  expect(reportBox).not.toBeNull();
  expect(reportBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect((reportBox?.x ?? 0) + (reportBox?.width ?? 0)).toBeLessThanOrEqual(390);
  await expect(page).toHaveScreenshot('soraya-article-mobile.png', { fullPage: true });
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveScreenshot('soraya-article-mobile-light.png', { fullPage: true });

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/pt/soraya/');
  const translatedReportLink = page.getByRole('link', { name: 'Informar um problema' });
  await expect(translatedReportLink).toBeVisible();
  const translatedReportBox = await translatedReportLink.boundingBox();
  expect(translatedReportBox).not.toBeNull();
  expect((translatedReportBox?.x ?? 0) + (translatedReportBox?.width ?? 0)).toBeLessThanOrEqual(
    320,
  );
});
