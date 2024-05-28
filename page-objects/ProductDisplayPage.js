export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.getByRole('button', { name: 'ADD TO CART', exact: true })
        this.firstColorAvailable = page.locator('(//button//div[contains(@class, "color-swatch-wrapper")])[1]')
        this.goToCartButton = page.locator('.atc-cart-link')
        this.pleaseSelectColor = page.getByText('Please Select Color')
        this.addedToCartMessage = page.getByText('ADDED TO CART')
        this.continueShoppingMessage = page.getByText('Continue Shopping')
        this.goToCartMessage = page.getByText('GO TO CART')
        this.oneItemCart = page.getByText('1 item')
        this.shipToMeFullfilmentButton = page.getByRole('button', { name: 'Ship' }).getByText('Available')
        this.freeStorePickupButton = page.locator('pdp-feature-in-store-pickup-button')
        this.changeStoreButton = getByRole('button', { name: 'Change Store' })
        this.availableProductColor = page.locator("//button[contains(@class, 'pdp-color-swatch-selected') and not(contains(@class, 'disabled'))]")
        this.availableBikeFrameSize = page.locator("//button[contains(@class, 'large-variant') and not(contains(@class, 'unavailable'))]")
        this.page.locator('#pdp-atc-succes-cart-btn').toContainText('Go To Cart');
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





