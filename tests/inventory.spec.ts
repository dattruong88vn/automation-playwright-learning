import {
    PRODUCTS,
    SORT_NAME_ASC,
    SORT_NAME_DESC,
    SORT_PRICE_ASC,
    SORT_PRICE_DESC,
} from '@/utils/constants';

import { expect, test } from '@/tests/fixtures';

const { BACKPACK, BIKE_LIGHT, ONESIE, BOLT_TSHIRT, FLEECE_JACKET, RED_TSHIRT } =
    PRODUCTS;

test('6 products are displayed on the inventory page', async ({
    inventoryPageSignedIn,
}) => {
    await expect(inventoryPageSignedIn.productItem).toHaveCount(6);
});

test('Verify product details for Sauce Labs Backpack product', async ({
    inventoryPageSignedIn,
}) => {
    const backpackItem = inventoryPageSignedIn.getProductByName(BACKPACK.NAME);
    await expect(backpackItem.img).toHaveAttribute('alt', BACKPACK.NAME);
    await expect(backpackItem.name).toHaveText(BACKPACK.NAME);
    await expect(backpackItem.desc).toContainText(BACKPACK.DESC);
    await expect(backpackItem.price).toHaveText(BACKPACK.PRICE);
    await expect(backpackItem.addToCartBtn).toBeVisible();
});

test('Add product to cart, verify button and cart count', async ({
    inventoryPageSignedIn,
}) => {
    const backpackItem = inventoryPageSignedIn.getProductByName(BACKPACK.NAME);
    await backpackItem.addToCartBtn.click();
    await expect(backpackItem.removeBtn).toBeVisible();
    await expect(backpackItem.addToCartBtn).toBeHidden();
    await expect(inventoryPageSignedIn.cartCount).toHaveText('1');
});

test('cart badge updates when products are added and removed', async ({
    inventoryPageSignedIn,
}) => {
    // add 2 products to cart
    for (const productName of [BACKPACK.NAME, BIKE_LIGHT.NAME]) {
        await inventoryPageSignedIn.addProductToCart(productName);
    }
    await expect(inventoryPageSignedIn.cartCount).toHaveText('2');

    const firstItem = inventoryPageSignedIn.getProductByName(BACKPACK.NAME);
    await firstItem.removeBtn.click();
    await expect(inventoryPageSignedIn.cartCount).toHaveText('1');

    const secondItem = inventoryPageSignedIn.getProductByName(BIKE_LIGHT.NAME);
    await secondItem.removeBtn.click();
    await expect(inventoryPageSignedIn.cartCount).toBeHidden();
});

test('Verify sort exists and has 4 options: default Name (A to Z)', async ({
    inventoryPageSignedIn,
}) => {
    await expect(inventoryPageSignedIn.sortSelect).toBeVisible();
    await expect(inventoryPageSignedIn.selectedOption).toHaveText(
        SORT_NAME_ASC,
    );

    await expect(inventoryPageSignedIn.options).toHaveText([
        SORT_NAME_ASC,
        SORT_NAME_DESC,
        SORT_PRICE_ASC,
        SORT_PRICE_DESC,
    ]);
});

test.describe('select sort option', () => {
    test('Verify sort by Name (Z to A)', async ({ inventoryPageSignedIn }) => {
        await inventoryPageSignedIn.selectOption(SORT_NAME_DESC);
        await expect(inventoryPageSignedIn.selectedOption).toHaveText(
            SORT_NAME_DESC,
        );
        await expect(inventoryPageSignedIn.productNames).toHaveText([
            RED_TSHIRT.NAME,
            ONESIE.NAME,
            FLEECE_JACKET.NAME,
            BOLT_TSHIRT.NAME,
            BIKE_LIGHT.NAME,
            BACKPACK.NAME,
        ]);
    });

    test('Verify sort by Price (low to high)', async ({
        inventoryPageSignedIn,
    }) => {
        await inventoryPageSignedIn.selectOption(SORT_PRICE_ASC);
        await expect(inventoryPageSignedIn.selectedOption).toHaveText(
            SORT_PRICE_ASC,
        );
        await expect(inventoryPageSignedIn.productNames).toHaveText([
            ONESIE.NAME,
            BIKE_LIGHT.NAME,
            BOLT_TSHIRT.NAME,
            RED_TSHIRT.NAME,
            BACKPACK.NAME,
            FLEECE_JACKET.NAME,
        ]);
    });

    test('Verify sort by Price (high to low)', async ({
        inventoryPageSignedIn,
    }) => {
        await inventoryPageSignedIn.selectOption(SORT_PRICE_DESC);
        await expect(inventoryPageSignedIn.selectedOption).toHaveText(
            SORT_PRICE_DESC,
        );
        await expect(inventoryPageSignedIn.productNames).toHaveText([
            FLEECE_JACKET.NAME,
            BACKPACK.NAME,
            BOLT_TSHIRT.NAME,
            RED_TSHIRT.NAME,
            BIKE_LIGHT.NAME,
            ONESIE.NAME,
        ]);
    });

    test('Verify sort by Name (A to Z)', async ({ inventoryPageSignedIn }) => {
        await inventoryPageSignedIn.selectOption(SORT_NAME_DESC);
        await expect(inventoryPageSignedIn.firstProductName).toHaveText(
            RED_TSHIRT.NAME,
        );

        await inventoryPageSignedIn.selectOption(SORT_NAME_ASC);
        await expect(inventoryPageSignedIn.selectedOption).toHaveText(
            SORT_NAME_ASC,
        );
        await expect(inventoryPageSignedIn.productNames).toHaveText([
            BACKPACK.NAME,
            BIKE_LIGHT.NAME,
            BOLT_TSHIRT.NAME,
            FLEECE_JACKET.NAME,
            ONESIE.NAME,
            RED_TSHIRT.NAME,
        ]);
    });
});
