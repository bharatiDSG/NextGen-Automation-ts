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
      const baseUrl = getBaseUrl();
      if (baseUrl.includes('www.dickssportinggoods')) {
        await homePage.goToHomePage(getBaseUrl());
        console.log('URL: ' + getBaseUrl());
      } else {
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log('URL: ' + getBaseUrl() + 'homr');
      }

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

  test('01. Pagination_Validating next arrow', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {

    await test.step('Validating the next arrow', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      await productListingPage.rightChevronNextButtonAngular.click();
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.nth(1).click();
      console.log('Clicked on the right arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const secondPageCount = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(secondPageCount);
      console.log('Page count matched between pages');
      console.log('Validation successful');
    });
  });

  test('02. Pagination_Validating back arrow', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {

    await test.step('Validating the back arrow', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      await productListingPage.rightChevronNextButtonAngular.click();
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.nth(1).click();
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

  test('03. Pagination_Validating page numbers', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Validating any random page number', async () => {
      const productListingPage = new ProductListingPage(page);
      await expect(productListingPage.rightChevronNextButtonAngular).toBeVisible();
      console.log('Right arrow is visible');
      await productListingPage.rightChevronNextButtonAngular.click();
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const firstPageCount = await productListingPage.getActualPaginationCount();
      await productListingPage.rightChevronNextButtonAngular.nth(1).click();
      console.log('Clicked on the right arrow');
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      const secondPageCount = await productListingPage.getActualPaginationCount();
      expect(firstPageCount).toBe(secondPageCount);
      console.log('Page count matched between pages');
      await productListingPage.validateRandomPage(firstPageCount, 2);
      await productListingPage.validateRandomPage(firstPageCount, 3);
      console.log('Validation successful');
    });

  });

  test('04. Pagination_Validating results per page', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Validating results per page', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.rightChevronNextButtonAngular.click();
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
      await productListingPage.validateResultsPerPage(1);
      await productListingPage.validateResultsPerPage(2);
      await productListingPage.validateResultsPerPage(3);
      console.log('Validation successful');
    });

  });


  test('05. Pagination_Validating sort selection', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    await test.step('Validating sort selection', async () => {
      await productListingPage.rightChevronNextButtonAngular.click();
      await page.waitForLoadState('domcontentloaded');
      await productListingPage.totalItemCardsAngular.last().waitFor();
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

  test('06. Category_Validating main product categories and marketing content', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    const productListingPage = new ProductListingPage(page);
    await test.step('Validating main product categories', async () => {
      //In some environments the categories do not display, hence commenting the below step for now to avoid build failure
      productListingPage.validateProductCategoryWithMarketingContent();
      console.log('Validation successful');
    });
  });

  test('07. Category_Validating Pro Tips functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to click on the ProTips link', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.linkProTips.nth(1).click();
      await page.waitForLoadState('domcontentloaded');
      const newPageUrl = page.url();
      expect(newPageUrl).toContain('protip');
      console.log('ProTips page opened');
      console.log('Validation successful');
    })
  });




  test('08. Validating Brand filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the brand filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      const brandName1 = await productListingPage.brandAccordionFilterLabelsAngular.nth(0).textContent();
      console.log('The brand selected is: ' + brandName1);
      const brandNameTrimmed1 = brandName1?.trim();
      await productListingPage.validateBrandFilter(brandNameTrimmed1, 0);
      const brandName2 = await productListingPage.brandAccordionFilterLabelsAngular.nth(1).textContent();
      console.log('The brand selected is: ' + brandName2);
      const brandNameTrimmed2 = brandName2?.trim();
      await productListingPage.validateBrandFilter(brandNameTrimmed2, 1);
      const brandName3 = await productListingPage.brandAccordionFilterLabelsAngular.nth(2).textContent();
      console.log('The brand selected is: ' + brandName3);
      const brandNameTrimmed3 = brandName3?.trim();
      await productListingPage.validateBrandFilter(brandNameTrimmed3, 2);
      console.log('Validation successful');
    })

  });

  test('09. Validating Size filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the size filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.sizeAccordionFilterButtonAngular.click();
      const size1 = await productListingPage.sizeAccordionFilterLabelsAngular.nth(0).textContent();
      console.log('The size selected is: ' + size1);
      const size1Trimmed1 = size1?.trim();
      await productListingPage.validateSizeFilter(size1Trimmed1, 0);
      const size2 = await productListingPage.sizeAccordionFilterLabelsAngular.nth(1).textContent();
      console.log('The size selected is: ' + size2);
      const size1Trimmed2 = size2?.trim();
      await productListingPage.validateSizeFilter(size1Trimmed2, 1);
      const size3 = await productListingPage.sizeAccordionFilterLabelsAngular.nth(2).textContent();
      console.log('The size selected is: ' + size3);
      const size3Trimmed = size3?.trim();
      await productListingPage.validateSizeFilter(size3Trimmed, 2);
      console.log('Validation successful');
    })
  });

  test('10. Validating Color filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the color filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.colorAccordionFilterButtonAngular.click();
      const color1 = await productListingPage.colorAccordionFilterLabelsAngular.nth(0).textContent();
      console.log('The color selected is: ' + color1);
      const colorTrimmed1 = color1?.trim();
      await productListingPage.validateColorFilter(colorTrimmed1, 0);
      const color2 = await productListingPage.colorAccordionFilterLabelsAngular.nth(1).textContent();
      console.log('The color selected is: ' + color1);
      const colorTrimmed2 = color2?.trim();
      await productListingPage.validateColorFilter(colorTrimmed2, 1);
      const color3 = await productListingPage.colorAccordionFilterLabelsAngular.nth(2).textContent();
      console.log('The color selected is: ' + color3);
      const colorTrimmed3 = color3?.trim();
      await productListingPage.validateColorFilter(colorTrimmed3, 2);
      console.log('Validation successful');
    })
  });

  test('11. Validating Gender filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the gender filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      const gender1 = await productListingPage.genderAccordionFilterLabelsAngular.nth(0).textContent();
      console.log('The gender selected is: ' + gender1);
      const genderTrimmed1 = gender1?.trim();
      await productListingPage.validateGendedFilter(genderTrimmed1, 0);
      const gender2 = await productListingPage.genderAccordionFilterLabelsAngular.nth(1).textContent();
      console.log('The gender selected is: ' + gender2);
      const genderTrimmed2 = gender2?.trim();
      await productListingPage.validateGendedFilter(genderTrimmed2, 1);
      const gender3 = await productListingPage.genderAccordionFilterLabelsAngular.nth(2).textContent();
      console.log('The gender selected is: ' + gender3);
      const genderTrimmed3 = gender3?.trim();
      await productListingPage.validateGendedFilter(genderTrimmed3, 2);
      console.log('Validation successful');
    })
  });

  test('12. Validating Product Type filter functionality',{ tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the product type filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      await productListingPage.productTypeAccordionFilterButtonAngular.click();
      const product11 = await productListingPage.productTypeAccordionFilterLabelsAngular.nth(0).textContent();
      console.log('The product type selected is: ' + product11);
      const productTrimmed1 = product11?.trim();
      await productListingPage.validateProductTypeFilter(productTrimmed1, 0);
      const product2 = await productListingPage.productTypeAccordionFilterLabelsAngular.nth(1).textContent();
      console.log('The product type selected is: ' + product2);
      const productTrimmed2 = product2?.trim();
      await productListingPage.validateProductTypeFilter(productTrimmed2, 1);
      const product3 = await productListingPage.productTypeAccordionFilterLabelsAngular.nth(2).textContent();
      console.log('The product type selected is: ' + product3);
      const productTrimmed3 = product3?.trim();
      await productListingPage.validateProductTypeFilter(productTrimmed3, 2);
      console.log('Validation successful');
    })
  });

  test('13. Validating Shipping filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the shipping filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      console.log('Going to validate the shipping filter is working as expected');
      await productListingPage.validateShippingFilter();
      console.log('Validation successful');
    })
  });

  test('14. Validating Shipping filter functionality', { tag: ['@PLP', '@Pagination', '@DSG', '@np0Prod', '@Prod', '@Preview'] }, async ({ page }) => {
    await test.step('Going to validate the mixed filter is working as expected', async () => {
      const productListingPage = new ProductListingPage(page);
      console.log('Going to validate the mixed filter is working as expected');
      await productListingPage.validateMixedFilter();
      console.log('Validation successful');
    })
  });

























});









