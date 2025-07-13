import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';
import { CheckoutHelper } from '../../../helpers/checkout-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { CHECKOUT_USERS } from '../../../fixtures/checkout-user-data';


test.describe('Checkout negative paths (validation)', () => {
  let inventoryHelper: InventoryHelper;
  let cartHelper: CartHelper;
  let checkoutHelper: CheckoutHelper;

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryHelper = new InventoryHelper();
    cartHelper = new CartHelper();
    checkoutHelper = new CheckoutHelper();

    // Add one item and navigate to checkout-info page
    const product = await inventoryHelper.getProductByName(page, 'Sauce Labs Backpack');
    await product!.addToCartButton.click();
    await inventoryHelper.openCartViaCartButton(page);
    await cartHelper.clickCheckoutButton(page);
  });

  test('missing first name shows error', async ({ page }) => {

    await test.step('Leave firstName blank, fill others, submit', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.missingFirstName);
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.getCheckoutErrorMsg(page);
      expect(err).toContain('First Name is required');
    });
  });

  test('missing last name shows error', async ({ page }) => {

    await test.step('Fill firstName & postal, leave lastName blank, submit', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.missingLastName);
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.getCheckoutErrorMsg(page);
      expect(err).toContain('Last Name is required');
    });
  });

  test('missing postal code shows error', async ({ page }) => {
    await test.step('Fill firstName & lastName, leave postalCode blank, submit', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.missingPostalCode);
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.getCheckoutErrorMsg(page);
      expect(err).toContain('Postal Code is required');
    });
  });

  test('missing all fields shows first-name error', async ({ page }) => {
    await test.step('Leave all fields blank, submit', async () => {
      await checkoutHelper.enterUserDataAndContinue(page, CHECKOUT_USERS.allFieldsBlank);
    });
    
    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.getCheckoutErrorMsg(page);
      expect(err).toContain('First Name is required');
    });
  });
});
