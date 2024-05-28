import { CommonPage, isTextVisible, selectFirstColorOption } from '../../../page-objects/CommonPage.js';
import { expect, test } from '@playwright/test';

import { HomePage } from '../../../page-objects/HomePage.js';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.js';
import { getBaseUrl } from '../../../globalSetup.js';

test.describe("Regression_DSG_PDP_024_BOPIS_ATC", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const commonPage = new CommonPage(page)
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page);
        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    });

    test('BOPIS ATC - Desktop', async ({ page }) => {
        await HomePage.searchForProduct("mountain bike");
        await ProductListingPage.selectMatchingProduct("Nishiki Men's Colorado Sport Mountain Bike");
        await CommonPage.addRewriteFlagToUrl();
        await CommonPage.isTextVisible(page, ProductDisplayPage.shipToMeButton, "Select product options");
        await ProductDisplayPage.availableProductColor.first().click();
        await ProductDisplayPage.availableBikeFrameSize.first().click();
        await ProductDisplayPage.freeStorePickupButton.click();
        await ProductDisplayPage.changeStoreButton.click();
        await CommonPage.assertCheckboxIsChecked(CommonPage.storesWithAvailabilityCheckbox);
        await CommonPage.fillTextField(CommonPage.zipCodeTextField,"15108");
        await CommonPage.storesNearMe.first().click();
        await CommonPage.selectStoreCloseButton.click();
        await ProductDisplayPage.addToCartButton.click();
        await CommonPage.isTextVisible(page, ProductDisplayPage.shipToMeButton, "Select product options");
        await CommonPage.isTextVisible(page, ProductDisplayPage.shipToMeButton, "Select product options");

    });
});