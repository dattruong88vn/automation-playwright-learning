import { test, expect } from "@playwright/test";
import LoginPage from "../pages/login";
import { expectLoginPage, expectInventoryPage } from "../utils/route";
import { DEFAULT_PASSWORD, DEFAULT_USERNAME, LOCKED_OUT_USERNAME, PERFORMANCE_GLITCH_USERNAME, WRONG_PASSWORD } from "../utils/constants";
import InventoryPage from "../pages/inventory";

test("login page has correct url and title", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await expect(page).toHaveTitle("Swag Labs")
    await expectLoginPage(page);
});

test("login page shows username, password and login button", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await expect(loginPage.userNameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
});

test("login successfully and redirect to products page", { tag: "@smoke" }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goTo();
    await loginPage.login();

    await expectInventoryPage(page);
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.productList).toBeVisible();
});

test("login with wrong password and display error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(DEFAULT_USERNAME, WRONG_PASSWORD);

    // verify
    await expect(loginPage.error).toHaveText(
        "Epic sadface: Username and password do not match any user in this service",
    );
    await expectLoginPage(page);
});

test("form keeps entered values after failed login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(DEFAULT_USERNAME, WRONG_PASSWORD);

    await expect(loginPage.error).toBeVisible();
    await expect(loginPage.userNameField).toHaveValue(DEFAULT_USERNAME);
    await expect(loginPage.passwordField).toHaveValue(WRONG_PASSWORD);
});

test("login with locked account and display error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(LOCKED_OUT_USERNAME, DEFAULT_PASSWORD);

    await expect(loginPage.error).toHaveText(
        "Epic sadface: Sorry, this user has been locked out.",
    );
    await expectLoginPage(page);
});

test.describe("login with empty username and password", () => {
    test("login with empty username", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();
        await loginPage.login('', DEFAULT_PASSWORD);

        await expect(loginPage.error).toHaveText("Epic sadface: Username is required");
        await expectLoginPage(page);
    });

    test("login with empty password", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();
        await loginPage.login(DEFAULT_USERNAME, '');

        // verify
        await expect(loginPage.error).toHaveText("Epic sadface: Password is required");
        await expectLoginPage(page);
    });
});

test("login by press enter", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.fillUserNameAndPassword(DEFAULT_USERNAME, DEFAULT_PASSWORD);
    await loginPage.passwordField.press("Enter");
    await expectInventoryPage(page);
});

test("login successfully and redirect to products page with performance user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goTo();
    // enter user name and password - submit
    await loginPage.login(PERFORMANCE_GLITCH_USERNAME, DEFAULT_PASSWORD);

    // verify
    await expectInventoryPage(page);
    await expect(inventoryPage.title).toHaveText("Products", { timeout: 10000 });
    await expect(inventoryPage.productList).toBeVisible();
});

// test("floaky", async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const inventoryPage = new InventoryPage(page);

//     await loginPage.goTo();
//     // enter user name and password - submit
//     await loginPage.login("performance_glitch_user", "secret_sauce");

//     // 2 lỗi flaky 
//     const productItem = await page.getByTestId("INVENTORY_ITEM").count();
//     expect(productItem).toBe(6); // do khong có cơ chế retry

//     await expect(page.getByTestId("INVENTORY_ITEM")).toHaveCount(6); // login with performance_glitch_user
// });