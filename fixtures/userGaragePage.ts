import { test as baseTest, Page } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";

const USER = process.env.APP_USER_EMAIL!;
const PASS = process.env.APP_USER_PASS!;

export const userGaragePage = baseTest.extend<{ pageGarage: Page }>({
  pageGarage: async ({ browser, page }, use) => {
    const homePage = new HomePage(page);

    await homePage.navigate();
    await homePage.loginAsUser(USER, PASS);

    await page.context().storageState({ path: "session-storage.json" });
    const pageFromStorage = await browser.newPage({
      storageState: "session-storage.json",
    });

    await use(pageFromStorage);
  },
});
