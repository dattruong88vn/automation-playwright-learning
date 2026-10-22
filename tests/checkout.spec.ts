import { test, expect } from "@playwright/test";

import * as CONSTANT from "../utils/constants";
import { expectCartPage, expectCheckoutStepOnePage, expectCheckoutStepTwoPage, expectInventoryPage } from "../utils/route";
import LoginPage from "../pages/login";
import InventoryPage from "../pages/inventory";
import CheckoutInfoPage from "../pages/checkout-info-page";
import CartPage from "../pages/cart";
import CheckoutOverviewPage from "../pages/checkout-overview-page";

test.describe("checkout page show error when fields are empty", () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutInfoPage: CheckoutInfoPage


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

    test("shows error when all fields are empty", async ({ page }) => {
        await checkoutInfoPage.clickContinueBtn();
        await expectCheckoutStepOnePage(page);
        await expect(checkoutInfoPage.errorMessage).toHaveText('Error: First Name is required');
    });

    test("shows error when zip code is empty", async ({ page }) => {
        await checkoutInfoPage.fillFirstNameField(CONSTANT.CHECKOUT_FIRST_NAME);
        await checkoutInfoPage.fillLastNameField(CONSTANT.CHECKOUT_LAST_NAME);
        await checkoutInfoPage.clickContinueBtn();

        await expectCheckoutStepOnePage(page);
        await expect(checkoutInfoPage.errorMessage).toHaveText('Error: Postal Code is required');
    });

    test("shows error when last name is empty", async ({ page }) => {
        await checkoutInfoPage.fillFirstNameField(CONSTANT.CHECKOUT_FIRST_NAME);
        await checkoutInfoPage.fillPostalCodeField(CONSTANT.CHECKOUT_POSTAL_CODE);
        await checkoutInfoPage.clickContinueBtn();

        await expectCheckoutStepOnePage(page);
        await expect(checkoutInfoPage.errorMessage).toHaveText('Error: Last Name is required');
    });

    test("shows error when first name is empty", async ({ page }) => {
        await checkoutInfoPage.fillLastNameField(CONSTANT.CHECKOUT_LAST_NAME);
        await checkoutInfoPage.fillPostalCodeField(CONSTANT.CHECKOUT_POSTAL_CODE);
        await checkoutInfoPage.clickContinueBtn();

        await expectCheckoutStepOnePage(page);
        await expect(checkoutInfoPage.errorMessage).toHaveText('Error: First Name is required');
    });
});

test("completes checkout information and shows the added product on the overview page", { tag: "@smoke" }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);

    await test.step("login, add product and open the checkout form", async () => {
        await loginPage.goTo();
        await loginPage.login();

        await expectInventoryPage(page);

        await inventoryPage.addProductToCart(CONSTANT.BACKPACK);
        await inventoryPage.clickCartLink();
        await expectCartPage(page);

        await cartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);
    });

    await test.step("fill in checkout information", async () => {
        await checkoutInfoPage.fillInformation(CONSTANT.CHECKOUT_FIRST_NAME, CONSTANT.CHECKOUT_LAST_NAME, CONSTANT.CHECKOUT_POSTAL_CODE);
        await checkoutInfoPage.clickContinueBtn();

        await expectCheckoutStepTwoPage(page);
    });

    await test.step("verify the overview page shows the added product", async () => {
        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        await expect(checkoutOverviewPage.overviewItem).toHaveCount(1);
        await expect(checkoutOverviewPage.overviewItemName).toHaveText(CONSTANT.BACKPACK);
        await expect(checkoutOverviewPage.overviewItemQuantity).toHaveText("1");
        await expect(checkoutOverviewPage.overviewItemPrice).toHaveText("$29.99");
    });
});