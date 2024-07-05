import { test, expect } from "@playwright/test";
import { waitForDebugger } from "inspector";
import { Page } from "@playwright/test";

function getLocators(page: Page) {
  const header = page.locator(".header");
  const signInBtn = header.getByRole("button", { name: "Sign in" });
  const modal = page.locator(".modal-content");
  const registrationBtn = page.getByRole("button", { name: "Registration" });
  const registrBtn = modal.getByRole("button", { name: "Register" });
  const firstNameInput = modal.locator("#signupName");
  const lastNameInput = modal.locator("#signupLastName");
  const emailInput = modal.locator("#signupEmail");
  const passwordInput = modal.locator("#signupPassword");
  const confirmPassInput = modal.locator("#signupRepeatPassword");
  const myProfile = page.locator("#userNavDropdown");

  return {
    header,
    signInBtn,
    modal,
    registrationBtn,
    registrBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
    myProfile,
  };
}
test("Register user correct", async ({ page }) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    registrBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
    myProfile,
  } = getLocators(page);

  await signInBtn?.click();
  await registrationBtn.click();
  await firstNameInput.fill("Dashulik");
  await lastNameInput.fill("Lavrenko");
  await emailInput.fill(`daria+${Math.round(100 * Math.random())}@test.com`);
  await passwordInput.fill("Password1234!");
  await confirmPassInput.fill("Password1234!");
  await registrBtn.click();
  await expect(myProfile).toBeVisible();
});

test("Passwords not match", async ({ page }) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
  } = getLocators(page);

  await signInBtn.click();
  await registrationBtn.click();
  await firstNameInput.fill("Jhon");
  await lastNameInput.fill("Smith");
  await emailInput.fill(`daria+${Math.round(100 * Math.random())}@test.com`);
  await passwordInput.fill("Password123!");
  await confirmPassInput.fill("Password12");
  //   await registrBtn.click();
  await page.getByRole("heading", { name: "Registration" }).click();
  expect(page.getByText("Passwords do not match")).toBeVisible();
});

test("Wrong password", async ({ page }) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
  } = getLocators(page);

  await signInBtn.click();
  await registrationBtn.click();
  await firstNameInput.fill("Jhon");
  await lastNameInput.fill("Smith");
  await emailInput.fill(`daria+${Math.round(100 * Math.random())}@test.com`);
  await passwordInput.fill("hello");
  await confirmPassInput.click();
  await passwordInput.click();

  await expect(
    page.getByText(
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
      {
        exact: true,
      }
    )
  ).toBeVisible();
  await expect(page.getByText("Re-enter password required")).toBeVisible();
});

test("Create user with inccorect 'Name' and 'Last name ", async ({ page }) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
  } = getLocators(page);

  await signInBtn.click();
  await registrationBtn.click();
  await firstNameInput.fill("1");
  await lastNameInput.fill("1");
  await emailInput.click();
  await expect(
    page.getByText("Name has to be from 2 to 20 characters long", {
      exact: true,
    })
  ).toBeVisible();
  await expect(page.getByText("Last name has to be from 2 to")).toBeVisible();
});

test("Check if button 'Register' is disabled untill user fill all data correct", async ({
  page,
}) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    registrBtn,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
  } = getLocators(page);

  await signInBtn?.click();
  await registrationBtn.click();
  await lastNameInput.fill("Lavrenko");
  await emailInput.fill(`daria+${Math.round(100 * Math.random())}@test.com`);
  await passwordInput.fill("Password1234!");
  await confirmPassInput.fill("Password1234!");

  expect(registrBtn).toBeDisabled();
});

test("Check validation for 'Email'", async ({ page }) => {
  await page.goto("/");

  const { signInBtn, registrationBtn, emailInput, passwordInput } =
    getLocators(page);

  await signInBtn?.click();
  await registrationBtn.click();
  await emailInput.fill("hi");
  await passwordInput.click();

  expect(page.getByText("Email is incorrect")).toBeVisible();
});

test("Check all fields are requiured", async ({ page }) => {
  await page.goto("/");

  const {
    signInBtn,
    registrationBtn,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    confirmPassInput,
  } = getLocators(page);

  await signInBtn?.click();
  await registrationBtn.click();
  await firstNameInput.click();
  await lastNameInput.click();
  await emailInput.click();
  await passwordInput.click();
  await confirmPassInput.click();
  await passwordInput.click();

  expect(page.getByText("Name required", { exact: true })).toBeVisible();
  expect(page.getByText("Last name required", { exact: true })).toBeVisible();
  expect(page.getByText("Email required", { exact: true })).toBeVisible();
  expect(page.getByText("Password required", { exact: true })).toBeVisible();
  expect(
    page.getByText("Re-enter password required", { exact: true })
  ).toBeVisible();
});
