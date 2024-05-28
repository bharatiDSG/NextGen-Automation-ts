export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.locator('#pdp-add-to-cart-button')
        this.goToCartButton = page.getByRole('link', { name: 'GO TO CART' })

    }
}





