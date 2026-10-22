import { Locator, Page } from "@playwright/test";
import { CONTINUE, FIRST_NAME_FIELD_PLACEHOLDER, LAST_NAME_FIELD_PLACEHOLDER, POSTAL_CODE_FIELD_PLACEHOLDER } from "../utils/constants";

class CheckoutInfoPage {
    firstNameField: Locator;
    lastNameField: Locator;
    postalCodeField: Locator;
    errorMessage: Locator;
    continueBtn: Locator;

    constructor(private page: Page) {
        this.firstNameField = page.getByPlaceholder(FIRST_NAME_FIELD_PLACEHOLDER);
        this.lastNameField = page.getByPlaceholder(LAST_NAME_FIELD_PLACEHOLDER);
        this.postalCodeField = page.getByPlaceholder(POSTAL_CODE_FIELD_PLACEHOLDER);
        this.errorMessage = page.getByRole('alert');
        this.continueBtn = page.getByRole('button', { name: CONTINUE });
    }

    async clickContinueBtn() {
        await this.continueBtn.click();
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
    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        await this.fillFirstNameField(firstName);
        await this.fillLastNameField(lastName);
        await this.fillPostalCodeField(postalCode);
    }
}

export default CheckoutInfoPage;