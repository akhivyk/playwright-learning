import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { blockAds } from "./blockAds";
import { searchKeyword, productA } from "../test-data/products";

test.describe("Product search and details", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    productsPage = new ProductsPage(page);
    await productsPage.open();
  });

  test("search shows a relevant, non-empty result list", async () => {
    await productsPage.search(searchKeyword);

    await expect(
      productsPage.searchedProductsTitle,
      "'Searched Products' section should be shown after a search"
    ).toBeVisible();

    const resultCount = await productsPage.products.count();
    expect(resultCount, "Search results should not be empty").toBeGreaterThan(0);

    await expect(productsPage.productImages, "Every result should show an image").toHaveCount(resultCount);
    await expect(productsPage.productNames, "Every result should show a name").toHaveCount(resultCount);
    await expect(productsPage.productPrices, "Every result should show a price").toHaveCount(resultCount);

    const keyword = searchKeyword.toLowerCase();
    const names = await productsPage.productNames.allTextContents();
    const matching = names.filter((name) => name.toLowerCase().includes(keyword));
    expect(
      matching.length,
      "Most results should contain the search keyword in their name"
    ).toBeGreaterThan(names.length / 2);
  });

  test("product details match the values shown in the list", async ({ page }) => {
    const listPrice = (await productsPage.priceOf(productA.name).innerText()).trim();

    await productsPage.openProductDetails(productA.name);
    const detailsPage = new ProductDetailsPage(page);

    await expect(page, "Product details page should open").toHaveURL(/product_details/);
    await expect(detailsPage.name, "Name should match the list").toHaveText(productA.name);
    await expect(detailsPage.price, "Price should match the list").toHaveText(listPrice);
    await expect(detailsPage.category, "Category should be visible").toBeVisible();
    await expect(detailsPage.availability, "Availability should read 'In Stock'").toContainText("In Stock");
    await expect(detailsPage.quantityInput, "Quantity selector should be visible").toBeVisible();
    await expect(detailsPage.addToCartButton, "'Add to cart' should be enabled").toBeEnabled();
  });
});
