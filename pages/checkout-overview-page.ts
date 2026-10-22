import { Locator, Page } from "@playwright/test";
import { INVENTORY_ITEM, INVENTORY_ITEM_NAME, INVENTORY_ITEM_PRICE, INVENTORY_ITEM_QUANTITY } from "../utils/constants";

class CheckoutOverviewPage {
    overviewItem: Locator;
    overviewItemName: Locator;
    overviewItemQuantity: Locator;
    overviewItemPrice: Locator;

    constructor(private page: Page) {
        this.overviewItem = page.getByTestId(INVENTORY_ITEM);
        this.overviewItemName = this.overviewItem.getByTestId(INVENTORY_ITEM_NAME);
        this.overviewItemQuantity = this.overviewItem.getByTestId(INVENTORY_ITEM_QUANTITY);
        this.overviewItemPrice = this.overviewItem.getByTestId(INVENTORY_ITEM_PRICE);
    }
}

export default CheckoutOverviewPage;