import { type Locator, type Page } from "@playwright/test";

export class ProductDetailsPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly category: Locator;
  readonly availability: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    const info = page.locator(".product-information");
    this.name = info.locator("h2");
    this.price = info.locator("span span").first();
    this.category = info.locator("p", { hasText: "Category" });
    this.availability = info.locator("p", { hasText: "Availability" });
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = info.getByRole("button", { name: "Add to cart" });
    this.continueShoppingButton = page.locator("#cartModal").getByRole("button", { name: "Continue Shopping" });
    this.viewCartLink = page.locator("#cartModal").getByRole("link", { name: "View Cart" });
  }

  async open(productId: number) {
    await this.page.goto(`https://automationexercise.com/product_details/${productId}`);
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async viewCart() {
    await this.viewCartLink.click();
  }
}
