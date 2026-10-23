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

import { expect, test } from '@/tests/fixtures';

test('display title and input fields', async ({
    emptyCartCheckoutInfoPage,
}) => {
    await expect(emptyCartCheckoutInfoPage.title).toHaveText(
        'Checkout: Your Information',
    );
    await expect(emptyCartCheckoutInfoPage.firstNameField).toBeVisible();
    await expect(emptyCartCheckoutInfoPage.lastNameField).toBeVisible();
    await expect(emptyCartCheckoutInfoPage.postalCodeField).toBeVisible();
});

test('display cancel button and continue button', async ({
    emptyCartCheckoutInfoPage,
}) => {
    await expect(emptyCartCheckoutInfoPage.cancelBtn).toBeVisible();
    await expect(emptyCartCheckoutInfoPage.continueBtn).toBeVisible();
});

test('navigate to cart page when click cancel button', async ({
    page,
    emptyCartCheckoutInfoPage,
}) => {
    await emptyCartCheckoutInfoPage.clickCancelBtn();
    await expectCartPage(page);
});

test('shows error when all fields are empty', async ({
    page,
    emptyCartCheckoutInfoPage,
}) => {
    await emptyCartCheckoutInfoPage.clickContinueBtn();
    await expect(emptyCartCheckoutInfoPage.errorMessage).toHaveText(
        'Error: First Name is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when zip code is empty', async ({
    page,
    emptyCartCheckoutInfoPage,
}) => {
    await emptyCartCheckoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await emptyCartCheckoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await emptyCartCheckoutInfoPage.clickContinueBtn();

    await expect(emptyCartCheckoutInfoPage.errorMessage).toHaveText(
        'Error: Postal Code is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when last name is empty', async ({
    page,
    emptyCartCheckoutInfoPage,
}) => {
    await emptyCartCheckoutInfoPage.fillFirstNameField(CHECKOUT_FIRST_NAME);
    await emptyCartCheckoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await emptyCartCheckoutInfoPage.clickContinueBtn();

    await expect(emptyCartCheckoutInfoPage.errorMessage).toHaveText(
        'Error: Last Name is required',
    );
    await expectCheckoutStepOnePage(page);
});

test('shows error when first name is empty', async ({
    page,
    emptyCartCheckoutInfoPage,
}) => {
    await emptyCartCheckoutInfoPage.fillLastNameField(CHECKOUT_LAST_NAME);
    await emptyCartCheckoutInfoPage.fillPostalCodeField(CHECKOUT_POSTAL_CODE);
    await emptyCartCheckoutInfoPage.clickContinueBtn();

    await expect(emptyCartCheckoutInfoPage.errorMessage).toHaveText(
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
