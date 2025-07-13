import type { Page } from '@playwright/test';
import { CartPage } from '../pages/logged-in/CartPage';

export class CartHelper {
  private cartPage: CartPage;

  constructor() {}

  setPage(page: Page) {
    this.cartPage = new CartPage(page);
  }

  async getNumberOfDisplayedItemsInCart(page: Page) {
    this.setPage(page);
    return this.cartPage.getItemCount();
  }

  async getCartPageCheckoutItems(page: Page) {
    this.setPage(page);
    return await this.cartPage.getAllItems();
  }

  getCartPageCheckoutItemTitles(cartItems: any[]): any {
    return cartItems.map((i) => i.title);
  }

  async removeItemFromCart(name: string) {
    await this.cartPage.removeItem(name);
  }

  async removeAllItemsFromCart(picks: any[]) {
    for (const title of picks.map((p) => p.title)) {
      await this.removeItemFromCart(title);
    }
  }

  async goToCart(page: Page) {
    this.setPage(page);
    await this.cartPage.goto();
    await this.cartPage.waitForLoad();
  }

  async clickContinueShoppingButton(page: Page) {
    this.setPage(page);
    await this.cartPage.continueShopping();
  }

  async clickCheckoutButton(page: Page) {
    this.setPage(page);
    await this.cartPage.clickCheckout();
  }
}
