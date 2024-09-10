import { test, expect, APIRequestContext } from '@playwright/test';
import { getBaseUrl } from '../../globalSetup.ts';
import { HomePage } from '../../page-objects/HomePage.ts';

import { ProductListingPage } from '../../page-objects/ProductListingPage.ts';
import { ProductDisplayPage } from '../../page-objects/ProductDisplayPage.ts';
import { CartPage } from '../../page-objects/CartPage.ts';
import { CheckoutPage } from '../../page-objects/CheckoutPage.ts';
import { OrderConfirmationPage } from '../../page-objects/OrderConfirmationPage.ts';
import { AccountSignInPage } from '../../page-objects/AccountSignInPage.ts';
import { testData_e2e_np0_qa } from '../../test-data/e2eNP0QATestData.ts';
import { testData_smokeCheckout_prod } from '../../test-data/smokeCheckoutProdTestData.js';
import { testData_Prod_Checkout } from '../../test-data/ProdCheckoutTestData.ts';


test.describe('Prod Checkout tests', () => {
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
        if (getBaseUrl().includes('preview')) {
            await homePage.goToHomePage(getBaseUrl() + 'homr?TagForceLane=62');
        } else {
            await homePage.goToHomePage(getBaseUrl() + '?TagForceLane=62');
        }


        console.log('URL: ' + getBaseUrl());

    });
    test.afterAll(async ({ }) => {
        // Dispose all responses.
        await apiContext.dispose();
    });

    test('1. Verify different checkout options', async ({ page }) => {

        const homePage = new HomePage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const productListingPage = new ProductListingPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const orderConfirmationPage = new OrderConfirmationPage(page);


        await test.step('When we search for "nike shoes" keyword in the search box', async () => {
            await homePage.searchForProduct('nike shoes');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            const email = testData_e2e_np0_qa.email;
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo(testData_smokeCheckout_prod.firstname, testData_smokeCheckout_prod.lastName, email, testData_smokeCheckout_prod.phoneNumber);
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', testData_smokeCheckout_prod.address, testData_smokeCheckout_prod.address2, testData_smokeCheckout_prod.zipCode);
        });
        // Add credit card info
        await test.step('verify paypal checkout', async () => {
            await checkoutPage.selectAPaymentOption('Paypal');
            await checkoutPage.verifyPayPalCheckout();
        });

        await test.step('verify affirm checkout', async () => {
            await checkoutPage.selectAPaymentOption('Affirm');
            await checkoutPage.verifyAffirmCheckout();
        });

        await test.step('verify afterPay checkout', async () => {
            await checkoutPage.selectAPaymentOption('AfterPay');
            await checkoutPage.verifyAfterPayCheckout();
        });

        await test.step('Verify Gift Card', async () => {
            await checkoutPage.verifyGiftCardFunctionality('6320181103465370', '92641354');

        });
        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyPromoCodeFunctionality('DSGSMSWELXK9NPCHDTND4');

        });

        await test.step('Update payment details with Tiger Card', async () => {
            await checkoutPage.selectAPaymentOption('Creditcard');
            await checkoutPage.enterCreditCardInfo(testData_smokeCheckout_prod.creditCardNumber, testData_smokeCheckout_prod.expiryDate, testData_smokeCheckout_prod.securityCode);
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click();
        });

        // Validate order confirmation page and order number
        await test.step('Validate Order details and Cancel the order', async () => {
            await page.waitForLoadState('load');
            //Need to wait so that order reaches down stream system, so that we can cancel it
            await page.waitForTimeout(20000); // eslint-disable-line
            await expect(orderConfirmationPage.orderNumberText).toBeVisible();
            const orderNumberFromConfirmationPage = await orderConfirmationPage.orderNumberText.textContent();
            const orderNumberFromConfirmationPageModified = orderNumberFromConfirmationPage ? orderNumberFromConfirmationPage.replace('Order# ', '').trim() : null;
            console.log('orderNumberFromOrderConfModified: ' + orderNumberFromConfirmationPageModified);

            //cancel the order
            //documentation - https://playwright.dev/docs/api-testing
            if (getBaseUrl().includes('preview') || getBaseUrl().includes('delta')) {
                console.log('Ignoring the Cancel order');
            } else {
                if (orderNumberFromConfirmationPageModified) {
                    await orderConfirmationPage.apiProdCancelOrderSolePanel(orderNumberFromConfirmationPageModified, apiContext);
                }
            }

            //verify orderConfirmationPage
            await expect(orderConfirmationPage.thankYouForYourOrderHeader).toBeVisible();
            //await orderConfirmationPage.continueShoppingLink.click();

            //await expect(homePage.searchField).toBeVisible();
        });

    });

    test('2. Tax Soft Lines', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Nike Socks" keyword in the search box', async () => {
            await homePage.searchForProduct('Nike socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '770 Pacific coast Hwy', '', '90245');
        });

        await test.step('validate that est tax is equal to ".095" multiplied by the order total', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyEstimatedTax(.095);
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.clickEditBillingShippingInfo();
            await page.waitForLoadState('load');
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('validate that est tax is equal to ".000" multiplied by the order total', async () => {
            await checkoutPage.verifyEstimatedTax(.000);
        });


    });

    test('3. Tax Hard Lines', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Kids bike" keyword in the search box', async () => {
            await homePage.searchForProduct('kids bike');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '770 Pacific coast Hwy', '', '90245');
        });

        await test.step('validate that est tax is equal to ".095" multiplied by the order total', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyEstimatedTax(.095);
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.clickEditBillingShippingInfo();
            await page.waitForLoadState('load');
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('validate that est tax is equal to ".000" multiplied by the order total', async () => {
            await checkoutPage.verifyEstimatedTax(.07);
        });


    });

    test('4. Oversized validation', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step("When we search for Goalrilla 60'' In-Ground Basketball Hoop keyword in the search box", async () => {
            await homePage.searchForProduct("Goalrilla 60'' In-Ground Basketball Hoop");
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });


        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Shipping is not null', async () => {
            const shipping = await checkoutPage.getEstimatedShipping();
            expect(shipping).not.toBeNull();
        });

        await test.step('Click on Large item shipping details', async () => {
            await checkoutPage.clickLargeItemShippingDetailsLink();
        });

        await test.step('we should see large item shipping details', async () => {
            await checkoutPage.verifyLargeItemShippingDetails('Large Item Shipping Methods');
        });

    });


    test('5. Payment Form Validations CC Number', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo('4111111111111112', '12/24', '299');
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click();
            await page.waitForLoadState('load');
        });
        await test.step('Validate credit card validation message', async () => {
            await checkoutPage.placeOrderButton.click();
            await checkoutPage.validateErrorMessage('Please enter your card number.');
        });



    });

    test('6. Payment Form Validations Exp Date', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo('4111111111111111', '01/21', '299');
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click();
            await page.waitForLoadState('load');
        });
        await test.step('Validate credit card validation message', async () => {
            await checkoutPage.placeOrderButton.click();
            await checkoutPage.validateErrorMessage('Enter a valid expiration.');
        });



    });

    test('7. Payment Form Validations CVV', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflasks" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflasks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update payment details with Invalid Details', async () => {
            //await checkoutPage.selectAPaymentOption("Creditcard");
            await checkoutPage.enterCreditCardInfo('4250973567565756', '01/25', '33');
        });
        // // Place order
        await test.step('Place Order', async () => {
            await checkoutPage.placeOrderButton.click();
            await page.waitForLoadState('networkidle');
        });
        await test.step('Validate credit card validation message', async () => {
            //await checkoutPage.placeOrderButton.click()
            await checkoutPage.validateErrorMessage('Enter a valid CVV');
        });



    });

    test('8. Payments Invalid Promo', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyInvalidPromoCodeFunctionality('DSGINVALIDPROMO2021');

        });



    });

    test('9. Apply GiftCard and Remove it', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify Gift Card and remove it', async () => {
            await checkoutPage.verifyGiftCardFunctionality('6320181103465370', '92641354');

        });

    });

    test('10. Payments Paypal', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('verify paypal checkout', async () => {
            await checkoutPage.selectAPaymentOption('Paypal');
            await checkoutPage.verifyPayPalCheckout();
        });

    });

    test('11. Payments Invalid GC', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify Invalid Gift Card', async () => {
            await checkoutPage.verifyInvalidGiftCardFunctionality('6168432776392640', '07208810');

        });

        await test.step('Verify Invalid Gift Card', async () => {
            await checkoutPage.verifyInvalidGiftCardFunctionality('6168432436407186', '00021229');

        });

    });

    test('12. Payments No Reward', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateQuantity(2);

        });

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateProductQuantity(1, '3');

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyInvalidPromoCodeWithErrorMessageFunctionality('RWDN2M7G3R2', 'You must Sign In to apply your ScoreCard rewards.');

        });

    });

    test('13. Different Shipping and Billing address, Invalid Billing address for Guest', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {

            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingWithInValidInfo('test', 'tester', '345 Court St Coraopolis', '', '90005', 'The address provided could not be verified. Please review.');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

    });

    test('14. Different Shipping and Billing address, Invalid Shipping address for Guest', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {

            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update Shipping address with invalid details', async () => {
            await checkoutPage.enterShippingWithInvalidInfo('test', 'tester', '202 Eastview Mall', '', '30005', 'The address provided could not be verified. Please review.');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

    });

    test('15. Same Shipping and Billing address, Invalid details for Guest', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {

            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingWithInValidInfo('test', 'tester', '202 Eastview Mall', '', '30005', 'The address provided could not be verified. Please review.');
        });

    });

    test('16. Same Shipping and Billing address, Invalid details for Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingWithInValidInfo('test', 'tester', '202 Eastview Mall', '', '30005', 'The address provided could not be verified. Please review.');
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('17. Different Shipping and Billing address, valid details for Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '202 Eastview Mall', '', '14564');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '202 Eastview Mall', '', '14564');
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('18. Different Shipping and Billing address, Invalid Billing details for Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingWithInValidInfo('test', 'tester', '1 Court St', '', '15108', 'The address provided could not be verified. Please review.');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('19. Different Shipping and Billing address, Invalid shipping details for Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolisreet', '', '15108');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingWithInvalidInfo('test', 'tester', '9999 Eastview Mall', '', '14564', 'The address provided could not be verified. Please review.');
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('20. Change parcel delivery options', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Change the shipping to Expedited Delivery', async () => {

            await checkoutPage.changeShippingMethodAndVerifyShippingCharges('Expedited', '14.99');
        });

        await test.step('Change the shipping to Express Delivery', async () => {

            await checkoutPage.changeShippingMethodAndVerifyShippingCharges('Express', '24.99');
        });


    });

    test('21. Info Retention EDD', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calia socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateQuantity(3);

        });

        await test.step('When we search for "kayak" keyword in the search box', async () => {
            await homePage.searchForProduct('kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test1', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test1', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test1 tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St']);
        });


    });

    test('22. Info Retention Guest Same Billing Shipping', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "yeti" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateQuantity(2);

        });

        await test.step('When we search for "kayak" keyword in the search box', async () => {
            await homePage.searchForProduct('kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test1', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test1', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test1 tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St']);
        });


    });

    test('23. Contact Info Form Validations FirstName', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify Validations with Invalid details', async () => {
            await page.waitForLoadState('networkidle');
            await checkoutPage.firstNameValidationsWithInvalidNames(['t', '234234234', 'test.', 'test!', 'te$t', 'test (test1)']);
        });

        await test.step('Verify Validations with Valid details', async () => {
            await checkoutPage.firstNameValidationsWithValidNames(['test', 'automation-tester', 'test one']);
        });

    });

    test('24. Contact Info Form Validations LastName', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify Validations with Invalid details', async () => {
            await page.waitForLoadState('networkidle');
            await checkoutPage.lastNameValidationsWithInvalidNames(['t', '234234234', 'test.', 'test!', 'te$t', 'test (test1)']);
        });

        await test.step('Verify Validations with Valid details', async () => {
            await checkoutPage.lastNameValidationsWithValidNames(['test', 'automation-tester', 'test one']);
        });

    });

    test('25. Contact Info Form Validations Email Field', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify Validations with Invalid details', async () => {
            await page.waitForLoadState('networkidle');
            await checkoutPage.emailFieldValidationsWithInvalidDetails(['automation.teste', 'automation-tester', 'automation@', 'automation@dcsg']);
        });

        await test.step('Verify Validations with Valid details', async () => {
            await checkoutPage.emailFieldValidationsWithValidDetails(['automation@dcsg.com', 'automation-tester@gmail.com', 'test.test.test@hotmail.com', 'test@psu.edu']);
        });

    });

    test('26. Contact Info Form Validations Phone Number Field', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify Validations with Invalid details', async () => {
            await page.waitForLoadState('networkidle');
            await checkoutPage.phoneNumberFieldValidationsWithInvalidDetails(['(724) 333-333', '(111) 111-111', '(000) 000-000']);
        });

        await test.step('Verify Validations with Valid details', async () => {
            await checkoutPage.phoneNumberFieldValidationsWithValidDetails(['(222) 222-2222', '(412) 939-2888']);
        });

    });

    test('27. Form Validations Zip Code Field', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Verify Validations with Invalid details', async () => {
            await checkoutPage.zipcodeFieldValidationsWithInvalidDetails(['3232', '15108-33', 'test!']);
        });

        await test.step('Verify Validations with Valid details', async () => {
            await checkoutPage.zipcodeFieldValidationsWithValidDetails(['90005', '15108']);
        });

    });


    test('28. Order Summary', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "kayak" keyword in the search box', async () => {
            await homePage.searchForProduct('kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "Titleist 2023" keyword in the search box', async () => {
            await homePage.searchForProduct('Titleist 2023');
        });

        await test.step('And we set zip code to "15108"', async () => {
            await page.waitForLoadState('networkidle');
            await productListingPage.setStoreFromPLP('Robinson');
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
            //await expect(productListingPage.zipDeliveryLocationButton).toHaveText(new RegExp('.*15205.*'))
        });


        await test.step('And we apply the "Pick up" shipping option filter', async () => {
            if (await productListingPage.pickupFilterButtonReact.first().isVisible()) {
                await productListingPage.pickupFilterButtonReact.first().click();
                await expect(productListingPage.filterChipsAngular.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            } else {
                await productListingPage.pickupFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {

            //await page.waitForLoadState('networkidle');
            //await page.waitForTimeout(5000);
            await productListingPage.selectAProduct();
        });

        await test.step('Select attributes for Bopis', async () => {
            await productDisplayPage.verifyAttributesArePresentOrNotForBOPIS('15108', 'Robinson');
            await productDisplayPage.selectBOPISAttributes(page);
        });

        await test.step('Select BOPIS fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.freeStorePickupButton).toBeVisible();
            await productDisplayPage.freeStorePickupButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateProductQuantity(1, '2');

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateProductQuantity(2, '2');

        });

        await test.step('Checkout ', async () => {
            //await page.waitForTimeout(5000);
            await cartPage.clickCheckoutButton();
        });

        await test.step('Validate Order total', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyOrderTotal();

        });

        await test.step('Verify Store pick up is Free', async () => {

            await checkoutPage.verifyStorePickUpIsFree();

        });
        await test.step('Validate Order Subtotal ', async () => {
            await page.waitForLoadState('domcontentloaded');
            //await page.waitForTimeout(5000);
            await checkoutPage.validateOrderSubtotal();
        });



    });

    test('29. Mixed fulfillment cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "pelican kayak" keyword in the search box', async () => {
            await expect(cartPage.cartCommonProgressSpinner).toHaveCount(0);
            await homePage.searchForProduct('pelican kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "yeti rambler" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti rambler');
        });

        await test.step('And we set zip code to "15108"', async () => {
            await page.waitForLoadState('networkidle');
            await productListingPage.setStoreFromPLP('Robinson');
        });


        await test.step('And we apply the "Pick up" shipping option filter', async () => {
            if (await productListingPage.pickupFilterButtonReact.first().isVisible()) {
                await productListingPage.pickupFilterButtonReact.first().click();
                await expect(productListingPage.filterChipsAngular.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            } else {
                await productListingPage.pickupFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {

            await page.waitForLoadState('networkidle');
            //await page.waitForTimeout(5000);
            await productListingPage.selectAProduct();
        });

        await test.step('Select attributes for Bopis', async () => {
            await productDisplayPage.verifyAttributesArePresentOrNotForBOPIS('15108', 'Robinson');
            await productDisplayPage.selectBOPISAttributes(page);
        });

        await test.step('Select BOPIS fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.freeStorePickupButton).toBeVisible();
            await productDisplayPage.freeStorePickupButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Validate EDD for parcel item', async () => {
            await checkoutPage.verifyEstDeliveryDate(2);

        });
        await test.step('validate product info for the oversized item', async () => {
            await checkoutPage.verifyOversizedItem('Kayak');

        });
        await test.step('validate BOPIS product info', async () => {
            await checkoutPage.verifyProductInfo('YETI');

        });

        await test.step('validate BOPIS Store details visible or not', async () => {
            await checkoutPage.checkBOPISStoreDetails();

        });
        await test.step('validate BOPIS Store name is present in the Details', async () => {
            await checkoutPage.checkBOPISStoreNameInDetails('Robinson');

        });
        await test.step('verify Free store pickup for BOPIS product', async () => {
            await checkoutPage.verifyFreeStorePickup();

        });

    });

    test('30. Info Retention Guest Different Billing and Shipping', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "yeti" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateQuantity(2);

        });

        await test.step('When we search for "calia shirt" keyword in the search box', async () => {
            await homePage.searchForProduct('calia shirt');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Update the quantity to 2', async () => {
            await cartPage.updateProductQuantity(1, '2');

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test1', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test1', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '328 NE Northgate Way', '', '98125');
        });


        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test1 tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St', '328 NE Northgate Way']);
        });


    });

    test('31. Info Retention for registered user with Same Billing and Shipping address', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "Nike socks" keyword in the search box', async () => {
            await homePage.searchForProduct('Nike socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St']);
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
            
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('32. Info Retention for registered user with Different Billing and Shipping address', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri fit socks" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri fit socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "calia" keyword in the search box', async () => {
            await homePage.searchForProduct('calia');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "yeti tumbler" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti tumbler');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '328 NE Northgate Way', '', '98125');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St', '328 NE Northgate Way']);
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('33. Order modification change product quantity', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        let productNameInCart;

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            productNameInCart = await cartPage.getProductNames();
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('validate the product name and Qty', async () => {
            await checkoutPage.verifyProductInfo(productNameInCart[0]);
            await checkoutPage.verifySingleProductQuantity(1);

        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Update product quantity', async () => {
            await cartPage.updateQuantity(3);
        });
        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });
        await test.step('validate the product name and Qty', async () => {
            await checkoutPage.verifyProductInfo(productNameInCart[0]);
            await checkoutPage.verifySingleProductQuantity(3);

        });




    });

    test('34. Order modification change Contact info Guest', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Pelican Kayak" keyword in the search box', async () => {
            await homePage.searchForProduct('Pelican kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Click on change contact info link', async () => {
            await checkoutPage.clickChangeContactInformation();
        });
        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('Automation', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['Automation tester', 'automation@dcsg.com', '(724) 273-3400']);
        });


    });

    test('35. Order modification Contact Info change Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Click on Change Contact info link', async () => {
            await checkoutPage.clickChangeContactInformation();
        });
        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('Automation', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['Automation tester', 'automation@dcsg.com', '(724) 273-3400']);
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });
    test('36. Order modification change Address Guest', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test tester', 'automation@dcsg.com', '(724) 273-3400', '345 Court St']);
        });

        await test.step('Click on change Billing SHipping info link', async () => {
            await checkoutPage.clickChangeBillingShippingformation();
        });
        await test.step('Provide Billing details', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });
        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '202 Eastview Mall', '', '14564');
        });

        await test.step('Verify the address details', async () => {
            await checkoutPage.validateUserAndBillingDetails(['345 Court St', '202 Eastview Mall']);
        });

    });
    test('37. Order modification Address change Registered User', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(new Array('345 Court St'));
        });

        await test.step('Click on Change Contact info link', async () => {
            await checkoutPage.clickChangeContactInformation();
        });
        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('Automation', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Click on change Billing SHipping info link', async () => {
            await checkoutPage.clickChangeBillingShippingformation();
        });
        await test.step('Provide Billing details', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '290 Baychester Ave', '', '10475');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '202 Eastview Mall', '', '14564');
        });

        await test.step('Verify the Shipping address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['290 Baychester Ave', '202 Eastview Mall']);
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('38. Order modification remove product', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        let productNamesFromCartPage: string[];

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('hydroflask');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "Nike socks" keyword in the search box', async () => {
            await expect(cartPage.cartCommonProgressSpinner).toHaveCount(0);
            await homePage.searchForProduct('Nike socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('Pelican kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Update product quantity', async () => {
            await cartPage.deleteNoOfCartItems(1);
        });
        await test.step('Remember the Cart items', async () => {
            await page.waitForLoadState('networkidle');
            productNamesFromCartPage = await cartPage.getProductNames();
        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });
        await test.step('validate the product names', async () => {
            await checkoutPage.verifyProductNamesWithCartPage(productNamesFromCartPage);

        });

    });

    test('39. Order modification Add non-restricted product', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        let productNamesFromCartPage: string[];
        let productNamesFromCartPageAfterChange: string[];

        await test.step('When we search for "yeti tumbler" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti tumbler');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();
            await expect(cartPage.checkoutButton).toBeVisible();

        });

        await test.step('When we search for "hydroflask" keyword in the search box', async () => {
            await homePage.searchForProduct('Pelican kayak');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Remember the Cart items', async () => {
            //await page.waitForTimeout(4000);
            //await page.waitForLoadState('networkidle');
            productNamesFromCartPage = await cartPage.getProductNames();
        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });
        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });
        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });
        await test.step('validate the product names', async () => {
            await checkoutPage.verifyProductNamesWithCartPage(productNamesFromCartPage);

        });
        await test.step('', async () => {
            await checkoutPage.clickDSGLogo();
        });

        await test.step('When we search for "adidas hat" keyword in the search box', async () => {
            await homePage.searchForProduct('adidas hat');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Remember the Cart items', async () => {
            //await page.waitForTimeout(4000);
            await page.waitForLoadState('networkidle');
            productNamesFromCartPageAfterChange = await cartPage.getProductNames();
        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('validate the product names', async () => {
            await checkoutPage.verifyProductNamesWithCartPage(productNamesFromCartPageAfterChange);

        });

    });

    test('40. Order modification Add restricted product', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        let productNamesFromCartPage: string[];
        let productNamesFromCartPageAfterChange: string[];

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Remember the Cart items', async () => {
            await page.waitForLoadState('networkidle');
            productNamesFromCartPage = await cartPage.getProductNames();
        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });
        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });
        await test.step('Update Billing address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '290 Baychester Ave', '', '10475');
        });
        await test.step('validate the product names', async () => {
            await checkoutPage.verifyProductNamesWithCartPage(productNamesFromCartPage);

        });
        await test.step('', async () => {
            await checkoutPage.clickDSGLogo();
        });

        await test.step('When we search for "pepper spray*" keyword in the search box', async () => {
            await homePage.searchForProduct('pepper spray*');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Remember the Cart items', async () => {
            //await page.waitForTimeout(4000);
            await page.waitForLoadState('networkidle');
            productNamesFromCartPageAfterChange = await cartPage.getProductNames();
        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('validate the product names', async () => {
            await checkoutPage.verifyProductNamesWithCartPage(productNamesFromCartPageAfterChange);

        });

    });

    test('41. Changing shipping address  for registered user', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calis socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Provide contact details', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing address', async () => {
            await checkoutPage.unCheckSameShippingAndBillingAddress();
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '202 Eastview Mall', '', '14564');
        });

        await test.step('Update Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Click on change Billing SHipping info link', async () => {
            await checkoutPage.clickChangeBillingShippingformation();
        });
        await test.step('Provide Billing details', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'TESTERONE', '23 Legion Way Pittsburgh', '', '15214-2833');
        });

        await test.step('Click on Cart icon', async () => {
            await checkoutPage.goBackToCart();
        });
        await test.step('Make Cart Empty', async () => {
            await cartPage.deleteCartItems();
        });

    });

    test('42. Payments Signed In Reward', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "nike dri-fit headband" keyword in the search box', async () => {
            await homePage.searchForProduct('nike dri-fit headband');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });
        await test.step('Sign in as registered user', async () => {
            await cartPage.signInAsRegisteredUser(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {

            await page.waitForLoadState('load');
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Verify Promo Code', async () => {
            await checkoutPage.verifyInvalidPromoCodeFunctionalityForSignedInUser('RWDN2M7G3R2');

        });



    });

    test('43. Store pickup section validation', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "yeti rambler" keyword in the search box', async () => {
            await homePage.searchForProduct('yeti rambler');
        });

        await test.step('And we set zip code to "15108"', async () => {
            await page.waitForLoadState('networkidle');
            await productListingPage.setStoreFromPLP('Robinson');
        });


        await test.step('And we apply the "Pick up" shipping option filter', async () => {
            if (await productListingPage.pickupFilterButtonReact.first().isVisible()) {
                await productListingPage.pickupFilterButtonReact.first().click();
                await expect(productListingPage.filterChipsAngular.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            } else {
                await productListingPage.pickupFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Pickup at Robinson.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {

            await page.waitForLoadState('networkidle');
            await productListingPage.selectAProduct();
        });

        await test.step('Select attributes for Bopis', async () => {
            await page.waitForLoadState('networkidle');
            await productDisplayPage.verifyAttributesArePresentOrNotForBOPIS('15108', 'Robinson');
            await productDisplayPage.selectBOPISAttributes(page);
        });

        await test.step('Select BOPIS fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.freeStorePickupButton).toBeVisible();
            await productDisplayPage.freeStorePickupButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfoWithOutContinue('test', 'tester', 'automation@dcsg.com', '7242733400');
        });
        await test.step('Check text updates checkout', async () => {
            await checkoutPage.checkTextMeOrderUpdates();
        });

        await test.step('click continue on contact info form', async () => {
            await checkoutPage.clickContinueOnContactInfo();
        });
        await test.step('click add pickup person link', async () => {
            await checkoutPage.clickAddPickUpPerson();
        });
        await test.step('provide details', async () => {
            await checkoutPage.providePickUPPersonDetails('test1', 'tester1', 'automationdcsg@dcsg.com');
        });
        await test.step('Verify the address', async () => {
            await checkoutPage.validateUserAndBillingDetails(['test1 tester1', 'automationdcsg@dcsg.com']);
        });

    });

    test('44. Gifting Validation', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "calis socks" keyword in the search box', async () => {
            await homePage.searchForProduct('calia socks');
        });

        await test.step('And we apply the "Ship" shipping option filter', async () => {
            if (await productListingPage.shipFilterButtonAngular.first().isVisible()) {
                await productListingPage.shipFilterButtonAngular.first().click();
                await expect(productListingPage.filterChipsAngular.first()).toContainText(new RegExp('.*Ship to.*'));
            } else {
                await productListingPage.shipFilterButtonReact.click();
                await expect(productListingPage.filterChipsReact.first()).toContainText(new RegExp('.*Ship to.*'));
            }
        });
        await test.step('Select a product', async () => {
            await productListingPage.selectAProduct();
        });
        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('Select Gift Options', async () => {
            await cartPage.selectGiftOption();

        });

        await test.step('Checkout ', async () => {
            await cartPage.clickCheckoutButton();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfo('test1', 'tester', '345 Court St Coraopolis', '', '15108');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterShippingInfo('test1', 'tester', '345 Court St Coraopolis', '', '15108');
        });
        await test.step('Provide Gift receipients name and details', async () => {
            await checkoutPage.enterGiftReceipientDetails('jane.doe20222222@gmail.com', 'Jane', 'Happy birthday jane!!! Love, Me');
        });

    });

    test('45. Same day Delivery Confirm Zip code', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Table Tennis" keyword in the search box', async () => {
            await homePage.searchForProduct('Table Tennis');
        });

        await test.step('And we set zip code to "15108"', async () => {
            await page.waitForLoadState('networkidle');
            await productListingPage.setDeliveryZipPLP('15108');
        });


        await test.step('And we apply the "Pick up" shipping option filter', async () => {
            //await page.waitForTimeout(3000);
            if (await productListingPage.sameDayDeliveryFilter.first().isVisible()) {
                await productListingPage.sameDayDeliveryFilter.first().click();
                await expect(productListingPage.filterChipsAngular.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Same Day Delivery to.*'));
            } else {
                await productListingPage.sameDayDeliveryFilter.click();
                await expect(productListingPage.filterChipsReact.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Same Day Delivery to.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {

            await page.waitForLoadState('networkidle');
            await productListingPage.selectAProduct();
        });

        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('click change delivery zip code', async () => {
            await cartPage.clickChangeDeliveryZipCode();

        });
        await test.step('update delivery zip code', async () => {
            await cartPage.updateDeliveryZipcode('15108');

        });
        await test.step('select Same Day Delivery radio button', async () => {
            await cartPage.selectSameDayDeliveryRadioButton();

        });

        await test.step('Checkout ', async () => {
            await cartPage.sameDayDeliveryCheckout();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfoForSameDayDelivery('test1', 'tester', '345 Court St Coraopolis', '');
        });

        await test.step('Verify Same day delivery Tip is visible', async () => {
            await checkoutPage.verifySameDayDevlieryTipIsVisibleOrNot();
        });
    });

    test('46. Same day Delivery Confirm Tip', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page);
        const productDisplayPage = new ProductDisplayPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await test.step('When we search for "Table Tennis" keyword in the search box', async () => {
            await homePage.searchForProduct('Table Tennis');
        });

        await test.step('And we set zip code to "15108"', async () => {
            await page.waitForLoadState('networkidle');
            await productListingPage.setDeliveryZipPLP('15108');
            //await page.waitForLoadState('networkidle');
        });


        await test.step('And we apply the "Pick up" shipping option filter', async () => {
            //await page.waitForLoadState('networkidle');
            if (await productListingPage.sameDayDeliveryFilter.first().isVisible()) {
                await productListingPage.sameDayDeliveryFilter.first().click();
                await expect(productListingPage.filterChipsAngular.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Same Day Delivery to.*'));
            } else {
                await productListingPage.sameDayDeliveryFilter.click();
                await expect(productListingPage.filterChipsReact.or(productListingPage.filterChipsReact).first()).toContainText(new RegExp('.*Same Day Delivery to.*'));
            }
            await expect(productListingPage.loadingOverlay).toHaveCount(0);
        });
        await test.step('Select a product', async () => {

            await page.waitForLoadState('load');
            //await page.waitForTimeout(5000);
            await productListingPage.selectAProductWithInGivenRange(6);
        });

        await test.step('select attributes', async () => {
            await page.waitForLoadState('load');
            await productDisplayPage.verifyAttributesArePresentOrNotForShipToMe();
            await productDisplayPage.selectShipToMeAttributes(page);
        });

        await test.step('Select ShipToMe fulfillment option', async () => {
            await page.waitForLoadState('load');
            await expect(productDisplayPage.shipToMeFullfilmentButton).toBeVisible();
            await productDisplayPage.shipToMeFullfilmentButton.click();
        });

        await test.step('Add to Cart and Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await page.waitForLoadState('load');
            await productDisplayPage.goToCartButtonProd.click();

        });

        await test.step('click change delivery zip code', async () => {
            await cartPage.clickChangeDeliveryZipCode();

        });
        await test.step('update delivery zip code', async () => {
            await cartPage.updateDeliveryZipcode('15108');

        });
        await test.step('select Same Day Delivery radio button', async () => {
            await cartPage.selectSameDayDeliveryRadioButton();

        });

        await test.step('Checkout ', async () => {
            await cartPage.sameDayDeliveryCheckout();
        });

        await test.step('Verify the contact information is not pre populated', async () => {
            await page.waitForLoadState('load');
            await checkoutPage.verifyContactInfoIsEmpty();
        });

        await test.step('Provide contact details', async () => {
            await checkoutPage.enterContactInfo('test', 'tester', 'automation@dcsg.com', '7242733400');
        });

        await test.step('Update Billing and Shipping address', async () => {
            await checkoutPage.enterBillingShippingInfoForSameDayDelivery('test1', 'tester', '345 Court St Coraopolis', '');
        });

        await test.step('Verify Same day delivery Tip is visible', async () => {
            await checkoutPage.verifySameDayDevlieryTipIsVisibleOrNot();
        });

        await test.step('Select Tip Amount', async () => {
            await checkoutPage.selectTipAmount('$5');
        });

        await test.step('Verify Same day delivery Tip amount', async () => {
            expect(await checkoutPage.getTipAmountOrderTotal()).toEqual('$5.00');
        });
        await test.step('Select Tip Amount', async () => {
            await checkoutPage.selectTipAmount('$0');
        });
        await test.step('Verify Same day delivery Tip amount', async () => {
            //await page.waitForTimeout(3000);
            expect(await checkoutPage.getTipAmountOrderTotal()).toEqual('$0.00');
        });
        await test.step('Select Tip Amount', async () => {
            await checkoutPage.selectTipAmount('$10');
        });
        await test.step('Verify Same day delivery Tip amount', async () => {
            //await page.waitForTimeout(3000);
            expect(await checkoutPage.getTipAmountOrderTotal()).toEqual('$10.00');
        });

        await test.step('Select other tip Amout', async () => {
            await checkoutPage.selectOtherTipAmount('7');
        });
        await test.step('Verify Same day delivery Tip amount', async () => {
            //await page.waitForTimeout(5000);
            expect(await checkoutPage.getTipAmountOrderTotal()).toEqual('$7.00');
        });


    });

    test('47. Delete Cart for Signed In User', async ({ page }) => {
        const homePage = new HomePage(page);
        const cartPage = new CartPage(page);

        const accountSignInPage = new AccountSignInPage(page);
        let accessToken;

        await test.step('Click my account link', async () => {
            await homePage.myAccountLink.click();
        });

        await test.step('Sign in With valid credentails and verify the sign in is successful or not', async () => {
            await accountSignInPage.signIn(testData_Prod_Checkout.signInUsername, testData_Prod_Checkout.signInPassword);

        });

        await test.step('Get Access Toekn', async () => {
            accessToken = await page.evaluate('window.accessToken');
        });

        await test.step('Delete Cart', async () => {
            await cartPage.deleteCartUsingAPI(accessToken);

        });


    });

});