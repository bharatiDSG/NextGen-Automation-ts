import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage.ts';
import { CheckoutPage } from '../../../page-objects/CheckoutPage.ts';
import { HomePage } from '../../../page-objects/HomePage.ts';
import { OrderConfirmationPage } from '../../../page-objects/OrderConfirmationPage.ts';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts'
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';
import { CommonPage } from '../../../page-objects/CommonPage.ts';
import { AccountSignInPage } from '../../../page-objects/AccountSignInPage.ts';

test.describe("PLP/SRLP GG Favorites Tests", () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");

        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

    });

    test('PLP Favorites', async ({ page }) => {

        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const commonPage = new CommonPage(page);
        const myAccount = new AccountSignInPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        // Given we are on "dsg" page
        await test.step('Given we are on "gg" page', async () => {
          await homePage.goToHomePage(getBaseUrl());
          console.log("URL: " + getBaseUrl());
        });

        // When we search for "mens polo" keyword in the search box
        await test.step('When we search for "golf polo" keyword in the search box', async () => {
          await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1)
        });

        await test.step('And we see product card descriptions contain "polo"', async () => {
            await page.waitForTimeout(6000); // waits for 6 seconds
            if(await productListingPage.productNamesAngular.first().isVisible()){
                const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
                console.log('Product name - '+loweredProductName);
                expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
            } else {
                const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
                console.log('Product name - '+loweredProductName);
                expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
            }
          });
          await test.step('Select fevorite item', async () => {
            await productListingPage.favorites.nth(1).click();
            await commonPage.sleep(5);
          });

          await test.step('Sign In', async () => {
            await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser,testData_smokePLP_prod.registeredUserPassword);            
            await commonPage.sleep(2);
        });

        await test.step('When we search for "golf polo" keyword in the search box', async () => {
            await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1)
            await commonPage.sleep(5);
          });

          await test.step('Verify favorite functionality', async () => {
       
            await productListingPage.favorites.nth(1).click();
            await commonPage.sleep(5)
            await productListingPage.favorites.nth(1).click();
            await expect(productListingPage.favoritesToastMsg).toBeVisible();
            await expect(productListingPage.favoritesToastMsg).toBeVisible();
            const toastText = await productListingPage.favoritesToastMsg.textContent();
            try{
                expect(toastText?.trim()).toContain(String("Added")); 
                await productListingPage.verifyFavoritesPresentInMyAccounts("1");
            }catch(e)
            {
                expect(toastText?.trim()).toContain(String("Removed")); 
                await productListingPage.verifyFavoritesNotPresentInMyAccounts();
            }
            
          });
    });
});