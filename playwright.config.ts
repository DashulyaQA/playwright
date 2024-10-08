import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  // testMatch: "**.spec.ts",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  // ["json", { fileName: "results.json" }],

  testIgnore: "**.skip.ts",
  outputDir: "res",
  // globalSetup: "global-setup.ts", // before all test
  // globalTeardown: "global-setup.ts", // after all tests
  // grep: new RegExp('has title') // ранит только выбраные тесты, можно и по тегу {tag: "@api"}
  // after all tests
  // testMatch: "",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.USER_NAME!,
      password: process.env.USER_PASS!,
    },
    trace: "on",
    testIdAttribute: "qa-dont-touch",
  },
  projects: [
    {
      name: "qauto",
      testMatch: "cars.spec.ts",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
        // storageState: "session-storage.json",
      },
      // dependencies: ["login"],
    },
    {
      name: "login",
      testMatch: "login.setup.ts",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "moking",
      testMatch: "**spec.ts",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "apicars",
      testMatch: "api.create.cars.ts",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: "fixtures",
    //   testMatch: "**.spec.ts",
    //   testDir: "./fixtures",
    //   use: { ...devices["Desktop Chrome"] },
    // },
  ],

  /* Configure projects for major browsers */

  // {
  //   name: "chromium",
  //   use: { ...devices["Desktop Chrome"] },
  // },

  // {
  //   name: "firefox",
  //   use: { ...devices["Desktop Firefox"] },
  // },

  // {
  //   name: "webkit",
  //   use: { ...devices["Desktop Safari"] },
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

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
