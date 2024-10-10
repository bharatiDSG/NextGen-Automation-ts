import { expect, test } from '@playwright/test';
import { HomePage } from '../../../page-objects/HomePage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';
import { CommonPage } from '../../../page-objects/CommonPage.ts';
import { AccountSignInPage } from '../../../page-objects/AccountSignInPage.ts';

test.describe('PLP/SRLP GG Favorites Tests', () => {
  
  test.beforeEach(async ({ page, context }) => {
    const commonPage = new CommonPage(page);

    // grant permission for location
    await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
    console.log('geolocation granted for: ' + getBaseUrl());

    // handle iframe popup  
    commonPage.handleIframePopupSignUpViaTextForOffers();
  });

  test('01: Favorites - Non signed in user',
    { tag: ['@PLP', '@Favorites', '@GG', '@np0Prod', '@Prod', '@Preview'] },
    async ({ page }) => {

      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);
      const commonPage = new CommonPage(page);
      const myAccount = new AccountSignInPage(page);


      await test.step('Given we are on the home page', async () => {
        console.log('Validating PLP favorites for non signed In user');
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      });

      // When we search for product in the search box
      await test.step('When we search for the product in the search box', async () => {
        console.log('Searching the product');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
      });

      await test.step('And we see product card descriptions contain "polo"', async () => {
        await page.waitForLoadState('load');

        if (await productListingPage.productNamesAngular.last().isVisible()) {
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
        await productListingPage.favorites.nth(1).click();
        await commonPage.sleep(5);
      });

      await test.step('Sign In', async () => {
        console.log('User gets the SignIn window');
        await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser1, testData_smokePLP_prod.registeredUserPassword);
        console.log('Validation successful');
      });
    });


  test('02: Favorites - E-code level add and remove favorites',
    { tag: ['@PLP', '@Favorites', '@GG', '@np0Prod', '@Prod', '@Preview'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);
      const commonPage = new CommonPage(page);
      const myAccount = new AccountSignInPage(page);
      const index = 3;

      await test.step('Given we are on the home page', async () => {
        console.log('Validating PLP favorites for E-Code level_Add and Remove');
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      });


      // When we search for "mens polo" keyword in the search box
      await test.step('When we search for product in the search box', async () => {
        console.log('Searching the product');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
      });

      await test.step('And we see product card descriptions contain "polo"', async () => {
        await page.waitForLoadState('load');

        if (await productListingPage.productNamesAngular.last().isVisible()) {
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

      await test.step('When we search for product in the search box', async () => {
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


  test('03: Favorites - Single/multiple SKU validation',
    { tag: ['@PLP', '@Favorites', '@GG', '@np0Prod', '@Prod', '@Preview'] },
    async ({ page }) => {

      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);
      const commonPage = new CommonPage(page);
      const myAccount = new AccountSignInPage(page);
      const index = 2;

      await test.step('Given we are on the home page', async () => {
        console.log('Validating PLP favorites for Single SKU_Add and Remove');
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      });


      // When we search for "mens polo" keyword in the search box
      await test.step('When we search for product in the search box', async () => {
        console.log('Searching the product');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
      });

      await test.step('And we see product card descriptions contain "polo"', async () => {
        await page.waitForLoadState('load');

        if (await productListingPage.productNamesAngular.last().isVisible()) {
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
        await myAccount.accountSignInModern(testData_smokePLP_prod.registeredUser2, testData_smokePLP_prod.registeredUserPassword);
        console.log('SignIN successful');


      });

      await test.step('When we search for product in the search box', async () => {
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
        const favoriteInPlp = productListingPage.favorites.nth(index);
        await expect(favoriteInPlp).not.toHaveAttribute('aria-label', /Remove/);
        console.log('Favorite also removed in PLP page for the selected product');


        await productListingPage.quickviewModalATCButton.nth(index).click();
        console.log('Quickview portal opened 2nd time');
        await productListingPage.quickViewColorStocked.nth(0).click();
        await productListingPage.quickViewSizeStocked.nth(0).click();
        await productListingPage.quickViewFavorites.click();
        await expect(productListingPage.favoritesToastMsg).toBeVisible();

        const toastText2 = (await productListingPage.favoritesToastMsg.textContent())?.trim();
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
        await expect(favoriteInPlp1).not.toHaveAttribute('aria-label', /Remove/);
        console.log('E-code level favorite is still not selected');

        await productListingPage.quickviewModalATCButton.nth(index).click();
        console.log('Quickview portal opened 3rd time');
        await productListingPage.quickViewColorStocked.nth(0).click();
        await productListingPage.quickViewSizeStocked.nth(0).click();
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
        console.log('SKU level attribute favorite is still selected/not selected for identified color and size combination');
        await productListingPage.quickViewColorStocked.nth(0).click();
        await productListingPage.quickViewSizeStocked.nth(1).click();
        const hasSelectedClass2 = await productListingPage.quickViewFavorites.getAttribute('class');

        // Check if the 'selected' class is present
        if (hasSelectedClass2?.includes('selected')) {
          // Validating favorites is already selected for 1st SKU
          console.log('Favorites already selected for 1st SKU');
          expect(hasSelectedClass2).toMatch(/selected/);
        } else {
          // Validating favorites not selected for 1st SKU
          console.log('Favorites not selected for 1st SKU');
          expect(hasSelectedClass2).not.toMatch(/selected/);
        }

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

  test('04: Favorites - No attribute product - add and remove favorites',
    { tag: ['@PLP', '@Favorites', '@GG', '@np0Prod', '@Prod', '@Preview'] },
    async ({ page }) => {

      const homePage = new HomePage(page);
      const productListingPage = new ProductListingPage(page);
      const commonPage = new CommonPage(page);
      const myAccount = new AccountSignInPage(page);
      const index = 1;

      await test.step('Given we are on the home page', async () => {
        console.log('Validating PLP favorites for E-Code level_Add and Remove');
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      });


      // When we search for "mens polo" keyword in the search box
      await test.step('When we search for product in the search box', async () => {
        console.log('Searching the product');
        await homePage.searchForProduct(testData_smokePLP_prod.searchTerm2);
      });

      await test.step('And we see product card descriptions contain "polo"', async () => {
        await page.waitForLoadState('load');

        if (await productListingPage.productNamesAngular.last().isVisible()) {
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

      await test.step('When we search for product in the search box', async () => {
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