export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.shipToMeButton = page.getByRole('button', { name: 'Ship' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.locator('#pdp-add-to-cart-button')
        this.addToCartButtonProd = page.locator('#add-to-cart')
        this.goToCartButton = page.getByRole('link', { name: 'GO TO CART' })

        //PDP attributes
        this.flexAttribute = page.getByRole('button',{ name: 'Tour Flex'})
        this.handAttribute = page.getByRole('button',{ name: 'Right Hand'})
        this.shaftAttribute = page.getByRole('button',{ name: 'Fujikura Ventus TR 6 Graphite'})
        this.loftAttribute = page.getByRole('button',{ name: '9.0'})

    }
}





