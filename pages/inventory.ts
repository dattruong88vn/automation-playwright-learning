import { Locator, Page } from '@playwright/test';

import {
    INVENTORY_ITEM,
    INVENTORY_ITEM_NAME,
    SHOPPING_CART_BADGE,
} from '../utils/constants';
import ProductItem from './components/product-item';

class InventoryPage {
    title: Locator;
    productList: Locator;
    productItem: Locator;
    cartCount: Locator;
    sortSelect: Locator;
    selectedOption: Locator;
    options: Locator;
    productNames: Locator;
    firstProductName: Locator;
    cartLink: Locator;

    constructor(private page: Page) {
        this.title = page.getByTestId('title');
        this.productList = page.getByTestId('inventory-list');
        this.productItem = page.getByTestId(INVENTORY_ITEM);
        this.cartCount = page.getByTestId(SHOPPING_CART_BADGE);
        this.sortSelect = page.getByTestId('product-sort-container');
        this.selectedOption = page.getByTestId('active-option');
        this.options = this.sortSelect.getByRole('option');
        this.productNames = page.getByTestId(INVENTORY_ITEM_NAME);
        this.firstProductName = page.getByTestId(INVENTORY_ITEM_NAME).first();
        this.cartLink = this.page.getByTestId('shopping-cart-link');
    }

    getProductByName(name: string): ProductItem {
        return ProductItem.byName(this.page, name);
    }

    async selectOption(optionName: string) {
        await this.sortSelect.selectOption({ label: optionName });
    }

    async addProductToCart(productName: string) {
        const product = this.getProductByName(productName);
        await product.addToCartBtn.click();
    }

    async clickCartLink() {
        await this.cartLink.click();
    }
}

export default InventoryPage;
