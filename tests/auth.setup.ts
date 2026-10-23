import { test as setup } from '@playwright/test';

import LoginPage from '@/pages/login';

import { AUTH_FILE } from '@/utils/constants';
import { expectInventoryPage } from '@/utils/route';

setup('login and save session', async ({ page }) => {
    // 1. đăng nhập bằng page object của bạn
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login();
    // 2. kiểm tra đã vào trang danh sách sản phẩm
    await expectInventoryPage(page);
    // 3. lưu phiên:
    await page.context().storageState({ path: AUTH_FILE });
});
