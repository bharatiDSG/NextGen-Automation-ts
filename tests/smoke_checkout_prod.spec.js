import { expect, test } from '@playwright/test';

import { AccountSignInPage } from '../page-objects/AccountSignInPage.js';
import { CartPage } from '../page-objects/CartPage.js';
import { CheckoutPage } from '../page-objects/CheckoutPage.js';
import { CommonPage } from '../page-objects/CommonPage.js';
import { HomePage } from '../page-objects/HomePage.js';
import { OrderConfirmationPage } from '../page-objects/OrderConfirmationPage.js';
import { ProductDisplayPage } from '../page-objects/ProductDisplayPage.js';
import { ProductListingPage } from '../page-objects/ProductListingPage.js';
import { getBaseUrl } from '../globalSetup.js';
import { testData_e2e_np0_prod } from '../test-data/e2eNP0ProdTestData.js';
import { testData_smokeCheckout_prod } from '../test-data/smokeCheckoutProdTestData.js';
import { timeStamp } from 'console';

test.describe("DSG Prod Smoke Checkout Tests", () => {
    // Request context is reused by all tests in the file.
    let apiContext;

    test.beforeAll(async ({ playwright }) => {
      apiContext = await playwright.request.newContext({
        // All requests we send go to this API endpoint.
        baseURL: 'https://customer-order.dcsg.com'
      });
    });

    test.afterAll(async ({ }) => {
      // Dispose all responses.
      await apiContext.dispose();
    });

    test('1: Smoke Checkout Prod - place order', async ({ page }) => {
        const homePage = new HomePage(page);
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
        // Search for product
        await homePage.searchForProduct(testData_smokeCheckout_prod.searchTerm1)

        //Click ship to me fulfillment option
        await productDisplayPage.shipToMeButton.click();

        //Select attributes
        await productDisplayPage.flexAttribute.click();
        await productDisplayPage.handAttribute.click();
        await productDisplayPage.shaftAttribute.click();
        await productDisplayPage.loftAttribute.click();

        //add to cart
        await productDisplayPage.addToCartButtonProd.click();

        // Click Go to Cart
        await productDisplayPage.goToCartButton.click();

        // Get Cart Price Details Object
        const cartPriceDetailsObject = await cartPage.getCartPriceDetailsObject()
        console.log({ cartPriceDetailsObject })

        // Verify shipping is free in price details using cart details object
        const estimatedShipping = cartPriceDetailsObject.getEstimatedShipping()
        console.log({ estimatedShipping })
        expect(estimatedShipping).toBe('Free')

        // Go to Checkout
        await cartPage.checkoutButton.click()

        await expect(checkoutPage.shippingTitleAnchor).toHaveText('Shipping')
        await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()

        // Enter contact info - continue - validate complete checkmark
        const email = testData_smokeCheckout_prod.email
        await checkoutPage.enterContactInfo(testData_smokeCheckout_prod.firstname, testData_smokeCheckout_prod.lastName, email, testData_smokeCheckout_prod.phoneNumber)

        // Enter Billing Shipping info - validate complete checkmark
        await checkoutPage.enterBillingShippingInfo(testData_smokeCheckout_prod.address, testData_smokeCheckout_prod.address2, testData_smokeCheckout_prod.zipCode)

        // Add credit card info
        await checkoutPage.enterCreditCardInfo(testData_smokeCheckout_prod.creditCardNumber, testData_smokeCheckout_prod.expiryDate, testData_smokeCheckout_prod.securityCode)

        // Place order
        await checkoutPage.placeOrderButton.click()

        // Validate order confirmation page and order number
        await page.waitForTimeout(20000); // waits for 20 seconds
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        const orderNumberFromConfirmationPageModified = orderNumberFromConfirmationPage.replace("Order# ", "").trim()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        console.log("orderNumberFromOrderConfModified: " + orderNumberFromConfirmationPageModified)

        //cancel the order
        //documentation - https://playwright.dev/docs/api-testing
        //currently this call does not work from a ui test; the below stand alone 1a test does successfully work
        const newIssue = await apiContext.put(`/api/v1/orders/${orderNumberFromConfirmationPageModified}/cancel`, {
            data: {
                "athleteOrderCancelRequest": {
                    "agent": "choitali.chakraborty@dcsg.com",
                    "cancelDate": timeStamp,
                    "cancelSource": "CallCenter",
                    "reason": "CANCEL_ATHLETE_REQUEST"
                },
                "orderNumber": orderNumberFromConfirmationPage,
                "wcsCancelRequest": {
                    "storeId": "15108"
                }
            }
        });
        // console.log(newIssue)
        expect(newIssue.ok()).toBeTruthy();
        /*
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click()

        await expect(homePage.searchField).toBeVisible()
        */

    });


    //use this order number from the above test to cancel the order
    test('1a: Smoke Checkout Prod - cancel order', async ({ request }) => {
        //replace the order number here
        const orderNumberFromConfirmationPage = '20130177825'

        //Cancel the order via API request
        const newIssue = await request.put(`https://customer-order.dcsg.com/api/v1/orders/${orderNumberFromConfirmationPage}/cancel`, {
            data: {
                "athleteOrderCancelRequest": {
                    "agent": "choitali.chakraborty@dcsg.com",
                    "cancelDate": timeStamp,
                    "cancelSource": "CallCenter",
                    "reason": "CANCEL_ATHLETE_REQUEST"
                },
                "orderNumber": orderNumberFromConfirmationPage,
                "wcsCancelRequest": {
                    "storeId": "15108"
                }
            }
        });
    
        // console.log(newIssue)
        expect(newIssue.ok()).toBeTruthy();
      });
});