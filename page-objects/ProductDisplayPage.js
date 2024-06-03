const { expect } = require('@playwright/test')
export class ProductDisplayPage {
    constructor(page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' })
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div')
        this.addToCartButton = page.locator('#add-to-cart')
        this.addToCartButtonRewrite = page.locator('#pdp-add-to-cart-button')
        this.goToCartButton = page.getByRole('link', { name: 'Go To Cart' })
        this.pleaseSelectColor = page.getByText('Please Select Color')
        this.addedToCartMessage = page.getByText('ADDED TO CART')
        this.continueShoppingButton = page.getByText('Continue Shopping')
        this.goToCartButton = page.getByText('GO TO CART')
        this.shipToMeFullfilmentButton = page.getByRole('button', { name: 'Ship' }).getByText('Available')
        this.freeStorePickupButton = page.locator('#pdp-in-store-pickup-button')
        this.changeStoreButton = page.getByRole('button', { name: 'Change Store' })
        this.availableProductColorRewrite = page.locator("//button[contains(@class, 'pdp-color-swatch-selected') and not(contains(@class, 'disabled'))]")
        this.availableProductColor = page.locator("//img[contains(@class, 'img-color-swatch') and not(contains(@class, 'disabled'))]")
        this.availableBikeFrameSize = page.locator("//button[(contains(@aria-label,'S') or contains(@aria-label,'M') or contains(@aria-label,'L')) and not(contains(@class,'unavailable'))]")
        this.availableWheelSize = page.locator("//button[(contains(@aria-label,'27.5 IN.') or contains(@aria-label,'29 IN.')) and not(contains(@class,'unavailable'))]")
        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability');
        this.zipCodeTextField = page.getByPlaceholder('Enter Zip code');
        this.storesNearMe = page.locator('.store-details-container > .hmf-button');
        this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true });
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





