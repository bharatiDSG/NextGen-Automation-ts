import { Locator, Page } from '@playwright/test';
import { getNextValueFromArray, removeAllMatchingItemsFromArray } from '../lib/functions';

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

  constructor(page: Page) {
    this.page = page;

    this.freeStorePickupRadioButtonText = page.getByText('Free Store Pickup at');
    this.cartPriceDetails = page.locator('[analyticeventname="CartAction"]');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.cartItemAmount = page.locator('cart-valid-cart');
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
}
