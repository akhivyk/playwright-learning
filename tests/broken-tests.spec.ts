import { test, expect } from "@playwright/test";

// Root cause: incorrect placeholder text
// Fix: update the placeholder text to match the actual input fields on the login page
// How I verify: ran the test and confirmed that it now passes without errors
test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});

// Root cause: Error locator and test is not correct
// Fix: Update locator for error message and update expected text
// How I verify: ran the test and confirmed that it now passes without errors
test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("[data-test='error']")).toHaveText(
    "Epic sadface: Username and password do not match any user in this service"   // ← is this the exact text?
  );
});

// Root cause: missing await before getting page locator
// Fix: adding await before page.locator to ensure the element is found before interacting with it
// How I verify: ran the test and confirmed that it now passes without errors
test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});