import { test as base } from '@playwright/test';

import CartPage from '@/pages/cart';
import CheckoutCompletePage from '@/pages/checkout-complete';
import CheckoutInfoPage from '@/pages/checkout-info-page';
import CheckoutOverviewPage from '@/pages/checkout-overview-page';
import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';

import {
    expectCartPage,
    expectCheckoutStepOnePage,
    expectInventoryPage,
} from '@/utils/route';

import { PRODUCTS } from '../utils/constants';
const { BACKPACK, BOLT_TSHIRT } = PRODUCTS;

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
    defaultCheckoutInfoPage: CheckoutInfoPage;
}

export const test = base.extend<PageFixtures & SessionFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
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

    // session
    inventoryPageSignedIn: async ({ page, loginPage, inventoryPage }, use) => {
        await loginPage.goTo();
        await loginPage.login();
        await expectInventoryPage(page);
        await use(inventoryPage);
    },
    emptyCartPage: async ({ page, inventoryPageSignedIn, cartPage }, use) => {
        await inventoryPageSignedIn.clickCartLink();
        await expectCartPage(page);
        await use(cartPage);
    },
    defaultCheckoutInfoPage: async (
        { page, emptyCartPage, checkoutInfoPage },
        use,
    ) => {
        await emptyCartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);
        await use(checkoutInfoPage);
    },
});

export { expect } from '@playwright/test';
