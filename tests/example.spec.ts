import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

type Product = {
  name: string;
  price: number;
  inStock: boolean;
}

const productOne: Product = {
  name: 'Laptop',
  price: 999.99,
  inStock: true,
};

const productTwo: Product = {
  name: 'Smartphone',
  price: 699.99,
  inStock: false,
};  

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
