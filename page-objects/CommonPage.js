const { expect } = require('@playwright/test');


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

    async addRewriteFlagToUrl() {
            const currentUrl = this.page.url();
            console.log("URL actual:", currentUrl);
            const rewriteFlagUrl = currentUrl + 'flag_useQVProductService=true&flag_useQVProductTemplate=true';

            console.log('Rewrite flag added: ' + rewriteFlagUrl);
            await this.page.goto(rewriteFlagUrl);
        }
    }

    export async function isTextVisible(page, locator, expectedText) {
        try {
            await expect(locator).toHaveText(expectedText);
            console.log(`Text '${expectedText}' is VISIBLE`);
            return true;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw new Error(`Text '${expectedText}' is not VISIBLE`);
        }
    }

    export async function selectFirstColorOption(productDisplayPage, colorsPDPList) {
        const colorButtons = await colorsPDPList.count();
        if (colorButtons > 0) {
            await productDisplayPage.colorsPDPList.first().click();
            console.log("First color option clicked");
        } else {
            throw new Error('Cannot select color option');
        }      
    }

    
