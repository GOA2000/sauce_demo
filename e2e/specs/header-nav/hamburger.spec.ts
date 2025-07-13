import { test, expect } from '@playwright/test';
import { HeaderHelper } from '../../../helpers/header-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';

test.describe('Hamburger menu behavior', () => {
  let headerHelper: HeaderHelper;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    headerHelper = new HeaderHelper(page);
  });

  test('menu is sidebarHidden by default', async () => {
    expect(await headerHelper.isMenuOpen()).toBe(false);
  });

  test('clicking “Open Menu” reveals sidebar', async () => {
    await headerHelper.openMenu();
    await expect(headerHelper.closeButton).toBeVisible();
    await expect(headerHelper.allItemsLink).toBeVisible();
    await expect(headerHelper.aboutLink).toBeVisible();
    await expect(headerHelper.logoutLink).toBeVisible();
    await expect(headerHelper.resetLink).toBeVisible();
  });

  test('clicking “Close Menu” hides sidebar again', async () => {
    await headerHelper.openMenu();
    await expect(headerHelper.closeButton).toBeVisible();

    await headerHelper.closeMenu();
    await expect(headerHelper.closeButton).toBeHidden();
    await expect(headerHelper.allItemsLink).toBeHidden();
    await expect(headerHelper.aboutLink).toBeHidden();
    await expect(headerHelper.logoutLink).toBeHidden();
    await expect(headerHelper.resetLink).toBeHidden();
  });

  test('sidebar closes if user clicks outside menu', async ({ page }) => {
    await headerHelper.openMenu();
    // click somewhere in the page outside the menu
    await page.click('body', { position: { x: 500, y: 100 } });
    await expect(headerHelper.closeButton).toBeHidden();
  });
});
