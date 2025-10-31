import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  //reporter: [['html', { outputFolder: 'test-results' }]],
  // reporter: [
  //   ['html'],
  //   ['json', { outputFile: 'test-results/results.json' }],
  //   ['junit', { outputFile: 'test-results/results.xml' }]
  // ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //baseURL: 'https://valentinos-magic-beans.click/',
    //baseURL: 'https://api.valentinos-magic-beans.click',
    headless: false,
    trace: 'on-first-retry',

    /* Take screenshot only when test fails */
    screenshot: 'only-on-failure',

    /* Record video only when test fails */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 1000
        }
      },
    }
  ]
    /* Test against mobile viewports. */
    // {
    //   name: 'mobile-chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     launchOptions: {
    //       slowMo: 1000
    //     }
    //   },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     launchOptions: {
    //       slowMo: 1000
    //     }
    //   },
    // },

    /* Test against branded browsers. */
  //   {
  //     name: 'microsoft-edge',
  //     use: { 
  //       ...devices['Desktop Edge'], 
  //       channel: 'msedge',
  //       launchOptions: {
  //         slowMo: 1000
  //       }
  //     },
  //   },
  //   {
  //     name: 'google-chrome',
  //     use: { 
  //       ...devices['Desktop Chrome'], 
  //       channel: 'chrome',
  //       launchOptions: {
  //         slowMo: 1000
  //       }
  //     },
  //   },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});