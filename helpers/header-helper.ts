// sauce_demo/helpers/header-helper.ts
import { expect, type Page } from '@playwright/test';
import { HeaderSectionPage } from '../pages/logged-in/shared/HeaderSectionPage';

export class HeaderHelper {
  private header: HeaderSectionPage;

  constructor(private page: Page) {
    this.header = new HeaderSectionPage(page);
  }

  get openButton() {
    return this.header.openMenuButton;
  }
  get closeButton() {
    return this.header.closeMenuButton;
  }
  get allItemsLink() {
    return this.header.allItemsLink;
  }
  get aboutLink() {
    return this.header.aboutLink;
  }
  get logoutLink() {
    return this.header.logoutLink;
  }
  get resetLink() {
    return this.header.resetAppStateLink;
  }

  async isMenuOpen(): Promise<boolean> {
    return (await this.page.locator('.bm-menu-wrap').getAttribute('aria-hidden')) === 'false';
  }

  async openMenu(): Promise<this> {
    await this.header.clickOpenMenu();
    await this.header.waitForSidebarOpen();
    return this;
  }

  async closeMenu(): Promise<this> {
    await this.header.waitForLoad();
    await this.header.clickCloseMenu();
    await this.header.waitForSidebarClose();
    return this;
  }

  async clickAllItems(): Promise<void> {
    await this.header.clickAllItems();
    await this.waitForHeaderLoad();
  }

  async clickAbout() {
    await this.header.waitForLoad();
    await this.header.clickAbout();
  }

  async logout(): Promise<void> {
    await this.header.logout();
  }

  async resetAppState(): Promise<void> {
    await this.header.resetAppState();
    await this.waitForHeaderLoad();
  }

  async getCartBadgeCount(): Promise<number> {
    await this.waitForHeaderLoad();
    return this.header.getCartBadgeCount();
  }

  async waitForHeaderLoad() {
    await this.header.waitForLoad();
  }
}
