import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";
import { blockAds } from "./blockAds";
import { productA, productB } from "../test-data/products";

const parsePrice = (text: string) => Number(text.replace(/[^0-9]/g, ""));

test.describe("Cart", () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  test("cart shows correct quantity and per-row total for multiple products", async ({ page }) => {
    const detailsPage = new ProductDetailsPage(page);

    await test.step("Add Product A with default quantity", async () => {
      await productsPage.open();
      await productsPage.addToCart(productA.name);
      await productsPage.continueShopping();
    });

    await test.step("Add Product B with quantity 2 from its details page", async () => {
      await detailsPage.open(productB.id);
      await detailsPage.setQuantity(2);
      await detailsPage.addToCart();
      await detailsPage.continueShopping();
    });

    await test.step("Open the cart", async () => {
      await cartPage.open();
    });

    await test.step("Verify products, quantities and per-row totals", async () => {
      await expect(cartPage.row(productA.name), "Cart should contain Product A").toBeVisible();
      await expect(cartPage.row(productB.name), "Cart should contain Product B").toBeVisible();
      await expect(cartPage.quantity(productA.name), "Product A quantity should be 1").toHaveText("1");
      await expect(cartPage.quantity(productB.name), "Product B quantity should be 2").toHaveText("2");

      const priceA = parsePrice(await cartPage.price(productA.name).innerText());
      const priceB = parsePrice(await cartPage.price(productB.name).innerText());
      await expect(cartPage.total(productA.name), "Row total A should equal unit price x 1").toHaveText(`Rs. ${priceA}`);
      await expect(cartPage.total(productB.name), "Row total B should equal unit price x 2").toHaveText(`Rs. ${priceB * 2}`);
    });
  });

  test("removing products updates the cart and empties it", async () => {
    await productsPage.open();
    await productsPage.addToCart(productA.name);
    await productsPage.continueShopping();
    await productsPage.addToCart(productB.name);
    await productsPage.continueShopping();
    await cartPage.open();
    await expect(cartPage.rows, "Cart should start with two products").toHaveCount(2);

    await cartPage.removeProduct(productA.name);
    await expect(cartPage.row(productA.name), "Removed product should disappear").toHaveCount(0);
    await expect(cartPage.row(productB.name), "Remaining product should stay").toBeVisible();
    await expect(cartPage.rows, "Cart should have one product left").toHaveCount(1);

    await cartPage.removeProduct(productB.name);
    await expect(cartPage.rows, "No products should remain in the cart").toHaveCount(0);
  });
});
