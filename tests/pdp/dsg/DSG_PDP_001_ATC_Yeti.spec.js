import { expect, test } from '@playwright/test'

import { CommonPage } from '../../../page-objects/CommonPage.js'
import { HomePage } from '../../../page-objects/HomePage.js'
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage.js'
import { ProductListingPage } from '../../../page-objects/ProductListingPage.js'
import { getBaseUrl } from '../../../globalSetup.js'

test.describe("Regression_PDP_DSG_Yeti_ATC_001", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page)

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl())
        console.log("URL: " + getBaseUrl())

    });


    test('1: DSG Yeti ATC - Desktop', async ({ page }) => {
        const productDisplayPage = new ProductDisplayPage(page)
        const homePage = new HomePage(page)
        const commonPage = new CommonPage(page)
        const productListingPage = new ProductListingPage(page)

        //Select a product
        await productListingPage.selectMatchingProduct("YETI 20 oz. Rambler Tumbler with MagSlider Lid")
        console.log("Selecting product...")

    //Click Add to Cart
        await commonPage.scrollIfElementNotVisible(productDisplayPage.addToCartButton)
        await productDisplayPage.addToCartButton.click()
         //Expect to be disabled after click - Waiting confirmation
         //await expect (productDisplayPage.addToCartButton).toBeDisabled()
             console.log("Add to Cart button clicked")

    //Should see "Please Select Color"
        await commonPage.isTextVisible(productDisplayPage.pleaseSelectColor, "Please Select Color")
            
    //Select first color option
    await productDisplayPage.selectFirstColorOption(productDisplayPage.colorsPDPList)

    //Validate Available to ship
        await expect(productDisplayPage.shipToMeFullfilmentButton).toBeEnabled()
        console.log("Available to Ship is enabled")

    //Click on Add to Cart button
        await commonPage.scrollIfElementNotVisible(productDisplayPage.addToCartButton)
        await productDisplayPage.addToCartButton.click({timeout: 15000})
         console.log("Add to Cart button clicked")
    
    //We should see "ADDED TO CART"
    await commonPage.isTextVisible(productDisplayPage.addedToCartMessage, "ADDED TO CART")
    
    //Validate 'ADDED TO CART' is centered
       const isCentered = await productDisplayPage.addedToCartMessage.evaluate(element => {
       const computedStyle = window.getComputedStyle(element).textAlign;
         return computedStyle === 'center'
    })
        console.log('Element centered: ', isCentered)

    //We should see Continue Shopping
    await commonPage.isElementVisibleAndEnabled(productDisplayPage.continueShoppingMessage)
    await commonPage.isTextVisible(productDisplayPage.continueShoppingMessage, " Continue Shopping ")

    //We should see "GO TO CART"
    //await expect(productDisplayPage.goToCartMessage).toBeVisible()
    await commonPage.isTextVisible(productDisplayPage.goToCartMessage, "GO TO CART")

    //We click GO TO CART
    await commonPage.isElementVisibleAndEnabled(productDisplayPage.goToCartButton)
    await productDisplayPage.goToCartButton.click()

    //We should see "1 item"
    await commonPage.isTextVisible(productDisplayPage.oneItemCart, "(1 item)")
    })
})