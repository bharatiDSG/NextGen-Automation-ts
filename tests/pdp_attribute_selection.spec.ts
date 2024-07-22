import { expect, test } from '@playwright/test';

import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';
import { CommonPage } from '../page-objects/CommonPage';
import { HomePage } from '../page-objects/HomePage';
import { OrderConfirmationPage } from '../page-objects/OrderConfirmationPage';
import { ProductDisplayPage } from '../page-objects/ProductDisplayPage';
import { ProductListingPage } from '../page-objects/ProductListingPage';
import { getBaseUrl } from '../globalSetup';
import { testData_e2e_np0_prod } from '../test-data/e2eNP0ProdTestData';

test.describe("E2E NP0 Prod", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await test.step('Navigate to homepage',async()=>{
        //await homePage.goToHomePage(getBaseUrl() + "homr");
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl() + "homr");
    });
        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()
    });

    
    test('1: PDP attribute selection through API_STH', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search for product',async()=>{
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm2)
    });
       
        // Select a product
        await test.step('Select a product',async()=>{
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch2)
    });

    await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
   
    await productDisplayPage.selectShipToMeAttributes(page);

        // Click add to cart
        await test.step('Click add to cart',async()=>{
        await commonPage.sleep(2)
    
        
        await productDisplayPage.addToCartButton.click();
    });

        // Click Go to Cart
        await test.step('Click Go To Cart',async()=>{
        await productDisplayPage.goToCartButton.click();
        await commonPage.sleep(2)
    });
        
    });

    test('2: PDP attribute selection through API_BOPIS', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const commonPage = new CommonPage(page)
        let storeName: string;
        let cartPriceDetailsObject: any;

    await test.step('Search for product',async()=>{
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm2)
    });
     
    // Select a product
        await test.step('Select a product',async()=>{
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch2)
    });

    await productDisplayPage.verifyAttributesArePresentOrNotForBOPIS(testData_e2e_np0_prod.zipCode,testData_e2e_np0_prod.storeSearch);
   
     await productDisplayPage.selectBOPISAttributes(page);

     await commonPage.sleep(5);

      // Verify store pickup is enabled
      await test.step('Verify store pickup is enabled',async()=>{
        await productDisplayPage.freeStorePickupButton.click();
    });

    await commonPage.sleep(5);

     await productDisplayPage.setStoreFromPDP(testData_e2e_np0_prod.zipCode,testData_e2e_np0_prod.storeSearch)


        // Click add to cart
        await test.step('Click add to cart',async()=>{
        await commonPage.sleep(2)
    
        
        await productDisplayPage.addToCartButton.click();
    });

        // Click Go to Cart
        await test.step('Click Go To Cart',async()=>{
        await productDisplayPage.goToCartButton.click();
        await commonPage.sleep(2)
    });
        
    });

});
