import test, { expect } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";

const USER = process.env.APP_USER_EMAIL!;
const PASS = process.env.APP_USER_PASS!;

test("Login", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.loginAsUser(USER, PASS);

  await page.getByRole("button", { name: "Add car" }).waitFor();
  const testData = {
    status: "ok",
    data: {
      userId: 132188,
      photoFilename: "default-user.png",
      name: "The Best",
      lastName: "student",
    },
  };
  await page.route("**/api/users/profile", (route) =>
    route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify(testData),
    })
  );
  await page.getByRole("link", { name: "Profile" }).click();
  await page.pause();
  const profileName = await page.getByText("The Best student").isVisible();
  expect(profileName).toBeTruthy();
});
