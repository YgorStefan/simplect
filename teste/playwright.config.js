import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  use: {
    baseURL: 'http://localhost:3333',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'node server.mjs',
    port: 3333,
    reuseExistingServer: true,
  },
});
