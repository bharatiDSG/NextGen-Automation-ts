import { FrameLocator, Locator, Page, expect } from '@playwright/test';
import { getNextValueFromArray, removeAllMatchingItemsFromArray } from '../lib/functions';

import { AccountSignInPage } from './AccountSignInPage';
import { CommonPage } from './CommonPage';
import axios from 'axios';
import { getBaseUrl } from '../globalSetup';

export interface PriceDetails {
  getOrderSubtotal: () => string | undefined;
  getEstimatedShipping: () => string | undefined;
  getStorePickup: () => string | undefined;
  getEstimatedTax: () => string | undefined;
  getEstimatedOrderTotal: () => string | undefined;
}

export class CartPage {
  private page: Page;
  readonly freeStorePickupRadioButtonText: Locator;
  readonly cartPriceDetails: Locator;
  readonly checkoutButton: Locator;
  readonly cartItemAmount: Locator;
  readonly cartLabel: Locator;
  readonly productLabel: Locator;
  readonly quantityInputText: Locator;
  readonly paypalIframe: FrameLocator;
  readonly paypalCheckoutButton: Locator;
  readonly cartProductQuantity: Locator;
  readonly cartProductName: Locator;
  readonly cartProductPrice: Locator;
  readonly cartDetailsArrow: Locator;
  readonly cartProductColor: Locator;
  readonly cartAlertMessage: Locator;
  readonly cartConfirmationHeader: Locator;
  readonly cartGiftCardCheckbox: Locator;
  readonly cartGiftCardTxt: Locator;
  readonly cartGiftCardLearnMoreLink: Locator;
  readonly cartScoreCardDiv: Locator;
  readonly cartScoreCardSignIn: Locator;
  readonly cartSignInPage: Locator;
  readonly cartPageBtnRemoveItem: Locator;
  readonly cartBtnContinue: Locator;
  readonly emptyCartButtonSinIn: Locator;
  readonly noRewardText: Locator;
  readonly cartSaveLaterLink: Locator;
  readonly deleteIcon: Locator;
  readonly individualProductName: Locator;
  readonly individualProductQuantity: Locator;
  readonly giftOption: Locator;
  readonly shipToZipCode: Locator;
  readonly zipCodeInput: Locator;
  readonly updateZipCodeButton: Locator;
  readonly sameDayDeliveryRadioButton: Locator;
  readonly confirmAndCheckoutBtn: Locator;
  readonly cartCommonProgressSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.freeStorePickupRadioButtonText = page.getByText('Free Store Pickup at');
    this.cartPriceDetails = page.locator('[analyticeventname="CartAction"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartItemAmount = page.locator('cart-valid-cart');
    this.cartLabel = page.locator("xpath=//h3[contains(text(),'Cart')]");
    this.productLabel = page.locator("//p[contains(@class,'product-name')]");
    this.quantityInputText = page.locator("xpath=//input[@aria-label='Quantity']");
    this.paypalIframe = page.frameLocator("xpath=//iframe[@title='PayPal' and contains(@name,'paypal')]");
    this.paypalCheckoutButton = this.paypalIframe.locator("xpath=//div[@aria-label='PayPal Checkout']");
    this.cartProductQuantity = page.locator('input[aria-label="Quantity"]');
    this.cartProductName = page.locator('p.product-name>a');
    this.cartProductPrice = page.locator('p.product-price');
    this.cartDetailsArrow = page.locator('p.details-toggle-text');
    this.cartProductColor = page.locator('span#cart-details-value');
    this.cartAlertMessage = page.locator('div.alert-message-text-wrapper>span>span');
    this.cartConfirmationHeader = page.locator('div.confirmation-header');
    this.cartGiftCardCheckbox = page.locator('div.gifting-container  homefield-checkbox');
    this.cartGiftCardTxt = page.locator('div.gifting-container  homefield-checkbox label');
    this.cartGiftCardLearnMoreLink = page.locator('div.gifting-container  a');
    this.cartScoreCardDiv = page.locator('div.easy-reward-content');
    this.cartScoreCardSignIn = page.locator('button#nonempty-cart-sign-in-button');
    this.cartSignInPage = page.locator('header p');
    this.cartPageBtnRemoveItem = page.locator('button[data-testid*="remove-item"]:nth-child(1)');
    this.cartBtnContinue = page.locator('button#continueShopping');
    this.emptyCartButtonSinIn = page.locator('button#empty-cart-sign-in-button');
    this.noRewardText = page.locator('p.no-reward-text');
    this.cartSaveLaterLink = page.locator('a.save-for-later-link');
    this.deleteIcon = page.locator('//img[@class="delete-icon"]');
    this.individualProductName = page.locator("//p[contains(@class,'product-name')]");
    this.giftOption = page.locator('//homefield-checkbox');
    this.shipToZipCode = page.locator("//a[contains(@class,'zip-code')]");
    this.zipCodeInput = page.locator("//input[@type='number']");
    this.updateZipCodeButton = page.getByTestId('button').first();
    this.sameDayDeliveryRadioButton = page.locator("//p[contains(text(),'Same Day Delivery')]");
    this.confirmAndCheckoutBtn = page.getByRole('button', { name: 'Confirm and Checkout' });
    this.cartCommonProgressSpinner = page.locator('//common-loading-overlay/div');

  }

