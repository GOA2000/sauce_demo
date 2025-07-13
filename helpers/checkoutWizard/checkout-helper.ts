import { expect, type Page } from '@playwright/test';
import { CheckoutInfoPage } from '../../pages/logged-in/checkoutWizard/CheckoutInfoPage';
import { CheckoutSummaryPage } from '../../pages/logged-in/checkoutWizard/CheckoutSummaryPage';
import { CheckoutCompletePage } from '../../pages/logged-in/checkoutWizard/CheckoutCompletePage';

export class CheckoutHelper {
  infoPage!: CheckoutInfoPage;
  summaryPage!: CheckoutSummaryPage;
  completePage!: CheckoutCompletePage;

  constructor() {}

  setPage(page: Page) {
    this.infoPage = new CheckoutInfoPage(page);
    this.summaryPage = new CheckoutSummaryPage(page);
    this.completePage = new CheckoutCompletePage(page);
  }

  async ensureOnCheckoutInfo(page: Page): Promise<CheckoutInfoPage> {
    this.setPage(page);
    await this.infoPage.waitForLoad();
    return this.infoPage;
  }

  async checkoutInfoPageEnterUserDataAndContinue(
    page: Page,
    userData: {
      firstName: string;
      lastName: string;
      postalCode: string;
    },
  ): Promise<void> {
    const { firstName, lastName, postalCode } = userData;
    const infoPage = await this.ensureOnCheckoutInfo(page);
    await infoPage.enterCustomerInfo(firstName, lastName, postalCode);
    await infoPage.clickContinue();
  }

  async checkoutInfoPageAttemptEmptyContinue(page: Page): Promise<string> {
    const infoPage = await this.ensureOnCheckoutInfo(page);
    await infoPage.clickContinue();
    return infoPage.getErrorMessage();
  }

  async checkoutInfoPageCancelAndReturnToCart(page: Page): Promise<void> {
    const infoPage = await this.ensureOnCheckoutInfo(page);
    await infoPage.clickCancel();
  }

  async checkoutInfoPageGetCheckoutErrorMsg(page: Page) {
    this.setPage(page);
    return await this.infoPage.getErrorMessage();
  }

  async checkoutSummaryPageGetItemDetails(
    title: string,
  ): Promise<{ title: string; price: number }> {
    const item = this.summaryPage.itemByTitle(title);
    await expect(item).toHaveCount(1);

    const nameLocator = item.locator(this.summaryPage.itemName);
    const priceLocator = item.locator(this.summaryPage.itemPrice);
    const itemTitle = await nameLocator.textContent();
    const priceText = await priceLocator.textContent();
    const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');

    return { title: itemTitle?.trim() || '', price };
  }

  async checkoutSummaryPageGetAllItems(): Promise<Array<{ title: string; price: number }>> {
    const itemCount = await this.summaryPage.cartItems.count();
    const items: Array<{ title: string; price: number }> = [];
    for (let i = 0; i < itemCount; i++) {
      const item = this.summaryPage.cartItems.nth(i);
      const title = (await item.locator(this.summaryPage.itemName).textContent())?.trim() || '';
      const priceText = (await item.locator(this.summaryPage.itemPrice).textContent()) || '';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      items.push({ title, price });
    }
    return items;
  }

  async checkoutSummaryPageWaitForLoad() {
    await this.summaryPage.waitForLoad();
  }

  async checkoutSummaryPageClickFinishButton() {
    await this.summaryPage.clickFinish();
  }

  async checkoutCompletePageWaitForLoad() {
    await this.completePage.waitForLoad();
  }

  async getCompletionPageDetails() {
    await this.completePage.waitForLoad();
    return this.completePage.getOrderCompletionPayload();
  }
}
