import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage.js';
import { CommonPage } from '../../../page-objects/CommonPage.js';
import { HeaderPage } from '../../../page-objects/HeaderPage.js';
import { HomePage } from '../../../page-objects/HomePage.js';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js';
import { getBaseUrl } from '../../../globalSetup.js';

test.describe("Regression_DSG_PDP_024_BOPIS_ATC", () => {
    let page;
    let homePage = new HomePage(page);
    let productDisplayPage = new ProductDisplayPage(page);
    let commonPage = new CommonPage(page);
    let headerPage = new HeaderPage(page);
    let cartPage = new CartPage(page);
    test.beforeEach(async ({ page }) => {
        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    });

    test.only('BOPIS ATC - Desktop', async ({ page }) => {
        await page.goto(getBaseUrl() + '/p/mongoose-adult-switchback-comp-mountain-bike-24mona29swtchbckcprf/24mona29swtchbckcprf');
        await commonPage.addRewriteFlagToUrl();
        await commonPage.isTextVisible(productDisplayPage.freeStorePickupButton, "Select product options");
        await productDisplayPage.availableProductColor.first().click();
        await productDisplayPage.availableBikeFrameSize.first().click();
        await productDisplayPage.availableWheelSize.first().click();
        await productDisplayPage.freeStorePickupButton.click();
        await productDisplayPage.changeStoreButton.click();
        await commonPage.assertCheckboxIsChecked(headerPage.storesWithAvailabilityCheckbox);
        await commonPage.fillTextField(headerPage.zipCodeTextField,"15108");
        await headerPage.storesNearMe.first().click();
        await productDisplayPage.addToCartButton.click();
        await productDisplayPage.goToCartButton.click();
        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });
});
