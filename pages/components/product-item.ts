import { Locator, Page } from '@playwright/test';

import {
    ADD_TO_CART,
    INVENTORY_ITEM,
    INVENTORY_ITEM_DESC,
    INVENTORY_ITEM_NAME,
    INVENTORY_ITEM_PRICE,
    REMOVE,
} from '../../utils/constants';

class ProductItem {
    name: Locator;
    price: Locator;
    desc: Locator;
    removeBtn: Locator;
    addToCartBtn: Locator;
    img: Locator;

    constructor(private product: Locator) {
        this.name = product.getByTestId(INVENTORY_ITEM_NAME);
        this.price = product.getByTestId(INVENTORY_ITEM_PRICE);
        this.desc = product.getByTestId(INVENTORY_ITEM_DESC);
        this.removeBtn = product.getByRole('button', { name: REMOVE });
        this.addToCartBtn = product.getByRole('button', { name: ADD_TO_CART });
        this.img = product.getByRole('img');
    }

    static byName(page: Page, name: string) {
        return new ProductItem(
            page.getByTestId(INVENTORY_ITEM).filter({
                has: page
                    .getByTestId(INVENTORY_ITEM_NAME)
                    .getByText(name, { exact: true }),
            }),
        );
    }

    async clickAddToCartBtn() {
        await this.addToCartBtn.click();
    }
}

export default ProductItem;
