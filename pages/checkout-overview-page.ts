import { Locator, Page } from '@playwright/test';

import {
    CANCEL,
    FINISH,
    INVENTORY_ITEM,
    INVENTORY_ITEM_DESC,
    INVENTORY_ITEM_NAME,
    INVENTORY_ITEM_PRICE,
    INVENTORY_ITEM_QUANTITY,
    TITLE,
} from '@/utils/constants';

import ProductItem from './components/product-item';

const PAYMENT_INFO_LABEL = 'payment-info-label';
const SHIPPING_INFO_LABEL = 'shipping-info-label';
const TOTAL_INFO_LABEL = 'total-info-label';

class CheckoutOverviewPage {
    overviewItems: Locator;
    overviewItemNames: Locator;
    overviewItemDescs: Locator;
    overviewItemQuantitys: Locator;
    overviewItemPrices: Locator;

    title: Locator;
    paymentInfoLabel: Locator;
    shippingInfoLabel: Locator;
    totalInfoLabel: Locator;

    cancelBtn: Locator;
    finishBtn: Locator;

    constructor(private page: Page) {
        this.overviewItems = page.getByTestId(INVENTORY_ITEM);
        this.overviewItemNames =
            this.overviewItems.getByTestId(INVENTORY_ITEM_NAME);
        this.overviewItemDescs =
            this.overviewItems.getByTestId(INVENTORY_ITEM_DESC);
        this.overviewItemQuantitys = this.overviewItems.getByTestId(
            INVENTORY_ITEM_QUANTITY,
        );
        this.overviewItemPrices =
            this.overviewItems.getByTestId(INVENTORY_ITEM_PRICE);
        this.title = page.getByTestId(TITLE);
        this.paymentInfoLabel = page.getByTestId(PAYMENT_INFO_LABEL);
        this.shippingInfoLabel = page.getByTestId(SHIPPING_INFO_LABEL);
        this.totalInfoLabel = page.getByTestId(TOTAL_INFO_LABEL);
        this.cancelBtn = page.getByRole('button', { name: CANCEL });
        this.finishBtn = page.getByRole('button', { name: FINISH });
    }

    getProductByName(name: string): ProductItem {
        return ProductItem.byName(this.page, name);
    }

    async clickCancelBtn() {
        await this.cancelBtn.click();
    }

    async clickFinishBtn() {
        await this.finishBtn.click();
    }
}

export default CheckoutOverviewPage;
