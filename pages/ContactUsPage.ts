import { type Locator, type Page } from "@playwright/test";

export class ContactUsPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder("Name");
    this.emailInput = page.getByPlaceholder("Email", { exact: true });
    this.subjectInput = page.getByPlaceholder("Subject");
    this.messageInput = page.getByPlaceholder("Your Message Here");
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.successMessage = page.locator(".status.alert-success");
  }

  async open() {
    await this.page.goto("https://automationexercise.com/contact_us");
  }

  async fillForm(name: string, email: string, subject: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async submit() {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}
