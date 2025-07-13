import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';
import { CheckoutHelper } from '../../../helpers/checkoutWizard/checkout-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { CHECKOUT_USERS } from '../../../fixtures/checkout-user-data';

test.describe('Checkout negative paths (validation)', () => {
  let inventoryHelper: InventoryHelper;
  let cartHelper: CartHelper;
  let checkoutHelper: CheckoutHelper;
  const firstNameMissingErrorMsg = 'First Name is required';
  const lastNameMissingErrorMsg = 'Last Name is required';
  const zipPostalCodeMissingErrorMsg = 'Postal Code is required';

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    inventoryHelper = new InventoryHelper();
    cartHelper = new CartHelper();
    checkoutHelper = new CheckoutHelper();

    const product = await inventoryHelper.getProductByName(page, 'Sauce Labs Backpack');
    await product!.addToCartButton.click();
    await inventoryHelper.openCartViaCartButton(page);
    await cartHelper.clickCheckoutButton(page);
  });

  test('missing first name shows error', async ({ page }) => {
    await test.step('Leave firstName blank, fill others, submit', async () => {
      await checkoutHelper.checkoutInfoPageEnterUserDataAndContinue(
        page,
        CHECKOUT_USERS.missingFirstName,
      );
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.checkoutInfoPageGetCheckoutErrorMsg(page);
      expect(err).toContain(firstNameMissingErrorMsg);
    });
  });

  test('missing last name shows error', async ({ page }) => {
    await test.step('Fill firstName & postal, leave lastName blank, submit', async () => {
      await checkoutHelper.checkoutInfoPageEnterUserDataAndContinue(
        page,
        CHECKOUT_USERS.missingLastName,
      );
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.checkoutInfoPageGetCheckoutErrorMsg(page);
      expect(err).toContain(lastNameMissingErrorMsg);
    });
  });

  test('missing postal code shows error', async ({ page }) => {
    await test.step('Fill firstName & lastName, leave postalCode blank, submit', async () => {
      await checkoutHelper.checkoutInfoPageEnterUserDataAndContinue(
        page,
        CHECKOUT_USERS.missingPostalCode,
      );
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.checkoutInfoPageGetCheckoutErrorMsg(page);
      expect(err).toContain(zipPostalCodeMissingErrorMsg);
    });
  });

  test('missing all fields shows first-name error', async ({ page }) => {
    await test.step('Leave all fields blank, submit', async () => {
      await checkoutHelper.checkoutInfoPageEnterUserDataAndContinue(
        page,
        CHECKOUT_USERS.allFieldsBlank,
      );
    });

    await test.step('Assert correct error message', async () => {
      const err = await checkoutHelper.checkoutInfoPageGetCheckoutErrorMsg(page);
      expect(err).toContain(firstNameMissingErrorMsg);
    });
  });
});
