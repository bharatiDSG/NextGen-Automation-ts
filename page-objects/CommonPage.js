const { expect } = require('@playwright/test')


export class CommonPage {

    constructor(page) {
        this.page = page
        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability')
        this.zipCodeTextField = getByPlaceholder('Enter Zip code')
        this.storesNearMe = page.locator('.store-details-container > .hmf-button')
        this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true })
    }

    async sleep(seconds) {
        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        await sleep(seconds * 1000)
        console.log("Sleep: " + seconds + " seconds")
    }


    async addCookieToBlockMedallia() {
        await this.page.evaluate(() => {
            document.cookie = "BlockedTags=Medallia"
        })
    }
    async assertCheckboxIsChecked(checkbox) {
        assertTrue(checkbox).isChecked();
    }

    async addRewriteFlagToUrl() {
            const currentUrl = this.page.url();
            console.log("URL actual:", currentUrl);
            const rewriteFlagUrl = currentUrl + '?flag_useQVProductService=true&flag_useQVProductTemplate=true';

            console.log('Rewrite flag added: ' + rewriteFlagUrl);
            await this.page.goto(rewriteFlagUrl);
    }

    async isTextVisible(locator, expectedText) {
        try {
            await expect(locator).toHaveText(expectedText)
            console.log(`Text '${expectedText}' is VISIBLE`)
            return true;
        } catch (error) {
            console.error(`Error: ${error.message}`)
            throw new Error(`Text '${expectedText}' is not VISIBLE`)
        }
    }
    
    async isElementVisibleAndEnabled(locator) {
        try {
            await expect(locator).toBeEnabled({ timeout: 15000 })
            await expect(locator).toBeVisible()
            console.log(`Element '${locator}}' is VISIBLE and ENABLED`)
            return true
        } catch (error) {
            console.error(`Element '${locator}' is not visible or enabled: ${error}`)
            throw new Error(`Element '${locator}' is not visible or enabled`)
    
        } 
    }

    async scrollIfElementNotVisible(locator, maxRetries = 3) {
        let retries = maxRetries
        while (retries > 0) {
            try {
                await expect(locator).toBeVisible({timeout:10000})
                console.log(`Element: '${locator}' is VISIBLE`)
            return
            } catch (error) {
                console.error(`Element '${locator}' is not visible: ${error}`)
                retries--;
                if (retries > 0) {
                    console.log(`Trying to scroll to element '${locator}'...`)
                    await locator.scrollIntoViewIfNeeded()
                }
            }
        }
        throw new Error(`Element '${locator}' is not visible`)
    }
    async fillTextField(locator, text) {
        await locator.fill(text)
    }
    async isElementCentered(locator) {
        const isCentered = await locator.evaluate(element => {
            const computedStyle = window.getComputedStyle(element).textAlign
            return computedStyle === 'center'
        })
        console.log('Element centered: ', isCentered)
        return isCentered
        }

}
