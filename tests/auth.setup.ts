// tests/dashboard.spec.ts: không cần login nữa
// const authFile = '/.auth/user.json';

import { AUTH_FILE } from '@/utils/constants';
import { expectInventoryPage } from '@/utils/route';

import { test as setup } from '@/tests/fixtures';

setup('vào thẳng dashboard', async ({ page, loginPage }) => {
    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);

    await page.context().storageState({ path: AUTH_FILE }); // lưu trạng thái đăng nhập
});
