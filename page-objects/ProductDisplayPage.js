export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.locator('#add-to-cart')
        this.goToCartButton = page.locator('.atc-cart-link')
        this.shipToMeButton = page.getByRole('button', {name: 'Ship filter'})
        this.colorFilterButton = page.locator('#facet_list_label_Color');
        this.blueColorButton = page.getByRole('checkbox', {name: 'Blue'})
        this.pleaseSelectColor = page.locator("//*[contains(text(), 'Please Select Color')]")
        this.addedToCartMessage = page.locator("//*[contains(text(), 'ADDED TO CART')]")
        this.continueShoppingMessage = page.locator("//button[contains(text(), 'Continue Shopping')]")
        this.goToCartMessage = page.locator("//*[contains(text(), 'GO TO CART')]")
        this.oneItemCart = page.locator("//*[contains(text(), '1 item')]")
        this.colorsPDPList = page.locator("//button/div[contains(@class, 'color-swatch-wrapper')]")
        this.shipToMeFullfilmentButton = page.locator('#pdp-homefield-ship-to-me')
        this.freeStorePickupButton = page.locator('pdp-feature-in-store-pickup-button')
        this.changeStoreButton = getByRole('button', { name: 'Change Store' })
        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability')
    }

    async selectFirstColorOption(colorsPDPList) {
        const colorButtons = await this.colorsPDPList.count()
        if (colorButtons > 0) {
            await this.colorsPDPList.first().click()
            console.log("First color option clicked")
        } else {
            throw new Error('Cannot select color option')
        }  
    }
}





