import { expect, test } from '@/tests/fixtures';

import {
    CHECKOUT_FIRST_NAME,
    CHECKOUT_LAST_NAME,
    PRODUCTS,
} from '@/utils/constants';
import { CHECKOUT_POSTAL_CODE } from '@/utils/constants';
import {
    expectCartPage,
    expectCheckoutStepOnePage,
    expectCheckoutStepTwoPage,
} from '@/utils/route';

test('display title and input fields', async ({ defaultCheckoutInfoPage }) => {
    await expect(defaultCheckoutInfoPage.title).toHaveText(
        'Checkout: Your Information',
    );
    await expect(defaultCheckoutInfoPage.firstNameField).toBeVisible();
    await expect(defaultCheckoutInfoPage.lastNameField).toBeVisible();
    await expect(defaultCheckoutInfoPage.postalCodeField).toBeVisible();
});

test('display cancel button and continue button', async ({
    defaultCheckoutInfoPage,
}) => {
    await expect(defaultCheckoutInfoPage.cancelBtn).toBeVisible();
    await expect(defaultCheckoutInfoPage.continueBtn).toBeVisible();
});

test('navigate to cart page when click cancel button', async ({
    page,
    defaultCheckoutInfoPage,
}) => {
    await defaultCheckoutInfoPage.clickCancelBtn();
    await expectCartPage(page);
});

test('shows error when all fields are empty', async ({
    page,
    defaultCheckoutInfoPage,
}) => {
    await defaultCheckoutInfoPage.clickContinueBtn();
    await expect(defaultCheckoutInfoPage.errorMessage).toHaveText(
        'Error: First Name is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when zip code is empty', async ({
    page,
    defaultCheckoutInfoPage,
}) => {
    await defaultCheckoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await defaultCheckoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await defaultCheckoutInfoPage.clickContinueBtn();

    await expect(defaultCheckoutInfoPage.errorMessage).toHaveText(
        'Error: Postal Code is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when last name is empty', async ({
    page,
    defaultCheckoutInfoPage,
}) => {
    await defaultCheckoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await defaultCheckoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await defaultCheckoutInfoPage.clickContinueBtn();

    await expect(defaultCheckoutInfoPage.errorMessage).toHaveText(
        'Error: Last Name is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when first name is empty', async ({
    page,
    defaultCheckoutInfoPage,
}) => {
    await defaultCheckoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await defaultCheckoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await defaultCheckoutInfoPage.clickContinueBtn();

    await expect(defaultCheckoutInfoPage.errorMessage).toHaveText(
        'Error: First Name is required',
    );
    await expectCheckoutStepOnePage(page);
});

test(
    'completes checkout information and shows the added product on the overview page',
    { tag: '@smoke' },
    async ({
        page,
        inventoryPageSignedIn,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
    }) => {
        await test.step('login, add product and open the checkout form', async () => {
            await inventoryPageSignedIn.addProductToCart(
                PRODUCTS.BACKPACK.NAME,
            );
            await inventoryPageSignedIn.clickCartLink();
            await expectCartPage(page);

            await cartPage.clickCheckoutBtn();
            await expectCheckoutStepOnePage(page);
        });

        await test.step('fill in checkout information', async () => {
            await checkoutInfoPage.fillInformation();
            await checkoutInfoPage.clickContinueBtn();

            await expectCheckoutStepTwoPage(page);
            await expect(
                checkoutOverviewPage.getProductByName(PRODUCTS.BACKPACK.NAME)
                    .name,
            ).toBeVisible();
        });
    },
);
