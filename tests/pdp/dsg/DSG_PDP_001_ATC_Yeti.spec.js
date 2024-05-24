import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../../../globalSetup.js';
import { HomePage } from '../../../page-objects/HomePage.js';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js';
import { CommonPage, isTextVisible, selectFirstColorOption} from '../../../page-objects/CommonPage.js';
import { ProductListingPage } from '../../../page-objects/ProductListingPage.js';


test.describe("Regression_PDP_DSG_Yeti_ATC_001", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    
    });


    test('1: DSG Yeti ATC - Desktop', async ({ page }) => {
        const productDisplayPage = new ProductDisplayPage(page);
        const homePage = new HomePage(page);
        const commonPage = new CommonPage(page)
        const productListingPage = new ProductListingPage(page)

    // Search for product
        await homePage.searchForProduct("yeti brand");
            console.log("Query search entered")

    //Click Ship To Me
        await commonPage.sleep(3)
        await expect(productDisplayPage.shipToMeButton).toBeVisible()
        await productDisplayPage.shipToMeButton.click();
             console.log("Ship to me button clicked")

    //Filter by color Blue
        await productDisplayPage.blueColorButton.click
        await commonPage.sleep(2);
                console.log("Blue color filter clicked")

    //Select a product
        await productListingPage.selectMatchingProduct("YETI 20 oz. Rambler Tumbler with MagSlider Lid")
            console.log("Selecting product...")

    //Click Add to Cart
        commonPage.sleep(3);
        await expect(productDisplayPage.addToCartButton).toBeVisible();
        await productDisplayPage.addToCartButton.click()
             console.log("Add to Cart button clicked")

    //Should see "Please Select Color"
        await isTextVisible(page, productDisplayPage.pleaseSelectColor, "Please Select Color");
            
    //Select first color option
    await selectFirstColorOption(productDisplayPage, productDisplayPage.colorsPDPList);

    //Validate Available to ship
        await expect(productDisplayPage.shipToMeFullfilmentButton).toBeEnabled()
        console.log("Available to Ship is enabled")

    //Click on Add to Cart button
        commonPage.sleep(5)
        await productDisplayPage.addToCartButton.scrollIntoViewIfNeeded()
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        await productDisplayPage.addToCartButton.click();
        console.log("ATC btn clicked")
    
    //We should see "ADDED TO CART"
    commonPage.sleep(2)
    await isTextVisible(page, productDisplayPage.addedToCartMessage, "ADDED TO CART");
            
    
    //Validate 'ADDED TO CART' is centered
        const isCentered = await productDisplayPage.addedToCartMessage.evaluate(element => {
       const computedStyle = window.getComputedStyle(element).textAlign;
       return computedStyle === 'center'
    });
        console.log('Element centered: ', isCentered)

    //We should see Continue Shopping
    commonPage.sleep(2)
    await isTextVisible(page, productDisplayPage.continueShoppingMessage, " Continue Shopping ");

    //We should see "GO TO CART"
    commonPage.sleep(2)
    await isTextVisible(page, productDisplayPage.goToCartMessage, "GO TO CART");

    //We click GO TO CART
    await expect (productDisplayPage.goToCartButton).toBeVisible();
    await productDisplayPage.goToCartButton.click();

    //We should see "1 item"
    await isTextVisible(page, productDisplayPage.oneItemCart, "(1 item)");
    });
});