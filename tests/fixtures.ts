import { test as base } from '@playwright/test';

import CartPage from '@/pages/cart';
import CheckoutCompletePage from '@/pages/checkout-complete';
import CheckoutInfoPage from '@/pages/checkout-info-page';
import CheckoutOverviewPage from '@/pages/checkout-overview-page';
import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';

import {
    expectCartPage,
    expectCheckoutCompletePage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
    expectInventoryPage,
} from '@/utils/route';

interface PageFixtures {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutInfoPage: CheckoutInfoPage;
    checkoutOverviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;
}
interface SessionFixtures {
    inventoryPageSignedIn: InventoryPage;
    emptyCartPage: CartPage;
    emptyCartCheckoutInfoPage: CheckoutInfoPage;
    emptyCartCheckoutOverviewPage: CheckoutOverviewPage;
    emptyCartCheckoutCompletePage: CheckoutCompletePage;
}

export const test = base.extend<PageFixtures & SessionFixtures>({
    loginPage: async ({ page }, use) => {
        console.log('before login use');
        await use(new LoginPage(page));
        console.log('after login use');
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutInfoPage: async ({ page }, use) => {
        await use(new CheckoutInfoPage(page));
    },
    checkoutOverviewPage: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },
    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },

    // StateFixtures
    inventoryPageSignedIn: async ({ page, inventoryPage }, use) => {
        await inventoryPage.goTo();
        await expectInventoryPage(page);
        await use(inventoryPage);
    },
    emptyCartPage: async ({ page, inventoryPageSignedIn, cartPage }, use) => {
        await inventoryPageSignedIn.clickCartLink();
        await expectCartPage(page);
        await use(cartPage);
    },
    emptyCartCheckoutInfoPage: async (
        { page, emptyCartPage, checkoutInfoPage },
        use,
    ) => {
        await emptyCartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);
        await use(checkoutInfoPage);
    },
    emptyCartCheckoutOverviewPage: async (
        { page, emptyCartCheckoutInfoPage, checkoutOverviewPage },
        use,
    ) => {
        await emptyCartCheckoutInfoPage.fillInformation();
        await emptyCartCheckoutInfoPage.clickContinueBtn();
        await expectCheckoutStepTwoPage(page);
        await use(checkoutOverviewPage);
    },
    emptyCartCheckoutCompletePage: async (
        { page, emptyCartCheckoutOverviewPage, checkoutCompletePage },
        use,
    ) => {
        await emptyCartCheckoutOverviewPage.clickFinishBtn();
        await expectCheckoutCompletePage(page);
        await use(checkoutCompletePage);
    },
});

export { expect } from '@playwright/test';
