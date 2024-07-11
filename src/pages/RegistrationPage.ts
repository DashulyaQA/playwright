import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegistrationPage extends BasePage {
  protected readonly _header: Locator;
  protected readonly _signInBtn: Locator;
  protected readonly _registrationBtn: Locator;
  protected readonly _modal;
  protected readonly _registrBtn;
  protected readonly _firstNameInput;
  protected readonly _lastNameInput;
  protected readonly _emailInput;
  protected readonly _passwordInput;
  protected readonly _confirmPassInput;
  protected readonly _myProfile;

  constructor(page: Page) {
    super(page, "/");
    this._header = this._page.locator(".header");
    this._signInBtn = this._header.getByRole("button", { name: "Sign in" });
    this._modal = this._page.locator(".modal-content");
    this._registrationBtn = this._modal.getByRole("button", {
      name: "Registration",
    });
    this._registrBtn = this._modal.getByRole("button", { name: "Register" });
    this._firstNameInput = this._modal.locator("#signupName");
    this._lastNameInput = this._modal.locator("#signupLastName");
    this._emailInput = this._modal.locator("#signupEmail");
    this._passwordInput = this._modal.locator("#signupPassword");
    this._confirmPassInput = this._modal.locator("#signupRepeatPassword");
    this._myProfile = this._page.locator("#userNavDropdown");
  }

  async fillRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    await this.navigate();
    await this._signInBtn.click();
    await this._registrationBtn.click();
    await this._firstNameInput.fill(firstName);
    await this._lastNameInput.fill(lastName);
    await this._emailInput.fill(email);
    await this._passwordInput.fill(password);
    await this._confirmPassInput.fill(confirmPassword);
  }

  async clickRegister() {
    await this._registrBtn.click();
  }

  get myProfile() {
    return this._myProfile;
  }
}