  async getCartPriceDetailsArray(): Promise<string[]> {
    await this.cartPriceDetails.waitFor();
    const cartAction = (await this.cartPriceDetails.innerText()).split('\n');
    removeAllMatchingItemsFromArray(cartAction, '');
    console.log({ cartAction });
    return cartAction;
  }
  // Start - Use if you only need one price from the cart details object

  async getOrderSubtotal(): Promise<string | undefined> {
    const price = await this.getCartPriceDetailsObject();
    return price.getOrderSubtotal();
  }

  async getEstimatedShipping(): Promise<string | undefined> {
    const price = await this.getCartPriceDetailsObject();
    return price.getEstimatedShipping();
  }

  async getStorePickup(): Promise<string | undefined> {
    const price = await this.getCartPriceDetailsObject();
    return price.getStorePickup();
  }

  async getEstimatedTax(): Promise<string | undefined> {
    const price = await this.getCartPriceDetailsObject();
    return price.getEstimatedTax();
  }

  async getEstimatedOrderTotal(): Promise<string | undefined> {
    const price = await this.getCartPriceDetailsObject();
    return price.getEstimatedOrderTotal();
  }
  // End - Use if you only need one price from the cart details object

  // Use to get entire cart details object, then get prices
  public async getCartPriceDetailsObject(): Promise<PriceDetails> {
    const priceDetails: PriceDetails = {
      getOrderSubtotal: function () {
        return this.orderSubtotal;
      },
      getEstimatedShipping: function () {
        return this.estimatedShipping;
      },
      getStorePickup: function () {
        return this.storePickup;
      },
      getEstimatedTax: function () {
        return this.estimatedTax;
      },
      getEstimatedOrderTotal: function () {
        return this.estimatedOrderTotal;
      },
    };

    await this.cartPriceDetails.waitFor();
    const cartAction = (await this.cartPriceDetails.innerText()).split('\n');
    removeAllMatchingItemsFromArray(cartAction, '');

    const details = Object.create(priceDetails);
    details.orderSubtotal = getNextValueFromArray(cartAction, 'Order Subtotal');
    details.estimatedShipping = getNextValueFromArray(cartAction, 'Estimated Shipping');
    details.storePickup = getNextValueFromArray(cartAction, 'Store Pickup');
    details.estimatedTax = getNextValueFromArray(cartAction, 'Estimated Tax ');
    details.estimatedOrderTotal = getNextValueFromArray(cartAction, 'Estimated Order Total');

    return details;
  }

  async updateQuantity(quantity): Promise<void> {
    const commonPage = new CommonPage(this.page);
    await this.quantityInputText.click();
    await this.quantityInputText.fill(quantity.toString());
    await this.productLabel.click();
    await commonPage.sleep(2);
  }
  async clickCheckoutButton(): Promise<void> {
    await this.page.waitForLoadState('load');
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.checkoutButton.click();

  }
  async verifyCheckoutOptions(): Promise<void> {
    const commonPage = new CommonPage(this.page);
    await commonPage.waitUntilPageLoads();
    await this.checkoutButton.scrollIntoViewIfNeeded();
    commonPage.sleep(3);
    await commonPage.waitUntilPageLoads();
    await expect(this.paypalCheckoutButton).toBeVisible();

  }
  async verifyPayPalCheckout(): Promise<void> {
    const pagePromise = await this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage =  pagePromise;
    console.log(await newPage.title());
    newPage.close();

  }
  async doPayPalCheckout(): Promise<void> {
    const pagePromise = await this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage =  pagePromise;
    console.log(await newPage.title());

  }

  async verifyProductDetails(expectedDetails: { name: string; price: string }): Promise<void> {
    await expect(this.cartProductName).toHaveText(new RegExp(expectedDetails.name, 'i')); // 'i' for case-insensitive
    await expect(this.cartProductPrice).toContainText(expectedDetails.price);
    await this.cartDetailsArrow.click();
  }


  async verifyProductQuantity(lineItem: number, expectedQuantity: string): Promise<void> {
    // Assert the quantity is as expected
    await expect( this.cartProductQuantity.nth(lineItem - 1)).toHaveValue(expectedQuantity);
  }


  async updateProductQuantity(lineItem: number, expectedQuantity: string): Promise<void> {
    // Update the value attribute of the input field
    await this.cartProductQuantity.nth(lineItem - 1).fill(expectedQuantity);
    // Assert the quantity is as expected
    await this.cartProductName.first().click();
    await expect(this.cartCommonProgressSpinner).toHaveCount(0);
  }

