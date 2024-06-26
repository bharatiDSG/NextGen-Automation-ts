import { test, expect, APIRequestContext } from '@playwright/test';
import { getBaseUrl } from '../../globalSetup.ts';
import { HomePage } from '../../page-objects/HomePage.ts'
import { CommonPage } from '../../page-objects/CommonPage.ts';
import { ProductListingPage } from '../../page-objects/ProductListingPage.ts';
import { ProductDisplayPage } from '../../page-objects/ProductDisplayPage.ts';
import { CartPage } from '../../page-objects/CartPage.ts';
import { CheckoutPage } from '../../page-objects/CheckoutPage.ts';
import { OrderConfirmationPage } from '../../page-objects/OrderConfirmationPage.ts';
import { AccountSignInPage } from '../../page-objects/AccountSignInPage.ts';
import { testData_e2e_np0_qa } from '../../test-data/e2eNP0QATestData.js';
import { testData_smokeCheckout_prod } from '../../test-data/smokeCheckoutProdTestData.js';


test.describe("Prod Checkout tests", () => {
    let apiContext: APIRequestContext;
    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({
          // All requests we send go to this API endpoint.
          baseURL: 'https://customer-order.dcsg.com'
        });
      });
    test.beforeEach(async ({ page }) => {
        
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());

    });
    test.afterAll(async ({ }) => {
        // Dispose all responses.
        await apiContext.dispose();
      });

    test('1. Verify different checkout options', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const PDP= new ProductDisplayPage(page)
        

        await test.step('Search with product SKU number',async() =>{
            await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
            await PDP.availableProductColor.first().click();
        });

        await test.step('Select ShipToMe fulfillment option',async() =>{
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async() =>{
            await cartPage.clickCheckoutButton();
        });
        
        await test.step('Verify the contact information is not pre populated', async() =>{
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async() =>{
        const email = testData_e2e_np0_qa.email
        await page.waitForLoadState("load");
        await checkoutPage.enterContactInfo(testData_smokeCheckout_prod.firstname, testData_smokeCheckout_prod.lastName, email, testData_smokeCheckout_prod.phoneNumber)
        });
        
        await test.step('Update Billing and Shipping address', async() =>{
        await checkoutPage.enterBillingShippingInfo(testData_smokeCheckout_prod.address, testData_smokeCheckout_prod.address2, testData_smokeCheckout_prod.zipCode)
        });
        // Add credit card info
        await test.step('verify paypal checkout', async()=>{
            await checkoutPage.selectAPaymentOption("Paypal");
            await checkoutPage.verifyPayPalCheckout();
        });

        await test.step('verify affirm checkout', async()=>{
            await checkoutPage.selectAPaymentOption("Affirm");
            await checkoutPage.verifyAffirmCheckout();
        });

        await test.step('verify afterPay checkout', async()=>{
            await checkoutPage.selectAPaymentOption("AfterPay");
            await checkoutPage.verifyAfterPayCheckout();
        });

        await test.step('Verify Gift Card', async() =>{
            await checkoutPage.verifyGiftCardFunctionality("6320181103465370","92641354"); 

        });
        await test.step('Verify Promo Code', async() =>{
            await checkoutPage.verifyPromoCodeFunctionality("CLICKADO1205D"); 

        });

        await test.step('Update payment details with Tiger Card', async() =>{
        await checkoutPage.selectAPaymentOption("Creditcard");
        await checkoutPage.enterCreditCardInfo(testData_smokeCheckout_prod.creditCardNumber, testData_smokeCheckout_prod.expiryDate, testData_smokeCheckout_prod.securityCode)
        });
        // // Place order
        await test.step('Place Order', async() =>{
        await checkoutPage.placeOrderButton.click()
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details and Cancel the order', async() =>{
        await page.waitForLoadState("load");
        await page.waitForTimeout(20000); // waits for 5 seconds
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        const orderNumberFromConfirmationPageModified = orderNumberFromConfirmationPage ? orderNumberFromConfirmationPage.replace("Order# ", "").trim() : null;
        console.log("orderNumberFromOrderConfModified: " + orderNumberFromConfirmationPageModified)

        //cancel the order
        //documentation - https://playwright.dev/docs/api-testing
        if (orderNumberFromConfirmationPageModified) {
        await orderConfirmationPage.apiProdCancelOrderSolePanel(orderNumberFromConfirmationPageModified, apiContext)
        }

        //verify orderConfirmationPage
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click()

        await expect(homePage.searchField).toBeVisible()
        });
    
    });

});