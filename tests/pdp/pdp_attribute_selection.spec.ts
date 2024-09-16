import { test } from '@playwright/test';
import { CartPage } from '../../page-objects/CartPage';
import { CommonPage } from '../../page-objects/CommonPage';
import { HomePage } from '../../page-objects/HomePage';
import { ProductDisplayPage } from '../../page-objects/ProductDisplayPage';
import { ProductListingPage } from '../../page-objects/ProductListingPage';
import { getBaseUrl } from '../../globalSetup';
import { testData_e2e_np0_prod } from '../../test-data/e2eNP0ProdTestData';

test.describe('Prod PDP API Attribute Selection', () => {
    test.beforeEach(async ({ page, context }) => {
        const commonPage = new CommonPage(page);
        const homePage = new HomePage(page);

        // grant permission for location
        await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
        console.log('geolocation granted for: ' + getBaseUrl());

        // handle iframe popup  
        commonPage.handleIframePopupSignUpViaTextForOffers();

        // Go to baseUrl set in .env or defaults to dsg_prod
        await test.step('Navigate to homepage', async () => {
            await homePage.goToHomePage(getBaseUrl());
            console.log('URL: ' + getBaseUrl());
        });

    });


    test('1: PDP attribute selection through API_STH', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);

        await test.step('Search for product', async () => {
            await homePage.searchForProductWithSlowTyping(testData_e2e_np0_prod.searchTerm2);
        });

        await test.step('Select a product', async () => {
            await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch2);
        });

        await test.step('Select product attributes using API', async () => {
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Click add to cart', async () => {
            await page.waitForLoadState('domcontentloaded');
            await productDisplayPage.addToCartButton.click();
        });

        await test.step('Click Go To Cart', async () => {
            await page.waitForLoadState('domcontentloaded');
            await productDisplayPage.goToCartButton.click();
        });

        await test.step('Verify the product quantity is 1', async () => {
            await cartPage.verifyProductQuantity(1, '1');
            console.log('Product quantity verified');
        });

    });

    test('2: PDP attribute selection through API_BOPIS', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);

        await test.step('Search for product', async () => {
            await homePage.searchForProductWithSlowTyping(testData_e2e_np0_prod.searchTerm2);
        });

        await test.step('Select a product', async () => {
            await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch2);
        });

        await test.step('Select product attributes using API', async () => {
            await productDisplayPage.verifyAttributesArePresentOrNotForBOPIS(testData_e2e_np0_prod.zipCode, testData_e2e_np0_prod.storeSearch);
            await productDisplayPage.selectBOPISAttributes(page);
        });

        await test.step('Verify store pickup is enabled', async () => {
            await productDisplayPage.freeStorePickupButton.click();
        });

        await test.step('Set Store from PDP', async () => {
            await productDisplayPage.setStoreFromPDP(testData_e2e_np0_prod.zipCode, testData_e2e_np0_prod.storeSearch);
        });

        await test.step('Click add to cart', async () => {
            await page.waitForLoadState('domcontentloaded');
            await productDisplayPage.addToCartButton.click();
        });

        await test.step('Click Go To Cart', async () => {
            await page.waitForLoadState('domcontentloaded');
            await productDisplayPage.goToCartButton.click();
        });

        await test.step('Verify the product quantity is 1', async () => {
            await cartPage.verifyProductQuantity(1, '1');
            console.log('Product quantity verified');
        });

    });

});
