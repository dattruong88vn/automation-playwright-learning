import { Page, expect } from "@playwright/test";
import { DEFAULT_URL } from "./constants";

export const expectLoginPage = async (page: Page) => await expect(page).toHaveURL(DEFAULT_URL);
export const expectInventoryPage = async (page: Page) => await expect(page).toHaveURL(/inventory/);
export const expectCartPage = async (page: Page) => await expect(page).toHaveURL(/cart/);
export const expectCheckoutStepOnePage = async (page: Page) => await expect(page).toHaveURL(/checkout-step-one/);
export const expectCheckoutStepTwoPage = async (page: Page) => await expect(page).toHaveURL(/checkout-step-two/);

