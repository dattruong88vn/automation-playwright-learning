import { expect, test } from "@playwright/test";
import { expectCartPage, expectCheckoutStepOnePage, expectInventoryPage } from "../utils/route";
import LoginPage from "../pages/login";
import InventoryPage from "../pages/inventory";
import CartPage from "../pages/cart";
import { BACKPACK, BOLT_TSHIRT } from "../utils/constants";

test.describe("cart page", () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.goTo();
        await loginPage.login();
        await expectInventoryPage(page);

    })

    test("no product in cart", async ({ page }) => {
        await inventoryPage.clickCartLink();
        await expectCartPage(page);
        await expect(cartPage.cartItems).toHaveCount(0);
    })

    test("redirect to checkout page after click checkout button", async ({ page }) => {
        await inventoryPage.clickCartLink();
        await expectCartPage(page);
        await cartPage.clickCheckoutBtn();
        await expectCheckoutStepOnePage(page);
    });

    test("redirect to inventory page after click back to shopping button", async ({ page }) => {
        await inventoryPage.clickCartLink();
        await expectCartPage(page);

        await cartPage.clickBackToShopBtn();
        await expectInventoryPage(page);
    });

    test("display 1 added product", async ({ page }) => {
        await inventoryPage.addProductToCart(BOLT_TSHIRT);
        await inventoryPage.clickCartLink();
        await expectCartPage(page);

        await expect(cartPage.cartItems).toHaveCount(1);

        const product = cartPage.getProductByName(BOLT_TSHIRT);
        await expect(product.name).toHaveText(BOLT_TSHIRT);
        await expect(product.desc).toContainText("Sauce Labs bolt T-shirt");
        await expect(product.price).toHaveText("$15.99")
        await expect(product.removeBtn).toBeVisible();
    });

    test.describe("add products to cart and navigate cart page", () => {
        test.beforeEach(async ({ page }) => {
            await inventoryPage.addProductToCart(BOLT_TSHIRT);
            await inventoryPage.addProductToCart(BACKPACK);

            await inventoryPage.clickCartLink();
            await expectCartPage(page);
        })

        test("display 2 added products", async ({ page }) => {
            await expect(cartPage.cartItemNames).toHaveText([BOLT_TSHIRT, BACKPACK])
        });

        test("removes products from the cart one by one", async ({ page }) => {
            await expect(cartPage.cartItemNames).toHaveText([BOLT_TSHIRT, BACKPACK])

            const boltTShirtProduct = cartPage.getProductByName(BOLT_TSHIRT);
            await boltTShirtProduct.removeBtn.click();

            await expect(cartPage.cartItems).toHaveCount(1);
            await expect(cartPage.cartItemNames).toHaveText([BACKPACK])

            const backpackProduct = cartPage.getProductByName(BACKPACK);
            await backpackProduct.removeBtn.click();
            await expect(cartPage.cartItems).toHaveCount(0);
        });
    })
})