// sauce_demo/pages/shared/HeaderSection.ts
import { Page, Locator, expect } from '@playwright/test';

export class HeaderSectionPage {
  readonly page: Page;

  // --- branding ---
  readonly appLogo: Locator;

  // --- menu & sidebar ---
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly sideMenuWrap: Locator;

  // --- cart ---
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLogo = page.locator('.app_logo');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.openMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('button#react-burger-cross-btn');
    this.sideMenuWrap = page.locator('.bm-menu-wrap');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  /** Wait for the header to be visible on the page */
  async waitForLoad(): Promise<this> {
    await this.page.waitForSelector('[data-test="header-container"]', { state: 'visible', timeout: 5_000 });
    return this;
  }

  async clickLogo(): Promise<void> {
    await this.appLogo.click();
  }

  async openMenu(): Promise<void> {
    await this.openMenuButton.click();
    await this.page.waitForSelector('.bm-menu-wrap[aria-hidden="false"]', { timeout: 5_000 });
  }

  async closeMenu(): Promise<void> {
    await this.page.waitForSelector('.bm-menu-wrap[aria-hidden="false"]', { timeout: 5_000 });
    await this.closeMenuButton.click();
    await this.page.waitForSelector('.bm-menu-wrap[aria-hidden="true"]', { timeout: 5_000 });
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.count() === 0) return 0;
    const txt = (await this.cartBadge.textContent())?.trim() || '';
    return txt ? parseInt(txt, 10) : 0;
  }

  async clickOpenMenu() {
    await this.openMenuButton.click();
  }

  async clickCloseMenu() {
    await this.closeMenuButton.click();
  }

  /** Wait until the sidebar is fully open */
  async waitForSidebarOpen() {
    await this.sideMenuWrap.waitFor({ state: 'visible', timeout: 5_000 });
    await expect(this.sideMenuWrap).toHaveAttribute('aria-hidden', 'false');
  }

  /** Wait until the sidebar is fully closed */
  async waitForSidebarClose() {
    await this.sideMenuWrap.waitFor({ state: 'hidden', timeout: 5_000 });
    await expect(this.sideMenuWrap).toHaveAttribute('aria-hidden', 'true');
  }
}
