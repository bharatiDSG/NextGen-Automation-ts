import { expect, test } from '@playwright/test';

import { CartPage } from '../../page-objects/CartPage';
import { CheckoutPage } from '../../page-objects/CheckoutPage';
import { CommonPage } from '../../page-objects/CommonPage';
import { HomePage } from '../../page-objects/HomePage';
import { OrderConfirmationPage } from '../../page-objects/OrderConfirmationPage';
import { ProductDisplayPage } from '../../page-objects/ProductDisplayPage';
import { ProductListingPage } from '../../page-objects/ProductListingPage';
import { getBaseUrl } from '../../globalSetup';
import { testData_e2e_np0_prod } from '../../test-data/e2eNP0ProdTestData';

test.describe("E2E NP0 Prod", () => {

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

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await test.step('Navigate to homepage',async()=>{
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");
    });
        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()
    });

    test.skip('1: BOPIS - Guest - CC', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const commonPage = new CommonPage(page)
        let storeName: string;
        let cartPriceDetailsObject: any;


        // Search for product
        await test.step('Search for a product',async()=>{
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm1)
    });
        // Set store
        await test.step('Set store',async()=>{
        storeName = await productListingPage.setStoreFromPLP(testData_e2e_np0_prod.storeSearch)
    });
        // Choose pickup filter
        await test.step('Choose pickup filter',async()=>{
        await productListingPage.pickupFilterButtonReact.click();
    });
        // Select a product
        await test.step('Select a product',async()=>{
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch1)
    });
        // Verify store pickup is enabled
        await test.step('Verify store pickup is enabled',async()=>{
        await productDisplayPage.storePickupEnabledButton.click();
    });
        // Verify correct store and add to cart
        await test.step('Verify correct store and add to cart',async()=>{
        await expect(productDisplayPage.storePickupSubText.filter({ hasText: storeName })).toBeVisible()
        await productDisplayPage.addToCartButtonRewrite.click();
    });
        // Click Go to Cart
        await test.step('Click Go to Cart',async()=>{
        await productDisplayPage.goToCartButton.click();
        await commonPage.sleep(2)
    });
        // Validate store pickup is free in cart
        await test.step('Validate store pickup is free in cart',async()=>{
        await expect(cartPage.freeStorePickupRadioButtonText).toBeVisible()
    });
        // Get Cart Price Details Object
        await test.step('Get Cart price details Object',async()=>{
        cartPriceDetailsObject = await cartPage.getCartPriceDetailsObject()
        console.log({ cartPriceDetailsObject })
    });
        // Verify store pickup is free in price details using cart details object
        await test.step('Verify Store pick up is free in price details using cart details object',async()=>{
        const storePickup = cartPriceDetailsObject.getStorePickup()
        console.log({ storePickup })
        expect(storePickup).toBe('Free')
    });
        // Go to Checkout
        await test.step('Go to Checkout',async()=>{
        await cartPage.checkoutButton.click()

        await expect(checkoutPage.shippingTitle).toHaveText('Free Store Pickup')
        await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()
    });
        // Enter contact info - continue - validate complete checkmark
        await test.step('Enter contact info - Continue - Validate Complete checkmark',async()=>{
        const email = testData_e2e_np0_prod.email
        await checkoutPage.enterContactInfo(testData_e2e_np0_prod.firstname, testData_e2e_np0_prod.lastName, email, testData_e2e_np0_prod.phoneNumber)
    });
        // Enter Billing Shipping info - validate complete checkmark
        await test.step('Enter billing shipping info - Validate complete checkmark',async()=>{
        await checkoutPage.enterBillingShippingInfo("", "", testData_e2e_np0_prod.address, testData_e2e_np0_prod.address2, testData_e2e_np0_prod.zipCode)
    });
        // Add credit card info
        await test.step('Add credit card info',async()=>{
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_prod.creditCardNumber, testData_e2e_np0_prod.expiryDate, testData_e2e_np0_prod.securityCode)
    });
        // Place order
        await test.step('Place order',async()=>{
        await checkoutPage.placeOrderButton.click()
    });
        // Validate order confirmation page and order number
        await test.step('Validate Order confirmation page and order number',async()=>{
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click();

        await expect(homePage.searchField).toBeVisible()
    });
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
        // const commonPage = new CommonPage(page)

        // Search for product
        await test.step('Search for product',async()=>{
        await homePage.searchForProduct(testData_e2e_np0_prod.searchTerm1)
    });
        // Set store
        //  Set store is changing in np0_prod env - commenting this for now
        // await test.step('Set store',async()=>{
        // await productListingPage.setStoreFromPLP(testData_e2e_np0_prod.storeSearch)
    // });

        // Select a product
        await test.step('Select a product',async()=>{
        await productListingPage.selectMatchingProduct(testData_e2e_np0_prod.productMatch1)
    });
        // Click add to cart
        await test.step('Click add to cart',async()=>{
        await page.waitForLoadState('networkidle')
        await productDisplayPage.availableProductColorRewrite.first().click()
        await page.waitForLoadState('networkidle')
       // await page.locator('class=pdp-color-swatch-selected').first().click()
        await productDisplayPage.addToCartButtonRewrite.scrollIntoViewIfNeeded()
        await expect(productDisplayPage.addToCartButtonRewrite).toBeVisible()
        await productDisplayPage.addToCartButtonRewrite.click();
    });
        // Click Go to Cart
        await test.step('Click Go To Cart',async()=>{
        await productDisplayPage.goToCartButton.click();
        await page.waitForLoadState('networkidle')
    });
        // Validate Cart and free shipping
        await test.step('Validate Cart and free shipping',async()=>{
        const estimatedShipping = await cartPage.getEstimatedShipping()
        console.log({ estimatedShipping })
        expect(estimatedShipping).toBe('Free')
    });
        // Go to Checkout
        await test.step('Go to Checkout',async()=>{
        await cartPage.checkoutButton.click()

        await expect(checkoutPage.shippingTitleAnchor).toHaveText('Shipping')
        await expect(checkoutPage.shippingHeader).toBeVisible()
        await expect(checkoutPage.shippingCompletedCheckMark).toBeVisible()
    });
        // Enter contact info - continue - validate complete checkmark
        await test.step('Enter contact info - Continue - Validate complete checkmark',async()=>{
        const email = testData_e2e_np0_prod.email
        await checkoutPage.enterContactInfo(testData_e2e_np0_prod.firstname, testData_e2e_np0_prod.lastName, email, testData_e2e_np0_prod.phoneNumber)
    });
        // Enter Billing Shipping info - validate complete checkmark
        await test.step('Enter Billing Shipping info',async()=>{
        await checkoutPage.enterBillingShippingInfo("", "", testData_e2e_np0_prod.address, testData_e2e_np0_prod.address2, testData_e2e_np0_prod.zipCode)
    });
        // Add credit card info
        await test.step('Add Credit card info',async()=>{
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_prod.creditCardNumber, testData_e2e_np0_prod.expiryDate, testData_e2e_np0_prod.securityCode)
    });
        // Place order
        await test.step('Place Order',async()=>{
        await checkoutPage.placeOrderButton.click()
    });
        // Validate order confirmation page and order number
        await test.step('Validate Order confirmation page and order number',async()=>{
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)

        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        await orderConfirmationPage.continueShoppingLink.click();

        await expect(homePage.searchField).toBeVisible()
    });
        // // bonus: validate email
        // await commonPage.sleep(10)
        // const emailServerId = testData_e2e_np0_prod.mailosaurServerID
        // const orderNumberFromEmail = await accountSignInPage.validateOrderConfirmationEmail(emailServerId, email)
        // expect(orderNumberFromConfirmationPage).toContain(orderNumberFromEmail);

        console.log('')
    });
});
