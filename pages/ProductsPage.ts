import { type Locator, type Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsTitle: Locator;
  readonly products: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productImages: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Search Product");
    this.searchButton = page.locator("#submit_search");
    this.searchedProductsTitle = page.getByRole("heading", { name: "Searched Products" });
    this.products = page.locator(".features_items .product-image-wrapper");
    this.productNames = page.locator(".features_items .productinfo p");
    this.productPrices = page.locator(".features_items .productinfo h2");
    this.productImages = page.locator(".features_items .productinfo img");
    this.continueShoppingButton = page.locator("#cartModal").getByRole("button", { name: "Continue Shopping" });
    this.viewCartLink = page.locator("#cartModal").getByRole("link", { name: "View Cart" });
  }

  async open() {
    await this.page.goto("https://automationexercise.com/products");
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  product(name: string): Locator {
    return this.products.filter({ hasText: name });
  }

  priceOf(productName: string): Locator {
    return this.product(productName).locator(".productinfo h2");
  }

  async addToCart(productName: string) {
    await this.product(productName).locator(".add-to-cart").first().click();
  }

  async openProductDetails(productName: string) {
    await this.product(productName).getByRole("link", { name: "View Product" }).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async viewCart() {
    await this.viewCartLink.click();
  }
}
