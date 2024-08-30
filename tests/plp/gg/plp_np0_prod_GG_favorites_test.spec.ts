import { expect, test } from '@playwright/test';

import { HomePage } from '../../../page-objects/HomePage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';
import { CommonPage } from '../../../page-objects/CommonPage.ts';
import { AccountSignInPage } from '../../../page-objects/AccountSignInPage.ts';

test.describe('PLP/SRLP GG Favorites Tests', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    // Go to baseUrl set in .env or defaults to dsg_prod
    await homePage.goToHomePage(getBaseUrl() + 'homr');
    console.log('URL: ' + getBaseUrl() + 'homr');

    // Close popup
    //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

  });

  test('01. PLP Favorites_Non SignedIn user', async ({ page }) => {

    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
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
      if (await productListingPage.productNamesAngular.first().isVisible()) {
        const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
        expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
      } else {
        const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
        expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
      }
      console.log('Product search completed');
    });
    await test.step('Adding item to the favorites', async () => {
      console.log('Trying to add the favorites for non signed In user');
      await productListingPage.favorites.nth(1).click();
      await commonPage.sleep(5);
    });

    await test.step('Sign In', async () => {
      console.log('User gets the SignIn window');
      await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser1, testData_smokePLP_prod.registeredUserPassword);
      console.log('Validation successful');
    });
  });



  test('02. PLP Favorites_E-code level_Add and Remove favorites', async ({ page }) => {

    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const commonPage = new CommonPage(page);
    const myAccount = new AccountSignInPage(page);
    const index = 1;

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
      if (await productListingPage.productNamesAngular.first().isVisible()) {
        const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
        expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
      } else {
        const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
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
      await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser1, testData_smokePLP_prod.registeredUserPassword);
      console.log('SignIN successful');


    });

    await test.step('When we search for "golf polo" keyword in the search box', async () => {
      console.log('Searching the product again');
      await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
    });

    await test.step('Verify PLP favorite functionality on E-Code level_Addition and Removal', async () => {
      await productListingPage.favorites.nth(index).click();
      await commonPage.sleep(5);
      //Unselecting all the favorites items from PLP page
      await productListingPage.unselectAllFavorites();
      await commonPage.sleep(5);
      //Adding one item to the favorites
      await productListingPage.favorites.nth(index).click();
      await commonPage.sleep(2);
      //Validating the favorites toast message
      await expect(productListingPage.favoritesToastMsg).toBeVisible();
      const toastText = await productListingPage.favoritesToastMsg.textContent();
      expect(toastText?.trim()).toContain(String('Added'));
      console.log('Favorites added successfully');
      const indexStr = index.toString();
      //Validating the added favorites in My List section
      await productListingPage.verifyFavoritesPresentInMyAccounts(indexStr);
      console.log('Validation successful');

    });

  });


  test.only('03. PLP Favorites_Single/Multiple SKU validation', async ({ page }) => {

    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const commonPage = new CommonPage(page);
    const myAccount = new AccountSignInPage(page);
    const index = 2;

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
      if (await productListingPage.productNamesAngular.first().isVisible()) {
        const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
        expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch1);
      } else {
        const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
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
      if (await myAccount.continueWithoutPasskey.isVisible() && await myAccount.continueWithoutPasskey.isEnabled()) {
        console.log('Clicked on the Continue button.');
        await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser2, testData_smokePLP_prod.registeredUserPassword);

      } else {
        await myAccount.signIn(testData_smokePLP_prod.registeredUser2, testData_smokePLP_prod.registeredUserPassword);

      }
      console.log('SignIN successful');

    });

    await test.step('When we search for "golf polo" keyword in the search box', async () => {
      console.log('Searching the product again');
      await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
    });

    await test.step('Verify favorite functionality for single and multiple sku_addition and removal', async () => {
      await productListingPage.favorites.nth(index).click();
      await commonPage.sleep(5);
      //Unselecting all the favorites items from PLP page
      await productListingPage.unselectAllFavorites();

      await commonPage.sleep(5);
      await productListingPage.favorites.nth(index).click();
      await commonPage.sleep(2);
      // Validating favorites added in E-code level in PLP page
      await expect(productListingPage.favoritesToastMsg).toBeVisible();
      const toastText = await productListingPage.favoritesToastMsg.textContent();
      expect(toastText?.trim()).toContain(String('Added'));
      console.log('Favorites added successfully for the selected product');
      await commonPage.sleep(5);
      // Opening the quick view widget
      await productListingPage.quickviewModalATCButton.nth(index).click();
      console.log('Quickview portal opened');
      //Validating the quick view favorites auto selected due to favorites already added in PLP page
      await expect(productListingPage.quickViewFavorites).toHaveAttribute('class', /selected/);
      console.log('Favorite is selected in quick view portal');
      await productListingPage.quickViewFavorites.click();
      // Removed the quick view favorites
      await expect(productListingPage.favoritesToastMsg).toBeVisible();
      const toastText1 = await productListingPage.favoritesToastMsg.textContent();
      expect(toastText1?.trim()).toContain(String('Removed'));
      console.log('Favorites removed in quick view');
      await productListingPage.quickViewCloseButton.click();
      // closing the quick view portal
      console.log('Quick view portal closed');
      await page.reload();
      const favoriteInPlp = productListingPage.favorites.nth(index);
      // Validating the favorites also removed from the PLP page for the same product
      await expect(favoriteInPlp).not.toHaveAttribute('aria-label', /Remove/);
      console.log('Favorite also removed in PLP page for the selected product');

      await productListingPage.quickviewModalATCButton.nth(index).click();
      console.log('Quickview portal opened 2nd time');
      // Identified the 1st sku to add to favorites
      await productListingPage.quickViewColorStocked.nth(0).click();
      await productListingPage.quickViewSizeStocked.nth(0).click();
      // Added the 1st sku to the favorites
      await productListingPage.quickViewFavorites.click();
      await expect(productListingPage.favoritesToastMsg).toBeVisible();
      //Validating the favorites toast message
      const toastText2 = await productListingPage.favoritesToastMsg.textContent();
     
      if (toastText2?.includes('Added')) {
        console.log('Favorites added for single SKU with stocked color and size');
        expect(toastText2).toContain('Added');
      } else if (toastText2?.includes('Removed')) {
        console.log('Favorites removed for single SKU with stocked color and size');
        expect(toastText2).toContain('Removed');
      } else {
        console.error('Unexpected toast message:', toastText2);
      }
      await commonPage.sleep(5);
      await productListingPage.quickViewCloseButton.click();
      console.log('Quick view portal closed');
      await page.reload();
      const favoriteInPlp1 = productListingPage.favorites.nth(index);
      // Validating even the sku lavel favorite is selected but E-code level favorites is still not selected
      await expect(favoriteInPlp1).not.toHaveAttribute('aria-label', /Remove/);
      console.log('E-code level favorite is still not selected');

      await productListingPage.quickviewModalATCButton.nth(index).click();
      console.log('Quickview portal opened 3rd time');
      // Identified the 1st sku to add to favorites once again
      await productListingPage.quickViewColorStocked.nth(0).click();
      await productListingPage.quickViewSizeStocked.nth(0).click();
     
      const hasSelectedClass = await productListingPage.quickViewFavorites.getAttribute('class');
      // Check if the 'selected' class is present
      if (hasSelectedClass?.includes('selected')) {
        // Validating favorites is already selected for 1st SKU
        console.log('Favorites already selected for 1st SKU');
        expect(hasSelectedClass).toMatch(/selected/);
      } else {
        // Validating favorites not selected for 1st SKU
        console.log('Favorites not selected for 1st SKU');
        expect(hasSelectedClass).not.toMatch(/selected/);
      }
      console.log('SKU level attribute favorite is still selected/not selected for identified color and size combination');
      // Identified the 2nd sku to add to the favorites
      await productListingPage.quickViewColorStocked.nth(0).click();
      await productListingPage.quickViewSizeStocked.nth(1).click();
      
      const hasSelectedClass1 = await productListingPage.quickViewFavorites.getAttribute('class');
      // Check if the 'selected' class is present
      if (hasSelectedClass1?.includes('selected')) {
        // Validating favorites is already selected for 1st SKU
        console.log('Favorites already selected for 1st SKU');
        expect(hasSelectedClass1).toMatch(/selected/);
      } else {
        // Validating favorites not selected for 1st SKU
        console.log('Favorites not selected for 1st SKU');
        expect(hasSelectedClass1).not.toMatch(/selected/);
      }
      console.log('SKU level attribute favorite is not selected/not selected for another color and size combinations');
      await productListingPage.quickViewFavorites.click();
      console.log('Clicked on Favorite button');
      //Validating favorites selected for 2nd SKU
      await expect(productListingPage.quickViewFavorites).toHaveAttribute('class', /selected/);
      console.log('SKU level attribute favorite is  selected for another color and size combinations');

      await productListingPage.quickViewCloseButton.click();
      console.log('Quick view portal closed');
      //Removing all the favorites items from My List
      await productListingPage.removeAllFavoritesInMyAccounts();
      console.log('Validation successful');

    });

  });

  test('04. PLP Favorites_No_Attribute_product_Add and Remove favorites', async ({ page }) => {

    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const commonPage = new CommonPage(page);
    const myAccount = new AccountSignInPage(page);
    const index = 1;

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

    await test.step('And we see product card descriptions contain "Spray"', async () => {
      await page.waitForTimeout(20000);
      await commonPage.handlePromotionalPopup();
      if (await productListingPage.productNamesAngular.first().isVisible()) {
        const loweredProductName = (await productListingPage.productNamesAngular.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
        expect(loweredProductName).toContain(testData_smokePLP_prod.productMatch2);
      } else {
        const loweredProductName = (await productListingPage.productNames.first().allInnerTexts()).toString().toLowerCase();
        console.log('Product name - ' + loweredProductName);
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
      await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser3, testData_smokePLP_prod.registeredUserPassword);
      console.log('SignIN successful');

    });

    await test.step('When we search for "spray" keyword in the search box', async () => {
      console.log('Searching the product again');
      await homePage.searchForProduct(testData_smokePLP_prod.searchTerm2);
    });

    await test.step('Verify favorites functionilty for no attribute products_addition and removal', async () => {
      await productListingPage.favorites.nth(index).click();
      await commonPage.sleep(5);
      await productListingPage.unselectAllFavorites();
      await commonPage.sleep(5);
      await productListingPage.favorites.nth(index).click();
      await expect(productListingPage.fasvoritesToastMsg).toBeVisible();
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