// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { MsTeamsReporterOptions } from 'playwright-msteams-reporter';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  timeout: 240000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* added MS team report only for CI runs with dynamic parameters*/
  reporter: process.env.CI ? [
    ['html'],
    ['playwright-ctrf-json-reporter', {}],
    [
      'playwright-msteams-reporter',
      <MsTeamsReporterOptions>{
        webhookUrl: process.env.WEB_HOOKS_URL,
        webhookType: "powerautomate", // or "msteams"
        linkToResultsUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
        title:`${process.env.GITHUB_WORKFLOW}-${process.env.GITHUB_RUN_NUMBER}`,
        notifyOnSuccess: process.env.NOTIFY_ON_SUCCESS === 'true',
        mentionOnFailure: `${process.env.MENTIONS}`,
        mentionOnFailureText: "{mentions} check those failed tests!"
      }
    ]
  ]: [['html']],
  /* Wait timeout time */
  expect: {
    timeout: 30 * 1000,
  },
  
  // globalSetup: require.resolve("./globalSetup.js"),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'off',

    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',

    // Timeout for page waits
    actionTimeout: 40000,

    // launchOptions: {
    //   slowMo: 50,
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },



});

