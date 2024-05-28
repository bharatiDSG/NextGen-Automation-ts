import { expect, test } from '@playwright/test'
import { CommonPage } from '../../../page-objects/CommonPage.js'
import { HomePage } from '../../../page-objects/HomePage.js'
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js'
import { ProductListingPage } from '../../../page-objects/ProductListingPage.js'
import { getBaseUrl } from '../../../globalSetup.js'

test.describe("Regression_PDP_DSG_Yeti_ATC_001", () => {
    let page;
    let homePage;
    let PDP;
    let commonPage;
    let PLP;

    test.beforeEach(async ({ page: _page }) => {
        page = _page;
        homePage = new HomePage(page);
        PDP = new ProductDisplayPage(page);
        commonPage = new CommonPage(page);
        PLP = new ProductListingPage(page);

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl() + 'homr');
    });

    test('1: DSG Yeti ATC - Desktop', async () => {
        await homePage.searchForProduct("yeti brand");
        console.log("Query search entered");

        await PLP.selectMatchingProduct("YETI 20 oz. Rambler Tumbler with MagSlider Lid");
        console.log("Selecting product...");

        await commonPage.scrollIfElementNotVisible(PDP.addToCartButton);
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await expect(PDP.addToCartButton).toBeDisabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");
        await commonPage.scrollIfElementNotVisible(PDP.firstColorAvailable);
        await PDP.firstColorAvailable.click();

        await expect(PDP.shipToMeFullfilmentButton).toBeEnabled();
        console.log("Available to Ship is enabled");

        await commonPage.scrollIfElementNotVisible(PDP.addToCartButton);
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isElementCentered(PDP.addedToCartMessage);

        await commonPage.isElementVisibleAndEnabled(PDP.continueShoppingMessage);
        await commonPage.isTextVisible(PDP.continueShoppingMessage, " Continue Shopping ");

        await commonPage.isTextVisible(PDP.goToCartMessage, "GO TO CART");

        await commonPage.isElementVisibleAndEnabled(PDP.goToCartButton);
        await PDP.goToCartButton.click();

        await commonPage.isTextVisible(PDP.oneItemCart, "(1 item)");
    });

    test('1: DSG Yeti ATC - Rewrite', async () => {
        await homePage.searchForProduct("yeti brand");
        console.log("Query search entered");

        await PLP.selectMatchingProduct("YETI 20 oz. Rambler Tumbler with MagSlider Lid");
        console.log("Selecting product...");

        await commonPage.addRewriteFlagToUrl();
        await commonPage.scrollIfElementNotVisible(PDP.addToCartButton);
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await expect(PDP.addToCartButton).toBeEnabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");
        await commonPage.scrollIfElementNotVisible(PDP.firstColorAvailable);
        await PDP.firstColorAvailable.click();

        await expect(PDP.shipToMeFullfilmentButton).toBeEnabled();
        console.log("Available to Ship is enabled");

        await commonPage.scrollIfElementNotVisible(PDP.addToCartButton);
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isElementCentered(PDP.addedToCartMessage);

        await commonPage.isElementVisibleAndEnabled(PDP.continueShoppingMessage);
        await commonPage.isTextVisible(PDP.continueShoppingMessage, " Continue Shopping ");

        await commonPage.isTextVisible(PDP.goToCartMessage, "GO TO CART");

        await commonPage.isElementVisibleAndEnabled(PDP.goToCartButton);
        await PDP.goToCartButton.click();

        await commonPage.isTextVisible(PDP.oneItemCart, "(1 item)");
    });
});
