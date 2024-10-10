import { expect, type Locator, type Page } from '@playwright/test';
import { getIndexThatIncludesFirstMatch } from '../lib/functions';
import { CommonPage } from './CommonPage';
import { getBaseUrl } from '../globalSetup.js';
import axios from 'axios';


import config from '../globalEnvironments.json';

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
  readonly womensClothingTitle: Locator;
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
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productColor: Locator;
  readonly productAvailability: Locator;
  readonly storePickup: Locator;
  readonly productAvailabilitystorePickup: Locator;
  readonly selectProductByColor: Locator;

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
  readonly favoritesDefaultListCheckBox: Locator;
  readonly saveFavoritesButton: Locator;
  //PDP Reviews
  readonly writeaReviewButton: Locator;
  readonly averageRatingLink: Locator;
  readonly overallRatingStarsButtons: Locator;
  readonly reviewTitle: Locator;
  readonly reviewsTextField: Locator;
  readonly nicknameInput: Locator;
  readonly emailInput: Locator;
  readonly reviewsTermsAndConditionsAgreenmentCheckBox: Locator;
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
  readonly productTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' });
    this.shipToMeButton = page.getByRole('button', {
      name: 'Ship'
    });
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
    this.freeStorePickupButton = page.getByLabel('Free Store Pickup').or(page.getByRole('button', { name: 'Free Store Pickup In stock at' }));
    this.changeStoreButton = page.getByRole('button', { name: 'Change Store' });
    this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability');
    this.zipCodeTextField = page.locator('input[id*="homefield-textinput-"]');
    this.storesNearMe = page.locator('.store-details-container > .hmf-button');
    this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true });
    this.sameDayDeliveryButton = page.locator('#pdp-same-day-delivery-button');
    this.changeZipCodeLink = page.locator('#pdp-change-zip-code-link');
    this.productQuantityTextFieldRewrite = page.getByLabel('Quantity');
    this.womensClothingBreadcrumb = page.locator("//a[@href='/c/womens-workout-clothes']");
    this.womensClothingTitle = page.getByRole('heading', { name: "Women's Clothing" });
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

    this.changeStoreLink = page.locator("xpath=//div[contains(@class,'find-a-store')]");
    this.selectStoreZipField = page.getByPlaceholder('Enter Zip code');
    this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true });
    this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]');
    this.selectStoreButons = page.getByLabel('select store');
    this.changeSelectedStoreLink = page.locator('button#pdp-change-store-link');
    this.productName = page.locator('h1.hmf-header-bold-m');
    this.productPrice = page.locator('span.product-price');
    this.productColor = page.locator('span.hmf-text-transform-none:nth-of-type(2)');
    this.productAvailability = page.locator('span.fulfillment-options-description div>span');
    this.storePickup = page.locator('div#pdp-in-store-pickup-button');
    this.selectProductByColor = page.locator('button.pdp-color-swatch-selected');
    this.productAvailabilitystorePickup = page.locator('div#pdp-in-store-pickup-button span.fulfillment-text>span');

    this.selectStoreButons = page.getByLabel('select store');

    //PDP Image Viewer
    this.viewAllImagesBtn = page.getByRole('button', { name: 'View All' });
    this.viewLessImagesBtn = page.getByRole('button', { name: 'View Less' });
    this.productImage = page.locator("(//img[@itemprop='image'])[1]");
    this.closeImageViewerBtn = page.locator('.lg-close.lg-icon');
    this.rightArrowBtn = page.locator('.lg-next.lg-icon');
    this.leftArrowBtn = page.locator('.lg-prev.lg-icon');
    this.zoomInBtn = page.locator('#lg-zoom-in.lg-icon');
    this.zoomOutBtn = page.locator('#lg-zoom-out.lg-icon');
    this.selectStoreButtons = page.locator("button[aria-label='select store']");

    //PDP Favorites
    this.addToFavoritesBtn = page.getByRole('button', { name: 'Add product to favorites' });
    this.addedToFavoritesBtn = page.getByLabel('Delete product from favorites');
    this.favoritesDefaultListCheckBox = page.locator('span.homefield-checkbox-span');
    this.saveFavoritesButton = page.getByRole('button', { name: 'Save' });

    //PDP Reviews
    this.writeaReviewButton = page.getByRole('button', { name: 'Write A Review' });
    this.averageRatingLink = page.locator('//div[@itemprop="ratingValue"]');
    this.overallRatingStarsButtons = page.locator('(//span[contains(@aria-hidden,"true")])[5]');
    this.reviewTitle = page.getByPlaceholder('Example: Great features! (Maximum of 200 characters.)');
    this.reviewsTextField = page.getByPlaceholder('Example: I bought this a month ago and am so happy that I did...');
    this.nicknameInput = page.locator('#bv-text-field-usernickname');
    this.emailInput = page.getByPlaceholder('Example: youremail@example.com');
    this.reviewsTermsAndConditionsAgreenmentCheckBox = page.locator('#bv-checkbox-reviews-termsAndConditions');
    this.postReviewButton = page.getByRole('button', { name: 'Post Review' });
    this.closeReviewsModalButton = page.getByRole('button', { name: 'Close' });

    this.reviewsCountNumber = page.locator('//div[@class="reviews-summary-text hmf-header-s hmf-ml-xxs hmf-pl-s-xxs hmf-pr-s-s"]');
    this.starsRatingValue = page.locator('(//*[@class="hmf-display-flex hmf-align-items-center"])[1]');
    this.reviewsPercentageAndwouldRecommendToAFriendText = page.locator('//div[@class="reviews-percentage w-100 text-center hmf-subheader-m ng-star-inserted"]');

    //Related Products Sections
    this.youMayAlsoLikeSection = page.getByText('You May Also Like');
    this.sponsoredProductsSection = page.getByText('Sponsored Products');
    this.customersAlsoBoughtSection = page.getByText('Customers Also Bought');
    this.recentlyViewedSection = page.getByText('Recently Viewed');

    this.productTitle = page.locator('//h1[@itemprop="name"]');
  }

  async setStoreFromPDP(zipcode: string, store: string): Promise<string> {
    const commonPage = new CommonPage(this.page);
    await commonPage.sleep(5);
    await this.changeSelectedStoreLink.nth(0).click();
    await this.selectStoreZipField.click();
    await this.selectStoreZipField.fill(zipcode);
    await this.selectStoreSearchButton.click();
    await commonPage.sleep(5);

    await this.selectStoreNames.last().waitFor();
    const storeNames = await this.selectStoreNames.allInnerTexts();

    console.log('store count: ' + storeNames.length);

    const storeMatchValue = store;
    const indexOfStoreFirstMatch = getIndexThatIncludesFirstMatch(storeNames, storeMatchValue);
    const storeName = storeNames[indexOfStoreFirstMatch];

    console.log('storeName: ' + storeName);
    console.log('storeIndex: ' + indexOfStoreFirstMatch);

    await this.selectStoreButtons.nth(indexOfStoreFirstMatch).click();

    return storeName;
  }

  async captureProductDetails(): Promise<{ name: string; price: string }> {
    await this.page.waitForTimeout(10000);

    // Use the Playwright API to get text content
    const name = await this.productName.textContent();
    const price = await this.productPrice.textContent();


    // Return the trimmed text content
    return {
      name: name?.trim() || '',
      price: price?.trim() || ''

    };
  }

  async verifyProductDisplayPage(): Promise<void> {
    expect(this.page.url()).toContain(getBaseUrl() + 'p/');
    await expect(this.productName.first()).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }

  async verifyProductAvailability(expectedStatus: string | number): Promise<void> {
    // Fetch the text of the input field
    const availabilityStatus = await this.productAvailability.textContent();

    // Assert the quantity is as expected
    expect(availabilityStatus?.trim()).toBe(String(expectedStatus));
  }

  async selectStorePickup(status:string): Promise<void> {
    console.log('The status is: '+status);
    await this.storePickup.click();
    await this.setStoreFromPDP('15108', 'Robinson');
  }




  async generateRandomNickname() {
    const randomPart = Math.random().toString(36).substring(2, 8);
    const prefix = 'user';
    return `${prefix}_${randomPart}`;
  }

  async enterReviewsSearch(reviewsTitle, searchInput, email) {
    const commonPage = new CommonPage(this.page);
    const nickname = this.generateRandomNickname();

    await commonPage.fillTextField(this.reviewTitle, reviewsTitle);
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
    if (await this.viewAllImagesBtn.isVisible()) {
      await this.viewAllImagesBtn.click();
    } else {
      console.log('View All Images button is not present for this product');
      await expect(this.productImage).toBeVisible();
      await this.productImage.click();
    }

    for (let i = 0; i < 4; i++) {
      if (await this.rightArrowBtn.isVisible()) {
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

  async increaseProductQuantity(quantityInput: Locator, quantity) {
    await expect(quantityInput).toBeVisible();
    await quantityInput.click();
    await quantityInput.clear();
    await quantityInput.fill(quantity);
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

  private skusWithAttributes: Map<string, string[]> = new Map<string, string[]>();
  private skusWithAvailability: Set<string> = new Set<string>();

  async verifyAttributesArePresentOrNotForShipToMe(): Promise<boolean> {
    await expect(this.productTitle.first()).toBeVisible();
    const hostUrl = getBaseUrl();
    let apiURL: string | null = null;
    if (hostUrl.includes('golfgalaxy')) {
      apiURL = config['app_gg_api'].baseUrl as string;
    } else if (hostUrl.includes('dsg') || hostUrl.includes('dickssportinggoods')) {
      apiURL = config['app_dsg_api'].baseUrl as string;;
    } else if (hostUrl.includes('pl')) {
      apiURL = config['app_pl_api'].baseUrl as string;;
    } else {
      console.info('Host did not contain appropriate name');
      return false;
    }
    console.log('The api Url is: ' + apiURL);
    const currentUrl = (await this.page).url();
    const productID = currentUrl.split('/')[4];
    const finalAPIURL = `${apiURL}${productID}`;
    console.log('The final Url is: ' + finalAPIURL);
    const res = await axios.get(finalAPIURL, { timeout: 25000 });
    const attArray = await res.data.productsData[0].style.definingAttributes;
    if (attArray.length > 0) {
      await this.getSKUsWithAttributes(res.data);
      console.log('Attributes present');
      return true;
    } else {
      console.log('No Attributes present');
      this.skusWithAttributes.clear();
      return false;
    }

  }

  async verifyAttributesArePresentOrNotForBOPIS(zipCode: string, storeSearch: string): Promise<boolean> {
    await expect(this.productTitle.first()).toBeVisible();
    const hostUrl = getBaseUrl();
    let apiURL: string | null = null;
    if (hostUrl.includes('golfgalaxy')) {
      apiURL = config['app_gg_api'].baseUrl as string;
    } else if (hostUrl.includes('dickssportinggoods')) {
      apiURL = config['app_dsg_api'].baseUrl as string;;
    } else if (hostUrl.includes('pl')) {
      apiURL = config['app_pl_api'].baseUrl as string;;
    } else {
      console.info('Host did not contain appropriate name');
      return false;
    }
    console.log('The api Url is: ' + apiURL);
    const currentUrl = this.page.url();
    const productID = currentUrl.split('/')[4];
    const finalAPIURL = `${apiURL}${productID}`;

    const res = await axios.get(finalAPIURL);

    const attArray = res.data.productsData[0].style.definingAttributes;
    console.log(attArray);
    if (attArray.length > 0) {
      await this.getSKUsWithAttributes(res.data);
      await this.getSKUsWithQuantity(zipCode, storeSearch);
      return true;
    } else {
      console.log('No Attributes present');
      return false;
    }
  }

  async getSKUsWithQuantity(zipcode: string, storeName: string | null): Promise<void> {
    const skus = Array.from(this.skusWithAttributes.keys());
    const skuWithCommaSeparated = skus.join(',');

    const address = `addr=${zipcode}&`;
    const radius = `radius=100&`;
    const uom = `uom=imperial&`;
    const lob = `lob=gg,dsg&`;
    const skusForAPICall = `sku=${skuWithCommaSeparated}&`;
    const res = `res=locatorsearch`;

    const hostUrl = getBaseUrl();
    let apiURL: string | null = null;

    if (!storeName) {
      storeName = 'robinson';
    }

    if (hostUrl.includes('golfgalaxy')) {
      apiURL = config['app_gg_dks_avail_api'].baseUrl as string;
    } else if (hostUrl.includes('dickssportinggoods') || hostUrl.includes('pl')) {
      apiURL = config['app_dsg_avail_api'].baseUrl as string;
    } else {
      console.info('Host did not contain appropriate name');
      return;
    }

    const finalAPIURL = `${apiURL}${address}${radius}${uom}${lob}${skusForAPICall}${res}`;

    console.log('The final quantity Url is: ' + finalAPIURL);

    const response = await axios.get(finalAPIURL);
    const quantityResponse = response.data;

    const skusArray = quantityResponse.data.results;
    const s = new Map<string, string>();

    for (const store of skusArray) {
      if (store.store.name.toUpperCase() === storeName.toUpperCase()) {
        for (const skuItem of store.skus) {
          const sku = skuItem.sku;
          const quantity = skuItem.qty.isa;
          s.set(sku, quantity);
        }
        break;
      }
    }

    const skusWithQuantity = Array.from(s.entries())
      .filter(([, value]) => value !== '0')
      .map(([key]) => key);

    this.skusWithAvailability = new Set(skusWithQuantity);
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSKUsWithAttributes(res: any): Promise<void> {
    this.skusWithAttributes.clear();
    const jsonObj = res;
    const skusArray = jsonObj.productsData[0].skus;

    for (const sku of skusArray) {
      console.log(sku.shipQty);
      if (sku.shipQty > 0) {
        const a: string[] = [];
        const definingAttr = sku.definingAttributes;
        const price = `price - ${sku.prices.offerPrice}`;
        a.push(price);
        for (const attribute of definingAttr) {
          const attr = `${attribute.name} - ${attribute.value}`;
          a.push(attr);
        }
        this.skusWithAttributes.set(sku.partNumber, a);
      }
    }

    // Refactored this for loop so keeping the old one until we verify it can be removed
    // for (let i = 0; i < skusArray.length; i++) {
    //   console.log(skusArray[i].shipQty);
    //   if (skusArray[i].shipQty > 0) {
    //     const a: string[] = [];
    //     const definingAttr = skusArray[i].definingAttributes;
    //     const price = `price - ${skusArray[i].prices.offerPrice}`;
    //     a.push(price);        
    //     for (let j = 0; j < definingAttr.length; j++) {
    //       const attr = `${definingAttr[j].name} - ${definingAttr[j].value}`;
    //       a.push(attr);
    //     }
    //     this.skusWithAttributes.set(skusArray[i].partNumber, a);
    //   }
    // }
  }

  async selectShipToMeAttributes(page: Page): Promise<void> {
    const commonPage = new CommonPage(this.page);
    console.log(this.skusWithAttributes);
    if (this.skusWithAttributes.size > 0) {
      const keysAsArray = Array.from(this.skusWithAttributes.keys());
      const randomSku = keysAsArray[Math.floor(Math.random() * keysAsArray.length)];
      const attr = this.skusWithAttributes.get(randomSku);
      if (attr) {
        for (const at of attr) {
          const attributeSet = at.split(' - ');
          console.log(attributeSet[0]);
          console.log(attributeSet[1]);
          switch (attributeSet[0]) {
            case 'Color':
              {
                console.info('Selecting attribute is: ' + attributeSet[0]);
                const randomColorXpath = `//img[@alt='${attributeSet[1]}']`;
                console.log(randomColorXpath);
                await commonPage.sleep(5);
                const colorPdp = page.locator(randomColorXpath);
                await colorPdp.click();
                break;
              }
            case 'Size':
            case 'Shoe Size':
            case 'Shoe Width':
            case 'Flex':
            case 'Hand':
            case 'Shaft':
            case 'Loft':
            case 'Wedge Bounce':
            case 'Wedge Grind/Sole':
            case 'Frame Size':
            case 'Wheel Size':
            case 'Drivetrain Manufacturer':
            case 'Sock Size':
            case 'Capacity':
              {
                console.info('Selecting attribute is: ' + attributeSet[0]);
                const randomXpath = `//button//span[text()='${attributeSet[1]}']`;
                await commonPage.sleep(5);
                const paramPdp = page.locator(randomXpath);
                await paramPdp.click();
                break;
              }
            case 'Length':
              {
                console.info('Selecting attribute is: ' + attributeSet[0]);
                const randomLengthXpath = `//button//span[contains(text(),"${attributeSet[1].split('"')[0]}")]`;
                page.locator(randomLengthXpath).click();;
                break;
              }
          }
        }
      }
    } else {
      //throw new Error('This product is not eligible for Ship To Me');
    }

  }


  async selectBOPISAttributes(page: Page): Promise<void> {

    const commonPage = new CommonPage(this.page);
    console.log('The skus with availability size is:  ' + this.skusWithAvailability.size);
    if (this.skusWithAvailability.size > 0) {
      console.log('The skus with attributes: ' + JSON.stringify(Array.from(this.skusWithAttributes.entries())));
      console.log('The skus with availabilities: ' + JSON.stringify(Array.from(this.skusWithAvailability)));
      const skusArray = Array.from(this.skusWithAvailability);
      const randomItem = Math.floor(Math.random() * skusArray.length);
      const randomSKU = skusArray[randomItem];
      const attr = this.skusWithAttributes.get(randomSKU);
      console.log('The random SKU is: ' + attr);
      if (attr) {
        for (const at of attr) {
          const attributeSet = at.split(' - ');
          console.log(attributeSet[0]);
          console.log(attributeSet[1]);
          switch (attributeSet[0].trim()) {
            case 'Color':
              {
                const randomColorXpath = `//img[@alt='${attributeSet[1].trim()}']/ancestor::button`;
                console.log('The color xpath is: ' + randomColorXpath);
                await commonPage.sleep(5);
                const paramPdp2 = page.locator(randomColorXpath);
                await paramPdp2.click();
                break;
              }
            case 'Size':
            case 'Shoe Size':
            case 'Shoe Width':
            case 'Flex':
            case 'Hand':
            case 'Shaft':
              {
                const randomShaftXpath = `//button//span[text()="${attributeSet[1].trim()}"]`;
                console.log('The size xpath is: ' + randomShaftXpath);
                await commonPage.sleep(5);
                const paramPdp1 = page.locator(randomShaftXpath);
                await paramPdp1.click();
                break;
              }
            case 'Loft':
            case 'Wedge Bounce':
            case 'Wedge Grind/Sole':
            case 'Frame Size':
            case 'Wheel Size':
            case 'Drivetrain Manufacturer':
            case 'Sock Size':
            case 'Capacity':
            case 'Grip':
              {
                const randomXpath = `//button//span[text()='${attributeSet[1].trim()}']`;
                await commonPage.sleep(5);
                const paramPdp = page.locator(randomXpath);
                await paramPdp.click();
                break;
              }
          }
        }
      }
    } else {
      //throw new Error('This product is not eligible for BOPIS');
    }
  }
}

















