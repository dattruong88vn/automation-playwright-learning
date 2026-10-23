import { PRODUCTS } from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutCompletePage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';

import { expect, test } from '@/tests/fixtures';

test.describe('display correct title, labels, buttons and navigate', () => {
    test('show title and labels', async ({ emptyCartCheckoutOverviewPage }) => {
        await expect(emptyCartCheckoutOverviewPage.title).toHaveText(
            'Checkout: Overview',
        );
        await expect(emptyCartCheckoutOverviewPage.paymentInfoLabel).toHaveText(
            'Payment Information:',
        );
        await expect(
            emptyCartCheckoutOverviewPage.shippingInfoLabel,
        ).toHaveText('Shipping Information:');
        await expect(emptyCartCheckoutOverviewPage.totalInfoLabel).toHaveText(
            'Price Total',
        );
    });

    test('display cancel button and finish button', async ({
        emptyCartCheckoutOverviewPage,
    }) => {
        await expect(emptyCartCheckoutOverviewPage.cancelBtn).toBeVisible();
        await expect(emptyCartCheckoutOverviewPage.finishBtn).toBeVisible();
    });

    test('navigate to inventory page when click cancel button', async ({
        page,
        emptyCartCheckoutOverviewPage,
    }) => {
        await emptyCartCheckoutOverviewPage.clickCancelBtn();
        await expectInventoryPage(page);
    });

    test('navigate to checkout complete page when click finish button', async ({
        page,
        emptyCartCheckoutOverviewPage,
    }) => {
        await emptyCartCheckoutOverviewPage.clickFinishBtn();
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
