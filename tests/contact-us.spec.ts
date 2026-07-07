import { test, expect } from "@playwright/test";
import { ContactUsPage } from "../pages/ContactUsPage";
import { blockAds } from "./blockAds";
import { validContact, attachmentPath } from "../test-data/contact";

test.describe("Contact Us form", () => {
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    contactUsPage = new ContactUsPage(page);
    await contactUsPage.open();
  });

  test("submitting valid data with a file attachment succeeds", async () => {
    await contactUsPage.fillForm(validContact.name, validContact.email, validContact.subject, validContact.message);
    await contactUsPage.uploadFile(attachmentPath);
    await contactUsPage.submit();

    await expect(
      contactUsPage.successMessage,
      "Success message should be shown after submitting"
    ).toContainText("Your details have been submitted successfully.");
  });

  test("submitting with a required field empty is blocked", async ({ page }) => {
    await contactUsPage.fillForm(validContact.name, "", validContact.subject, validContact.message);
    await contactUsPage.submit();

    await expect(contactUsPage.successMessage, "Success message should not appear").toBeHidden();
    await expect(page, "User should stay on the Contact Us page").toHaveURL(/contact_us/);

    const emailIsValid = await contactUsPage.emailInput.evaluate(
      (input) => (input as HTMLInputElement).validity.valid
    );
    expect(emailIsValid, "Empty required Email field should be invalid").toBe(false);
  });
});
