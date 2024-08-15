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
import { testData_e2e_np0_qa } from '../test-data/e2eNP0QATestData.ts';
import { PassThrough } from 'stream';


test.describe("E2E NP0 QA", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl() + "homr");
        console.log("URL: " + getBaseUrl() + "homr");

        // Close popup
        //await page.frameLocator('iframe[title="Sign Up via Text for Offers"]').getByTestId('closeIcon').click()

    });


    test('1: Cart product details', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)


        // Search for product
        await test.step('Search with product SKU number', async () => {
            console.log("Validating cart product details");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            console.log("Product is searchable");

        });
        const productDetails = await productDisplayPage.captureProductDetails();


        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await commonPage.handlePromotionalPopup();
            await productDisplayPage.selectProductByColor.click();
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Clicking Go to Cart");

        });


        await test.step('Verify cart page', async () => {
            await cartPage.verifyProductDetails(productDetails);
            console.log("Cart page verified");

        });


        await test.step('Verify the product quantity is 1', async () => {
            await cartPage.verifyProductQuantity(1,'1');
            console.log("Product quantity verified");

        });
    });

    test('2: Cart pricing details', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search with product SKU number', async () => {
            console.log("Validating cart pricing  details");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            console.log("Product is searchable");

        });

        const productDetails = await productDisplayPage.captureProductDetails();

        await test.step('Verify product availability', async () => {
            await productDisplayPage.selectProductByColor.click();
            await productDisplayPage.verifyProductAvailability("Available");
            console.log("Product is available for the selected color");
        });

        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await commonPage.handlePromotionalPopup();
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to the Cart");
            console.log("Validation successful");  

        });

        await test.step('Validating cart pricing components', async () => {
            const cartPriceDetailsObject = await cartPage.getCartPriceDetailsObject()
            console.log({ cartPriceDetailsObject })

            //Validate estimated shipping
            const estimatedShipping = cartPriceDetailsObject.getEstimatedShipping()
            console.log({ estimatedShipping })
            expect(estimatedShipping).toBe('$8.99')
            console.log("Estimated shipping price validated");

            //Validate estimated Tax
            const estimatedTax = cartPriceDetailsObject.getEstimatedTax();
            console.log({ estimatedTax })
            expect(estimatedTax).toBe('$0.00')
            console.log("Estimated tax price validated");


            //Validate order subTotal
            const orderSubTotal = cartPriceDetailsObject.getOrderSubtotal()
            console.log({ orderSubTotal })
            expect(orderSubTotal).toBe(productDetails.price)
            console.log("Order sub total validated");

            await cartPage.updateQuantity("10");
            console.log("Product quantity updated");  

            // Get Cart Price Details Object updated
            const cartPriceDetailsObjectupdated = await cartPage.getCartPriceDetailsObject()
            console.log({ cartPriceDetailsObjectupdated })


            const estimatedShippingFree = cartPriceDetailsObjectupdated.getEstimatedShipping()
            console.log({ estimatedShippingFree })
            expect(estimatedShippingFree).toBe('Free')
            console.log("Estimateed shipping validated");  
            console.log("Validation successful");  

        });

    });


    test('3: Cart Fulfilment choice', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search with product SKU number', async () => {
            console.log("Validating cart fulfillment choice details");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible();
            console.log("Product is searchable");

        });

        // Set store
        await test.step('Set zip code and select Store', async () => {
            await commonPage.handlePromotionalPopup();
            await productDisplayPage.selectStorePickup('Select product options');
            await page.waitForLoadState("networkidle");
            const storeName = await productDisplayPage.setStoreFromPDP(testData_e2e_np0_qa.zipCode, "Robinson")
            await productDisplayPage.selectProductByColor.click();
            console.log("Store setup done");
            

        });

        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {

            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");

        });

        // Validate Cart and free shipping
        const storePickup = await cartPage.getStorePickup()
        console.log({ storePickup })
        expect(storePickup).toBe('Free')
        console.log("Estimated shipping validated");
        console.log("Validation successful");


    });

    test('4: Cart quantity functionality STH', { tag: '@regression' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        // Search for product
        await test.step('Search with product SKU number', async () => {
            console.log("Validating cart quantity functionality");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product is searchable");

        });


        // Verifying the product is available to ship
        await productDisplayPage.verifyProductAvailability("Available");
        console.log("Product is available");

        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await commonPage.handlePromotionalPopup();
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");

        });

        //updating the quantity-1st time
        await cartPage.updateProductQuantity(1,'10');
        await commonPage.sleep(5);
        await cartPage.verifyPShippingMedium('sth');
        console.log("Vquantity updated to 10");

        // Get Cart Price Details Object updated
        const cartPriceDetailsObjectupdated = await cartPage.getCartPriceDetailsObject()
        console.log({ cartPriceDetailsObjectupdated })

        //Validate estimated shipping
        const estimatedShippingFree = cartPriceDetailsObjectupdated.getEstimatedShipping()
        console.log({ estimatedShippingFree })
        expect(estimatedShippingFree).toBe('Free')

        //updating the quantity-2nd time
        await cartPage.updateProductQuantity(1,'100');
        console.log("Vquantity updated to 100");
        await commonPage.sleep(5);
        await cartPage.verifyProductQuantity(1,'99');
        await commonPage.sleep(5);
        const alertMessage1 = await cartPage.cartAlertMessage.nth(0).innerText()
        expect(alertMessage1.trim()).toContain('unavailable. We have updated the quantity to the maximum available.');
        console.log("Error message validated");


        //updating the quantity-3rd time
        await cartPage.updateProductQuantity(1,'0');
        console.log("Quantity updated to 0");
        await commonPage.sleep(20);
        const alertMessage2 = await cartPage.cartConfirmationHeader.innerText()
        expect(alertMessage2.trim()).toContain('Do you want to remove this item from your Cart?')
        console.log("Alert pop up validated");
        console.log("Validation successful");


    });

    test('5: Cart quantity functionality Store Pickup', { tag: '@regression' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)


        await test.step('Search with product SKU number', async () => {
            console.log("Cart quantity validation for store pick up");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            console.log("Product is visible");

        });

        // Set store
        await test.step('Set zip code and select Store', async () => {

            await productDisplayPage.selectStorePickup('Select product options');
            await page.waitForLoadState("networkidle");
            await commonPage.handlePromotionalPopup();
            const storeName = await productDisplayPage.setStoreFromPDP(testData_e2e_np0_qa.zipCode, "Robinson")
            console.log("Store setup completed");
            await productDisplayPage.selectProductByColor.click();
            //Selecting store pickup and validating stock is present
            await productDisplayPage.selectStorePickup('In stock');
            console.log("CProduct in stock for BOPIS");
        });

        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {

            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");

        });

        // Validate Cart and free shipping
        const storePickup = await cartPage.getStorePickup()
        console.log({ storePickup })
        expect(storePickup).toBe('Free')



        //updating the quantity-1st time
        await cartPage.updateProductQuantity(1,'10');
        await commonPage.sleep(10);
        await cartPage.verifyPShippingMedium('bopis');

        //updating the quantity-2nd time
        await cartPage.updateProductQuantity(1,'100');
        await commonPage.sleep(10);
        await cartPage.verifyProductQuantity(1,'99');
        await cartPage.verifyPShippingMedium('bopis');
        const alertMessage1 = await cartPage.cartAlertMessage.innerText()
        expect(alertMessage1.trim()).toContain('unavailable. We have updated the quantity to the maximum available.');


        //updating the quantity-3rd time
        await cartPage.updateProductQuantity(1,'0');
        const alertMessage2 = await cartPage.cartConfirmationHeader.innerText()
        expect(alertMessage2.trim()).toContain('Do you want to remove this item from your Cart?')
        console.log("Pricing and quantity successfuly validated");
        console.log("Validation successful");

    });

    test('6: Paypal checkout in Cart page', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)
        await test.step('Search with product SKU number', async () => {
            console.log("Validating Paypal payment");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            
        });


        // Verifying the product is available to ship
        await productDisplayPage.verifyProductAvailability("Available");
        console.log("Product is available");
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await commonPage.handlePromotionalPopup();
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");

        });


        //Validate paypal checkout
        await commonPage.sleep(10)
        await cartPage.verifyPaypalModal('Pay with PayPal');
        console.log("Paypal payment available")
        console.log("Validation successful");
    });

    test('7: Cart page mixed order', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)


        await test.step('Search with product SKU number', async () => {
            console.log("Validating mixed order in cart page");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()

        });

        // Set store
        await test.step('Set zip code and select Store', async () => {

            await productDisplayPage.selectStorePickup('Select product options');
            await page.waitForLoadState("networkidle");
            await commonPage.handlePromotionalPopup();
            const storeName = await productDisplayPage.setStoreFromPDP(testData_e2e_np0_qa.zipCode, "Robinson")
            console.log("Store setup completed");
            await productDisplayPage.selectProductByColor.click();
            //Selecting store pickup and validating stock is present
            await productDisplayPage.selectStorePickup('In stock');
            console.log("Product In stock");
        });

        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {

            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to Cart");

        });

        //Validate Store Pickup is selected
        await cartPage.verifyPShippingMedium('bopis');
        console.log("Shipping method BOPIS verified");

        await test.step('Search with product SKU number', async () => {
            await homePage.searchForProduct(testData_e2e_np0_qa.sku2),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product selected");

        });
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");
        });



        //Validate STH is selected
        await cartPage.verifyPShippingMedium('sth');
        console.log("Shipping method STH verified");
        console.log("Validation successful");

    });

    test('8: Cart page gift card and score card guest user', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search with product SKU number', async () => {
            console.log("Validating gift card and score card");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku2),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product is selected");

        });
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");

        });

        //Validate Giftcard
        await expect(cartPage.cartGiftCardCheckbox).toBeVisible();
        await cartPage.cartGiftCardCheckbox.click();
        await expect(cartPage.cartGiftCardLearnMoreLink).toBeVisible()
        await expect(cartPage.cartGiftCardTxt).toHaveText(/This order is a gift./);
        console.log("Gift card is available");

        //Validate Scorecard
        await expect(cartPage.cartScoreCardDiv).toBeVisible()
        await expect(cartPage.cartScoreCardSignIn).toBeVisible()
        await cartPage.cartScoreCardSignIn.click();
        await commonPage.sleep(5)
        await expect(cartPage.cartSignInPage).toHaveText(/Log in to Dick's Sporting Goods/);
        console.log("Guest user is getting signIn prompt while selecting gift card");
        console.log("Validation successful");

    });

    test('9: Empty cart functionality_Guest', { tag: '@regression' }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search with product SKU number', async () => {
            console.log("Validating empty cart functionality");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku2),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product is selected");

        });
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");


        });

        await cartPage.updateProductQuantity(1,'0');
        const alertMessage2 = await cartPage.cartConfirmationHeader.innerText()
        expect(alertMessage2.trim()).toContain('Do you want to remove this item from your Cart?')

        await cartPage.cartPageBtnRemoveItem.click();
        await expect(cartPage.emptyCartButtonSinIn).toBeVisible()
        console.log("Guest user is getting signIn prompt while validating empty cart");
        console.log("Validation successful");

    });

    test('10: Cart page gift card and score card guest user', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)


        await test.step('Search with product SKU number', async () => {
            console.log("Validating gift and score card for guest user");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku2),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product is selected");


        });
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");


        });

        //Validate Giftcard
        await expect(cartPage.cartGiftCardCheckbox).toBeVisible();
        await cartPage.cartGiftCardCheckbox.click();
        await expect(cartPage.cartGiftCardLearnMoreLink).toBeVisible()
        await expect(cartPage.cartGiftCardTxt).toHaveText(/This order is a gift./);

        //Validate Scorecard
        await expect(cartPage.cartScoreCardDiv).toBeVisible()
        await expect(cartPage.cartScoreCardSignIn).toBeVisible()
        console.log("Gift and score card validated");
        console.log("Validation successful");

    });

    test('11: Cart page save later', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)
        const productDisplayPage = new ProductDisplayPage(page)
        const cartPage = new CartPage(page)
        const checkoutPage = new CheckoutPage(page)
        const orderConfirmationPage = new OrderConfirmationPage(page)
        const accountSignInPage = new AccountSignInPage(page)
        const commonPage = new CommonPage(page)

        await test.step('Search with product SKU number', async () => {
            console.log("Validate save later functionality");
            await homePage.searchForProduct(testData_e2e_np0_qa.sku2),
                await page.waitForLoadState("load");
            await commonPage.waitUntilPageLoads();
            await expect(productDisplayPage.addToCartButton).toBeVisible()
            await productDisplayPage.selectProductByColor.click();
            console.log("Product is selected");


        });
        await test.step('Clicking on Add To Cart button and click Go to Cart', async () => {
            await productDisplayPage.addToCartButton.click();
            await productDisplayPage.goToCartButton.click();
            console.log("Going to cart");


        });


        await expect(cartPage.cartSaveLaterLink.first()).toBeVisible();
        cartPage.cartSaveLaterLink.click();
        // Partially automated as this functionality is not working in NP0 QA GG, highlighted the issue to the product team
        await expect(cartPage.emptyCartButtonSinIn).toBeVisible()
        console.log("Save later link validated");
        console.log("Validation successful");

    });
});




