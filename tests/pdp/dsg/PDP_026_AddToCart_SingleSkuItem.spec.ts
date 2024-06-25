import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage';
import { CommonPage } from '../../../page-objects/CommonPage';
import { HomePage } from '../../../page-objects/HomePage';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage';
import { getBaseUrl } from '../../../globalSetup';

test.describe("PDP Single Sku Item Tests", () => {
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

    test('DSG ATC Single Sku - Desktop', { tag: ['@rewrite'] }, async ({ page }) => {
        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
        await commonPage.addRewriteFlagToUrl();

        //Check the ship to me button displays the correct text before selecting product options
        await commonPage.isTextVisible(productDisplayPage.shipToMeButton, "Select product options");

        //Select product options
        await productDisplayPage.availableProductColorRewrite.first().click();

        //Check the ship to me button displays the correct text after selecting product options
        await commonPage.isTextVisible(productDisplayPage.shipToMeButton, "Available");
        await productDisplayPage.shipToMeButton.click();

        //Add to cart and check the product is in the cart
        await productDisplayPage.addToCartButtonRewrite.click();
        await productDisplayPage.goToCartButton.click();
        await commonPage.isTextVisible(cartPage.cartItemAmount, "1 item");
    });
});
