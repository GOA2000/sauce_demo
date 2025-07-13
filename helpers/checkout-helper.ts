import type { Page } from '@playwright/test';
import { CheckoutInfoPage } from '../pages/logged-in/CheckoutInfoPage';

export class CheckoutHelper {
    infoPage: CheckoutInfoPage
    constructor() { }

    setPage(page: Page) {
        this.infoPage = new CheckoutInfoPage(page)
    }

    /** Navigate into the checkout info step (assumes you're already on cart page and clicked checkout) */
    async ensureOnCheckoutInfo(page: Page): Promise<CheckoutInfoPage> {
        this.setPage(page)
        await this.infoPage.waitForLoad();
        return this.infoPage;
    }

    /** Fill in and submit the checkout info form */
    async enterUserDataAndContinue(
        page: Page,
        userData: {
            firstName: string;
            lastName: string;
            postalCode: string;
        }
    ): Promise<void> {
        const { firstName, lastName, postalCode } = userData;
        const infoPage = await this.ensureOnCheckoutInfo(page);
        await infoPage.enterCustomerInfo(firstName, lastName, postalCode);
        await infoPage.clickContinue();
    }

    /** Attempt to continue without entering data (to trigger validation) */
    async attemptEmptyContinue(page: Page): Promise<string> {
        const infoPage = await this.ensureOnCheckoutInfo(page);
        await infoPage.clickContinue();
        return infoPage.getErrorMessage();
    }

    /** Cancel out of checkout info and return to cart */
    async cancelAndReturnToCart(page: Page): Promise<void> {
        const infoPage = await this.ensureOnCheckoutInfo(page);
        await infoPage.clickCancel();
    }

    async getCheckoutErrorMsg(page:Page) {
        this.setPage(page)
        return await this.infoPage.getErrorMessage();

    }
}
