import { expect, test } from '@playwright/test';

import { HomePage } from '../../../page-objects/HomePage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_e2e_np0_prod } from '../../../test-data/e2eNP0ProdTestData.js';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';

test.describe('PLP/SRLP DSG Smoke Tests', () => {
    test.beforeEach(async ({ page, context }) => {
      const homePage = new HomePage(page);

      // Close popup(frame) listener
      const closePopup = page.locator('#slideoutCloseButton');
      page.once('frameattached', async data => {
        console.log('listening for popup frame once');
        if (await closePopup.isVisible({ timeout: 20000 })) {
          await closePopup.click({ timeout: 20000 });
          console.log('popup closed');
        } else {
          console.log('no popup displayed');
        }
      });

      //add homr to url if running in preview
      if(getBaseUrl().includes('dks')){
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      }
    });

    test('1: Validate Add to Cart is available on majority of Product Cards', async ({ page }) => {
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
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                // await(productListingPage.quickviewOpenATCButtonAngular.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
                console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
                expect(ATCbuttonCountAngular).toBeGreaterThanOrEqual(ATCbuttonCountAngular * .8);
              } else {
                // await(productListingPage.quickviewOpenATCButtonReact.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
                console.log('ATC button count React = ' + ATCbuttonCountReact);
                expect(ATCbuttonCountReact).toBeGreaterThanOrEqual(ATCbuttonCountReact * .8);
              }
        });
    });

    test('2: Validate Add to Cart is not visible on custom products', async ({ page }) => {
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
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                // await(productListingPage.quickviewOpenATCButtonAngular.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
                console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
                expect(ATCbuttonCountAngular).toBe(0);
              } else {
                // await(productListingPage.quickviewOpenATCButtonReact.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
                console.log('ATC button count React = ' + ATCbuttonCountReact);
                expect(ATCbuttonCountReact).toBe(0);
              }
        });
    });

    test('3: Validate Add to Cart is not visible on personalized products', async ({ page }) => {
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
                // await(productListingPage.quickviewOpenATCButtonAngular.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountAngular = await(productListingPage.quickviewOpenATCButtonAngular.count());
                console.log('ATC button count Angular = ' + ATCbuttonCountAngular);
                expect(ATCbuttonCountAngular).toBe(0);
              } else {
                // await(productListingPage.quickviewOpenATCButtonReact.last().isVisible());
                await page.waitForTimeout(6000); // waits for 6 seconds
                const ATCbuttonCountReact = await(productListingPage.quickviewOpenATCButtonReact.count());
                console.log('ATC button count React = ' + ATCbuttonCountReact);
                expect(ATCbuttonCountReact).toBe(0);
              }
        });
    });

    test('4: Validate Quickview - Product name, image carousel', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                await productListingPage.quickviewOpenATCButtonAngular.first().click();
            } else {
                await productListingPage.quickviewOpenATCButtonReact.first().click();
            }
        });

        // And we Validate Product Name is dispayed
        await test.step('And we Validate Product Name is dispayed', async () => {
            //await productListingPage.quickviewViewProductName.isVisible();
            await page.waitForTimeout(3000); // waits for 3 seconds
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

        // And we choose product attributes
        // replace this with api selection method similar to what was done for pdp
        await test.step('And we choose product attributes', async () => {
          await page.waitForTimeout(2000); // waits for 2 seconds
          await productListingPage.quickviewColorAttribute2.first().click();
          await productListingPage.quickviewSizeAttribute.click();
        });
    });

    test('5: Select different fulfillment options - Ship', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And open quickview with api intercept attribute selection for the first product in the grid
        await test.step('And open quickview with api intercept for attributes', async () => {
          //will remove the below comments later
            //   console.log("Before the waitForResponse");
            //   const responsePromise = page.waitForResponse('**/catalog-productdetails/**');
            //   if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
            //     await productListingPage.quickviewOpenATCButtonAngular.first().click();
            // } else {
            //     await productListingPage.quickviewOpenATCButtonReact.first().click();
            // }
            //   console.log("Before the responsePromise");
            //   const response = await responsePromise;
            //   console.log("This is the response status - "+response.status());
            //   const newt = (await response.text()).match("parentPartNumber");
            //   const newtt = (await response.text()).search("parentPartNumber");
            //   const pos1 = (await response.text()).indexOf("parentPartNumber");
            //   const newttt = (await response.text()).substring(pos1,(pos1+40));
            //   console.log("This is the newt length - " +newt?.length);
            //   console.log("This is the newt - " +newt);
            //   console.log("This is the newtt - " +newtt);
            //   console.log("This is the newttt - " +newttt);
            //   console.log("Below is json");
            //   console.log(await response.json());
            //   const newz = await response.json();
            //   const newzz = await response.json();
            //   console.log(newz.productsData[0].style.definingAttributes);
            //   const jsonString = JSON.stringify(newzz, null, 2);
            //   console.log(jsonString);
              // console.log("This is the response text - "+ await response.text());

          await productListingPage.verifyAttributesArePresentOrNotForShipToMe();
          await productListingPage.selectShipToMeAttributes(page);
        });

        // And we click add to cart
        await test.step('And we click add to cart', async () => {
          await productListingPage.quickviewModalATCButton.first().click();
          await page.waitForTimeout(5000); // waits for 5 seconds
        });

        // // And we should see text "Keep Shopping"
        await test.step('And we should see text "Keep Shopping"', async () => {
          await expect (productListingPage.quickviewKeepShoppingButton).toBeVisible();
        });

        // // And we should see text "View Cart"
        await test.step('And we should see text "View Cart"', async () => {
          await expect (productListingPage.quickviewViewCartButton).toBeVisible();
        });
    });

    test('6: Select different fulfillment options - Store', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                await productListingPage.quickviewOpenATCButtonAngular.first().click();
            } else {
                await productListingPage.quickviewOpenATCButtonReact.first().click();
            }
        });

        // // And we choose product attributes and fulfillment
        await test.step('And we choose product attributes and fulfillment', async () => {
          await page.waitForTimeout(2000); // waits for 2 seconds
          await productListingPage.quickviewViewStoreFulfillment.click();
          await productListingPage.quickviewColorAttribute2.first().click();
          await productListingPage.quickviewSizeAttribute.click();
        });

        // // And we select store with availability
        await test.step('And we choose product attributes and fulfillment', async () => {
          await productListingPage.quickviewViewChangeStoreLink.click();
          await productListingPage.quickviewViewChangeStoreInputField.first().click();
          await productListingPage.quickviewViewChangeStoreInputField.first().fill(testData_smokePLP_prod.zipCode);
          await productListingPage.quickviewViewChangeStoreSearchButton.first().click();
          await productListingPage.quickviewViewChangeStoreSelectStoreButton.first().click();
        });

        // And we click add to cart
        await test.step('And we click add to cart', async () => {
          await productListingPage.quickviewModalATCButton.first().click();
          await page.waitForTimeout(5000); // waits for 5 seconds
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

    test('7: Select different fulfillment options - Same Day Delivery', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
        await homePage.goToHomePage(getBaseUrl() + '/f/mens-polo-shirts');
        console.log('URL: ' + getBaseUrl());
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
            if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
                await productListingPage.quickviewOpenATCButtonAngular.first().click();
            } else {
                await productListingPage.quickviewOpenATCButtonReact.first().click();
            }
        });

        // And we verify same day delivery button exists
        // Currently same day delivery functionality does not work in np0
        await test.step('And we choose product attributes and fulfillment', async () => {
          await page.waitForTimeout(2000); // waits for 2 seconds
          await expect(productListingPage.quickviewViewSameDayDeliveryFulfillment).toBeVisible();
        });
    });

    test('8: Quickview Add to Cart - SRLP', async ({ page }) => {
      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);

      // Go to baseUrl set in .env or defaults to dsg_prod
      // Given we are on "dsg" page
      await test.step('Given we are on "dsg" page', async () => {
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
      });

      // When we search for "testData_smokePLP_prod.searchTerm1" keyword in the search box
      await test.step('When we search for "mens polo" keyword in the search box', async () => {
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1)
      });

      // And open quickview with api intercept attribute selection for the first product in the grid
      await test.step('And open quickview with api intercept for attributes', async () => {
        await productListingPage.verifyAttributesArePresentOrNotForShipToMe();
        await productListingPage.selectShipToMeAttributes(page);
      });

      // And we click add to cart
      await test.step('And we click add to cart', async () => {
        await productListingPage.quickviewModalATCButton.first().click();
        await page.waitForTimeout(5000); // waits for 5 seconds
      });

      // And we should see text "Keep Shopping"
      await test.step('And we should see text "Keep Shopping"', async () => {
        expect (productListingPage.quickviewKeepShoppingButton).toBeVisible();
      });

      // And we should see text "View Cart"
      await test.step('And we should see text "View Cart"', async () => {
        expect (productListingPage.quickviewViewCartButton).toBeVisible();
      });
  });
});