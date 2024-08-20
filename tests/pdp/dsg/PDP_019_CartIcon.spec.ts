import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage';
import { CommonPage } from '../../../page-objects/CommonPage';
import { HomePage } from '../../../page-objects/HomePage';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage';
import { getBaseUrl } from '../../../globalSetup';

test.describe('PDP Cart Icon Tests', () => {
    let homePage: HomePage;
    let productDisplayPage: ProductDisplayPage;
    let commonPage: CommonPage;
    let cartPage: CartPage;
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        commonPage = new CommonPage(page);
        productDisplayPage = new ProductDisplayPage(page);
        cartPage = new CartPage(page);
        await test.step('Navigate to Home page', async() => {
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl());
    });
    });

    test('DSG Cart Icon - Desktop', { tag: ['@rewrite'] }, async ({ page }) => {
        await test.step('Navigate to mountain bike page', async() => {
        await page.goto(getBaseUrl() + '/p/mongoose-adult-switchback-comp-mountain-bike-24mona29swtchbckcprf/24mona29swtchbckcprf');
        await commonPage.addRewriteFlagToUrl();
        });

        //Select product options
        await test.step('Select attributes', async() => {
        await productDisplayPage.availableProductColorRewrite.first().click();
        await productDisplayPage.availableBikeFrameSize.first().click();
        await productDisplayPage.availableWheelSize.first().click();
        });

        //Set the product quantity to 4
        await test.step('Update Quantity to 4', async() => {
        await commonPage.fillTextField(productDisplayPage.productQuantityTextFieldRewrite, '4');
        });

        //Add to cart and check the products are in the cart
        await test.step('Add to cart and check products are present in Cart', async() => {
        await productDisplayPage.addToCartButtonRewrite.click();
        await productDisplayPage.goToCartButton.click();
        await commonPage.isTextVisible(cartPage.cartItemAmount, '4 items');
        });
    });
});
