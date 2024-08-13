import { Locator, Page, expect } from '@playwright/test';
import { getNextValueFromArray, removeAllMatchingItemsFromArray } from '../lib/functions';
import { CommonPage } from './CommonPage';
import { AccountSignInPage } from './AccountSignInPage';

interface PriceDetails {
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
  readonly paypalIframe: any;
  readonly paypalCheckoutButton: any;
  readonly cartProductQuantity: any;
  readonly cartProductName: any;
  readonly cartProductPrice: any;
  readonly cartDetailsArrow: any;
  readonly cartProductColor: any;
  readonly cartAlertMessage: any;
  readonly cartConfirmationHeader: any;
  readonly cartGiftCardCheckbox: any;
  readonly cartGiftCardTxt: any;
  readonly cartGiftCardLearnMoreLink: any;
  readonly cartScoreCardDiv: any;
  readonly cartScoreCardSignIn: any;
  readonly cartSignInPage: any;
  readonly cartPageBtnRemoveItem: any;
  readonly cartBtnContinue: any;
  readonly emptyCartButtonSinIn: any;
  readonly noRewardText: any;
  readonly cartSaveLaterLink: any;
  readonly deleteIcon:Locator;
  individualProductName: Locator;
  readonly individualProductQuantity: Locator;
  giftOption: Locator;
  shipToZipCode: Locator;
  zipCodeInput: Locator;
  updateZipCodeButton: Locator;
  sameDayDeliveryRadioButton: Locator;
  confirmAndCheckoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.freeStorePickupRadioButtonText = page.getByText('Free Store Pickup at');
    this.cartPriceDetails = page.locator('[analyticeventname="CartAction"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartItemAmount = page.locator('cart-valid-cart');
    this.cartLabel = page.locator("xpath=//h3[contains(text(),'Cart')]");
    this.productLabel = page.locator("//p[contains(@class,'product-name')]");
    this.quantityInputText = page.locator("xpath=//input[@aria-label='Quantity']")
    this.paypalIframe = page.frameLocator("xpath=//iframe[@title='PayPal' and contains(@name,'paypal')]")
    this.paypalCheckoutButton = this.paypalIframe.locator("xpath=//div[@aria-label='PayPal Checkout']")
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
    this.deleteIcon=page.locator('//img[@class="delete-icon"]');
    this.individualProductName=page.locator("//p[contains(@class,'product-name')]");
    this.giftOption=page.locator("//homefield-checkbox");
    this.shipToZipCode=page.locator("//a[contains(@class,'zip-code')]");
    this.zipCodeInput= page.locator("//input[@type='number']")
    this.updateZipCodeButton=page.getByTestId('button')
    this.sameDayDeliveryRadioButton= page.locator("//p[contains(text(),'Same Day Delivery')]")
    this.confirmAndCheckoutBtn=page.getByRole('button', { name: 'Confirm and Checkout' })
    
  }

  async getCartPriceDetailsArray(): Promise<string[]> {
    await this.cartPriceDetails.waitFor();
    const cartAction = (await this.cartPriceDetails.innerText()).split("\n");
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
    const cartAction = (await this.cartPriceDetails.innerText()).split("\n");
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
    const commonPage = new CommonPage(this.page)
    await this.quantityInputText.click();
    await this.quantityInputText.fill(quantity.toString());
    await this.productLabel.click();
    await commonPage.sleep(2);
    await this.page.waitForLoadState("networkidle");
  }
  async clickCheckoutButton(): Promise<void> {
    const commonPage = new CommonPage(this.page)
    await this.page.waitForLoadState("load");
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.checkoutButton.click();

  }
  async verifyCheckoutOptions(): Promise<void> {
    const commonPage = new CommonPage(this.page)
    await commonPage.waitUntilPageLoads();
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("networkidle");
    commonPage.sleep(3);
    await commonPage.waitUntilPageLoads();
    await expect(this.paypalCheckoutButton).toBeVisible();

  }
  async verifyPayPalCheckout(): Promise<void> {
    const pagePromise = this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage = await pagePromise;
    console.log(await newPage.title());
    newPage.close();

  }
  async doPayPalCheckout(): Promise<void> {
    const pagePromise = this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage = await pagePromise;
    console.log(await newPage.title());

  }

