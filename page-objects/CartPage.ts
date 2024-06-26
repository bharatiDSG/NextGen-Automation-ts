import { Locator, Page, expect } from '@playwright/test';
import { getNextValueFromArray, removeAllMatchingItemsFromArray } from '../lib/functions';
import { CommonPage } from './CommonPage';

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

  constructor(page: Page) {
    this.page = page;

    this.freeStorePickupRadioButtonText = page.getByText('Free Store Pickup at');
    this.cartPriceDetails = page.locator('[analyticeventname="CartAction"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartItemAmount = page.locator('cart-valid-cart');
    this.cartLabel = page.locator("xpath=//h3[contains(text(),'Cart')]");
    this.productLabel = page.locator("//p[contains(@class,'product-name')]");
    this.quantityInputText = page.locator("xpath=//input[@aria-label='Quantity']")
    this.paypalIframe= page.frameLocator("xpath=//iframe[@title='PayPal' and contains(@name,'paypal')]")
    this.paypalCheckoutButton= this.paypalIframe.locator("xpath=//div[@aria-label='PayPal Checkout']")
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
    const commonPage= new CommonPage(this.page)

    this.quantityInputText.click();
    this.quantityInputText.fill(quantity);
    await this.productLabel.click();
    await commonPage.sleep(2);
    await this.page.waitForLoadState("networkidle");
}
async clickCheckoutButton() : Promise<void> {
    const commonPage= new CommonPage(this.page)
    await this.page.waitForLoadState("load");
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.checkoutButton.click();

}
async verifyCheckoutOptions() : Promise<void> {
    const commonPage= new CommonPage(this.page)
    await commonPage.waitUntilPageLoads();
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.page.waitForLoadState("networkidle");
    commonPage.sleep(3);
    await commonPage.waitUntilPageLoads();
    await expect(this.paypalCheckoutButton).toBeVisible();

}
async verifyPayPalCheckout() : Promise<void>
{
    const pagePromise = this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage = await pagePromise;
    console.log(await newPage.title());
    newPage.close();

}
async doPayPalCheckout() : Promise<void>
{
    const pagePromise = this.page.context().waitForEvent('page');
    await this.paypalCheckoutButton.click();
    const newPage = await pagePromise;
    console.log(await newPage.title());
}
}
