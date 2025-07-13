// sauce_demo/e2e/specs/header-nav/sidebar-links.spec.ts
import { test, expect, Page } from '@playwright/test';
import { HeaderHelper } from '../../../helpers/header-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { InventoryHelper } from '../../../helpers/inventory-helper';

test.describe('Sidebar links behavior', () => {
  let headerHelper: HeaderHelper;
  let inventoryHelper: InventoryHelper;
  test.beforeEach(async ({ page }) => {
    // first, log in and land on the inventory page
    await loginAsStandardUser(page);
    headerHelper = new HeaderHelper(page);
    inventoryHelper = new InventoryHelper();

    // make sure the menu is closed, then open it
    //await headerHelper.closeMenu();
    await headerHelper.openMenu();
    await headerHelper.waitForHeaderLoad();
  });

  test('All Items returns to the inventory list', async ({ page }) => {
    await test.step('Click “All Items”', async () => {
      await headerHelper.clickAllItems();
    });
    // await test.step('Menu should automatically close', async () => {
    //   await expect(headerHelper.isMenuOpen()).resolves.toBe(false);
    // });
    await test.step('URL stays on /inventory.html and title reads "Products"', async () => {
      await expect(page).toHaveURL(/\/inventory\.html$/);
      const title = page.locator('[data-test="title"]');
      await expect(title).toHaveText('Products');
    });
  });

  test('About opens the Sauce Labs site in a new tab', async ({ page }) => {
    await test.step('Click “About” and wait for new page', async () => {
      await headerHelper.clickAbout();
      await expect(page).toHaveURL(/saucelabs\.com/);
      expect(await page.title()).toEqual(
        'Sauce Labs: Cross Browser Testing, Selenium Testing & Mobile Testing',
      );
      await expect(page.locator('body')).toContainText('Sauce Labs');
    });
  });

  test('Logout brings you back to the login screen', async ({ page }) => {
    await test.step('Click “Logout”', async () => {
      await headerHelper.logout();
    });
    await test.step('URL should end in /login.html and login form is visible', async () => {
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.locator('[data-test="username"]')).toBeVisible();
      await expect(page.locator('[data-test="password"]')).toBeVisible();
    });
  });

  test('Reset App State clears the cart badge', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step(`Add "${productName}" to cart and validate badge`, async () => {
      await headerHelper.closeMenu();
      await inventoryHelper.addProductToCart(page, productName);
      await expect(headerHelper.getCartBadgeCount()).resolves.toBeGreaterThan(0);
    });

    await test.step('Open menu and click “Reset App State”', async () => {
      await headerHelper.openMenu();
      await headerHelper.resetAppState();
    });
    await test.step('Badge count goes back to zero', async () => {
      await expect(headerHelper.getCartBadgeCount()).resolves.toBe(0);
    });
  });
});
