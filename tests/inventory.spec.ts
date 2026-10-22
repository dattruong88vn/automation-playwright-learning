import { test, expect } from '@playwright/test';
import { expectInventoryPage } from '../utils/route';
import * as CONSTANT from '../utils/constants';
import LoginPage from '../pages/login';
import InventoryPage from '../pages/inventory';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);
    inventoryPage = new InventoryPage(page);
});

test('6 products are displayed on the inventory page', async ({ page }) => {
    await expect(inventoryPage.productItem).toHaveCount(6);
});

test('Verify product details for Sauce Labs Backpack product', async ({
    page,
}) => {
    const backpackItem = inventoryPage.getProductByName(
        CONSTANT.PRODUCTS.BACKPACK.NAME,
    );
    await expect(backpackItem.img).toHaveAttribute(
        'alt',
        CONSTANT.PRODUCTS.BACKPACK.NAME,
    );
    await expect(backpackItem.name).toHaveText(CONSTANT.PRODUCTS.BACKPACK.NAME);
    await expect(backpackItem.desc).toContainText(
        CONSTANT.PRODUCTS.BACKPACK.DESC,
    );
    await expect(backpackItem.price).toHaveText(
        CONSTANT.PRODUCTS.BACKPACK.PRICE,
    );
    await expect(backpackItem.addToCartBtn).toBeVisible();
});

test('Add product to cart, verify button and cart count', async ({ page }) => {
    const backpackItem = inventoryPage.getProductByName(
        CONSTANT.PRODUCTS.BACKPACK.NAME,
    );
    await backpackItem.addToCartBtn.click();
    await expect(backpackItem.removeBtn).toBeVisible();
    await expect(backpackItem.addToCartBtn).toBeHidden();
    await expect(inventoryPage.cartCount).toHaveText('1');
});

test('Add the second product to cart, remove all products step by step and verify cart count', async ({
    page,
}) => {
    // add 2 products to cart
    for (const productName of [
        CONSTANT.PRODUCTS.BACKPACK.NAME,
        CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
    ]) {
        const item = inventoryPage.getProductByName(productName);
        await item.addToCartBtn.click();
    }
    await expect(inventoryPage.cartCount).toHaveText('2');

    const firstItem = inventoryPage.getProductByName(
        CONSTANT.PRODUCTS.BACKPACK.NAME,
    );
    await firstItem.removeBtn.click();
    await expect(inventoryPage.cartCount).toHaveText('1');

    const secondItem = inventoryPage.getProductByName(
        CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
    );
    await secondItem.removeBtn.click();
    await expect(inventoryPage.cartCount).toBeHidden();
});

test('Verify sort exists and has 4 options: default Name (A to Z)', async ({
    page,
}) => {
    await expectInventoryPage(page);
    // verify
    await expect(inventoryPage.sortSelect).toBeVisible();
    await expect(inventoryPage.selectedOption).toHaveText(
        CONSTANT.SORT_NAME_ASC,
    );

    await expect(inventoryPage.options).toHaveText([
        CONSTANT.SORT_NAME_ASC,
        CONSTANT.SORT_NAME_DESC,
        CONSTANT.SORT_PRICE_ASC,
        CONSTANT.SORT_PRICE_DESC,
    ]);
});

test.describe('select sort option', () => {
    test.beforeEach(async ({ page }) => {
        await expectInventoryPage(page);
    });

    test('Verify sort by Name (Z to A)', async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_NAME_DESC);
        await expect(inventoryPage.selectedOption).toHaveText(
            CONSTANT.SORT_NAME_DESC,
        );
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.PRODUCTS.RED_TSHIRT.NAME,
            CONSTANT.PRODUCTS.ONESIE.NAME,
            CONSTANT.PRODUCTS.FLEECE_JACKET.NAME,
            CONSTANT.PRODUCTS.BOLT_TSHIRT.NAME,
            CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
            CONSTANT.PRODUCTS.BACKPACK.NAME,
        ]);
    });

    test('Verify sort by Price (low to high)', async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_PRICE_ASC);
        await expect(inventoryPage.selectedOption).toHaveText(
            CONSTANT.SORT_PRICE_ASC,
        );
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.PRODUCTS.ONESIE.NAME,
            CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
            CONSTANT.PRODUCTS.BOLT_TSHIRT.NAME,
            CONSTANT.PRODUCTS.RED_TSHIRT.NAME,
            CONSTANT.PRODUCTS.BACKPACK.NAME,
            CONSTANT.PRODUCTS.FLEECE_JACKET.NAME,
        ]);
    });

    test('Verify sort by Price (high to low)', async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_PRICE_DESC);
        await expect(inventoryPage.selectedOption).toHaveText(
            CONSTANT.SORT_PRICE_DESC,
        );
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.PRODUCTS.FLEECE_JACKET.NAME,
            CONSTANT.PRODUCTS.BACKPACK.NAME,
            CONSTANT.PRODUCTS.BOLT_TSHIRT.NAME,
            CONSTANT.PRODUCTS.RED_TSHIRT.NAME,
            CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
            CONSTANT.PRODUCTS.ONESIE.NAME,
        ]);
    });

    test('Verify sort by Name (A to Z)', async ({ page }) => {
        await inventoryPage.selectOption(CONSTANT.SORT_NAME_DESC);
        await expect(inventoryPage.firstProductName).toHaveText(
            CONSTANT.PRODUCTS.RED_TSHIRT.NAME,
        );

        await inventoryPage.selectOption(CONSTANT.SORT_NAME_ASC);
        await expect(inventoryPage.selectedOption).toHaveText(
            CONSTANT.SORT_NAME_ASC,
        );
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.PRODUCTS.BACKPACK.NAME,
            CONSTANT.PRODUCTS.BIKE_LIGHT.NAME,
            CONSTANT.PRODUCTS.BOLT_TSHIRT.NAME,
            CONSTANT.PRODUCTS.FLEECE_JACKET.NAME,
            CONSTANT.PRODUCTS.ONESIE.NAME,
            CONSTANT.PRODUCTS.RED_TSHIRT.NAME,
        ]);
    });
});
