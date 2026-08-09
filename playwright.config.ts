import { defineConfig } from '@playwright/test';

const testPort = process.env.PLAYWRIGHT_TEST_PORT ?? '4321';
const testUrl = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: testUrl,
    browserName: 'chromium',
    colorScheme: 'dark',
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  webServer: {
    // Astro automatically backgrounds preview servers under coding agents. Playwright needs the
    // process to remain attached so it can own the server lifecycle.
    command: `ASTRO_PREVIEW_BACKGROUND=1 npm run preview -- --host 127.0.0.1 --port ${testPort}`,
    url: testUrl,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
