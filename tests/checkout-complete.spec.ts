import { expect,test } from '@playwright/test';

import CartPage from '@/pages/cart';
import CheckoutCompletePage from '@/pages/checkout-complete';
import CheckoutInfoPage from '@/pages/checkout-info-page';
import CheckoutOverviewPage from '@/pages/checkout-overview-page';
import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';

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

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutInfoPage: CheckoutInfoPage;
let checkoutOverviewPage: CheckoutOverviewPage;
let checkoutCompletePage: CheckoutCompletePage;

const { BACKPACK, BIKE_LIGHT } = PRODUCTS;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);

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

    await checkoutOverviewPage.clickFinishBtn();
    await expectCheckoutCompletePage(page);
});

test('display title, header, text and buttons correctly', async ({ page }) => {
    await expect(checkoutCompletePage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.completeHeader).toHaveText(
        'Thank you for your order!',
    );
    await expect(checkoutCompletePage.completeText).toContainText(
        'has been dispatched',
    );
    await expect(checkoutCompletePage.backHomeBtn).toBeVisible();
    await expect(checkoutCompletePage.generatePdfBtn).toBeVisible();
});

test('navigate to inventory page when click back to home button', async ({
    page,
}) => {
    await checkoutCompletePage.clickBackHomeBtn();
    await expectInventoryPage(page);
});

test('clear cart when click back to home button', async ({ page }) => {
    await checkoutCompletePage.clickBackHomeBtn();
    await expect(inventoryPage.cartCount).toBeHidden();
});

test('download pdf when click generate pdf button', async ({ page }) => {
    const downloadPromise = page.waitForEvent(DOWNLOAD);
    await checkoutCompletePage.clickGeneratePdfBtn();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(REG_EXP_DOWNLOAD_FILE_NAME);
    expect(await download.failure()).toBeNull();
});
