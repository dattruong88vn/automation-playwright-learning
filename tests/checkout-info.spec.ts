import { test, expect } from '@playwright/test';

import {
    CHECKOUT_FIRST_NAME,
    CHECKOUT_LAST_NAME,
    PRODUCTS,
} from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';
import LoginPage from '@/pages/login';
import InventoryPage from '@/pages/inventory';
import CheckoutInfoPage from '@/pages/checkout-info-page';
import CartPage from '@/pages/cart';
import CheckoutOverviewPage from '@/pages/checkout-overview-page';
import { CHECKOUT_POSTAL_CODE } from '@/utils/constants';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutInfoPage: CheckoutInfoPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);

    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);

    await inventoryPage.clickCartLink();
    await expectCartPage(page);

    await cartPage.clickCheckoutBtn();
    await expectCheckoutStepOnePage(page);
});

test('display title and input fields', async ({ page }) => {
    await expect(checkoutInfoPage.title).toHaveText(
        'Checkout: Your Information',
    );
    await expect(checkoutInfoPage.firstNameField).toBeVisible();
    await expect(checkoutInfoPage.lastNameField).toBeVisible();
    await expect(checkoutInfoPage.postalCodeField).toBeVisible();
});

test('display cancel button and continue button', async () => {
    await expect(checkoutInfoPage.cancelBtn).toBeVisible();
    await expect(checkoutInfoPage.continueBtn).toBeVisible();
});

test('navigate to cart page when click cancel button', async ({ page }) => {
    await checkoutInfoPage.clickCancelBtn();
    await expectCartPage(page);
});

test('shows error when all fields are empty', async ({ page }) => {
    await checkoutInfoPage.clickContinueBtn();
    await expectCheckoutStepOnePage(page);
    await expect(checkoutInfoPage.errorMessage).toHaveText(
        'Error: First Name is required',
    );
});

test('shows error when zip code is empty', async ({ page }) => {
    await checkoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await checkoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await checkoutInfoPage.clickContinueBtn();

    await expectCheckoutStepOnePage(page);
    await expect(checkoutInfoPage.errorMessage).toHaveText(
        'Error: Postal Code is required',
    );
});

test('shows error when last name is empty', async ({ page }) => {
    await checkoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await checkoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await checkoutInfoPage.clickContinueBtn();

    await expectCheckoutStepOnePage(page);
    await expect(checkoutInfoPage.errorMessage).toHaveText(
        'Error: Last Name is required',
    );
});

test('shows error when first name is empty', async ({ page }) => {
    await checkoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await checkoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await checkoutInfoPage.clickContinueBtn();

    await expectCheckoutStepOnePage(page);
    await expect(checkoutInfoPage.errorMessage).toHaveText(
        'Error: First Name is required',
    );
});

test(
    'completes checkout information and shows the added product on the overview page',
    { tag: '@smoke' },
    async ({ page }) => {
        await test.step('login, add product and open the checkout form', async () => {
            await loginPage.goTo();
            await loginPage.login();

            await expectInventoryPage(page);

            await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.NAME);
            await inventoryPage.clickCartLink();
            await expectCartPage(page);

            await cartPage.clickCheckoutBtn();
            await expectCheckoutStepOnePage(page);
        });

        await test.step('fill in checkout information', async () => {
            await checkoutInfoPage.fillInformation();
            await checkoutInfoPage.clickContinueBtn();

            await expectCheckoutStepTwoPage(page);
        });
    },
);
