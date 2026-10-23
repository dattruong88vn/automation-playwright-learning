import { Locator, Page } from '@playwright/test';

import ProductItem from '@/pages/components/product-item';

import {
    CHECKOUT,
    CONTINUE_SHOPPING,
    INVENTORY_ITEM,
    INVENTORY_ITEM_NAME,
    TITLE,
} from '@/utils/constants';

class CartPage {
    checkoutBtn: Locator;
    backToShopBtn: Locator;
    cartItems: Locator;
    cartItemNames: Locator;
    title: Locator;

    constructor(private page: Page) {
        this.checkoutBtn = page.getByRole('button', { name: CHECKOUT });
        this.backToShopBtn = page.getByRole('button', {
            name: CONTINUE_SHOPPING,
        });
        this.cartItems = page.getByTestId(INVENTORY_ITEM);
        this.cartItemNames = page.getByTestId(INVENTORY_ITEM_NAME);
        this.title = page.getByTestId(TITLE);
    }

    getProductByName(name: string): ProductItem {
        return ProductItem.byName(this.page, name);
    }

    async clickCheckoutBtn() {
        await this.checkoutBtn.click();
    }

    async clickBackToShopBtn() {
        await this.backToShopBtn.click();
    }
}

export default CartPage;
