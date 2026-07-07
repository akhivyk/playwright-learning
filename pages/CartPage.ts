import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator("#cart_info_table tbody tr");
    this.emptyCartMessage = page.locator("#empty_cart");
  }

  async open() {
    await this.page.goto("https://automationexercise.com/view_cart");
  }

  row(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  price(productName: string): Locator {
    return this.row(productName).locator(".cart_price");
  }

  quantity(productName: string): Locator {
    return this.row(productName).locator(".cart_quantity button");
  }

  total(productName: string): Locator {
    return this.row(productName).locator(".cart_total_price");
  }

  async removeProduct(productName: string) {
    await this.row(productName).locator(".cart_quantity_delete").click();
  }
}
