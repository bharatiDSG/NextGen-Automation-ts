import { expect, test } from '@playwright/test';

import { CartPage } from '/Users/DKS0393110/Documents/repos/te-playwright-js/page-objects/CartPage';
import { CheckoutPage } from '/Users/DKS0393110/Documents/repos/te-playwright-js/page-objects/CheckoutPage';
import { HomePage } from '/Users/DKS0393110/Documents/repos/te-playwright-js/page-objects/HomePage';
import { OrderConfirmationPage } from '/Users/DKS0393110/Documents/repos/te-playwright-js/page-objects/OrderConfirmationPage';
import { ProductDisplayPage } from '/Users/DKS0393110/Documents/repos/te-playwright-js/page-objects/ProductDisplayPage';
import { ProductListingPage } from './../../../page-objects/ProductListingPage';
import { getBaseUrl } from '/Users/DKS0393110/Documents/repos/te-playwright-js/globalSetup';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData';

test.describe("PLP/SRLP DSG Smoke Tests", () => {
    test.beforeEach(async ({ page, context }) => {
      const homePage = new HomePage(page);

      // Close popup(frame) listener
      const closePopup = page.locator('#slideoutCloseButton')
      page.once('frameattached', async data => {
        console.log("listening for popup frame once")
        if (await closePopup.isVisible({ timeout: 20000 })) {
          await closePopup.click({ timeout: 20000 })
          console.log("popup closed")
        } else {
          console.log("no popup displayed")
        }
      });

      //add homr to url if running in preview
      if(getBaseUrl().includes('preview')){
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");
      }
    });

    test('1: SRLP page, STH order', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        // Given we are on "dsg" page
        await test.step('Given we are on "dsg" page', async () => {
          await homePage.goToHomePage(getBaseUrl());
          console.log("URL: " + getBaseUrl());
        });

        // When we search for "mens polo" keyword in the search box
        await test.step('When we search for "mens polo" keyword in the search box', async () => {
          await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1)
        });

        // And we set zip code to "15108"
        await test.step('And we set zip code to "15108"', async () => {
          await productListingPage.setDeliveryZipPLP(testData_smokePLP_prod.zipCode)
          await expect(productListingPage.zipDeliveryLocationButton.first()).toHaveText(new RegExp('.*'+testData_smokePLP_prod.zipCode+'.*'))
        });

        // And we see product card descriptions contain "polo"
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

        // And we see promotions on product cards
        await test.step('And we see promotions on product cards', async () => {
          await expect(productListingPage.productPromotionsReact.first().or(productListingPage.productPromotionsAngular).first()).toBeVisible();
        });

        // And we see availability attributes on product cards
        await test.step('And we see availability attributes on product cards', async () => {
          await expect(productListingPage.productAvailabilityReact.first().or(productListingPage.productAvailabilityAngular.first())).toBeVisible();
        });

        // And we see price attribute "homefield-price" on product cards
        await test.step('And we see price attribute "homefield-price" on product cards', async () => {
          await expect(productListingPage.productPriceReact.first().or(productListingPage.productPriceAngular.first())).toBeVisible();
        });

        // And we go to the next page for products
        await test.step('And we go to the next page for products', async () => {
          if(await productListingPage.rightChevronNextButtonAngular.first().isVisible()){
            await productListingPage.rightChevronNextButtonAngular.first().click();
            await page.waitForTimeout(4000); // waits for 4 seconds
            expect(productListingPage.highlightedPageNumberAngular).toHaveText("2");
          } else {
            await productListingPage.rightChevronNextButtonReact.first().click();
            await page.waitForTimeout(4000); // waits for 4 seconds
            expect(productListingPage.highlightedPageNumberReact).toHaveText("2");
          }
        });

        // And we apply the "Ship" shipping option filter
        await test.step('And we apply the "Ship" shipping option filter', async () => {
          if(await productListingPage.shipFilterButtonAngular.first().isVisible()){
            await productListingPage.shipFilterButtonAngular.first().click();
            expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
          } else {
            await productListingPage.shipFilterButtonReact.click();
            expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
          }
        });

        // And we apply the size filter "L"
        await test.step('And we apply the size filter "L"', async () => {
          if(await productListingPage.sizeAccordionFilterButtonAngular.first().isVisible()){
            await productListingPage.sizeAccordionFilterButtonAngular.first().click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.sizeFilterValueAngular.first().click();
            expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('L'));
          } else {
            await productListingPage.sizeAccordionFilterButtonReact.click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.sizeFilterValueReact.first().click();
            expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('L'));
          }
        });

        // And we apply the sale filter
        await test.step('And we apply the sale filter', async () => {
          if(await productListingPage.saleAccordionFilterButtonAngular.first().isVisible()){
            await productListingPage.saleAccordionFilterButtonAngular.first().click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.saleFilterValueAngular.click();
            expect(productListingPage.filterChipsAngular.nth(1)).toContainText(new RegExp('Sale'));
          } else {
            await productListingPage.saleAccordionFilterButtonReact.click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.saleFilterValueReact.click();
            expect(productListingPage.filterChipsReact.nth(1)).toContainText(new RegExp('Sale'));
          }
        });

        // And we sort by "Price Low to High"
        await test.step('And we sort by "Price Low to High"', async () => {
          if(await productListingPage.sortOptionsAccordionButtonAngular.isVisible()){
            await productListingPage.sortOptionsAccordionButtonAngular.click();
            await productListingPage.sortOptionsSelectionAngular.selectOption('Price Low to High');
            // await productListingPage.sortOptionsSelectionAngular.filter({ hasText: 'Price Low to High' }).click();
            expect(productListingPage.sortSelectedAngular).toContainText('Price Low to High');
          } else {
            await productListingPage.sortOptionsAccordionButtonReact.click();
            await productListingPage.sortOptionsSelectionReact.filter({ hasText: 'Price Low to High' }).click();
            expect(productListingPage.sortSelectedReact).toContainText('Price Low to High');
          }
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
          if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
            await productListingPage.quickviewOpenATCButtonAngular.first().click();
          } else {
            await productListingPage.quickviewOpenATCButtonReact.first().click();
          }
        });

        // And we choose product attributes
        await test.step('And we choose product attributes', async () => {
          await page.waitForTimeout(2000); // waits for 2 seconds
          await productListingPage.quickviewColorAttribute.first().click();
          await productListingPage.quickviewSizeAttribute.click();
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

    test('2: PLP page, BOPIS order', async ({ page }) => {
      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);

        // Given we are on "/f/mens-polo-shirts" page
        await test.step('Given we are on "/f/mens-polo-shirts" page', async () => {
          await homePage.goToHomePage(getBaseUrl() + "/f/mens-polo-shirts");
          console.log("URL: " + getBaseUrl());
        });

        // And we see breadcrumb links at the top of the PLP page
        await test.step('And we see breadcrumb links at the top of the PLP page', async () => {
          if(await productListingPage.breadCrumbLinkAngular.isVisible()){
            expect(productListingPage.breadCrumbLinkAngular).toContainText('Men\'s Shirts & Tops');
          } else {
            expect(productListingPage.breadCrumbLinkReact).toContainText('Men\'s Shirts & Tops');
          }
        });

        // And we set zip code to "15108"
        await test.step('And we set zip code to "15108"', async () => {
          await productListingPage.setDeliveryZipPLP(testData_smokePLP_prod.zipCode)
          await expect(productListingPage.zipDeliveryLocationButton.first()).toHaveText(new RegExp('.*'+testData_smokePLP_prod.zipCode+'.*'))
        });

        // And we see product card descriptions contain "polo"
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

        // And we see promotions on product cards
        await test.step('And we see promotions on product cards', async () => {
          await expect(productListingPage.productPromotionsReact.first().or(productListingPage.productPromotionsAngular).first()).toBeVisible();
        });

        // And we see availability attributes on product cards
        await test.step('And we see availability attributes on product cards', async () => {
          await expect(productListingPage.productAvailabilityReact.first().or(productListingPage.productAvailabilityAngular.first())).toBeVisible();
        });

        // And we see price attribute "homefield-price" on product cards
        await test.step('And we see price attribute "homefield-price" on product cards', async () => {
          await expect(productListingPage.productPriceReact.first().or(productListingPage.productPriceAngular.first())).toBeVisible();
        });

        // And we go to the next page for products
        await test.step('And we go to the next page for products', async () => {
          if(await productListingPage.rightChevronNextButtonAngular.first().isVisible()){
            await productListingPage.rightChevronNextButtonAngular.first().click();
            await page.waitForTimeout(4000); // waits for 4 seconds
            expect(productListingPage.highlightedPageNumberAngular).toHaveText("2");
          } else {
            await productListingPage.rightChevronNextButtonReact.first().click();
            await page.waitForTimeout(4000); // waits for 4 seconds
            expect(productListingPage.highlightedPageNumberReact).toHaveText("2");
          }
        });

        // And we apply the "Pickup" shipping option filter
        await test.step('And we apply the "Ship" shipping option filter', async () => {
          if(await productListingPage.pickupFilterButtonAngular.first().isVisible()){
            await productListingPage.pickupFilterButtonAngular.first().click();
            expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Pickup.*'));
          } else {
            await productListingPage.pickupFilterButtonReact.click();
            expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Pickup.*'));
          }
        });

        // And we apply the size filter "L"
        await test.step('And we apply the size filter "L"', async () => {
          if(await productListingPage.sizeAccordionFilterButtonAngular.first().isVisible()){
            await productListingPage.sizeAccordionFilterButtonAngular.first().click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.sizeFilterValueAngular.first().click();
            expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('L'));
          } else {
            await productListingPage.sizeAccordionFilterButtonReact.click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.sizeFilterValueReact.first().click();
            expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('L'));
          }
        });

        // And we apply the sale filter
        await test.step('And we apply the sale filter', async () => {
          if(await productListingPage.saleAccordionFilterButtonAngular.first().isVisible()){
            await productListingPage.saleAccordionFilterButtonAngular.first().click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.saleFilterValueAngular.click();
            expect(productListingPage.filterChipsAngular.nth(1)).toContainText(new RegExp('Sale'));
          } else {
            await productListingPage.saleAccordionFilterButtonReact.click();
            await page.waitForTimeout(2000); // waits for 2 seconds
            await productListingPage.saleFilterValueReact.click();
            expect(productListingPage.filterChipsReact.nth(1)).toContainText(new RegExp('Sale'));
          }
        });

        // And we sort by "Price Low to High"
        await test.step('And we sort by "Price Low to High"', async () => {
          if(await productListingPage.sortOptionsAccordionButtonAngular.isVisible()){
            await productListingPage.sortOptionsAccordionButtonAngular.click();
            await productListingPage.sortOptionsSelectionAngular.selectOption('Price Low to High');
            expect(productListingPage.sortSelectedAngular).toContainText('Price Low to High');
          } else {
            await productListingPage.sortOptionsAccordionButtonReact.click();
            await productListingPage.sortOptionsSelectionReact.filter({ hasText: 'Price Low to High' }).click();
            expect(productListingPage.sortSelectedReact).toContainText('Price Low to High');
          }
        });

        // And we open quickview add to cart for the first product in the grid
        await test.step('And we open quickview add to cart for the first product in the grid', async () => {
          if(await productListingPage.quickviewOpenATCButtonAngular.isVisible()){
            await productListingPage.quickviewOpenATCButtonAngular.first().click();
          } else {
            await productListingPage.quickviewOpenATCButtonReact.first().click();
          }
        });

        // And we choose product attributes
        await test.step('And we choose product attributes', async () => {
          await page.waitForTimeout(2000); // waits for 2 seconds
          await productListingPage.quickviewColorAttribute2.first().click();
          await productListingPage.quickviewSizeAttribute.click();
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