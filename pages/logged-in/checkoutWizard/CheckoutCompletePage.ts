import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly header: Locator;
  readonly message: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('h2[data-test="complete-header"]');
    this.message = page.locator('div[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('img[data-test="pony-express"]');
    this.backHomeButton = page.locator('button[data-test="back-to-products"]');
  }

  async waitForLoad(timeout: number = 5000): Promise<void> {
    await this.header.waitFor({ state: 'visible', timeout });
  }

  async getHeaderText(): Promise<string> {
    return (await this.header.textContent())?.trim() || '';
  }

  async getMessageText(): Promise<string> {
    return (await this.message.textContent())?.trim() || '';
  }

  async getOrderCompletionPayload() {
    const headerText = (await this.header.textContent())?.trim() || '';
    const messageText = (await this.message.textContent())?.trim() || '';
    const isPonyExpressVisible = await this.ponyExpressImage.isVisible();
    const isBackHomeVisible = await this.backHomeButton.isVisible();

    const payload = {
      headerText: headerText,
      messageText: messageText,
      isPonyExpressVisible: isPonyExpressVisible,
      isBackHomeVisible: isBackHomeVisible,
    };

    return payload;
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