  async verifyProductDetails(expectedDetails: { name: any; price: any }): Promise<void> {
    await expect(this.cartProductName).toHaveText(new RegExp(expectedDetails.name, 'i')); // 'i' for case-insensitive
    await expect(this.cartProductPrice).toContainText(expectedDetails.price);
    await this.cartDetailsArrow.click();
  }


  async verifyProductQuantity(lineItem: number, expectedQuantity: string): Promise<void> {
    // Fetch the value attribute of the input field
    const quantityValue = await this.cartProductQuantity.nth(lineItem - 1).inputValue();
    // Assert the quantity is as expected
    expect(quantityValue.trim()).toBe(String(expectedQuantity));
  }


  async updateProductQuantity(lineItem: number, expectedQuantity: string): Promise<void> {
    // Update the value attribute of the input field
    await this.cartProductQuantity.nth(lineItem - 1).fill(expectedQuantity);
    // Assert the quantity is as expected
    await this.cartProductName.first().click();
  }

  async verifyPShippingMedium(status: string): Promise<void> {
    // Fetch the shipping medium
    const locator = await this.page.locator('mat-radio-button[id*="cart-' + status + '"][class*="checked"]');
    // Assert the quantity is as expected
  }

  async verifyPaypalModal(strText: string): Promise<void> {

    const frameLocator = await this.paypalIframe.locator('div.paypal-button')
    const [multiPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      await frameLocator.click()
    ])
    await multiPage.waitForLoadState();
    const pages = multiPage.context().pages();
    console.log('No.of tabs: ' + pages.length);
    const popupPage = pages[1];
    await popupPage.waitForLoadState();
    const label = popupPage.locator('h1#headerText');
    const labelTxt = await label.innerText();
    expect(labelTxt.trim()).toEqual(strText);
  } catch(error: string) {
    console.error('Failed to verify PayPal modal:', error);
  }

  async signInAsRegisteredUser(userName:string,  password:string)
  {
    await this.cartScoreCardSignIn.click();
    const accountSignInPage = new AccountSignInPage(this.page);
    await accountSignInPage.signInFromPDP(userName,password)
  }

  async deleteCartItems()
  {
    await this.checkoutButton.waitFor();
    const listOfDeleteItems= await this.page.$$("//img[@class='delete-icon']");
    for await (const itemlist of listOfDeleteItems) {
      await this.page.locator("(//img[@class='delete-icon'])[1]").click();
      await this.page.waitForLoadState("domcontentloaded");
  }
  
}
async deleteNoOfCartItems(noOfProductsToBeDeleted:number)
  {
    await this.checkoutButton.waitFor();
    const listOfDeleteItems= await this.page.$$("//img[@class='delete-icon']");
    for (let index = 0; index < noOfProductsToBeDeleted; index++) {
      await this.page.locator("(//img[@class='delete-icon'])[1]").click();
      await this.page.waitForLoadState("domcontentloaded");
      
    }
  
}
async getProductNames():Promise<String[]>
    {
        await expect(this.individualProductName.first()).toBeVisible();
        let productNames: Array<String>= await this.individualProductName.allInnerTexts();
        console.log(productNames)
        return productNames;
    }

    async selectGiftOption()
    {
      await expect(this.giftOption).toBeVisible();
      await this.giftOption.click();
    }
    async clickChangeDeliveryZipCode()
    {
      await expect(this.shipToZipCode.first()).toBeVisible();
      await this.shipToZipCode.first().click();
    }
    async updateDeliveryZipcode(zipcode:string)
    {
      await expect(this.zipCodeInput.first()).toBeVisible();
      await this.zipCodeInput.first().clear();
      await this.zipCodeInput.first().fill(zipcode);
      await this.updateZipCodeButton.click();
    }
    async selectSameDayDeliveryRadioButton()
    {
      await expect(this.sameDayDeliveryRadioButton).toBeVisible();
      await this.sameDayDeliveryRadioButton.click();
    }
    async sameDayDeliveryCheckout()
    {
      await expect(this.checkoutButton).toBeVisible();
      await this.checkoutButton.click();
      await expect(this.confirmAndCheckoutBtn).toBeVisible();
      await this.confirmAndCheckoutBtn.click();
    }


  

}
