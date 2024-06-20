import { test, expect } from '@playwright/test';
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


test.describe("NP0 QA Smoke Checkout Tests", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");

        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

    });

    test('1. Smoke_CHECKOUT_001_VISA_Guest', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)
        

        await test.step('Search with product SKU number',async() =>{
        await homePage.searchForProduct("90799259"),
        await page.waitForLoadState("load");
        await commonPage.waitUntilPageLoads();
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        });

        await test.step('Set zip code and select Store',async() =>{
        await page.waitForLoadState("networkidle");
        await commonPage.handlePromotionalPopup();
        //const storeName = await productDisplayPage.setStoreFromPDP("15949","Robinson")
        });


        await test.step('Select ShipToMe fulfillment option',async() =>{
            await expect(productDisplayPage.shipToMeButton).toBeVisible()
            await productDisplayPage.shipToMeButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();

        });
        
        await test.step('Update the Quantity to 2', async() =>{
            await cartPage.updateQuantity("2");     
        });

        await test.step('Checkout ', async() =>{
            await cartPage.checkout();
        });
        
        await test.step('Verify the contact information is not pre populated', async() =>{
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async() =>{
        const email = testData_e2e_np0_qa.email
        await page.waitForLoadState("load");
        await checkoutPage.enterContactInfo(testData_e2e_np0_qa.firstname, testData_e2e_np0_qa.lastName, email, testData_e2e_np0_qa.phoneNumber)
        });
        // Enter Billing Shipping info - validate complete checkmark
        await test.step('Update Billing and Shipping address', async() =>{
        await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_qa.address, testData_e2e_np0_qa.address2, testData_e2e_np0_qa.zipCode)
        });
        // Add credit card info
        await test.step('Update payment details with Tiger Card', async() =>{
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_qa.accountNumberTiger, testData_e2e_np0_qa.expDateTiger, testData_e2e_np0_qa.CVVTiger)
        });
        // // Place order
        await test.step('Place Order', async() =>{
        await checkoutPage.placeOrderButton.click()
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details', async() =>{
        await page.waitForLoadState("load");
        await page.waitForLoadState("networkidle");
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        });
    
    });

    test('2. Smoke_CHECKOUT_002_Different_CheckOut_Options', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)
        

        await test.step('Search with product SKU number',async() =>{
        await homePage.searchForProduct("90309583"),
        await page.waitForLoadState("load");
        await commonPage.waitUntilPageLoads();
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        });

        await test.step('Set zip code and select Store',async() =>{
        await page.waitForLoadState("networkidle");
        await commonPage.handlePromotionalPopup();
        //const storeName = await productDisplayPage.setStoreFromPDP("15949","Robinson")
        });


        await test.step('Select ShipToMe fulfillment option',async() =>{
            await expect(productDisplayPage.shipToMeButton).toBeVisible()
            await productDisplayPage.shipToMeButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();

        });
        
        await test.step('Verify checkout Options', async() =>{
            await cartPage.verifyCheckoutOptions();
        });

        await test.step('Verify paypal checkout ', async() =>{
            await cartPage.verifyPayPalCheckout();
        });
        
        await test.step('Checkout ', async() =>{
            await cartPage.checkout();
        });

        await test.step('Provide contact details', async() =>{
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo(testData_e2e_np0_qa.firstname, testData_e2e_np0_qa.lastName, email, testData_e2e_np0_qa.phoneNumber)
            });
            
        await test.step('Update Billing and Shipping address', async() =>{
            await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_qa.address, testData_e2e_np0_qa.address2, testData_e2e_np0_qa.zipCode)
            });
        
        await test.step('Verify Gift Card', async() =>{
            await checkoutPage.verifyGiftCardFunctionality("1234 5678 1234 5678","0000"); 

        });
        await test.step('Verify Promo Code', async() =>{
            await checkoutPage.verifyPromoCodeFunctionality("5DOLLARSOFFSHIPPING"); 

        });
    
    });

    test('3. Smoke_CHECKOUT_003_Mastercard_Registered', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        

        await test.step('Search with product SKU number',async() =>{
        await homePage.searchForProduct("90799259"),
        await page.waitForLoadState("load");
        await commonPage.waitUntilPageLoads();
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        });


        await test.step('Select ShipToMe fulfillment option',async() =>{
            await commonPage.handlePromotionalPopup();
            await expect(productDisplayPage.shipToMeButton).toBeVisible()
            await productDisplayPage.shipToMeButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();

        });
        

        await test.step('Checkout ', async() =>{
            await cartPage.checkout();
        });

        await test.step('Sign in a Registered User ', async() =>{
            await checkoutPage.signInAsRegisteredUser(testData_e2e_np0_qa.registeredUser,testData_e2e_np0_qa.registeredUserPassword);
        });
        
        /* await test.step('Verify the contact information is not pre populated', async() =>{
            await commonPage.waitUntilPageLoads();
            await checkoutPage.verifyContactInfoIsNotEmpty();
        }); */

        await test.step('Continue with Contact information', async() =>{
        const email = testData_e2e_np0_qa.email
        await commonPage.waitUntilPageLoads();
        await checkoutPage.continueWithContactInformation();
        });
        // Enter Billing Shipping info - validate complete checkmark
        await test.step('Update Billing and Shipping address', async() =>{
        await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_qa.address, testData_e2e_np0_qa.address2, testData_e2e_np0_qa.zipCode)
        });
        // Add credit card info
        await test.step('Update payment details with Tiger Card', async() =>{
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_qa.accountNumberMaster, testData_e2e_np0_qa.expDateMaster, testData_e2e_np0_qa.CVVMaster)
        });
        // // Place order
        await test.step('Place Order', async() =>{
        await checkoutPage.placeOrderButton.click()
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details', async() =>{
        await page.waitForLoadState("load");
        await page.waitForLoadState("networkidle");
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        });
    
    });

    test('4. Smoke_CHECKOUT_004_Mixed_Tender_Guest', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)
        

        await test.step('Search with product SKU number',async() =>{
        await homePage.searchForProduct("90799259"),
        await page.waitForLoadState("load");
        await commonPage.waitUntilPageLoads();
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        });

        await test.step('Set zip code and select Store',async() =>{
        await page.waitForLoadState("networkidle");
        await commonPage.handlePromotionalPopup();
        //const storeName = await productDisplayPage.setStoreFromPDP("15949","Robinson")
        });


        await test.step('Select ShipToMe fulfillment option',async() =>{
            await expect(productDisplayPage.shipToMeButton).toBeVisible()
            await productDisplayPage.shipToMeButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();

        });
        
        await test.step('Update the Quantity to 2', async() =>{
            await cartPage.updateQuantity("2");     
        });

        await test.step('Checkout ', async() =>{
            await cartPage.checkout();
        });
        
        await test.step('Verify the contact information is not pre populated', async() =>{
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async() =>{
        const email = testData_e2e_np0_qa.email
        await page.waitForLoadState("load");
        await checkoutPage.enterContactInfo(testData_e2e_np0_qa.firstname, testData_e2e_np0_qa.lastName, email, testData_e2e_np0_qa.phoneNumber)
        });
        // Enter Billing Shipping info - validate complete checkmark
        await test.step('Update Billing and Shipping address', async() =>{
        await checkoutPage.enterBillingShippingInfo(testData_e2e_np0_qa.address, testData_e2e_np0_qa.address2, testData_e2e_np0_qa.zipCode)
        });

        await test.step('Add Gift card', async() =>{
            await checkoutPage.verifyGiftCardFunctionality("6149 1320 0738 8456","19369593"); 
            });
        // Add credit card info
        await test.step('Update payment details with Tiger Card', async() =>{
        await checkoutPage.enterCreditCardInfo(testData_e2e_np0_qa.accountNumberTiger, testData_e2e_np0_qa.expDateTiger, testData_e2e_np0_qa.CVVTiger)
        });
        // // Place order
        await test.step('Place Order', async() =>{
        await checkoutPage.placeOrderButton.click()
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details', async() =>{
        await page.waitForLoadState("load");
        await page.waitForLoadState("networkidle");
        await expect(orderConfirmationPage.orderNumberText).toBeVisible()
        const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent()
        console.log("orderNumberFromOrderConf: " + orderNumberFromConfirmationPage)
        await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible()
        });
    
    });

    test('5. Smoke_CHECKOUT_005_Paypal Checkout', async ({ page }, testInfo) => {
        
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const commonPage = new CommonPage(page)
        
        

        await test.step('Search with product SKU number',async() =>{
        await homePage.searchForProduct("90309583"),
        await page.waitForLoadState("load");
        await commonPage.waitUntilPageLoads();
        await expect(productDisplayPage.addToCartButton).toBeVisible()
        });

        await test.step('Set zip code and select Store',async() =>{
        await page.waitForLoadState("networkidle");
        await commonPage.handlePromotionalPopup();
        //const storeName = await productDisplayPage.setStoreFromPDP("15949","Robinson")
        });


        await test.step('Select ShipToMe fulfillment option',async() =>{
            await expect(productDisplayPage.shipToMeButton).toBeVisible()
            await productDisplayPage.shipToMeButton.click();
        });
        
        await test.step('Add to Cart and Go to Cart', async() =>{
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();

        });
        
        await test.step('Update the Quantity to 2', async() =>{
            await cartPage.updateQuantity("2");     
        });

        await test.step('Verify paypal checkout ', async() =>{
            await cartPage.verifyPayPalCheckout();
         });
        
    
    });

 

});