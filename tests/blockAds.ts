import { type Page } from "@playwright/test";

export async function blockAds(page: Page): Promise<void> {
  await page.route(
    /googlesyndication|doubleclick|googleadservices|google-analytics|googletagmanager|adtrafficquality|adservice\.google|pagead|fonts\.googleapis|fonts\.gstatic|maps\.googleapis|maps\.google\.com/,
    (route) => route.abort()
  );
}
