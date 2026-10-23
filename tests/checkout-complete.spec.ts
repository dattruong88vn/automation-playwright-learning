import {
    DOWNLOAD,
    PRODUCTS,
    REG_EXP_DOWNLOAD_FILE_NAME,
} from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutCompletePage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';

import { expect, test } from '@/tests/fixtures';

const { BACKPACK } = PRODUCTS;

test.describe('display correct title, header, text, buttons and navigate', () => {
    test('display title, header, text and buttons correctly', async ({
        emptyCartCheckoutCompletePage,
    }) => {
        await expect(emptyCartCheckoutCompletePage.title).toHaveText(
            'Checkout: Complete!',
        );
        await expect(emptyCartCheckoutCompletePage.completeHeader).toHaveText(
            'Thank you for your order!',
        );
        await expect(emptyCartCheckoutCompletePage.completeText).toContainText(
            'has been dispatched',
        );
        await expect(emptyCartCheckoutCompletePage.backHomeBtn).toBeVisible();
        await expect(
            emptyCartCheckoutCompletePage.generatePdfBtn,
        ).toBeVisible();
    });

    test('navigate to inventory page when click back to home button', async ({
        page,
        emptyCartCheckoutCompletePage,
    }) => {
        await emptyCartCheckoutCompletePage.clickBackHomeBtn();
        await expectInventoryPage(page);
    });

    test('download pdf when click generate pdf button', async ({
        page,
        emptyCartCheckoutCompletePage,
    }) => {
        const downloadPromise = page.waitForEvent(DOWNLOAD);
        await emptyCartCheckoutCompletePage.clickGeneratePdfBtn();
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(
            REG_EXP_DOWNLOAD_FILE_NAME,
        );
        expect(await download.failure()).toBeNull();
    });
});

test('cart badge is cleared after finishing the order', async ({
    page,
    inventoryPageSignedIn,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
}) => {
    await inventoryPageSignedIn.addProductToCart(BACKPACK.NAME);
    await expect(inventoryPageSignedIn.cartCount).toHaveText('1');
    await inventoryPageSignedIn.clickCartLink();
    await expectCartPage(page);

    await cartPage.clickCheckoutBtn();
    await expectCheckoutStepOnePage(page);

    await checkoutInfoPage.fillInformation();
    await checkoutInfoPage.clickContinueBtn();
    await expectCheckoutStepTwoPage(page);

    await checkoutOverviewPage.clickFinishBtn();
    await expectCheckoutCompletePage(page);

    await expect(checkoutCompletePage.cartCount).toBeHidden();
});
