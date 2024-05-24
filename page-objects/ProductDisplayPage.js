export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.locator('#add-to-cart');
        this.goToCartButton = page.locator('.atc-cart-link')
        this.shipToMeButton = page.getByRole('button', {name: 'Ship filter'})
        this.blueColorButton = page.getByRole('checkbox', {name: 'Blue'})
        this.pleaseSelectColor = page.locator("//*[contains(text(), 'Please Select Color')]")
        this.addedToCartMessage = page.locator("//*[contains(text(), 'ADDED TO CART')]")
        this.continueShoppingMessage = page.locator("//button[contains(text(), 'Continue Shopping')]");
        this.goToCartMessage = page.locator("//*[contains(text(), 'GO TO CART')]")
        this.oneItemCart = page.locator("//*[contains(text(), '1 item')]")
        this.colorsPDPList = page.locator("//div[contains(@class,'color-attributes-container pricing-color hmf-pl-s hmf-pl-m-0 sliding_row_inner not-pricing')]//button");
        this.shipToMeFullfilmentButton = page.locator('#pdp-homefield-ship-to-me')
    }
}





