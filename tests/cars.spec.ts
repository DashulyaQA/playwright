import { expect } from "@playwright/test";
import { GaragePage } from "../src/pages/GaragePage";
import { userGaragePage as test } from "../fixtures/userGaragePage";

test.describe("Check fixture", () => {
  test("create car", async ({ pageGarage }) => {
    const garagePage = new GaragePage(pageGarage);
    await garagePage.waitForAddCarButton();
    await garagePage.addCar("Porsche", "911", 1234);
    const carList = await garagePage.getCarList();
    await expect(carList).toContain("Porsche 911");
  });
});
// test
