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
import { testData_Prod_Checkout } from '../../test-data/ProdCheckoutTestData.js';


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
        const PDP = new ProductDisplayPage(page)


        await test.step('Search with product SKU number', async () => {
            await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
            await PDP.availableProductColor.first().click();
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo(testData_smokeCheckout_prod.firstname, testData_smokeCheckout_prod.lastName, email, testData_smokeCheckout_prod.phoneNumber)
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester",testData_smokeCheckout_prod.address, testData_smokeCheckout_prod.address2, testData_smokeCheckout_prod.zipCode)
        });
        // Add credit card info
        await test.step('verify paypal checkout', async () => {
            await checkoutPage.selectAPaymentOption("Paypal");
            await checkoutPage.verifyPayPalCheckout();
        });

        await test.step('verify affirm checkout', async () => {
            await checkoutPage.selectAPaymentOption("Affirm");
            await checkoutPage.verifyAffirmCheckout();
        });

        await test.step('verify afterPay checkout', async () => {
            await checkoutPage.selectAPaymentOption("AfterPay");
            await checkoutPage.verifyAfterPayCheckout();
        });

        await test.step('Verify Gift Card', async () => {
            await checkoutPage.verifyGiftCardFunctionality("6320181103465370", "92641354");

        });
        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyPromoCodeFunctionality("CLICKADO1205D");

        });

        await test.step('Update payment details with Tiger Card', async () => {
            await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo(testData_smokeCheckout_prod.creditCardNumber, testData_smokeCheckout_prod.expiryDate, testData_smokeCheckout_prod.securityCode)
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click()
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details and Cancel the order', async () => {
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

    test('2. Tax Soft Lines', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Nike Socks" keyword in the search box', async () => {
            await homePage.searchForProduct("Nike socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","770 Pacific coast Hwy", "", "90245")
        });

        await test.step('validate that est tax is equal to ".095" multiplied by the order total', async () => {
            await page.waitForLoadState("load")
            await checkoutPage.verifyEstimatedTax(.095)
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.clickEditBillingShippingInfo();
            await page.waitForLoadState("load")
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('validate that est tax is equal to ".000" multiplied by the order total', async () => {
            await checkoutPage.verifyEstimatedTax(.000)
        });


    });

    test('3. Tax Hard Lines', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Kids bike" keyword in the search box', async () => {
            await homePage.searchForProduct("kids bike")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","770 Pacific coast Hwy", "", "90245")
        });

        await test.step('validate that est tax is equal to ".095" multiplied by the order total', async () => {
            await page.waitForLoadState("load")
            await checkoutPage.verifyEstimatedTax(.095)
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.clickEditBillingShippingInfo();
            await page.waitForLoadState("load")
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('validate that est tax is equal to ".000" multiplied by the order total', async () => {
            await checkoutPage.verifyEstimatedTax(.07)
        });


    });

    test('4. Oversized validation', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step("When we search for Goalrilla 60'' In-Ground Basketball Hoop keyword in the search box", async () => {
            await homePage.searchForProduct("Goalrilla 60'' In-Ground Basketball Hoop")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Shipping is not null', async()=>{
            let shipping=await checkoutPage.getEstimatedShipping();
            expect(shipping).not.toBeNull();
        });

        await test.step('Click on Large item shipping details', async()=>{
            await checkoutPage.clickLargeItemShippingDetailsLink();
        });

        await test.step('we should see large item shipping details', async()=>{
            await checkoutPage.verifyLargeItemShippingDetails("Large Item Shipping Methods")
        });

    });


    test('5. Payment Form Validations CC Number', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo("4111111111111112", "12/24", "299")
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click()
            await page.waitForLoadState("load");
        });
        await test.step('Validate credit card validation message', async () => {
            await checkoutPage.placeOrderButton.click()
            await checkoutPage.validateErrorMessage("Please enter your card number.")
        });
      


    });

    test('6. Payment Form Validations Exp Date', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo("4111111111111111", "01/21", "299")
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click()
            await page.waitForLoadState("load");
        });
        await test.step('Validate credit card validation message', async () => {
            await checkoutPage.placeOrderButton.click()
            await checkoutPage.validateErrorMessage("Enter a valid expiration.")
        });
      


    });

    test('7. Payment Form Validations CVV', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflasks" keyword in the search box', async () => {
            await homePage.searchForProduct("hydroflasks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo("4250973567565756", "01/25", "33")
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click()
            await page.waitForLoadState("load");
        });
        await test.step('Validate credit card validation message', async () => {
            await checkoutPage.placeOrderButton.click()
            await checkoutPage.validateErrorMessage("Enter a valid CVV")
        });
      


    });

    test('8. Payments Invalid Promo', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyInvalidPromoCodeFunctionality("DSGINVALIDPROMO2021");

        });
      


    });

    test('9. Apply GiftCard and Remove it', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct("hydroflask")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Verify Gift Card and remove it', async () => {
            await checkoutPage.verifyGiftCardFunctionality("6320181103465370", "92641354");

        });

    });

    test('10. Payments Paypal', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct("hydroflask")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('verify paypal checkout', async () => {
            await checkoutPage.selectAPaymentOption("Paypal");
            await checkoutPage.verifyPayPalCheckout();
        });

    });

    test('11. Payments Invalid GC', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct("nike dri-fit headband")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Verify Invalid Gift Card', async () => {
            await checkoutPage.verifyInvalidGiftCardFunctionality("6168432776392640", "07208810");

        });
        
        await test.step('Verify Invalid Gift Card', async () => {
            await checkoutPage.verifyInvalidGiftCardFunctionality("6168432436407186", "00021229");

        });
        
    });

    test('12. Payments No Reward', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct("nike dri-fit headband")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateQuantity(2);

        });

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateProductQuantity(1,"3");

        });
        
        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyInvalidPromoCodeWithErrorMessageFunctionality("RWDN2M7G3R2","You must Sign In to apply your ScoreCard rewards.");

        });

    });

    test('13. Different Shipping and Billing address, Invalid Billing address for Guest', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingWithInValidInfo("345 Court St", "", "90005","The address provided could not be verified. Please review.")
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

    });

    test('14. Different Shipping and Billing address, Invalid Shipping address for Guest', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Update Shipping address with invalid details', async () => {
            await checkoutPage.enterShippingWithInvalidInfo("test","tester","202 Eastview Mall", "", "30005","The address provided could not be verified. Please review.")
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo("Test","Tester","345 Court St", "", "15108")
        });

    });

    test('15. Same Shipping and Billing address, Invalid details for Guest', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingWithInValidInfo("202 Eastview Mall", "", "30005","The address provided could not be verified. Please review.")
        });

    });

    test('16. Same Shipping and Billing address, Invalid details for Registered User', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user',async()=>{
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingWithInValidInfo("202 Eastview Mall", "", "30005","The address provided could not be verified. Please review.")
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart()
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('17. Different Shipping and Billing address, valid details for Registered User', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct("hydroflask")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user',async()=>{
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo("test","tester","202 Eastview Mall", "", "14564")
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo("test","tester","202 Eastview Mall", "", "14564")
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart()
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('18. Different Shipping and Billing address, Invalid Billing details for Registered User', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user',async()=>{
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingWithInValidInfo("1 Court St", "", "15108","The address provided could not be verified. Please review.")
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court St", "", "15108")
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart()
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('19. Different Shipping and Billing address, Invalid shipping details for Registered User', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct("hydroflask")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user',async()=>{
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState("load");
            await checkoutPage.enterContactInfo("test", "tester", "automation@dcsg.com", "7242733400")
        });
       
        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo("test","tester","345 Court Street", "", "15108")
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingWithInvalidInfo("test","tester","9999 Eastview Mall", "", "14564","The address provided could not be verified. Please review.")
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart()
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('20. Change parcel delivery options', async ({ page }, testInfo) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct("calia socks")
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        })
        await test.step('select attributes', async () => {
            await page.waitForLoadState("load");
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState("load");
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible()
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState("load");
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Change the shipping to Expedited Delivery', async () => {
            
            await checkoutPage.changeShippingMethodAndVerifyShippingCharges("Expedited","14.99");
        });

        await test.step('Change the shipping to Express Delivery', async () => {
            
            await checkoutPage.changeShippingMethodAndVerifyShippingCharges("Express","24.99");
        });


    });

});