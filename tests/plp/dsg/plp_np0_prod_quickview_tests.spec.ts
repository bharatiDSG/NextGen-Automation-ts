import { expect, test } from '@playwright/test';

import { CommonPage } from './../../../page-objects/CommonPage';
import { HomePage } from '../../../page-objects/HomePage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_e2e_np0_prod } from '../../../test-data/e2eNP0ProdTestData.js';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';

test.describe('PLP/SRLP DSG Smoke Tests', () => {
    test.beforeEach(async ({ page }) => {
      const homePage = new HomePage(page);
      const commonPage = new CommonPage(page);

      // Close popup(frame) listener
      await commonPage.handleIframePopupSignUpViaTextForOffers();

      //add homr to url if running in preview
      if(getBaseUrl().includes('dks')){
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      }
    });

    test('1: Validate Add to Cart is available on majority of Product Cards',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        // Given we are on "dsg" page
        await test.step('Given we are on "dsg" page', async () => {
          await homePage.goToHomePage(getBaseUrl());
          console.log('URL: ' + getBaseUrl());
        });

        // When we search for "mens polo" keyword in the search box
        await test.step('When we search for "mens polo" keyword in the search box', async () => {
            await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
        });

        // And we Validate Add to Cart is available on majority of Product Cards
        await test.step('And we Validate Add to Cart is available on majority of Product Cards', async () => {
          await page.waitForLoadState('networkidle');
          if(await productListingPage.quickviewOpenATCButtonAngular.first().isVisible()){
              const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
              console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
              expect(ATCbuttonCountAngular).toBeGreaterThanOrEqual(ATCbuttonCountAngular * .8);
            } else {
              const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
              console.log('ATC button count React = ' + ATCbuttonCountReact);
              expect(ATCbuttonCountReact).toBeGreaterThanOrEqual(ATCbuttonCountReact * .8);
            }
        });
    });

    test('2: Validate Add to Cart is not visible on custom products',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        // Given we are on "dsg" page
        await test.step('Given we are on "dsg" page', async () => {
          await homePage.goToHomePage(getBaseUrl());
          console.log('URL: ' + getBaseUrl());
        });

        // When we search for "custom" keyword in the search box
        await test.step('When we search for "mens polo" keyword in the search box', async () => {
            await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm3);
        });

        // And we Validate Add to Cart is not visible on custom products
        await test.step('Validate Add to Cart is not visible on custom products', async () => {
          await page.waitForLoadState('networkidle');
          if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
              const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
              console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
              expect(ATCbuttonCountAngular).toBe(0);
            } else {
              const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
              console.log('ATC button count React = ' + ATCbuttonCountReact);
              expect(ATCbuttonCountReact).toBe(0);
            }
        });
    });

    test('3: Validate Add to Cart is not visible on personalized products',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        // Given we are on "dsg" page
        await test.step('Given we are on "dsg" page', async () => {
          await homePage.goToHomePage(getBaseUrl());
          console.log('URL: ' + getBaseUrl());
        });

        // When we search for "custom" keyword in the search box
        await test.step('When we search for "mens polo" keyword in the search box', async () => {
            await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm4);
        });

        // And we Validate Add to Cart is not visible on personalized products
        await test.step('And we Validate Add to Cart is not visible on personalized products', async () => {
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
                console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
                expect(ATCbuttonCountAngular).toBe(0);
              } else {
                const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
                console.log('ATC button count React = ' + ATCbuttonCountReact);
                expect(ATCbuttonCountReact).toBe(0);
              }
        });
    });

    test('4: Validate Quickview - Product name, image carousel',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
            await page.waitForLoadState('networkidle');
            if(await productListingPage.quickviewOpenATCButtonAngular.first().isVisible()){
                await productListingPage.quickviewOpenATCButtonAngular.first().click();
            } else {
                await productListingPage.quickviewOpenATCButtonReact.first().click();
            }
        });

        // And we Validate Product Name is dispayed
        await test.step('And we Validate Product Name is dispayed', async () => {
            await expect(productListingPage.quickviewViewProductName).toBeVisible();
            const loweredProductName = (await productListingPage.quickviewViewProductName.allInnerTexts()).toString().toLowerCase();
            console.log('Product name - '+loweredProductName);
            expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
        });

        // And we Validate Image Carousel
        await test.step('And we Validate Image Carousel', async () => {
          let i=0;
          for(i;i < 4; i++){
            await productListingPage.quickviewViewImageCarouselNextButton.click();
            await page.waitForTimeout(1000); // waits for .5 seconds
            await expect(productListingPage.quickviewViewImage.first()).toBeVisible();
          }
          for(i=0; i < 4; i++){
            await productListingPage.quickviewViewImageCarouselPreviousButton.click();
            await page.waitForTimeout(1000); // waits for .5 seconds
            await expect(productListingPage.quickviewViewImage.first()).toBeVisible();
          }
        });

        // And we Validate adding to cart a product with no attributes - button should be grayed out
        await test.step('And we Validate adding to cart a product with no attributes', async () => {
          await expect(productListingPage.quickviewModalATCButton.first()).toBeDisabled();
        });
    });

    test('5: Select different fulfillment options - Ship',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And open quickview with api intercept attribute selection for the first product in the grid
        await test.step('And open quickview with api intercept for attributes', async () => {
          await page.waitForLoadState('networkidle');
          await productListingPage.verifyAttributesArePresentOrNotForShipToMe();
          await productListingPage.selectShipToMeAttributes(page);
        });

        // And we click add to cart
        await test.step('And we click add to cart', async () => {
          await productListingPage.quickviewModalATCButton.first().click();
        });

        // And we should see text "Keep Shopping"
        await test.step('And we should see text "Keep Shopping"', async () => {
          await expect (productListingPage.quickviewKeepShoppingButton).toBeVisible();
        });

        // And we should see text "View Cart"
        await test.step('And we should see text "View Cart"', async () => {
          await expect (productListingPage.quickviewViewCartButton).toBeVisible();
        });
    });

    test('6: Select different fulfillment options - Store',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

      // And open quickview with api intercept attribute selection for the first product in the grid
      await test.step('And open quickview with api intercept for attributes', async () => {
        await page.waitForLoadState('networkidle');
        await productListingPage.verifyAttributesArePresentOrNotForBOPIS(testData_smokePLP_prod.zipCode, testData_smokePLP_prod.storeSearch, testData_smokePLP_prod.storeSearch);
        await productListingPage.quickviewViewStoreFulfillment.click();
        await productListingPage.selectBOPISAttributes(page);
      });

      // And we click add to cart
      await test.step('And we click add to cart', async () => {
        await productListingPage.quickviewModalATCButton.first().click();
      });

      // And we should see text "Keep Shopping"
      await test.step('And we should see text "Keep Shopping"', async () => {
        await productListingPage.quickviewKeepShoppingButton.waitFor();
        await expect (productListingPage.quickviewKeepShoppingButton).toBeVisible();
      });

      // And we should see text "View Cart"
      await test.step('And we should see text "View Cart"', async () => {
       await expect (productListingPage.quickviewViewCartButton).toBeVisible();
      });
  });

    test('7: Select different fulfillment options - Same Day Delivery',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
          await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
          console.log('URL: ' + getBaseUrl());
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
          await page.waitForLoadState('networkidle');
          await productListingPage.quickviewOpenATCButtonAngular.first().click();
        });

        // And we verify same day delivery button exists
        // Currently same day delivery functionality does not work in np0
        await test.step('And we choose product attributes and fulfillment', async () => {
          await expect(productListingPage.quickviewViewSameDayDeliveryFulfillment).toBeVisible();
        });
    });

    test('8: Quickview Add to Cart - SRLP - Ship to me',
      { tag: ['@PLP',  '@Prod', '@Preview', '@np0Prod', '@DSG'] },
      async ({ page }) => {
      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);

      // Go to baseUrl set in .env or defaults to dsg_prod
      // Given we are on "dsg" page
      await test.step('Given we are on "dsg" page', async () => {
        await homePage.goToHomePage(getBaseUrl());
        console.log('URL: ' + getBaseUrl());
      });

      // When we search for "testData_smokePLP_prod.searchTerm1" keyword in the search box
      await test.step('When we search for "mens polo" keyword in the search box', async () => {
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1)
      });

      // And open quickview with api intercept attribute selection for the first product in the grid
      await test.step('And open quickview with api intercept for attributes', async () => {
        await page.waitForLoadState('networkidle');
        await productListingPage.verifyAttributesArePresentOrNotForShipToMe();
        await productListingPage.selectShipToMeAttributes(page);
      });

      // And we click add to cart
      await test.step('And we click add to cart', async () => {
        await productListingPage.quickviewModalATCButton.first().click();
      });

      // And we should see text "Keep Shopping"
      await test.step('And we should see text "Keep Shopping"', async () => {
        await productListingPage.quickviewKeepShoppingButton.waitFor();
        await expect (productListingPage.quickviewKeepShoppingButton).toBeVisible();
      });

      // And we should see text "View Cart"
      await test.step('And we should see text "View Cart"', async () => {
        await expect (productListingPage.quickviewViewCartButton).toBeVisible();
      });
    });
});