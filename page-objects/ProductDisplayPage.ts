import {expect, type Locator, type Page} from '@playwright/test';
import { getIndexThatIncludesFirstMatch } from '../lib/functions';
import { CommonPage } from './CommonPage';

export class ProductDisplayPage {
    private page: Page;

    readonly storePickupEnabledButton: Locator;
    readonly shipToMeButton: Locator;
    readonly storePickupSubText: Locator;
    readonly addToCartButton: Locator;
    readonly addToCartButtonRewrite: Locator;
    readonly goToCartButton: Locator;
    readonly pleaseSelectColor: Locator;
    readonly addedToCartMessage: Locator;
    readonly continueShoppingButton: Locator;
    readonly shipToMeFullfilmentButton: Locator;
    readonly freeStorePickupButton: Locator;
    readonly changeStoreButton: Locator;
    readonly availableWheelSize: Locator;
    readonly storesWithAvailabilityCheckbox: Locator;
    readonly zipCodeTextField: Locator;
    readonly storesNearMe: Locator;
    readonly selectStoreModalCloseButton: Locator;
    readonly sameDayDeliveryButton: Locator;
    readonly changeZipCodeLink: Locator;
    readonly productQuantityTextFieldRewrite: Locator;
    readonly womensClothingBreadcrumb: Locator;
    readonly womensClothingTitle : Locator;
    readonly productName: Locator;
    readonly sameDayDeliveryButton: Locator;
    readonly productInformationContainer: Locator;
    readonly productSpecsContainer: Locator;
    readonly quantityInput: Locator;
    readonly fulfillmentOptionsDescription: Locator;
    
    // PDP attributes
    readonly colorsAttributeSection: Locator;
    readonly flexAttribute: Locator;
    readonly handAttribute: Locator;
    readonly shaftAttribute: Locator;
    readonly loftAttribute: Locator;
    readonly availableProductColorRewrite: Locator;
    readonly availableProductColor: Locator;
    readonly availableBikeFrameSize: Locator;
    readonly changeStoreLink: Locator;
    readonly selectStoreZipField: Locator;
    readonly selectStoreSearchButton: Locator;
    readonly selectStoreNames: Locator;
    readonly selectStoreButons: Locator;
    readonly changeSelectedStoreLink: Locator;
    readonly selectStoreButtons: Locator;
    readonly goToCartButtonProd: Locator;

    //PDP Image Viewer
    readonly viewAllImagesBtn: Locator;
    readonly viewLessImagesBtn: Locator;
    readonly productImage: Locator;
    readonly closeImageViewerBtn: Locator;
    readonly rightArrowBtn: Locator;
    readonly leftArrowBtn: Locator;
    readonly zoomInBtn: Locator;
    readonly zoomOutBtn: Locator;

    //PDP Favorites
    readonly addToFavoritesBtn: Locator;
    readonly addedToFavoritesBtn: Locator;

    //PDP Reviews
    readonly writeaReviewButton: Locator;
    readonly averageRatingLink: Locator;
    readonly overallRatingStarsButtons: Locator;
    readonly reviewTitle: Locator;
    readonly reviewsTextField: Locator;
    readonly nicknameInput: Locator;
    readonly emailInput: Locator;
    readonly reviewsTermsAndConditionsAgreenmentCheckBox : Locator;
    readonly postReviewButton: Locator;
    readonly reviewsCountNumber: Locator;
    readonly starsRatingValue: Locator;
    readonly reviewsPercentageAndwouldRecommendToAFriendText: Locator;
    readonly closeReviewsModalButton: Locator;

    //Related Products Sections
    readonly youMayAlsoLikeSection: Locator;
    readonly sponsoredProductsSection: Locator;
    readonly customersAlsoBoughtSection: Locator;
    readonly recentlyViewedSection: Locator;

