import { expect,test } from '@playwright/test';

import CartPage from '@/pages/cart';
import CheckoutInfoPage from '@/pages/checkout-info-page';
import CheckoutOverviewPage from '@/pages/checkout-overview-page';
import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';

import { PRODUCTS } from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutCompletePage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutInfoPage: CheckoutInfoPage;
let checkoutOverviewPage: CheckoutOverviewPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);

    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);
});

test.describe('display correct title, labels, buttons and navigate', async () => {
    test.beforeEach(async ({ page }) => {
        await inventoryPage.clickCartLink();
        await expectCartPage(page);

        await cartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);

        await checkoutInfoPage.fillInformation();
        await checkoutInfoPage.clickContinueBtn();
        await expectCheckoutStepTwoPage(page);
    });

    test('show title and labels', async () => {
        await expect(checkoutOverviewPage.title).toHaveText(
            'Checkout: Overview',
        );
        await expect(checkoutOverviewPage.paymentInfoLabel).toHaveText(
            'Payment Information:',
        );
        await expect(checkoutOverviewPage.shippingInfoLabel).toHaveText(
            'Shipping Information:',
        );
        await expect(checkoutOverviewPage.totalInfoLabel).toHaveText(
            'Price Total',
        );
    });

    test('display cancel button and finish button', async ({ page }) => {
        await expect(checkoutOverviewPage.cancelBtn).toBeVisible();
        await expect(checkoutOverviewPage.finishBtn).toBeVisible();
    });

    test('navigate to inventory page when click cancel button', async ({
        page,
    }) => {
        await checkoutOverviewPage.clickCancelBtn();
        await expectInventoryPage(page);
    });

    test('navigate to checkout complete page when click finish button', async ({
        page,
    }) => {
        await checkoutOverviewPage.clickFinishBtn();
        await expectCheckoutCompletePage(page);
    });
});

test.describe('add products and display correct information', async () => {
    const { BACKPACK, BIKE_LIGHT } = PRODUCTS;
    test.beforeEach(async ({ page }) => {
        // add 2 products to cart
        for (const productName of [BACKPACK.NAME, BIKE_LIGHT.NAME]) {
            const item = inventoryPage.getProductByName(productName);
            await item.addToCartBtn.click();
        }
        await expect(inventoryPage.cartCount).toHaveText('2');

        await inventoryPage.clickCartLink();
        await expectCartPage(page);

        await cartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);

        await checkoutInfoPage.fillInformation();
        await checkoutInfoPage.clickContinueBtn();
        await expectCheckoutStepTwoPage(page);
    });

    test('verify the overview page shows the added product', async () => {
        await expect(checkoutOverviewPage.overviewItems).toHaveCount(2);
        await expect(checkoutOverviewPage.overviewItemNames).toHaveText([
            BACKPACK.NAME,
            BIKE_LIGHT.NAME,
        ]);
        await expect(checkoutOverviewPage.overviewItemDescs).toContainText([
            BACKPACK.DESC,
            BIKE_LIGHT.DESC,
        ]);
        await expect(checkoutOverviewPage.overviewItemPrices).toHaveText([
            BACKPACK.PRICE,
            BIKE_LIGHT.PRICE,
        ]);
    });
});