  async verifyPShippingMedium(status: string): Promise<void> {
    // Fetch the shipping medium
    const isCheckedElement =  this.page.locator('[id*="cart-' + status + '"]').first();
    await expect(isCheckedElement).toBeChecked();
    // Assert the quantity is as expected
  }

  async verifyPaypalModal(strText: string): Promise<void> {
    try {

      const frameLocator = await this.paypalIframe.locator('div.paypal-button');
      const [multiPage] = await Promise.all([
        await this.page.waitForEvent('popup'),
        await frameLocator.click()
      ]);
      await multiPage.waitForLoadState();
      const pages = multiPage.context().pages();
      console.log('No.of tabs: ' + pages.length);
      const popupPage = pages[1];
      await popupPage.waitForLoadState();
      const label = popupPage.locator('h1#headerText');
      const labelTxt = await label.innerText();
      expect(labelTxt.trim()).toEqual(strText);
    } catch (error) {
      console.error('Failed to verify PayPal modal:', error);
    }
  }


  async signInAsRegisteredUser(userName: string, password: string) {
    await this.cartScoreCardSignIn.click();
    const accountSignInPage = new AccountSignInPage(this.page);
    await accountSignInPage.signInFromPDP(userName, password);
  }

  async deleteCartItems() {
    // await this.checkoutButton.waitFor();
    // const listOfDeleteItems= await this.page.$$("//img[@class='delete-icon']");
    // for await (const itemlist of listOfDeleteItems) {
    //   await this.page.locator("(//img[@class='delete-icon'])[1]").click();
    await this.page.waitForLoadState('domcontentloaded');
    const accessToken: string = await this.page.evaluate('window.accessToken');
    await this.deleteCartUsingAPI(accessToken);

  }

  async deleteNoOfCartItems(noOfProductsToBeDeleted: number) {
    await this.checkoutButton.waitFor();
    for (let index = 0; index < noOfProductsToBeDeleted; index++) {
      await this.deleteIcon.nth(1).click();
      // await this.page.locator("(//img[@class='delete-icon'])[1]").click();
    }
  }

  async getProductNames(): Promise<string[]> {
    await expect(this.cartCommonProgressSpinner).toHaveCount(0);
    await expect(this.individualProductName.first()).toBeVisible();
    const productNames: string[] = await this.individualProductName.allInnerTexts();
    console.log(productNames);
    return productNames;
  }

  async selectGiftOption() {
    await expect(this.giftOption).toBeVisible();
    await this.giftOption.click();
  }
  async clickChangeDeliveryZipCode() {
    await expect(this.shipToZipCode.first()).toBeVisible();
    await this.shipToZipCode.first().click();
  }
  async updateDeliveryZipcode(zipcode: string) {
    await expect(this.zipCodeInput.first()).toBeVisible();
    await this.zipCodeInput.first().clear();
    await this.zipCodeInput.first().fill(zipcode);
    await this.updateZipCodeButton.click();
  }
  async selectSameDayDeliveryRadioButton() {
    await expect(this.sameDayDeliveryRadioButton).toBeVisible();
    await this.sameDayDeliveryRadioButton.click();
  }
  async sameDayDeliveryCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
    await expect(this.confirmAndCheckoutBtn).toBeVisible();
    await this.confirmAndCheckoutBtn.click();
  }

  async deleteCartUsingAPI(token: string): Promise<void> {
    const finalAPIURL = getBaseUrl() + 'api/v1/carts';

    const headers = {
      'Authorization': `${token}`,
      'Cookie': 'AdditionalLanes=69,54,41,8,83,65; CHECKOUTSESSION=D54E9C786303ABABB38512935BEC5A1E; DCSG_NGX_CART_COUNT=0; DSG_CartQTY=0; NNC=1; akaalb_CHK_ALB=~op=CHK_API_ALB:CHK_Azure_API|~rv=38~m=CHK_Azure_API:0|~os=b834769be1dd4d72381443d311536027~id=336232a1a7b726846ce16d304ca4b2d5; akaalb_DSG_CART_ALB=~op=DSG_CART_ALB_API:DSG_CART_Azure_API|~rv=8~m=DSG_CART_Azure_API:0|~os=b834769be1dd4d72381443d311536027~id=6cf8657cd99cd5800ed15031b2857982; akaas_AS_EXP_DSG=2147483647~rv=76~id=8b6c58523bee8c43f28eb6950e66390c; cartCount=0; dih=desktop; dsg_perf_analysis=NB-0; swimlane_as_exp_dsg=76; whereabouts=20146'
    };
    try {
      const res = await axios.delete(finalAPIURL,
        {
          headers: headers,
          timeout: 25000
        }
      );
      console.log(res.status);
    } catch (error) {
      console.error(error.message);
      console.log(error.message);
    }
    console.log('test');
  }

}
