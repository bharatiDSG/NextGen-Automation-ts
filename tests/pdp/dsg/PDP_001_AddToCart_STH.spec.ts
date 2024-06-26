import { expect, test } from '@playwright/test'

import { CartPage } from '../../../page-objects/CartPage';
import { CommonPage } from '../../../page-objects/CommonPage'
import { HomePage } from '../../../page-objects/HomePage'
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage'
import { getBaseUrl } from '../../../globalSetup'
import {AccountSignInPage} from "../../../page-objects/AccountSignInPage";

test.describe("PDP Ship To Home - Add To Cart Tests", () => {
    let homePage: HomePage;
    let PDP: ProductDisplayPage;
    let commonPage: CommonPage;
    let accountSignIn: AccountSignInPage;
    let cartPage: CartPage;
    
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        PDP = new ProductDisplayPage(page);
        commonPage = new CommonPage(page);
        accountSignIn = new AccountSignInPage(page)
        cartPage = new CartPage(page);
    
        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    });

    test('DSG ATC STH - Desktop', { tag: ['@smoke'] }, async ({ page }) => {
        await page.goto(getBaseUrl() + 'p/nike-sportswear-womens-phoenix-fleece-oversized-crewneck-sweatshirt-22nikwstylflccrwxapt/22nikwstylflccrwxapt');

        await expect(PDP.womensClothingBreadcrumb).toBeVisible();
        await PDP.womensClothingBreadcrumb.first().click();
        await commonPage.isTextVisible(PDP.womensWorkoutClothesTitle, 'Women\'s Clothing');

        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await expect(PDP.addToCartButton).toBeDisabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");
        await PDP.availableProductColor.first().click();

        await expect(PDP.shipToMeFullfilmentButton).toBeEnabled();
        console.log("Available to Ship is enabled");

        await commonPage.scrollIfElementNotVisible(PDP.addToCartButton);
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");

        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isTextVisible(PDP.continueShoppingButton, " Continue Shopping ");
        await commonPage.isTextVisible(PDP.goToCartButton, "GO TO CART");

        await commonPage.isElementVisibleAndEnabled(PDP.goToCartButton);
        await PDP.goToCartButton.click();

        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });

    test('DSG ATC STH - Rewrite', { tag: ['@rewrite'] }, async ({ page }) => {
        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
        await commonPage.addRewriteFlagToUrl();
        await commonPage.scrollIfElementNotVisible(PDP.addToCartButtonRewrite);
        await PDP.addToCartButtonRewrite.click();
        console.log("Add to Cart button clicked");

        await expect(PDP.addToCartButtonRewrite).toBeEnabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");
        await PDP.availableProductColorRewrite.first().click();

        await expect(PDP.shipToMeFullfilmentButton).toBeEnabled();
        console.log("Available to Ship is enabled");

        await commonPage.scrollIfElementNotVisible(PDP.addToCartButtonRewrite);
        await PDP.addToCartButtonRewrite.click();
        console.log("Add to Cart button clicked");

        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isTextVisible(PDP.continueShoppingButton, " Continue Shopping ");
        await commonPage.isTextVisible(PDP.goToCartButton, " Go To Cart ");
        await PDP.goToCartButton.click();

        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });
});
