import { Locator, Page } from '@playwright/test';

import {
    CANCEL,
    CHECKOUT_FIRST_NAME,
    CHECKOUT_LAST_NAME,
    CHECKOUT_POSTAL_CODE,
    CONTINUE,
    FIRST_NAME_FIELD_PLACEHOLDER,
    LAST_NAME_FIELD_PLACEHOLDER,
    POSTAL_CODE_FIELD_PLACEHOLDER,
    TITLE,
} from '@/utils/constants';

class CheckoutInfoPage {
    firstNameField: Locator;
    lastNameField: Locator;
    postalCodeField: Locator;
    errorMessage: Locator;
    continueBtn: Locator;
    cancelBtn: Locator;
    title: Locator;

    constructor(private page: Page) {
        this.firstNameField = page.getByPlaceholder(
            FIRST_NAME_FIELD_PLACEHOLDER,
        );
        this.lastNameField = page.getByPlaceholder(LAST_NAME_FIELD_PLACEHOLDER);
        this.postalCodeField = page.getByPlaceholder(
            POSTAL_CODE_FIELD_PLACEHOLDER,
        );
        this.errorMessage = page.getByRole('alert');
        this.continueBtn = page.getByRole('button', { name: CONTINUE });
        this.cancelBtn = page.getByRole('button', { name: CANCEL });
        this.title = page.getByTestId(TITLE);
    }

    async clickContinueBtn() {
        await this.continueBtn.click();
    }

    async clickCancelBtn() {
        await this.cancelBtn.click();
    }

    async fillFirstNameField(name: string) {
        await this.firstNameField.fill(name);
    }
    async fillLastNameField(name: string) {
        await this.lastNameField.fill(name);
    }
    async fillPostalCodeField(code: string) {
        await this.postalCodeField.fill(code);
    }
    async fillInformation(
        firstName = CHECKOUT_FIRST_NAME,
        lastName = CHECKOUT_LAST_NAME,
        postalCode = CHECKOUT_POSTAL_CODE,
    ) {
        await this.fillFirstNameField(firstName);
        await this.fillLastNameField(lastName);
        await this.fillPostalCodeField(postalCode);
    }
}

export default CheckoutInfoPage;
