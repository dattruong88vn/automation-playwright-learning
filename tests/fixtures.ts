import { test as base } from '@playwright/test';

import CartPage from '@/pages/cart';
import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';

import { expectInventoryPage } from '@/utils/route';

interface PageFixtures {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
}

interface SessionFixtures {
    inventoryPageSignedIn: InventoryPage;
}

export const test = base.extend<PageFixtures & SessionFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    // session
    inventoryPageSignedIn: async ({ page, loginPage, inventoryPage }, use) => {
        await loginPage.goTo();
        await loginPage.login();
        await expectInventoryPage(page);
        await use(inventoryPage);
    },
});

export { expect } from '@playwright/test';
