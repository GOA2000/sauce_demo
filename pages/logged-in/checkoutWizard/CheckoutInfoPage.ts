import { Page, Locator } from '@playwright/test';
import { config } from '../../../utils/config';

export class CheckoutInfoPage {
  readonly page: Page;

  readonly formContainer: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  readonly errorContainer: Locator;

  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formContainer = page.locator('[data-test="checkout-info-container"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.errorContainer = page.locator('.error-message-container');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/checkout-step-one.html`);
  }

  async waitForLoad(): Promise<void> {
    await this.formContainer.waitFor({ state: 'visible', timeout: 5_000 });
  }

  async enterCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorContainer.textContent())?.trim() || '';
  }
}
