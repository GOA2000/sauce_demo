import { Page, Locator } from '@playwright/test';
import { HeaderSectionPage } from './shared/HeaderSectionPage';
import { config } from '../../utils/config';

export interface CartItem {
  quantity: number;
  title: string;
  description: string;
  price: string;
  removeButton: Locator;
}

export class CartPage {
  readonly page: Page;

  readonly header: HeaderSectionPage;
  readonly cartContentsContainer: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  private readonly itemQuantitySelector = '[data-test="item-quantity"]';
  private readonly itemTitleSelector = '[data-test="inventory-item-name"]';
  private readonly itemDescSelector = '[data-test="inventory-item-desc"]';
  private readonly itemPriceSelector = '[data-test="inventory-item-price"]';
  private readonly removeButtonSelector = 'button[data-test^="remove-"]';


  constructor(page: Page) {
    this.header = new HeaderSectionPage(page);
    this.page = page;
    this.cartContentsContainer = page.locator('[data-test="cart-contents-container"]');
    this.cartItems = page.locator('.cart_item[data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }


  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/cart.html`);
  }

  async waitForLoad(): Promise<void> {
    await this.cartContentsContainer.waitFor({ state: 'visible', timeout: 5_000 });
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getAllItems(): Promise<CartItem[]> {
    const count = await this.cartItems.count();
    const items: CartItem[] = [];

    for (let i = 0; i < count; i++) {
      const element = this.cartItems.nth(i);
      const quantity = parseInt((await element.locator(this.itemQuantitySelector).textContent()) ?? '0', 10);
      const title = (await element.locator(this.itemTitleSelector).textContent())?.trim() ?? '';
      const description = (await element.locator(this.itemDescSelector).textContent())?.trim() ?? '';
      const price = (await element.locator(this.itemPriceSelector).textContent())?.trim() ?? '';
      const removeButton = element.locator(this.removeButtonSelector);

      items.push({ quantity, title, description, price, removeButton });
    }

    return items;
  }

  async getItemByName(name: string): Promise<CartItem | null> {
    const items = await this.getAllItems();
    return items.find(item => item.title === name) ?? null;
  }

  async removeItem(name: string): Promise<void> {
    const item = await this.getItemByName(name);
    if (!item) {
      throw new Error(`CartPage.removeItem(): no item found with title "${name}"`);
    }
    await item.removeButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
