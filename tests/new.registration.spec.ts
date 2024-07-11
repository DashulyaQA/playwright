import { test, expect } from "@playwright/test";
import { waitForDebugger } from "inspector";
import { Page } from "@playwright/test";
import { RegistrationPage } from "../src/pages/RegistrationPage";

test("Register user correctly", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "Dashulik",
    "Lavrenko",
    `daria+test+${Math.round(100 * Math.random())}@test.com`,
    "Password1234!",
    "Password1234!"
  );
  await registrationPage.clickRegister();
  await expect(registrationPage.myProfile).toBeVisible();
});

test("Passwords not match", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "Jhon",
    "Smith",
    `daria+test+${Math.round(100 * Math.random())}@test.com`,
    "Password123!",
    "Password12"
  );
  await page.getByRole("heading", { name: "Registration" }).click();
  expect(page.getByText("Passwords do not match")).toBeVisible();
});

test("Wrong password", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "Jhon",
    "Smith",
    `daria+test+${Math.round(100 * Math.random())}@test.com`,
    "hello",
    ""
  );
  await registrationPage["_passwordInput"].click();

  await expect(
    page.getByText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
      { exact: true }
    )
  ).toBeVisible();

  await expect(page.getByText("Re-enter password required")).toBeVisible();
});

test("Create user with incorrect 'Name' and 'Last name'", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "1",
    "1",
    `daria+test+${Math.round(100 * Math.random())}@test.com`,
    "Password1234!",
    "Password1234!"
  );
  await registrationPage["_emailInput"].click();

  await expect(
    page.getByText("Name has to be from 2 to 20 characters long", {
      exact: true,
    })
  ).toBeVisible();

  await expect(page.getByText("Last name has to be from 2 to")).toBeVisible();
});

test("Check if button 'Register' is disabled until user fills all data correctly", async ({
  page,
}) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "",
    "Lavrenko",
    `daria+test+${Math.round(100 * Math.random())}@test.com`,
    "Password1234!",
    "Password1234!"
  );

  await expect(registrationPage["_registrBtn"]).toBeDisabled();
});

test("Check validation for 'Email'", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage.fillRegistrationForm(
    "FirstName",
    "LastName",
    "hi",
    "Password1234!",
    "Password1234!"
  );
  await registrationPage["_passwordInput"].click();

  expect(page.getByText("Email is incorrect")).toBeVisible();
});

test("Check all fields are required", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.navigate();
  await registrationPage["_signInBtn"].click();
  await registrationPage["_registrationBtn"].click();
  await registrationPage["_firstNameInput"].click();
  await registrationPage["_lastNameInput"].click();
  await registrationPage["_emailInput"].click();
  await registrationPage["_passwordInput"].click();
  await registrationPage["_confirmPassInput"].click();
  await registrationPage["_passwordInput"].click();

  await expect(page.getByText("Name required", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Last name required", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("Email required", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Password required", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText("Re-enter password required", { exact: true })
  ).toBeVisible();
});
