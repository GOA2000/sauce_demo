import { test, expect } from '@playwright/test';
import { InventoryHelper } from '../../../helpers/inventory-helper';
import { loginAsStandardUser } from '../../../helpers/auth-helper';
import { SortUtils } from '../../../utils/sort-utils';

test.describe('Inventory sorting tests', () => {
  let inventoryHelper = new InventoryHelper();

  test.beforeEach(async ({ page }) => {
    await test.step('Log in as standard user', async () => {
      await loginAsStandardUser(page);
    });
  });

  test('inventory exists after logging in', async ({ page }) => {
    let products: any[];

    await test.step('Fetch all products', async () => {
      products = await inventoryHelper.getAllProducts(page);
    });

    await test.step('Verify there is at least one product', async () => {
      expect(products.length).toBeGreaterThan(0);
    });
  });

  test('ascending (A→Z) default sorting for titles', async ({ page }) => {
    let titles: string[] = [];

    await test.step('Fetch all product titles', async () => {
      titles = await inventoryHelper.getAllProductTitles(page);
    });

    await test.step('Verify titles are sorted ascending (A→Z)', async () => {
      expect(SortUtils.compareTitlesAsc(titles)).toBe(true);
    });
  });

  test('descending (Z→A) sorting for titles', async ({ page }) => {
    await test.step('Select sort by name descending', async () => {
      await inventoryHelper.selectSortByNameDescFilter(page);
    });

    let titles: string[] = [];
    await test.step('Fetch all product titles', async () => {
      titles = await inventoryHelper.getAllProductTitles(page);
    });

    await test.step('Verify titles are sorted descending (Z→A)', async () => {
      expect(SortUtils.compareTitlesDesc(titles)).toBe(true);
    });
  });

  test('ascending (low→high) sorting for prices', async ({ page }) => {
    await test.step('Select sort by price low to high', async () => {
      await inventoryHelper.selectSortByPriceAscFilter(page);
    });

    let prices: string[] = [];
    await test.step('Fetch all product prices', async () => {
      prices = await inventoryHelper.getAllProductPrices(page);
    });

    await test.step('Verify prices are sorted ascending (low→high)', async () => {
      expect(SortUtils.comparePricesAsc(prices)).toBe(true);
    });
  });

  test('descending (high→low) sorting for prices', async ({ page }) => {
    await test.step('Select sort by price high to low', async () => {
      await inventoryHelper.selectSortByPriceDescFilter(page);
    });

    let prices: string[] = [];

    await test.step('Fetch all product prices', async () => {
      prices = await inventoryHelper.getAllProductPrices(page);
    });

    await test.step('Verify prices are sorted descending (high→low)', async () => {
      expect(SortUtils.comparePricesDesc(prices)).toBe(true);
    });
  });

  test('image src values are unique for all products', async ({ page }) => {
    let srcs: string[];

    await test.step('Fetch all product image src attributes', async () => {
      srcs = await inventoryHelper.getAllProductImageSrcs(page);
    });

    await test.step('Verify all image srcs are unique', async () => {
      const uniqueSrcs = new Set(srcs);
      expect(uniqueSrcs.size).toBe(srcs.length);
    });
  });
});
