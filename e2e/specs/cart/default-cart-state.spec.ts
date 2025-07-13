import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { CartHelper } from '../../../helpers/cart-helper';

test.describe('Default Cart Empty State', () => {
    let inventoryHelper = new InventoryHelper()
    let cartHelper = new CartHelper()

    test.beforeEach(async ({ page }) => {
        await test.step('Log in as standard user', async () => {
            await loginAsStandardUser(page)
        });
    });

    test('empty cart after login with no items added', async ({ page }) => {
        await test.step('Open cart page via cart icon', async () => {
            await inventoryHelper.openCartViaCartButton(page)
        });

        await test.step('Validate cart has no items', async () => {
            const itemCount = await cartHelper.getNumberOfDisplayedItemsInCart(page);
            expect(itemCount).toBe(0);
        });
    });
});