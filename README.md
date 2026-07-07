# Automation Exercise — Playwright E2E Suite

End‑to‑end UI test suite for [automationexercise.com](https://automationexercise.com), built with **Playwright** and **TypeScript** using the **Page Object Model**.

This is the Week 6 final project of the *Playwright for Manual QA Engineers* learning path (Track B — Automation Exercise).

## Test target

| | |
| --- | --- |
| Application | https://automationexercise.com |
| Framework | Playwright Test (`@playwright/test`) |
| Language | TypeScript |
| Pattern | Page Object Model |
| Browser | Chromium |

## Covered user journey

Product discovery → product details → cart → contact.

The suite implements the five Track B required scenarios, published as test cases **TC‑01…TC‑05**.

## Test cases

| ID | Scenario | Spec | Type |
| --- | --- | --- | --- |
| TC‑01 | Search for a product and verify relevant results | `product-search.spec.ts` | positive |
| TC‑02 | Open product details and verify name, price, availability | `product-search.spec.ts` | positive |
| TC‑03 | Add multiple products and verify quantity and per‑row total | `cart.spec.ts` | positive |
| TC‑04 | Remove a product and empty the cart | `cart.spec.ts` | state change |
| TC‑05 | Submit the Contact Us form with a file attachment | `contact-us.spec.ts` | positive |
| TC‑05 | Submitting with a required field empty is blocked | `contact-us.spec.ts` | negative |

**6 tests total** — happy path, a state‑change flow, and a negative case.

## Project structure

```
pages/                       # Page Objects — one class per page
├── ProductsPage.ts          # search, product grid, add-to-cart, cart modal
├── ProductDetailsPage.ts    # name, price, category, availability, quantity
├── CartPage.ts              # rows, unit price, quantity, row total, remove
└── ContactUsPage.ts         # form fields, file upload, submit

tests/
├── product-search.spec.ts   # TC-01, TC-02
├── cart.spec.ts             # TC-03, TC-04
├── contact-us.spec.ts       # TC-05 (positive + negative)
├── blockAds.ts              # helper: blocks 3rd-party ad/analytics requests
└── fixtures/
    └── sample.txt           # attachment used by TC-05

test-data/                   # test inputs, separate from test logic
├── products.ts              # search keyword, products A/B
└── contact.ts               # contact form details, attachment path

playwright.config.ts
package.json
```

> The repository also contains practice files from earlier weeks (for example `saucedemo.spec.ts`). They are not part of this final‑project suite.

## Getting started

### Prerequisites

- Node.js 20+ (v22 LTS recommended)
- npm

### Install

```bash
npm install
npx playwright install
```

### Run the suite (Chromium)

```bash
npx playwright test tests/product-search.spec.ts tests/cart.spec.ts tests/contact-us.spec.ts --project=chromium
```

### Open the HTML report

```bash
npx playwright show-report
```

### Check stability (run each test 3×)

```bash
npx playwright test tests/product-search.spec.ts tests/cart.spec.ts tests/contact-us.spec.ts --project=chromium --repeat-each=3
```

## Page Object Model

Each page is a small class that exposes locators (used by the tests for assertions) and wraps user actions in methods. Tests describe *behavior*; page objects hold the *locators*.

- **ProductsPage** — `open()`, `search()`, `product(name)`, `addToCart()`, `openProductDetails()`, `continueShopping()`, `viewCart()`
- **ProductDetailsPage** — `open(id)`, `setQuantity()`, `addToCart()`; exposes `name`, `price`, `category`, `availability`, `quantityInput`
- **CartPage** — `open()`, `row(name)`, `price/quantity/total(name)`, `removeProduct()`
- **ContactUsPage** — `open()`, `fillForm()`, `uploadFile()`, `submit()`; exposes `successMessage`

Design rules followed:

- One class per page — no `BasePage`, wrappers, or other abstractions.
- Semantic locators first (`getByRole`, `getByPlaceholder`); CSS only as a fallback; no XPath.
- **Assertions live in the tests, never in the page objects.**
- No `waitForTimeout` — relies on Playwright web‑first assertions and auto‑waiting.
- Test data (search keyword, products, contact details) lives in `test-data/`, separate from the test logic.
- The longest scenario (TC‑03) is organized with `test.step`, so each stage shows as a section in the HTML report.

## Known limitations

Automation Exercise is a public demo site with ads and a few quirks. Documented here as recommended by the course:

- **Ads reflow the page.** Third‑party ad / analytics / font / map requests continuously shift the layout and slow navigation, which makes clicks flaky. `tests/blockAds.ts` aborts those requests in each `beforeEach` (the site's own scripts, e.g. jQuery, are kept). Without it, tests can flake even in headless mode.
- **Search is broader than the name.** Searching "Top" also returns category‑related items (e.g. some shirts) whose name does not contain the keyword, so TC‑01 asserts that the *majority* of results match, not all.
- **No cart subtotal on the cart page.** `view_cart` shows only per‑row totals, so TC‑03 verifies `row total = unit price × quantity` (there is no cart‑level subtotal element to assert against).
- **Only Email is required on the Contact form.** Native HTML5 validation blocks submission when Email is empty, so TC‑05's negative case leaves Email empty.
- This suite covers the selected user journey and does not exercise every edge case (registration, checkout / payment, invoice download).
