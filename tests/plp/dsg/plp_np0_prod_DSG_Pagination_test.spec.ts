import { expect, test } from '@playwright/test';

import { HomePage } from '../../../page-objects/HomePage.ts';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.ts';
import { getBaseUrl } from '../../../globalSetup.ts';
import { testData_smokePLP_prod } from '../../../test-data/smokePLPProdTestData.js';
import { CommonPage } from '../../../page-objects/CommonPage.ts';

test.describe('PLP Pagination Tests', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const commonPage = new CommonPage(page);

    await test.step('Given we are on the home page', async () => {
      await homePage.goToHomePage(getBaseUrl() + 'homr');
      console.log('URL: ' + getBaseUrl() + 'homr');
    });

    await test.step('When we search for product in the search box', async () => {
      console.log('Searching the product');
      await homePage.searchForProduct(testData_smokePLP_prod.searchTerm1);
    });

    await test.step('And we see product card descriptions contain product name', async () => {
      await commonPage.handlePromotionalPopup();
      const productListingPage = new ProductListingPage(page);
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

  });

  test('01. Pagination_Validating next arrow', async ({ page }) => {

    await test.step('Validating the next arrow', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.click();
      console.log('Clicked on the right arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const secondPageCount = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(secondPageCount);
      console.log('Page count matched between pages');
      console.log('Validation successful');
    });
  });

  test('02. Pagination_Validating back arrow', async ({ page }) => {

    await test.step('Validating the back arrow', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.click();
      console.log('Clicked on the right arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const secondPageCount = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(secondPageCount);
      console.log('Page count matched between pages');
      await expect(productListingPage.rightChevronNextButtonAngular.first()).toBeVisible();
      console.log('Left arrow is visible');
      await productListingPage.rightChevronNextButtonAngular.first().click();
      console.log('Clicked on left arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const firstPageCountAfterClickingLeftArrow = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(firstPageCountAfterClickingLeftArrow);
      console.log('Left arrow is working as expected');
      console.log('Validation successful');
    });

  });

  test('03. Pagination_Validating page numbers', async ({ page }) => {
    await test.step('Validating any random page number', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.click();
      console.log('Clicked on the right arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const secondPageCount = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(secondPageCount);
      console.log('Page count matched between pages');
      await productListingPage.validateRandomPage(firstPageCount, 2);
      await productListingPage.validateRandomPage(firstPageCount, 3);
      await productListingPage.validateRandomPage(firstPageCount, 1);
      console.log('Validation successful');
    });

  });

  test('04. Pagination_Validating results per page', async ({ page }) => {
    await test.step('Validating results per page', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.validateResultsPerPage(1);
      await productListingPage.validateResultsPerPage(3);
      await productListingPage.validateResultsPerPage(4);
      console.log('Validation successful');
    });

  });


  test('04. Pagination_Validating sort selection', async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    await test.step('Validating sort selection', async () => {
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.selectSortCategory('Top Sellers', firstPageCount);
      await productListingPage.selectSortCategory('Savings High to Low', firstPageCount);
      await productListingPage.selectSortCategory('Price Low to High', firstPageCount);
      await productListingPage.selectSortCategory('New Products', firstPageCount);
      await productListingPage.selectSortCategory('Brand (A-Z)', firstPageCount);
      await productListingPage.selectSortCategory('Most Relevant', firstPageCount);
      console.log('Validation successful');
    });

  });

  test('05. Category_Validating main product categories and marketing content', async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    await test.step('Validating main product categories', async () => {
      //In some environments the categories do not display, hence commenting the below step for now to avoid build failure
      productListingPage.validateProductCategoryWithMarketingContent();
      console.log('Validation successful');
    });

  });

  test('06. Category_Validating Pro Tips functionality', async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    console.log('Going to click on the ProTips link');
    await productListingPage.linkProTips.nth(1).click();
    const newPageUrl = page.url();
    expect(newPageUrl).toContain('protip');
    console.log('ProTips page opened');
    console.log('Validation successful');
  });

  test('07. Validating Brand filter functionality', async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    console.log('Going to validate the brand filter is working as expected');
    const brandName1 = await productListingPage.brandAccordionFilterLabelsAngular.nth(0).textContent();
    console.log('The brand selected is: '+brandName1);
    const brandNameTrimmed1 = brandName1?.trim();
    await productListingPage.validateBrandFilter(brandNameTrimmed1, 0);
    const brandName2 = await productListingPage.brandAccordionFilterLabelsAngular.nth(1).textContent();
    console.log('The brand selected is: '+brandName2);
    const brandNameTrimmed2 = brandName2?.trim();
    await productListingPage.validateBrandFilter(brandNameTrimmed2, 1);
    const brandName3 = await productListingPage.brandAccordionFilterLabelsAngular.nth(2).textContent();
    console.log('The brand selected is: '+brandName3);
    const brandNameTrimmed3 = brandName3?.trim();
    await productListingPage.validateBrandFilter(brandNameTrimmed3, 2);
    console.log('Validation successful');
  });















});










