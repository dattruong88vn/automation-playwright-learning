import InventoryPage from '@/pages/inventory';
import LoginPage from '@/pages/login';
import { expectInventoryPage } from '@/utils/route';
import { test as base } from '@playwright/test';

interface PageFixtures {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
}

interface SessionFixtures {
    loggedInInventoryPage: InventoryPage;
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
    // session
    loggedInInventoryPage: async ({ page, loginPage, inventoryPage }, use) => {
        await loginPage.goTo();
        await loginPage.login();
        await expectInventoryPage(page);
        await use(inventoryPage);
    },
});

export { expect } from '@playwright/test';
