import { Locator, Page } from '@playwright/test';

import {
    DEFAULT_PASSWORD,
    DEFAULT_USERNAME,
    PASSWORD_FIELD_PLACEHOLDER,
    TITLE,
    USERNAME_FIELD_PLACEHOLDER,
} from '@/utils/constants';

class LoginPage {
    userNameField: Locator;
    passwordField: Locator;
    submitButton: Locator;
    error: Locator;
    title: Locator;

    constructor(private page: Page) {
        this.userNameField = page.getByPlaceholder(USERNAME_FIELD_PLACEHOLDER);
        this.passwordField = page.getByPlaceholder(PASSWORD_FIELD_PLACEHOLDER);
        this.submitButton = page.getByRole('button', { name: 'Login' });
        this.error = page.getByTestId('error');
        this.title = page.getByTestId(TITLE);
    }

    async goTo() {
        await this.page.goto('/');
    }

    async fillUserNameAndPassword(
        username = DEFAULT_USERNAME,
        password = DEFAULT_PASSWORD,
    ) {
        await this.userNameField.fill(username);
        await this.passwordField.fill(password);
    }

    async login(username = DEFAULT_USERNAME, password = DEFAULT_PASSWORD) {
        await this.fillUserNameAndPassword(username, password);
        await this.submitButton.click();
    }
}

export default LoginPage;
