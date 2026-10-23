import { expect, test } from '@/tests/fixtures';

import { PRODUCTS } from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutCompletePage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';

test.describe('display correct title, labels, buttons and navigate', () => {
    test('show title and labels', async ({ defaultCheckoutOverviewPage }) => {
        await expect(defaultCheckoutOverviewPage.title).toHaveText(
            'Checkout: Overview',
        );
        await expect(defaultCheckoutOverviewPage.paymentInfoLabel).toHaveText(
            'Payment Information:',
        );
        await expect(defaultCheckoutOverviewPage.shippingInfoLabel).toHaveText(
            'Shipping Information:',
        );
        await expect(defaultCheckoutOverviewPage.totalInfoLabel).toHaveText(
            'Price Total',
        );
    });

    test('display cancel button and finish button', async ({
        defaultCheckoutOverviewPage,
    }) => {
        await expect(defaultCheckoutOverviewPage.cancelBtn).toBeVisible();
        await expect(defaultCheckoutOverviewPage.finishBtn).toBeVisible();
    });

    test('navigate to inventory page when click cancel button', async ({
        page,
        defaultCheckoutOverviewPage,
    }) => {
        await defaultCheckoutOverviewPage.clickCancelBtn();
        await expectInventoryPage(page);
    });

    test('navigate to checkout complete page when click finish button', async ({
        page,
        defaultCheckoutOverviewPage,
    }) => {
        await defaultCheckoutOverviewPage.clickFinishBtn();
        await expectCheckoutCompletePage(page);
    });
});

test('overview lists both added products with name, description and price', async ({
    page,
    inventoryPageSignedIn,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
}) => {
    const { BACKPACK, BIKE_LIGHT } = PRODUCTS;

    for (const productName of [BACKPACK.NAME, BIKE_LIGHT.NAME]) {
        await inventoryPageSignedIn.addProductToCart(productName);
    }
    await expect(inventoryPageSignedIn.cartCount).toHaveText('2');

    await inventoryPageSignedIn.clickCartLink();
    await expectCartPage(page);

    await cartPage.clickCheckoutBtn();
    await expectCheckoutStepOnePage(page);

    await checkoutInfoPage.fillInformation();
    await checkoutInfoPage.clickContinueBtn();
    await expectCheckoutStepTwoPage(page);
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
