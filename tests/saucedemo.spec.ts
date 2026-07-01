import { expect, test } from "@playwright/test";

test.describe("SauceDemo - unloginned", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("Login with invalid credentials", async ({ page }) => {
        await page.fill("#user-name", "standard_user");
        await page.fill("#password", "invalid_password");
        await page.click("#login-button");
        await expect(page.locator("[data-test='error']"), 'Error message should be visible with invalid credentials').toBeVisible();
    });

    test("Empty form validation", async ({ page }) => {
        await page.click("#login-button");
        await expect(page.locator("[data-test='error']"), 'Error message should be visible when form is empty').toBeVisible();
    });
});

test.describe("SauceDemo", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.fill("#user-name", "standard_user");
        await page.fill("#password", "secret_sauce");
        await page.click("#login-button");
    });

    test("Login with valid credentials", async ({ page }) => {
        await expect(page, 'User should be redirected to inventory page after successful login').toHaveURL(/inventory/);
    });

    test("Add product to cart", async ({ page }) => {
        await page.click(".inventory_item:first-child button");
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should show 1 item').toHaveText("1");
    });

    test("Remove product from cart", async ({ page }) => {
        await page.click(".inventory_item:first-child button");
        await page.click(".shopping_cart_link");
        await page.click("[data-test='remove-sauce-labs-backpack']");
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should not be visible after removing the product').not.toBeVisible();
    });

    test("Add 3 products, remove one and verify the badge updates", async ({ page }) => {
        await page.click(".inventory_item:nth-child(1) button");
        await page.click(".inventory_item:nth-child(2) button");
        await page.click(".inventory_item:nth-child(3) button");
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should show 3 items').toHaveText("3");
        await page.click(".shopping_cart_link");
        await page.click("[data-test='remove-sauce-labs-backpack']");
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should show 2 items after removing one').toHaveText("2");
    });

    test("Change the product sort order, verify the first product name changes", async ({ page }) => {
        const firstProductBeforeSort = await page.locator(".inventory_item_name").first().textContent();
        await page.selectOption(".product_sort_container", "lohi");
        const firstProductAfterSort = await page.locator(".inventory_item_name").first().textContent();
        expect(firstProductBeforeSort, 'First product name should change after sorting').not.toBe(firstProductAfterSort);
    });

    test("Add product to cart and verify it persists after page reload", async ({ page }) => {
        await page.click(".inventory_item:first-child button");
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should show 1 item').toHaveText("1");
        await page.reload();
        await expect(page.locator(".shopping_cart_badge"), 'Shopping cart badge should still show 1 item after page reload').toHaveText("1");
    });

});