    constructor(page: Page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' });
        this.shipToMeButton = page.getByRole('button', { name: 'Ship' });
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div');
        this.addToCartButton = page.locator("xpath=//button[@id='pdp-add-to-cart-button']|//button[@id='add-to-cart']");
        this.addToCartButtonRewrite = page.locator('#pdp-add-to-cart-button');
        this.goToCartButton = page.getByRole('link', { name: 'Go To Cart' });
        this.goToCartButtonProd = page.getByRole('link', { name: 'GO TO CART' });
        this.pleaseSelectColor = page.getByText('Please Select Color');
        this.addedToCartMessage = page.getByText('ADDED TO CART');
        this.continueShoppingButton = page.getByText('Continue Shopping');
        this.goToCartButton = page.getByText('GO TO CART');
        this.shipToMeFullfilmentButton = page.getByRole('button', { name: 'Ship' }).getByText('Available');
        this.freeStorePickupButton = page.getByLabel(' Free Store Pickup');
        this.changeStoreButton = page.getByRole('button', { name: 'Change Store' });
        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability');
        this.zipCodeTextField = page.locator('input[id*="homefield-textinput-"]');
        this.storesNearMe = page.locator('.store-details-container > .hmf-button');
        this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true });
        this.sameDayDeliveryButton = page.locator('#pdp-same-day-delivery-button');
        this.changeZipCodeLink = page.locator('#pdp-change-zip-code-link');
        this.productQuantityTextFieldRewrite = page.getByLabel('Quantity');
        this.womensClothingBreadcrumb = page.locator("//a[@href='/c/womens-workout-clothes']");
        this.womensClothingTitle = page.getByRole('heading', { name: "Women's Clothing"});
        this.productName = page.locator("//h1[@itemprop='name']");
        this.sameDayDeliveryButton = page.locator('#pdp-same-day-delivery').first();
        this.productInformationContainer = page.locator('#pdp-product-description');
        this.productSpecsContainer = page.locator('#pdp-tech-specs');
        this.quantityInput = page.locator('#inputQty');
        this.fulfillmentOptionsDescription = page.locator('div.hmf-fulfillment-options-description');

        // PDP attributes
        this.colorsAttributeSection = page.getByText('Color:');
        this.flexAttribute = page.getByRole('button', { name: 'Tour Flex' });
        this.handAttribute = page.getByRole('button', { name: 'Right Hand' });
        this.shaftAttribute = page.getByRole('button', { name: 'Fujikura Ventus TR 6 Graphite' });
        this.loftAttribute = page.getByRole('button', { name: '9.0' });
        this.availableProductColorRewrite = page.locator("//button[contains(@class, 'pdp-color-swatch-selected') and not(contains(@class, 'disabled'))]");
        this.availableProductColor = page.locator("//img[contains(@class, 'img-color-swatch') and not(contains(@class, 'disabled'))]");
        this.availableBikeFrameSize = page.locator("//button[(contains(@aria-label,'S') or contains(@aria-label,'M') or contains(@aria-label,'L')) and not(contains(@class,'unavailable'))]");
        this.availableWheelSize = page.locator("//button[(contains(@aria-label,'27.5 IN.') or contains(@aria-label,'29 IN.')) and not(contains(@class,'unavailable'))]");
    
        this.changeStoreLink= page.locator("xpath=//div[contains(@class,'find-a-store')]")
        this.selectStoreZipField = page.getByPlaceholder('Enter Zip code')
        this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true })
        this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]')
        this.selectStoreButons = page.getByLabel('select store');

        //PDP Image Viewer
        this.viewAllImagesBtn = page.getByRole('button', { name:'View All'});
        this.viewLessImagesBtn = page.getByRole('button', {name:'View Less'});
        this.productImage = page.locator("(//img[@itemprop='image'])[1]");
        this.closeImageViewerBtn = page.locator('.lg-close.lg-icon');
        this.rightArrowBtn = page.locator('.lg-next.lg-icon');
        this.leftArrowBtn = page.locator('.lg-prev.lg-icon');
        this.zoomInBtn = page.locator('#lg-zoom-in.lg-icon');
        this.zoomOutBtn = page.locator('#lg-zoom-out.lg-icon');

        //PDP Favorites
        this.addToFavoritesBtn = page.getByRole('button', { name:'Add product to favorites'});
        this.addedToFavoritesBtn = page.getByLabel('Delete product from favorites');

        //PDP Reviews
        this.writeaReviewButton = page.getByRole('button', {name: 'Write A Review'})
        this.averageRatingLink = page.locator('//div[@itemprop="ratingValue"]');
        this.overallRatingStarsButtons = page.locator('(//span[contains(@aria-hidden,"true")])[5]');
        this.reviewTitle = page.getByPlaceholder('Example: Great features! (Maximum of 200 characters.)');
        this.reviewsTextField = page.getByPlaceholder('Example: I bought this a month ago and am so happy that I did...');
        this.nicknameInput = page.locator('#bv-text-field-usernickname');
        this.emailInput = page.getByPlaceholder('Example: youremail@example.com');
        this.reviewsTermsAndConditionsAgreenmentCheckBox = page.locator('#bv-checkbox-reviews-termsAndConditions');
        this.postReviewButton = page.getByRole('button', {name:'Post Review'});
        this.closeReviewsModalButton = page.getByRole('button', {name: 'Close'});

        this.reviewsCountNumber = page.locator('//div[@class="reviews-summary-text hmf-header-s hmf-ml-xxs hmf-pl-s-xxs hmf-pr-s-s"]');
        this.starsRatingValue = page.locator('(//*[@class="hmf-display-flex hmf-align-items-center"])[1]');
        this.reviewsPercentageAndwouldRecommendToAFriendText = page.locator('//div[@class="reviews-percentage w-100 text-center hmf-subheader-m ng-star-inserted"]');

        //Related Products Sections
        this.youMayAlsoLikeSection = page.getByText('You May Also Like');
        this.sponsoredProductsSection = page.getByText('Sponsored Products');
        this.customersAlsoBoughtSection = page.getByText('Customers Also Bought');
        this.recentlyViewedSection = page.getByText('Recently Viewed');
    }

    async setStoreFromPDP(zipcode: string,store: string): Promise<string> {
        const commonPage = new CommonPage(this.page);

        await this.changeSelectedStoreLink.click();
        await this.selectStoreZipField.click();
        await this.selectStoreZipField.fill(zipcode);
        await this.selectStoreSearchButton.click();
        await commonPage.sleep(1);

        await this.selectStoreNames.last().waitFor();
        const storeNames = await this.selectStoreNames.allInnerTexts();

        console.log("store count: " + storeNames.length);

        const storeMatchValue = store;
        const indexOfStoreFirstMatch = getIndexThatIncludesFirstMatch(storeNames, storeMatchValue);
        const storeName = storeNames[indexOfStoreFirstMatch];

        console.log("storeName: " + storeName);
        console.log("storeIndex: " + indexOfStoreFirstMatch);

        await this.selectStoreButtons.nth(indexOfStoreFirstMatch).click();

        return storeName;
    }

    async generateRandomNickname() {
        const randomPart = Math.random().toString(36).substring(2, 8);
        const prefix = 'user';
        return `${prefix}_${randomPart}`;
      }
    
    async enterReviewsSearch(reviewsTitle, searchInput, email) {
        const commonPage = new CommonPage(this.page);
        const nickname = this.generateRandomNickname();

        await commonPage.fillTextField(this.reviewTitle, reviewsTitle)
        await this.overallRatingStarsButtons.click();
        await commonPage.fillTextField(this.reviewsTextField, searchInput);
        await commonPage.fillTextField(this.nicknameInput, await nickname);
        await commonPage.fillTextField(this.emailInput, email);
        await this.reviewsTermsAndConditionsAgreenmentCheckBox.click();
        await this.postReviewButton.click();
        await this.closeReviewsModalButton.click();
    }

    async verifyNumberOfReviews() {
        const reviewsNumber = await this.reviewsCountNumber.innerText();
        const reviewsNumberText = reviewsNumber.split(' ')[0];
        console.log('Numbers of reviews are: ' + reviewsNumberText);
    }

    async validateImageViewer() {
        const commonPage = new CommonPage(this.page);

        if(await this.viewAllImagesBtn.isVisible()) {
            await this.viewAllImagesBtn.click();
        } else {
            console.log('View All Images button is not present for this product');
            await expect(this.productImage).toBeVisible();
            await this.productImage.click();
        }

        for (let i = 0; i < 4; i++) {
            if(await this.rightArrowBtn.isVisible()) {
                await this.rightArrowBtn.click();
            } else {
                console.error('Right arrow button is not visible');
                break;
            }

            if (await this.leftArrowBtn.isVisible()) {
                await this.leftArrowBtn.click();
            } else {
                console.error('Left arrow button is not visible');
                break;
            }
        }

        if (await this.zoomInBtn.isVisible()) {
            await this.zoomInBtn.click();
        } else {
            console.error('Zoom in button is not visible');
        }

        if (await this.zoomOutBtn.isVisible()) {
            await this.zoomOutBtn.click();
        } else {
            console.error('Zoom out button is not visible');
        }
        await this.closeImageViewerBtn.click();
        console.log('Image Viewer actions work as expected');
    }

    async increaseProductQuantity(quantity) {
        await expect(this.quantityInput).toBeVisible();
        await this.quantityInput.click();
        await this.quantityInput.clear();
        await this.quantityInput.fill(quantity);
    }

    async checkProductAvailability() {
        const elementsDescription = await this.fulfillmentOptionsDescription.all();

        for (const element of elementsDescription) {
            const text = await element.innerText();
            console.log(text);

            if (text.includes('Select product options')) {
                throw new Error("'Select product options' found. Shipping options didn't adjust based on product's availability");
            } else {
                console.log("Shipping options adjusted based on product's availability");
            }
        }
    }
}