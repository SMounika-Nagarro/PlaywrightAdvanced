import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 90000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
     {
       name: 'firefox',
       use: { ...devices['Desktop Firefox'] },
     },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
