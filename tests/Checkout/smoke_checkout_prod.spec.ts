import { APIRequestContext, expect, test } from '@playwright/test';

import { CartPage } from '../../page-objects/CartPage.ts';
import { CheckoutPage } from '../../page-objects/CheckoutPage.ts';
import { HomePage } from '../../page-objects/HomePage.ts';
import { OrderConfirmationPage } from '../../page-objects/OrderConfirmationPage.ts';
import { ProductDisplayPage } from '../../page-objects/ProductDisplayPage.ts';
import { getBaseUrl } from '../../globalSetup.ts';
import { testData_smokeCheckout_prod } from '../../test-data/smokeCheckoutProdTestData.js';

test.describe("DSG Prod Smoke Checkout Tests", () => {
  // Request context is reused by all tests in the file.
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      // All requests we send go to this API endpoint.
      baseURL: 'https://customer-order.dcsg.com'
    });
  });

  test.beforeEach(async ({ page, context }) => {

    // grant permission for location
    await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
    console.log("geolocation granted for: " + getBaseUrl())

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
    let cartPriceDetailsObject;
    let orderNumberFromConfirmationPageModified;

    // Go to baseUrl set in .env or defaults to dsg_prod
    await test.step('Go to baseUrl set in .env or defaults to dsg_prod', async() =>{
    await homePage.goToHomePage(getBaseUrl());
    console.log("URL: " + getBaseUrl());
    });

    // Search for product
    await test.step('Search for product',async()=>{
    await homePage.searchForProduct(testData_smokeCheckout_prod.searchTerm1)
    });

    //Click ship to me fulfillment option
    await test.step('Click ship to me fulfillment option',async()=>{
    await productDisplayPage.shipToMeButton.click();
  });

    //Select attributes
    await test.step('Select Attributes',async()=>{
    await productDisplayPage.flexAttribute.click();
    await productDisplayPage.handAttribute.click();
    await productDisplayPage.shaftAttribute.click();
    await productDisplayPage.loftAttribute.click();
  });

    //add to cart
    await test.step('Add to Cart',async()=>{
    await productDisplayPage.addToCartButton.click();
  });

    // Click Go to Cart
    await test.step('Click Go to Cart',async()=>{
    await productDisplayPage.goToCartButton.click();
  });

    // Get Cart Price Details Object
    await test.step('Get Cart Price Details Object',async()=>{
    cartPriceDetailsObject = await cartPage.getCartPriceDetailsObject()
    console.log({ cartPriceDetailsObject })
  });

    // Verify shipping is free in price details using cart details object
    await test.step('Verify Shipping is free in price details using cart details object',async()=>{
    const estimatedShipping = cartPriceDetailsObject.getEstimatedShipping()
    console.log({ estimatedShipping })
    expect(estimatedShipping).toBe('Free')
  });

    // Go to Checkout
    await test.step('Go to checkout',async()=>{
    await cartPage.checkoutButton.click()
  

    await expect(checkoutPage.shippingTitleAnchor).toHaveText('Shipping')
    await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()
  });
    // Enter contact info - continue - validate complete checkmark
    await test.step('Enter contact info and Continue',async()=>{
    const email = testData_smokeCheckout_prod.email
    await checkoutPage.enterContactInfo(testData_smokeCheckout_prod.firstname, testData_smokeCheckout_prod.lastName, email, testData_smokeCheckout_prod.phoneNumber)
  });
    // Enter Billing Shipping info - validate complete checkmark
    await test.step('Enter Billing Shipping info and Validate Complete checkmark',async()=>{
    await checkoutPage.enterBillingShippingInfo("", "", testData_smokeCheckout_prod.address, testData_smokeCheckout_prod.address2, testData_smokeCheckout_prod.zipCode)
  });
    // Add credit card info
    await test.step('Add Credit card info',async()=>{
    await checkoutPage.enterCreditCardInfo(testData_smokeCheckout_prod.creditCardNumber, testData_smokeCheckout_prod.expiryDate, testData_smokeCheckout_prod.securityCode)
  });
    // Place order
    await test.step('Place Order',async()=>{
    await checkoutPage.placeOrderButton.click()
  });
    // Validate order confirmation page and order number
    await test.step('Validate order confirmation page and order number',async()=>{
    await page.waitForTimeout(20000); // waits for 20 seconds
    await expect(orderConfirmationPage.orderNumberText).toBeVisible()
    const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
    orderNumberFromConfirmationPageModified = orderNumberFromConfirmationPage ? orderNumberFromConfirmationPage.replace("Order# ", "").trim() : null;
    // console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
    console.log("orderNumberFromOrderConfModified: " + orderNumberFromConfirmationPageModified)
  });
    //cancel the order
    await test.step('Cancel the order',async()=>{
    //documentation - https://playwright.dev/docs/api-testing
    if (orderNumberFromConfirmationPageModified) {
      await orderConfirmationPage.apiProdCancelOrderSolePanel(orderNumberFromConfirmationPageModified, apiContext)
    }
  });
    //verify orderConfirmationPage
    await test.step('Verify OrderConfirmation Page',async()=>{
    await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
    await orderConfirmationPage.continueShoppingLink.click()

    await expect(homePage.searchField).toBeVisible()
  });
  });
});