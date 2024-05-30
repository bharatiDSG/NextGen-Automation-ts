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

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        PDP = new ProductDisplayPage(page);
        commonPage = new CommonPage(page);
        PLP = new ProductListingPage(page);

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl() + 'homr');
    });

    test('DSG ATC STH - Desktop', async () => {
        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
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

        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });

    test('DSG ATC STH - Rewrite', {tag: ['@rewrite']}, async () => {
        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
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

        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });
});
