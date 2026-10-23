import { expect, test } from '@/tests/fixtures';

import { PRODUCTS } from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutStepOnePage,
    expectInventoryPage,
} from '@/utils/route';

const { BACKPACK, BOLT_TSHIRT } = PRODUCTS;

test('display cart title', async ({ emptyCartPage }) => {
    await expect(emptyCartPage.title).toHaveText('Your Cart');
});

test('no product in cart', async ({ emptyCartPage }) => {
    await expect(emptyCartPage.cartItems).toHaveCount(0);
});

test('redirect to checkout page after click checkout button', async ({
    page,
    emptyCartPage,
}) => {
    await emptyCartPage.clickCheckoutBtn();
    await expectCheckoutStepOnePage(page);
});

test('redirect to inventory page after click back to shopping button', async ({
    page,
    emptyCartPage,
}) => {
    await emptyCartPage.clickBackToShopBtn();
    await expectInventoryPage(page);
});

test('display 1 added product', async ({
    page,
    inventoryPageSignedIn,
    cartPage,
}) => {
    await inventoryPageSignedIn.addProductToCart(BOLT_TSHIRT.NAME);
    await inventoryPageSignedIn.clickCartLink();
    await expectCartPage(page);

    await expect(cartPage.cartItems).toHaveCount(1);

    const product = cartPage.getProductByName(BOLT_TSHIRT.NAME);
    await expect(product.name).toHaveText(BOLT_TSHIRT.NAME);
    await expect(product.desc).toContainText(BOLT_TSHIRT.DESC);
    await expect(product.price).toHaveText(BOLT_TSHIRT.PRICE);
    await expect(product.removeBtn).toBeVisible();
});

test.describe('add products to cart and navigate cart page', () => {
    test.beforeEach(async ({ page, inventoryPageSignedIn }) => {
        await inventoryPageSignedIn.addProductToCart(BOLT_TSHIRT.NAME);
        await inventoryPageSignedIn.addProductToCart(BACKPACK.NAME);

        await inventoryPageSignedIn.clickCartLink();
        await expectCartPage(page);
    });

    test('display 2 added products', async ({ cartPage }) => {
        await expect(cartPage.cartItemNames).toHaveText([
            BOLT_TSHIRT.NAME,
            BACKPACK.NAME,
        ]);
    });

    test('removes products from the cart one by one', async ({ cartPage }) => {
        await expect(cartPage.cartItemNames).toHaveText([
            BOLT_TSHIRT.NAME,
            BACKPACK.NAME,
        ]);

        const boltTShirtProduct = cartPage.getProductByName(BOLT_TSHIRT.NAME);
        await boltTShirtProduct.removeBtn.click();

        await expect(cartPage.cartItems).toHaveCount(1);
        await expect(cartPage.cartItemNames).toHaveText([BACKPACK.NAME]);

        const backpackProduct = cartPage.getProductByName(BACKPACK.NAME);
        await backpackProduct.removeBtn.click();
        await expect(cartPage.cartItems).toHaveCount(0);
    });
});
