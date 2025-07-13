import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';

test.describe('Removing items from cart', () => {
  let inventoryHelper = new InventoryHelper();
  let cartHelper = new CartHelper();

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('add one item then remove it, badge and cart update', async ({ page }) => {
    const name = 'Sauce Labs Backpack';

    await test.step(`Add "${name}"`, async () =>
      await inventoryHelper.addProductToCart(page, name));
    expect(await inventoryHelper.getCartBadgeCount(page)).toBe(1);

    await test.step(`Go to Cart and remove Item:"${name}"`, async () => {
      await cartHelper.goToCart(page);
      await cartHelper.removeItemFromCart(name);
    });

    await test.step('Cart page is empty', async () => {
      const items = await cartHelper.getCartPageCheckoutItems(page);
      expect(items.length).toBe(0);
    });

    await test.step('Badge resets to 0', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(0);
    });

    await test.step('Return to products page', async () => {
      await inventoryHelper.goTo(page);
    });

    await test.step('Badge resets to 0', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(0);
    });

    await test.step('Inventory shows “Add to cart”', async () => {
      const product = await inventoryHelper.getProductByName(page, name);
      await expect(product!.addToCartButton).toHaveText('Add to cart');
    });
  });

  test('add multiple items then remove all of them', async ({ page }) => {
    const picks = await inventoryHelper.addMultipleRandomItemsToCart(page);

    await test.step('Badge shows all added', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(picks.length);
    });

    await test.step('Remove all items', async () => {
      await cartHelper.goToCart(page);
      await cartHelper.removeAllItemsFromCart(picks);
    });

    await test.step('Cart page is empty', async () => {
      const items = await cartHelper.getCartPageCheckoutItems(page);
      expect(items.length).toBe(0);
    });

    await test.step('Badge resets to 0', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(0);
    });
  });

  test('add multiple items then remove a single one', async ({ page }) => {
    const picks = await inventoryHelper.addMultipleRandomItemsToCart(page);
    const removeMe = picks[1].title;

    await test.step('Badge shows all added', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(picks.length);
    });

    await test.step(`Remove only "${removeMe}"`, async () => {
      await cartHelper.goToCart(page);
      await cartHelper.removeItemFromCart(removeMe);
    });

    await test.step('Cart page lists only remaining items', async () => {
      const items = await cartHelper.getCartPageCheckoutItems(page);
      const titlesInCart = items.map((i) => i.title);
      expect(titlesInCart).toEqual(picks.filter((p) => p.title !== removeMe).map((p) => p.title));
    });

    await test.step('Badge decremented', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(picks.length - 1);
    });

    await test.step('Inventory updates for removed item', async () => {
      await inventoryHelper.goTo(page);
      const product = await inventoryHelper.getProductByName(page, removeMe);
      await expect(product!.addToCartButton).toHaveText('Add to cart');
    });
  });
});
