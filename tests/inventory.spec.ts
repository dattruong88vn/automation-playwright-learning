import { test, expect } from "@playwright/test";
import { expectInventoryPage } from "../utils/route";
import * as CONSTANT from "../utils/constants";
import LoginPage from "../pages/login";
import InventoryPage from "../pages/inventory";

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login();
    await expectInventoryPage(page);
    inventoryPage = new InventoryPage(page);
});

test("6 products are displayed on the inventory page", async ({ page }) => {
    await expect(inventoryPage.productItem).toHaveCount(6);
});

test("Verify product details for Sauce Labs Backpack product", async ({ page }) => {
    const backpackItem = inventoryPage.getProductByName(CONSTANT.BACKPACK);
    await expect(backpackItem.img).toHaveAttribute("alt", CONSTANT.BACKPACK);
    await expect(backpackItem.name).toHaveText(CONSTANT.BACKPACK);
    await expect(backpackItem.desc).toContainText(
        "streamlined Sly Pack",
    );
    await expect(backpackItem.price).toHaveText("$29.99");
    await expect(backpackItem.addToCartBtn).toBeVisible();
});

test("Add product to cart, verify button and cart count", async ({ page }) => {
    const backpackItem = inventoryPage.getProductByName(CONSTANT.BACKPACK);
    await backpackItem.addToCartBtn.click();
    await expect(backpackItem.removeBtn).toBeVisible();
    await expect(backpackItem.addToCartBtn).toBeHidden();
    await expect(inventoryPage.cartCount).toHaveText("1");
});

test("Add the second product to cart, remove all products step by step and verify cart count", async ({ page }) => {
    // add 2 products to cart
    for (const productName of [CONSTANT.BACKPACK, CONSTANT.BIKE_LIGHT]) {
        const item = inventoryPage.getProductByName(productName);
        await item.addToCartBtn.click();
    }
    await expect(inventoryPage.cartCount).toHaveText("2");

    const firstItem = inventoryPage.getProductByName(CONSTANT.BACKPACK);
    await firstItem.removeBtn.click();
    await expect(inventoryPage.cartCount).toHaveText("1");

    const secondItem = inventoryPage.getProductByName(CONSTANT.BIKE_LIGHT);
    await secondItem.removeBtn.click();
    await expect(inventoryPage.cartCount).toBeHidden();
});

test("Verify sort exists and has 4 options: default Name (A to Z)", async ({ page }) => {
    await expectInventoryPage(page);
    // verify
    await expect(inventoryPage.sortSelect).toBeVisible();
    await expect(inventoryPage.selectedOption).toHaveText(CONSTANT.SORT_NAME_ASC);

    await expect(inventoryPage.options).toHaveText([
        CONSTANT.SORT_NAME_ASC, CONSTANT.SORT_NAME_DESC, CONSTANT.SORT_PRICE_ASC, CONSTANT.SORT_PRICE_DESC
    ]);
});

test.describe("select sort option", () => {
    test.beforeEach(async ({ page }) => {
        await expectInventoryPage(page);

    });

    test("Verify sort by Name (Z to A)", async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_NAME_DESC);
        await expect(inventoryPage.selectedOption).toHaveText(CONSTANT.SORT_NAME_DESC);
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.RED_TSHIRT,
            CONSTANT.ONESIE,
            CONSTANT.FLEECE_JACKET,
            CONSTANT.BOLT_TSHIRT,
            CONSTANT.BIKE_LIGHT,
            CONSTANT.BACKPACK
        ]);
    });

    test("Verify sort by Price (low to high)", async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_PRICE_ASC);
        await expect(inventoryPage.selectedOption).toHaveText(CONSTANT.SORT_PRICE_ASC);
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.ONESIE,
            CONSTANT.BIKE_LIGHT,
            CONSTANT.BOLT_TSHIRT,
            CONSTANT.RED_TSHIRT,
            CONSTANT.BACKPACK,
            CONSTANT.FLEECE_JACKET,
        ]);
    });

    test("Verify sort by Price (high to low)", async () => {
        await inventoryPage.selectOption(CONSTANT.SORT_PRICE_DESC);
        await expect(inventoryPage.selectedOption).toHaveText(CONSTANT.SORT_PRICE_DESC);
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.FLEECE_JACKET,
            CONSTANT.BACKPACK,
            CONSTANT.BOLT_TSHIRT,
            CONSTANT.RED_TSHIRT,
            CONSTANT.BIKE_LIGHT,
            CONSTANT.ONESIE,
        ]);
    });

    test("Verify sort by Name (A to Z)", async ({ page }) => {
        await inventoryPage.selectOption(CONSTANT.SORT_NAME_DESC);
        await expect(inventoryPage.firstProductName).toHaveText(CONSTANT.RED_TSHIRT);

        await inventoryPage.selectOption(CONSTANT.SORT_NAME_ASC);
        await expect(inventoryPage.selectedOption).toHaveText(CONSTANT.SORT_NAME_ASC);
        await expect(inventoryPage.productNames).toHaveText([
            CONSTANT.BACKPACK,
            CONSTANT.BIKE_LIGHT,
            CONSTANT.BOLT_TSHIRT,
            CONSTANT.FLEECE_JACKET,
            CONSTANT.ONESIE,
            CONSTANT.RED_TSHIRT
        ]);
    });
});
