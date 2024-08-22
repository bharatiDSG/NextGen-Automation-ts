import { test } from '@playwright/test';
import { CartPage } from '../../../page-objects/CartPage';
import { CommonPage } from '../../../page-objects/CommonPage';
import { HomePage } from '../../../page-objects/HomePage';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage';
import { getBaseUrl } from '../../../globalSetup';

test.describe('PDP Same day delivery Tests', () => {
    let homePage: HomePage;
    let productDisplayPage: ProductDisplayPage;
    let commonPage: CommonPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page);
        commonPage = new CommonPage(page);
        productDisplayPage = new ProductDisplayPage(page);
        cartPage = new CartPage(page);

        // grant permission for location
        await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
        console.log('geolocation granted for: ' + getBaseUrl());

        // handle iframe popup  
        commonPage.handleIframePopupSignUpViaTextForOffers();

        // Go to baseUrl set in .env
        await test.step('Navigate to Home page', async () => {
            await homePage.goToHomePage(getBaseUrl() + 'homr');
            console.log('URL: ' + getBaseUrl() + 'homr');
        });
    });

    test('DSG Same day delivery - Desktop', { tag: ['@rewrite'] }, async ({ page }) => {
        await test.step('Navigate to Yeti Tumbler page', async () => {
            await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
            await commonPage.addRewriteFlagToUrl();
        });

        //Select product options
        await test.step('Select product attributes', async () => {
            await productDisplayPage.availableProductColorRewrite.first().click();
        });

        //Update to my desired zip code
        await test.step('Update desired zip code', async () => {
            await productDisplayPage.sameDayDeliveryButton.click();
            await productDisplayPage.changeZipCodeLink.click();
            await commonPage.fillTextField(productDisplayPage.zipCodeTextField, '15205');
        });

        //Add to cart and check the product is in the cart
        await test.step('Add to cart and check the product is in the cart', async () => {
            await productDisplayPage.addToCartButtonRewrite.click();
            await productDisplayPage.goToCartButton.click();
            await commonPage.isTextVisible(cartPage.cartItemAmount, '1 item');
        });
    });
});
