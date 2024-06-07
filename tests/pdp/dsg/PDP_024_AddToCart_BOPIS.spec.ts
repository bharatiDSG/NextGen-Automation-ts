import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage.js';
import { CommonPage } from '../../../page-objects/CommonPage.js';
import { HomePage } from '../../../page-objects/HomePage.js';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js';
import { getBaseUrl } from '../../../globalSetup.js';

test.describe("PDP BOPIS - Add To Cart Tests", () => {
    let homePage: HomePage;
    let productDisplayPage: ProductDisplayPage;
    let commonPage: CommonPage;
    let cartPage: CartPage;
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        commonPage = new CommonPage(page);
        productDisplayPage = new ProductDisplayPage(page);
        cartPage = new CartPage(page);

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    });

    test('DSG ATC BOPIS - Desktop', { tag: ['@rewrite'] }, async ({ page }) => {
        await page.goto(getBaseUrl() + '/p/mongoose-adult-switchback-comp-mountain-bike-24mona29swtchbckcprf/24mona29swtchbckcprf');
        await commonPage.addRewriteFlagToUrl();

        //Select product options
        await productDisplayPage.availableProductColorRewrite.first().click();
        await productDisplayPage.availableBikeFrameSize.first().click();
        await productDisplayPage.availableWheelSize.first().click();

        //Select the nearest store with availability to my zip code
        await productDisplayPage.freeStorePickupButton.click();
        await productDisplayPage.changeStoreButton.click();
        await commonPage.assertCheckboxIsChecked(productDisplayPage.storesWithAvailabilityCheckbox);
        await commonPage.fillTextField(productDisplayPage.zipCodeTextField, "15108");
        await productDisplayPage.storesNearMe.first().click();

        //Add to cart and check the product is in the cart
        await productDisplayPage.addToCartButtonRewrite.click();
        await productDisplayPage.goToCartButton.click();
        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });
});
