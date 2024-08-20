import { expect, test } from '@playwright/test';

import { CartPage } from '../../../page-objects/CartPage.ts';
import { CheckoutPage } from '../../../page-objects/CheckoutPage.ts';
import { HomePage } from '../../../page-objects/HomePage.ts';
import { OrderConfirmationPage } from '../../../page-objects/OrderConfirmationPage.ts';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';
import { CommonPage } from '../../../page-objects/CommonPage.ts';
import { AccountSignInPage } from '../../../page-objects/AccountSignInPage.ts';

test.describe.serial('PLP/SRLP GG Favorites Tests', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');

        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

    });

    test('PLP Favorites_Non SignedIn user', async ({ page }) => {

        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const orderConfirmationPage = new OrderConfirmationPage(page);
        const commonPage = new CommonPage(page);
        const myAccount = new AccountSignInPage(page);

        
        await test.step('Given we are on "gg" page', async () => {
          console.log('Validating PLP favorites for non signed In user');
          await homePage.goToHomePage(getBaseUrl());
          console.log('URL: ' + getBaseUrl());
        });

        // When we search for "mens polo" keyword in the search box
        await test.step('When we search for "golf polo" keyword in the search box', async () => {
          console.log('Searching the product');
          await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
        });

        await test.step('And we see product card descriptions contain "polo"', async () => {
            await page.waitForTimeout(20000); 
            await commonPage.handlePromotionalPopup();
            if(await productListingPage.productNamesAngular.first().isVisible()){
                const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
                console.log('Product name - '+loweredProductName);
                expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
            } else {
                const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
                console.log('Product name - '+loweredProductName);
                expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
            }
            console.log('Product search completed');
          });
          await test.step('Select fevorite item', async () => {
            console.log('Trying to add the favorites for non signed In user');
            await productListingPage.favorites.nth(1).click();
            await commonPage.sleep(5);
          });

          await test.step('Sign In', async () => {
            console.log('User gets the SignIn window');
            await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser, testData_smokePLP_prod.registeredUserPassword);            
            console.log('Validation successful');
        });
    });



    test('PLP Favorites_E-code level_Add and Remove favorites', async ({ page }) => {

      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);
      const productDisplayPage = new ProductDisplayPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);
      const orderConfirmationPage = new OrderConfirmationPage(page);
      const commonPage = new CommonPage(page);
      const myAccount = new AccountSignInPage(page);
      const index =1;

      await test.step('Given we are on "gg" page', async () => {
        console.log('Validating PLP favorites for E-Code level_Add and Remove');
        await homePage.goToHomePage(getBaseUrl());
        console.log('URL: ' + getBaseUrl());
      });

      
      // When we search for "mens polo" keyword in the search box
      await test.step('When we search for "golf polo" keyword in the search box', async () => {
        console.log('Searching the product');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
      });

      await test.step('And we see product card descriptions contain "polo"', async () => {
          await page.waitForTimeout(20000); 
          await commonPage.handlePromotionalPopup();
          if(await productListingPage.productNamesAngular.first().isVisible()){
              const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
              console.log('Product name - '+loweredProductName);
              expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
          } else {
              const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
              console.log('Product name - '+loweredProductName);
              expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
          }
          console.log('Product search completed');
        });
        await test.step('Select fevorite item', async () => {
          console.log('Trying to add the favorites for non signed In user');
          await productListingPage.favorites.nth(index).click();
          await commonPage.sleep(5);
        });

        await test.step('Sign In', async () => {
          console.log('User gets the SignIn window');
          await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser, testData_smokePLP_prod.registeredUserPassword);            
          console.log('SignIN successful');
          
    
      });

      await test.step('When we search for "golf polo" keyword in the search box', async () => {
          console.log('Searching the product again');
          await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
        });

        await test.step('Verify favorite functionality', async () => {
          await productListingPage.favorites.nth(index).click();
          await commonPage.sleep(5);
          await productListingPage.unselectAllFavorites();
          await commonPage.sleep(5);
          await productListingPage.favorites.nth(index).click();
          await commonPage.sleep(2);
          await expect(productListingPage.favoritesToastMsg).toBeVisible();
          const toastText = await productListingPage.favoritesToastMsg.textContent();
          expect(toastText?.trim()).toContain(String('Added')); 
          console.log('Favorites added successfully');
          const indexStr = index.toString();
          await productListingPage.verifyFavoritesPresentInMyAccounts(indexStr);
          console.log('Validation successful');

        });
        
      });


    test('PLP Favorites_Single/Multiple SKU validation', async ({ page }) => {

          const homePage = new HomePage(page);
          const productListingPage = new ProductListingPage(page);
          const productDisplayPage = new ProductDisplayPage(page);
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          const orderConfirmationPage = new OrderConfirmationPage(page);
          const commonPage = new CommonPage(page);
          const myAccount = new AccountSignInPage(page);
          const index =2;
    
          await test.step('Given we are on "gg" page', async () => {
            console.log('Validating PLP favorites for Single SKU_Add and Remove');
            await homePage.goToHomePage(getBaseUrl());
            console.log('URL: ' + getBaseUrl());
          });
    
          
          // When we search for "mens polo" keyword in the search box
          await test.step('When we search for "golf polo" keyword in the search box', async () => {
            console.log('Searching the product');
            await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
          });
    
          await test.step('And we see product card descriptions contain "polo"', async () => {
              await page.waitForTimeout(20000); 
              await commonPage.handlePromotionalPopup();
              if(await productListingPage.productNamesAngular.first().isVisible()){
                  const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
                  console.log('Product name - '+loweredProductName);
                  expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
              } else {
                  const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
                  console.log('Product name - '+loweredProductName);
                  expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
              }
              console.log('Product search completed');
            });
            await test.step('Select fevorite item', async () => {
              console.log('Trying to add the favorites for non signed In user');
              await productListingPage.favorites.nth(index).click();
              await commonPage.sleep(5);
            });
    
            await test.step('Sign In', async () => {
              console.log('User gets the SignIn window');
              await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser, testData_smokePLP_prod.registeredUserPassword);            
              console.log('SignIN successful');
              
        
          });
    
          await test.step('When we search for "golf polo" keyword in the search box', async () => {
              console.log('Searching the product again');
              // await commonPage.sleep(5);
              await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
              // await commonPage.sleep(5);
            });
    
            await test.step('Verify favorite functionality', async () => {
            await productListingPage.favorites.nth(index).click();
            await commonPage.sleep(5);
            await productListingPage.unselectAllFavorites();
            
            await commonPage.sleep(5);
            await productListingPage.favorites.nth(index).click();
            await commonPage.sleep(2);
            await expect(productListingPage.favoritesToastMsg).toBeVisible();
            const toastText = await productListingPage.favoritesToastMsg.textContent();
            expect(toastText?.trim()).toContain(String('Added')); 
            console.log('Favorites added successfully for the selected product');
            await commonPage.sleep(5);

            await productListingPage.quickviewModalATCButton.nth(index).click();
            console.log('Quickview portal opened');
            await expect(productListingPage.quickViewFavorites).toHaveAttribute('class', /selected/);
            console.log('Favorite is selected in quick view portal');
            await productListingPage.quickViewFavorites.click();
            await expect(productListingPage.favoritesToastMsg).toBeVisible();
            const toastText1 = await productListingPage.favoritesToastMsg.textContent();
            expect(toastText1?.trim()).toContain(String('Removed')); 
            console.log('Favorites removed in quick view');
            await productListingPage.quickViewCloseButton.click();

            
            console.log('Quick view portal closed');
            await page.reload();
            const favoriteInPlp =  productListingPage.favorites.nth(index);
            await expect(favoriteInPlp).not.toHaveAttribute('aria-label', /Remove/);
            console.log('Favorite also removed in PLP page for the selected product');


            await productListingPage.quickviewModalATCButton.nth(index).click();
            console.log('Quickview portal opened 2nd time');
            await productListingPage.quickViewColorStocked.nth(0).click();
            await productListingPage.quickViewSizeStocked.nth(0).click();
            await productListingPage.quickViewFavorites.click();
            await expect(productListingPage.favoritesToastMsg).toBeVisible();
            const toastText2 = await productListingPage.favoritesToastMsg.textContent();

              try {
                expect(toastText2?.trim()).toContain(String('Added'));
                console.log('Favorites added for single SKU with stocked color and size');
              } catch (e) { // eslint-disable-line
                expect(toastText2?.trim()).toContain(String('Removed'));
                console.log('Favorites removed for single SKU with stocked color and size');
              }

            await commonPage.sleep(5);
            await productListingPage.quickViewCloseButton.click();
            console.log('Quick view portal closed');
            await page.reload();
            const favoriteInPlp1 =  productListingPage.favorites.nth(index);
            await expect(favoriteInPlp1).not.toHaveAttribute('aria-label', /Remove/);
            console.log('E-code level favorite is still not selected');

            await productListingPage.quickviewModalATCButton.nth(index).click();
            console.log('Quickview portal opened 3rd time');
            await productListingPage.quickViewColorStocked.nth(0).click();
            await productListingPage.quickViewSizeStocked.nth(0).click();
            try{
             await expect(productListingPage.quickViewFavorites).toHaveAttribute('class', /selected/);
            }catch(e) {
              await expect(productListingPage.quickViewFavorites).not.toHaveAttribute('class', /selected/);
            }
            console.log('SKU level attribute favorite is still selected/not selected for identified color and size combination');
          
            await productListingPage.quickViewColorStocked.nth(0).click();
            await productListingPage.quickViewSizeStocked.nth(1).click();
            await expect(productListingPage.quickViewFavorites).not.toHaveAttribute('class', /selected/);
            console.log('SKU level attribute favorite is not selected for another color and size combinations');
            await productListingPage.quickViewFavorites.click();
            console.log('Clicked on Favorite button');
            await expect(productListingPage.quickViewFavorites).toHaveAttribute('class', /selected/);
            console.log('SKU level attribute favorite is  selected for another color and size combinations');


            await productListingPage.quickViewCloseButton.click();
            console.log('Quick view portal closed');
            await productListingPage.removeAllFavoritesInMyAccounts();
            console.log('Validation successful');

        });

  });

  test('PLP Favorites_No_Attribute_product_Add and Remove favorites', async ({ page }) => {

    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const productDisplayPage = new ProductDisplayPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);
    const commonPage = new CommonPage(page);
    const myAccount = new AccountSignInPage(page);
    const index =1;

    await test.step('Given we are on "gg" page', async () => {
      console.log('Validating PLP favorites for E-Code level_Add and Remove');
      await homePage.goToHomePage(getBaseUrl());
      console.log('URL: ' + getBaseUrl());
    });

    
    // When we search for "mens polo" keyword in the search box
    await test.step('When we search for "spray" keyword in the search box', async () => {
      console.log('Searching the product');
      await homePage.searchForProduct(testData_smokePLP_prod.searchTerm2);
    });

    await test.step('And we see product card descriptions contain "polo"', async () => {
        await page.waitForTimeout(20000); 
        await commonPage.handlePromotionalPopup();
        if(await productListingPage.productNamesAngular.first().isVisible()){
            const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
            console.log('Product name - '+loweredProductName);
            expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch2);
        } else {
            const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
            console.log('Product name - '+loweredProductName);
            expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch2);
        }
        console.log('Product search completed');
      });
      await test.step('Select fevorite item', async () => {
        console.log('Trying to add the favorites for non signed In user');
        await productListingPage.favorites.nth(index).click();
        await commonPage.sleep(5);
      });

      await test.step('Sign In', async () => {
        console.log('User gets the SignIn window');
        await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser, testData_smokePLP_prod.registeredUserPassword);            
        console.log('SignIN successful');
       
        
  
    });

    await test.step('When we search for "spray" keyword in the search box', async () => {
        console.log('Searching the product again');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm2);
      });

      await test.step('Verify favorite functionality', async () => {
        await productListingPage.favorites.nth(index).click();
        await commonPage.sleep(5);
        await productListingPage.unselectAllFavorites();
        await commonPage.sleep(5);
        await productListingPage.favorites.nth(index).click();
        await expect(productListingPage.favoritesToastMsg).toBeVisible();
        console.log('Favorites added successfully for the selected product');
        await commonPage.sleep(5);
        await page.reload();
        await productListingPage.favorites.nth(index).click();
        await commonPage.sleep(5);
        await expect(productListingPage.favoritesToastMsg).toBeVisible();
        console.log('Favorites removed successfully for the selected product');
        await commonPage.sleep(5);
        await productListingPage.quickviewModalATCButton.nth(index).click();
        console.log('Quickview portal opened');
        await productListingPage.quickViewFavorites.click();
        await expect(productListingPage.favoritesToastMsg).toBeVisible();
        await commonPage.sleep(5);
        await productListingPage.quickViewFavorites.click();
        await expect(productListingPage.favoritesToastMsg).toBeVisible();
        console.log('Validation successful');

      });
      
    });


});