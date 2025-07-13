import { Page } from '@playwright/test';
import { InventoryPage, Product } from '../pages/logged-in/InventoryPage';
import { CartPage } from '../pages/logged-in/CartPage';

export class InventoryHelper {
  private inventoryPage: InventoryPage;

  constructor() {}

  setPage(page: Page) {
    this.inventoryPage = new InventoryPage(page);
    return this.inventoryPage;
  }

  private async mapProducts<T>(page: Page, selector: (product: Product) => T): Promise<T[]> {
    this.setPage(page);
    let products = await this.inventoryPage.getAllProducts();
    return products.map(selector);
  }

  async getAllProductTitles(page: Page): Promise<string[]> {
    const titles = await this.mapProducts(page, (p) => p.title);
    console.log('Product titles:', titles);
    return titles;
  }

  async getAllProductPrices(page: Page): Promise<string[]> {
    const prices = await this.mapProducts(page, (p) => p.price);
    console.log('Product prices:', prices);
    return prices;
  }

  async getAllProductImageSrcs(page: Page): Promise<string[]> {
    const srcs = await this.mapProducts(page, (p) => p.imageSrc);
    console.log('Product imageSrcs:', srcs);
    return srcs;
  }

  async getAllProducts(page: Page) {
    this.setPage(page);
    return await this.inventoryPage.getAllProducts();
  }

  async selectSortByNameDescFilter(page: Page) {
    this.setPage(page);
    this.inventoryPage.sortByNameDesc();
  }

  async selectSortByPriceAscFilter(page: Page) {
    this.setPage(page);
    await this.inventoryPage.sortByPriceLowToHigh();
  }

  async selectSortByPriceDescFilter(page: Page) {
    this.setPage(page);
    await this.inventoryPage.sortByPriceHighToLow();
  }

  async openCartViaCartButton(page: Page) {
    this.setPage(page);
    const cart = new CartPage(page);
    await this.inventoryPage.header.clickCart();
    await cart.waitForLoad();
  }

  async addProductToCart(page: Page, productName: string) {
    this.setPage(page);
    const product = await this.inventoryPage.getProductByName(productName);
    await product!.addToCartButton.click();
  }

  async getProductByName(page: Page, productName: string) {
    this.setPage(page);
    return await this.inventoryPage.getProductByName(productName);
  }

  async getCartBadgeCount(page: Page) {
    this.setPage(page);
    return await this.inventoryPage.header.getCartBadgeCount();
  }

  async addMultipleRandomItemsToCart(page: Page) {
    this.setPage(page);
    const allProducts = await this.inventoryPage.getAllProducts();
    const productsToAdd = allProducts.sort(() => Math.random() - 0.5).slice(0, 3);

    for (const product of productsToAdd) {
      await product.addToCartButton.click();
    }
    return productsToAdd;
  }

  async goTo(page: Page) {
    this.setPage(page);
    await this.inventoryPage.goto();
    await this.inventoryPage.waitForLoad();
  }
}
