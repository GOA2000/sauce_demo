import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';
import { CHECKOUT_USERS } from '../../../fixtures/checkout-user-data';
import { CheckoutHelper } from '../../../helpers/checkout-helper';

test.describe('Checkout happy paths', () => {
  let inventoryHelper: InventoryHelper;
  let cartHelper: CartHelper;
  let checkoutHelper: CheckoutHelper;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryHelper = new InventoryHelper();
    cartHelper = new CartHelper();
    checkoutHelper = new CheckoutHelper();
  });

  test('checkout flow with a single item', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step('Add one item to cart', async () => {
      const product = await inventoryHelper.getProductByName(page, productName);
      await product!.addToCartButton.click();
    });

    await test.step('Open cart and click checkout', async () => {
      await inventoryHelper.openCartViaCartButton(page);
      await cartHelper.clickCheckoutButton(page);
    });

    await test.step('Enter customer info and continue', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.validCustomer);
    });

    await test.step('Verify navigation to step-two', async () => {
      await expect(page).toHaveURL(/checkout-step-two\.html$/);
    });
  });

  test('checkout flow with multiple items', async ({ page }) => {
    let productsToAdd: Array<{ title: string }>;

    await test.step('Add multiple random items to cart', async () => {
      productsToAdd = await inventoryHelper.addMultipleRandomItemsToCart(page);
    });

    await test.step('Verify cart badge counter matches number of items', async () => {
      expect(await inventoryHelper.getCartBadgeCount(page)).toBe(productsToAdd.length);
    });

    await test.step('Open cart and click checkout', async () => {
      await inventoryHelper.openCartViaCartButton(page);
      await cartHelper.clickCheckoutButton(page);
    });

    await test.step('Enter customer info and continue', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.validCustomerTwo);
    });

    await test.step('Verify navigation to step-two', async () => {
      await expect(page).toHaveURL(/checkout-step-two\.html$/);
    });
  });
});
