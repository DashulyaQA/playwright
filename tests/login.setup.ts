import { expect, test as setup } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";

const USER = process.env.APP_USER_EMAIL!;
const PASS = process.env.APP_USER_PASS!;

setup("Login", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.loginAsUser(USER, PASS);
  await page.getByRole("button", { name: "Add car" }).waitFor();
  // await page.context().storageState({ path: "session-storage.json" });
  await page.getByRole("link", { name: " Profile" }).click();
  const profileHeader = await page
    .getByRole("heading", { name: "Profile" })
    .textContent();
  expect(profileHeader).toContain("Profile");
});
