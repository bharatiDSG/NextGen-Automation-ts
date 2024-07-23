import { expect, test } from '@playwright/test'

import { CartPage } from '../../../page-objects/CartPage';
import { CommonPage } from '../../../page-objects/CommonPage'
import { HomePage } from '../../../page-objects/HomePage'
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage'
import { getBaseUrl } from '../../../globalSetup'
import {AccountSignInPage} from "../../../page-objects/AccountSignInPage";

test.describe("PDP Ship To Home - Add To Cart Tests", () => {
    let homePage: HomePage;
    let PDP: ProductDisplayPage;
    let commonPage: CommonPage;
    let accountSignIn: AccountSignInPage;
    let cartPage: CartPage;
    
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        PDP = new ProductDisplayPage(page);
        commonPage = new CommonPage(page);
        accountSignIn = new AccountSignInPage(page)
        cartPage = new CartPage(page);
    
        // Go to baseUrl set in .env
        await test.step('Navigate to homepage',async()=>{
        await homePage.goToHomePage(getBaseUrl() + 'homr');
        console.log("URL: " + getBaseUrl());
    });
    });

    test('DSG ATC STH - Desktop - Smoke test', { tag: ['@smoke'] }, async ({ page }) => {
        await test.step('Navigate to yeti tumbler page',async()=>{
        await page.goto(getBaseUrl() + 'p/nike-sportswear-womens-phoenix-fleece-oversized-crewneck-sweatshirt-22nikwstylflccrwxapt/22nikwstylflccrwxapt');

        await expect(PDP.womensClothingBreadcrumb).toBeVisible();
        await PDP.womensClothingBreadcrumb.first().click();
        await expect (PDP.womensClothingTitle).toBeVisible();

        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
    });
        await test.step('Add to cart and validate error messages',async()=>{
        await commonPage.closePromoPopUp();

        await commonPage.isTextVisible(PDP.productName.first(), 'YETI 20 oz. Rambler Tumbler with MagSlider Lid');

        await expect(PDP.colorsAttributeSection.first()).toBeVisible();

        await expect(PDP.shipToMeButton).toBeVisible();
        await expect(PDP.freeStorePickupButton).toBeVisible();
        await expect(PDP.sameDayDeliveryButton).toBeVisible();

        await expect(PDP.productInformationContainer).toBeVisible();
        await expect(PDP.productSpecsContainer.first()).toBeVisible();

        await PDP.averageRatingLink.first().click();

        await PDP.writeaReviewButton.click();

        await PDP.enterReviewsSearch('Yeti', 'YetiYetiYetiYetiYetiYetiYetiYetiYetiYetiYetiYetiYeti', 'tester123@test.com');

        await PDP.verifyNumberOfReviews();
        await expect(PDP.starsRatingValue).toBeVisible();
        await expect(PDP.reviewsPercentageAndwouldRecommendToAFriendText).toBeVisible();
        await PDP.averageRatingLink.click();

        await expect(PDP.youMayAlsoLikeSection).toBeVisible();
        await expect(PDP.sponsoredProductsSection).toBeVisible();
        await expect(PDP.customersAlsoBoughtSection).toBeVisible();
        await expect(PDP.recentlyViewedSection).toBeVisible();

        await PDP.validateImageViewer();

        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");
    });

        await test.step('Select attributes and Fulfillment option',async()=>{
        await expect(PDP.addToCartButton).toBeDisabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");

        await PDP.availableProductColor.first().click();

        await PDP.shipToMeButton.click();
        await PDP.freeStorePickupButton.click();
        await PDP.sameDayDeliveryButton.click();

        await PDP.addToFavoritesBtn.click();
        await accountSignIn.signInFromPDP('dcsgorgs+5@gmail.com','345CourtStreet!');

        if (!await PDP.addedToFavoritesBtn.isVisible()) {
            await PDP.addToFavoritesBtn.click();
            await PDP.favoritesDefaultListCheckBox.click();
            await PDP.saveFavoritesButton.click();
    } else {
        await expect(PDP.addedToFavoritesBtn).toBeVisible({timeout: 20000});
    }

        await PDP.increaseProductQuantity(PDP.quantityInput, '3');
        await PDP.availableProductColor.first().click();
        await test.step('Check product availability based on selected options',async()=>{});        
        await PDP.checkProductAvailability();
    });
        await test.step('Add to cart',async()=>{
        await PDP.addToCartButton.click();
        console.log("Add to Cart button clicked");
    });

        await test.step('Go To Cart',async()=>{
        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isTextVisible(PDP.continueShoppingButton, " Continue Shopping ");
        await commonPage.isTextVisible(PDP.goToCartButton, "GO TO CART");
        await expect(PDP.goToCartButton).toBeVisible();
        await PDP.goToCartButton.click();
    });
        await test.step('Verify Cart title and item count',async()=>{        
            await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (3 items)");
    });
    });

    test('DSG ATC STH - Rewrite', { tag: ['@rewrite'] }, async ({ page }) => {
        
        await test.step('Navigate to Yeti Tumbler product page',async()=>{
        await page.goto(getBaseUrl() + '/p/yeti-20-ozrambler-tumbler-with-magslider-lid-17yetarmblr20wmgsodr/17yetarmblr20wmgsodr');
        await commonPage.addRewriteFlagToUrl();
    });
        await test.step('Add to cart and validate error messages',async()=>{
        await commonPage.scrollIfElementNotVisible(PDP.addToCartButtonRewrite);
        await PDP.addToCartButtonRewrite.click();
        console.log("Add to Cart button clicked");
    });

        await test.step('Select attribites',async()=>{
        await expect(PDP.addToCartButtonRewrite).toBeEnabled();
        await commonPage.isTextVisible(PDP.pleaseSelectColor, "Please Select Color");
        await PDP.availableProductColorRewrite.first().click();
    });

        await test.step('Select fulfillment option',async()=>{
        await expect(PDP.shipToMeFullfilmentButton).toBeEnabled();
        console.log("Available to Ship is enabled");
    });

        await test.step('Add to cart',async()=>{
        await commonPage.scrollIfElementNotVisible(PDP.addToCartButtonRewrite);
        await PDP.addToCartButtonRewrite.click();
        console.log("Add to Cart button clicked");
    });

        await test.step('Go to Cart',async()=>{
        await commonPage.isTextVisible(PDP.addedToCartMessage, "ADDED TO CART");
        await commonPage.isTextVisible(PDP.continueShoppingButton, " Continue Shopping ");
        await commonPage.isTextVisible(PDP.goToCartButton, " Go To Cart ");
        await PDP.goToCartButton.click();
    });
        await test.step('Validate Item count in Cart page',async()=>{
        await commonPage.isTextVisible(cartPage.cartItemAmount, "Cart (1 item)");
    });
    });
});
