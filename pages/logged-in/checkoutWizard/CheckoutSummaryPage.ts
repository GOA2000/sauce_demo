import { Page, Locator } from '@playwright/test';

export class CheckoutSummaryPage {
  readonly page: Page;

  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotalLabel: Locator;
  readonly cartItems: Locator;

  readonly itemName: string = '.inventory_item_name';
  readonly itemPrice: string = '[data-test="inventory-item-price"]';

  constructor(page: Page) {
    this.page = page;

    this.cancelButton = page.locator('button[data-test="cancel"]');
    this.finishButton = page.locator('button[data-test="finish"]');
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.cartItems = page.locator('.cart_item[data-test="inventory-item"]');
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async getItemTotalText() {
    return await this.itemTotalLabel.textContent();
  }

  async getItemTotalValue(): Promise<number | null> {
    const text = await this.getItemTotalText();
    const match = text?.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(',', '')) : null;
  }

  itemByTitle(title: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator(this.itemName, { hasText: title }),
    });
  }

  async waitForLoad(timeout: number = 5000): Promise<void> {
    await this.cartItems.first().waitFor({ state: 'visible', timeout });
  }
}
