import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../globalSetup.js';
import { HomePage } from '../page-objects/HomePage.js';
import { CommonPage } from '../page-objects/CommonPage.js';
import { ProductListingPage } from '../page-objects/ProductListingPage.js';
import { ProductDisplayPage } from '../page-objects/ProductDisplayPage.js';
import { CartPage } from '../page-objects/CartPage.js';
import { CheckoutPage } from '../page-objects/CheckoutPage.js';
import { OrderConfirmationPage } from '../page-objects/OrderConfirmationPage.js';
import { AccountSignInPage } from '../page-objects/AccountSignInPage.js';
import { testData_e2e_np0_prod } from '../test-data/e2eNP0ProdTestData.js';



test.describe("E2E NP0 Prod", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");

        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

    });


    test('1: BOPIS - Guest - CC', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        // Search for product
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm1)

        // Set store
        const storeName = await productListingPage.setStoreFromPLP(testData_e2e_np0_prod.storeSearch)

        // Choose pickup filter
        await productListingPage.pickupFilterButton.click();

        // Select a product
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch1)

        // Verify store pickup is enabled
        await expect(productDisplayPage.storePickupEnabledButton).toBeVisible()
        await productDisplayPage.storePickupEnabledButton.click();

        // Verify correct store and add to cart
        await expect(productDisplayPage.storePickupSubText.filter({ hasText: storeName })).toBeVisible()
        await productDisplayPage.addToCartButton.click();

        // Click Go to Cart
        await productDisplayPage.goToCartButton.click();
        await commonPage.sleep(2)

        // Validate store pickup is free in cart
        expect(cartPage.freeStorePickupRadioButtonText).toBeVisible()

        // Get Cart Price Details Object
        const cartPriceDetailsObject = await cartPage.getCartPriceDetailsObject()
        console.log({ cartPriceDetailsObject })

        // Verify store pickup is free in price details using cart details object
        const storePickup = cartPriceDetailsObject.getStorePickup()
        console.log({ storePickup })
        expect(storePickup).toBe('Free')

        // Go to Checkout
        await cartPage.checkoutButton.click()

        await expect(checkoutPage.shippingTitle).toHaveText('Free Store Pickup')
        await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()

        // Enter contact info - continue - validate complete checkmark
        const email = testData_e2e_np0_prod.email
        await checkoutPage.enterContactInfo(testData_e2e_np0_prod.firstname, testData_e2e_np0_prod.lastName, email, testData_e2e_np0_prod.phoneNumber)

        // Enter Billing Shipping info - validate complete checkmark
        await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_prod.address, testData_e2e_np0_prod.address2, testData_e2e_np0_prod.zipCode)

        // Add credit card info
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_prod.creditCardNumber, testData_e2e_np0_prod.expiryDate, testData_e2e_np0_prod.securityCode)

        // // Place order
        await checkoutPage.placeOrderButton.click()

        // Validate order confirmation page and order number
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click();

        await expect(homePage.searchField).toBeVisible()

        // // bonus: validate email
        // await commonPage.sleep(10)
        // const emailServerId = testData_e2e_np0_prod.mailosaurServerID
        // const orderNumberFromEmail = await accountSignInPage.validateOrderConfirmationEmail(emailServerId, email)
        // expect(orderNumberFromConfirmationPage).toContain(orderNumberFromEmail);

        console.log('')
    });


    test('2: STH - Guest - CC', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        // Search for product
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm1)

        // Set store
        await productListingPage.setStoreFromPLP(testData_e2e_np0_prod.storeSearch)

        // Select a product
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch1)

        // Click add to cart
        await commonPage.sleep(2)
        await productDisplayPage.addToCartButton.scrollIntoViewIfNeeded()
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        await productDisplayPage.addToCartButton.click();

        // Click Go to Cart
        await productDisplayPage.goToCartButton.click();
        await commonPage.sleep(2)

        // Validate Cart and free shipping
        const estimatedShipping = await cartPage.getEstimatedShipping()
        console.log({ estimatedShipping })
        expect(estimatedShipping).toBe('Free')

        // Go to Checkout
        await cartPage.checkoutButton.click()

        await expect(checkoutPage.shippingTitleAnchor).toHaveText('Shipping')
        await expect(checkoutPage.shippingHeader).toBeVisible()
        await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()

        // Enter contact info - continue - validate complete checkmark
        const email = testData_e2e_np0_prod.email
        await checkoutPage.enterContactInfo(testData_e2e_np0_prod.firstname, testData_e2e_np0_prod.lastName, email, testData_e2e_np0_prod.phoneNumber)

        // Enter Billing Shipping info - validate complete checkmark
        await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_prod.address, testData_e2e_np0_prod.address2, testData_e2e_np0_prod.zipCode)

        // Add credit card info
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_prod.creditCardNumber, testData_e2e_np0_prod.expiryDate, testData_e2e_np0_prod.securityCode)

        // Place order
        await checkoutPage.placeOrderButton.click()

        // Validate order confirmation page and order number
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)

        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click();

        await expect(homePage.searchField).toBeVisible()

        // bonus: validate email
        await commonPage.sleep(10)
        const emailServerId = testData_e2e_np0_prod.mailosaurServerID
        const orderNumberFromEmail = await accountSignInPage.validateOrderConfirmationEmail(emailServerId, email)
        expect(orderNumberFromConfirmationPage).toContain(orderNumberFromEmail);

        console.log('')
    });

});