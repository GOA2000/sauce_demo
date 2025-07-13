// sauce_demo/pages/logged-in/InventoryPage.ts
import { Page, Locator }   from '@playwright/test';
import { HeaderSectionPage }   from './shared/HeaderSectionPage';
import { config } from '../../utils/config';

export interface Product {
  imageSrc: string;
  title: string;
  description: string;
  price: string;
  addToCartButton: Locator;
  removeFromCartButton: Locator;
}

export class InventoryPage {
  private page: Page;
  readonly header: HeaderSectionPage;

  private readonly sortSelect: Locator;
  private readonly activeSortOption: Locator;

  private readonly productItems: Locator;


  private readonly imageSelector        = 'img';
  private readonly titleSelector        = '[data-test="inventory-item-name"]';
  private readonly descriptionSelector  = '[data-test="inventory-item-desc"]';
  private readonly priceSelector        = '[data-test="inventory-item-price"]';
  private readonly addToCartSelector    = 'button[data-test^="add-to-cart-"]';
  private readonly removeButtonSelector = 'button[data-test^="remove-"]';

  constructor(page: Page) {
    this.page             = page;
    this.header           = new HeaderSectionPage(page);
    this.sortSelect       = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');
    this.productItems     = page.locator('[data-test="inventory-item"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/inventory.html`);
  }


  async sortByNameAsc(): Promise<void>      { await this.sortSelect.selectOption('az'); }
  async sortByNameDesc(): Promise<void>     { await this.sortSelect.selectOption('za'); }
  async sortByPriceLowToHigh(): Promise<void> { await this.sortSelect.selectOption('lohi'); }
  async sortByPriceHighToLow(): Promise<void> { await this.sortSelect.selectOption('hilo'); }
  async getActiveSortText(): Promise<string>  { 
    return (await this.activeSortOption.textContent())?.trim() || '';
  }

  async waitForLoad(): Promise<void> {
    await this.productItems.first().waitFor({ state: 'visible', timeout: 5000 });
  }

  async getAllProducts(): Promise<Product[]> {
    const count = await this.productItems.count();
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
      const item = this.productItems.nth(i);
      const imageSrc = (await item.locator(this.imageSelector).getAttribute('src')) || '';
      const title    = (await item.locator(this.titleSelector).textContent())?.trim() || '';
      const desc     = (await item.locator(this.descriptionSelector).textContent())?.trim() || '';
      const price    = (await item.locator(this.priceSelector).textContent())?.trim() || '';
      const addBtn   = item.locator(this.addToCartSelector);
      const removeBtn= item.locator(this.removeButtonSelector);
      products.push({ imageSrc, title, description: desc, price, addToCartButton: addBtn, removeFromCartButton: removeBtn });
    }
    return products;
  }

  async getProductByName(name: string): Promise<Product | null> {
    const all = await this.getAllProducts();
    return all.find(p => p.title === name) || null;
  }
}
