import { expect } from '@playwright/test';
export class CommonPage {

    constructor(page) {
        this.page = page;
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
        await expect(checkbox).toBeChecked();
    }

    async addRewriteFlagToUrl() {
            const currentUrl = this.page.url();
            console.log("URL actual:", currentUrl);
            const rewriteFlagUrl = currentUrl + '?flag_useQVProductService=true&flag_useQVProductTemplate=true';

            console.log('Rewrite flag added: ' + rewriteFlagUrl);
            await this.page.goto(rewriteFlagUrl);
    }

    async isTextVisible(locator, expectedText) {
            await expect(locator).toContainText(expectedText);
            await expect(locator).toBeVisible();
            console.log(`Text '${expectedText}' is VISIBLE`)
            return true;
    }
    
    
    async isElementVisibleAndEnabled(locator) {
            await expect(locator).toBeEnabled({ timeout: 15000 })
            await expect(locator).toBeVisible()
            console.log(`Element '${locator}}' is VISIBLE and ENABLED`)
            return true
    }

    async scrollIfElementNotVisible(locator, maxRetries = 3) {
        let retries = maxRetries
        while (retries > 0) {
                await expect(locator).toBeVisible({timeout:10000})
                console.log(`Element: '${locator}' is VISIBLE`)
                return

        }
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
