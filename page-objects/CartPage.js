import { getNextValueFromArray, removeAllMatchingItemsFromArray } from '../lib/functions.js';

export class CartPage {
    constructor(page) {
        this.page = page;

        this.freeStorePickupRadioButtonText = page.getByText('Free Store Pickup at');
        this.cartPriceDetails = page.locator('[analyticeventname="CartAction"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });

    }

    async getCartPriceDetailsArray() {
        await this.cartPriceDetails.waitFor()
        const cartAction = (await this.cartPriceDetails.innerText()).split("\n")
        removeAllMatchingItemsFromArray(cartAction, '')
        console.log({ cartAction })
        return cartAction;
    }


    // Start - Use if you only need one price from the cart details object
    async getOrderSubtotal() {
        const price = await this.getCartPriceDetailsObject()
        return price.getOrderSubtotal()
    }

    async getEstimatedShipping() {
        const price = await this.getCartPriceDetailsObject()
        return price.getEstimatedShipping()
    }

    async getStorePickup() {
        const price = await this.getCartPriceDetailsObject()
        return price.getStorePickup();
    }

    async getEstimatedTax() {
        const price = await this.getCartPriceDetailsObject()
        return price.getEstimatedTax()
    }

    async getEstimatedOrderTotal() {
        const price = await this.getCartPriceDetailsObject()
        return price.getEstimatedOrderTotal()
    }
    // End - Use if you only need one price from the cart details object

    // Use to get entire cart details object, then get prices
    async getCartPriceDetailsObject() {

        const priceDetails = {

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

        await this.cartPriceDetails.waitFor()
        const cartAction = (await this.cartPriceDetails.innerText()).split("\n")
        removeAllMatchingItemsFromArray(cartAction, '')
        // console.log({ cartAction })

        const details = Object.create(priceDetails);
        details.orderSubtotal = getNextValueFromArray(cartAction, 'Order Subtotal')
        details.estimatedShipping = getNextValueFromArray(cartAction, 'Estimated Shipping')
        details.storePickup = getNextValueFromArray(cartAction, 'Store Pickup')
        details.estimatedTax = getNextValueFromArray(cartAction, 'Estimated Tax ')
        details.estimatedOrderTotal = getNextValueFromArray(cartAction, 'Estimated Order Total')

        return details;

        // const orderSubtotal = getNextValueFromArray(cartPriceDetailsArray, 'Order Subtotal')
        // console.log({ orderSubtotal })

        // const estimatedShipping = getNextValueFromArray(cartPriceDetailsArray, 'Estimated Shipping')
        // console.log({ estimatedShipping })

        // const storePickup = getNextValueFromArray(cartPriceDetailsArray, 'Store Pickup')
        // console.log({ storePickup })

        // const estimatedTax = getNextValueFromArray(cartPriceDetailsArray, 'Estimated Tax ')
        // console.log({ estimatedTax })

        // const estimatedOrderTotal = getNextValueFromArray(cartPriceDetailsArray, 'Estimated Order Total')
        // console.log({ estimatedOrderTotal })

        // const cartPriceDetailsObject = 
    }


}