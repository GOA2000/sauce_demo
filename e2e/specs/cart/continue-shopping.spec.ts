import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { CartHelper } from '../../../helpers/cart-helper';

test.describe('Cart “Continue Shopping” button', () => {
  let inventoryHelper: InventoryHelper;
  let cartHelper: CartHelper;

  test.beforeEach(async ({ page }) => {
    // Log in and navigate to inventory
    await loginAsStandardUser(page);
    inventoryHelper = new InventoryHelper();
    cartHelper = new CartHelper();
  });

  test('clicking Continue Shopping returns to products page', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step(`Add "${productName}" to cart`, async () => {
      await inventoryHelper.addProductToCart(page, productName);
    });

    await test.step('UI shows "Remove" on that item', async () => {
      const product = await inventoryHelper.getProductByName(page, productName);
    });

    await test.step('Cart badge counter increments to 1', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(1);
    });

    await test.step('Validate cart page contains exactly that 1 item', async () => {
      await cartHelper.goToCart(page);
      let cartItems = await cartHelper.getCartPageCheckoutItems(page);
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].title).toBe(productName);
    });

    await test.step('Click “Continue Shopping”', async () => {
      await cartHelper.clickContinueShoppingButton(page);
    });

    await test.step('Verify returned to inventory page', async () => {
      expect(page.url()).toContain('/inventory.html');

      const headerTitle = await page.locator('[data-test="title"]').textContent();
      expect(headerTitle?.trim()).toBe('Products');
    });
  });
});
