import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';

test.describe('Adding items to cart', () => {
  let inventoryHelper = new InventoryHelper();
  let cartHelper = new CartHelper();

  test.beforeEach(async ({ page }) => {
    await test.step('Log in as standard user', async () => {
      await loginAsStandardUser(page);
    });
  });

  test('add a single item to cart and validate', async ({ page }) => {
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
  });

  test('add multiple random items to cart and validate', async ({ page }) => {
    const productsToAdd = await inventoryHelper.addMultipleRandomItemsToCart(page);

    await test.step('Cart badge counter matches number of added items', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(productsToAdd.length);
    });

    await test.step('Each added item shows "Remove" button in the product list', async () => {
      for (const product of productsToAdd) {
        const productToCheck = await inventoryHelper.getProductByName(page, product.title);
        await expect(productToCheck!.removeFromCartButton).toHaveText('Remove');
      }
    });

    await test.step('Cart page correctly lists all items added to cart', async () => {
      await cartHelper.goToCart(page);
      let cartItems = await cartHelper.getCartPageCheckoutItems(page);
      expect(cartItems.length).toBe(productsToAdd.length);

      const titlesInCart = cartHelper.getCartPageCheckoutItemTitles(cartItems);
      for (const product of productsToAdd) {
        expect(titlesInCart).toContain(product.title);
      }
    });
  });
});
