import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { GaragePage } from "./GaragePage";
import { LogInModal } from "../components/LogInModal";

export class HomePage extends BasePage {
  protected readonly _header: Locator;
  protected readonly _guestLogIn: Locator;
  protected readonly _signInBtn: Locator;
  protected readonly _signInPopUp: LogInModal;

  constructor(page: Page) {
    super(page, "/");
    this._header = this._page.locator(".header");
    this._guestLogIn = this._header.getByRole("button", {
      name: "Guest log in",
    });
    this._signInBtn = this._header.getByRole("button", {
      name: "Sign in",
    });
    this._signInPopUp = new LogInModal(this._page);
  }

  async loginAsGuest() {
    await this._guestLogIn.click();
    return new GaragePage(this._page);
  }

  async loginAsUser(login: string, pass: string) {
    await this._signInBtn.click();
    await this._signInPopUp.login(login, pass);
  }

  get header() {
    return this._header;
  }
}
//pagesHome
