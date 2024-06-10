import { Locator, Page, expect } from '@playwright/test';

export class CommonPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async sleep(seconds: number): Promise<void> {
        const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));
        await sleep(seconds * 1000);
        console.log(`Sleep: ${seconds} seconds`);
    }

    async addCookieToBlockMedallia(): Promise<void> {
        await this.page.evaluate(() => {
            document.cookie = "BlockedTags=Medallia";
        });
    }

    async assertCheckboxIsChecked(checkbox: Locator): Promise<void> {
        await expect(checkbox).toBeChecked();
    }

    async addRewriteFlagToUrl(): Promise<void> {
        const currentUrl = this.page.url();
        console.log("URL actual:", currentUrl);
        const rewriteFlagUrl = currentUrl + '?flag_useQVProductService=true&flag_useQVProductTemplate=true';
        console.log('Rewrite flag added: ' + rewriteFlagUrl);
        await this.page.goto(rewriteFlagUrl);
    }

    async isTextVisible(locator: Locator, expectedText: string): Promise<boolean> {
        await expect(locator).toContainText(expectedText);
        await expect(locator).toBeVisible();
        console.log(`Text '${expectedText}' is VISIBLE`);
        return true;
    }

    async isElementVisibleAndEnabled(locator: Locator): Promise<boolean> {
        await expect(locator).toBeEnabled({ timeout: 15000 });
        await expect(locator).toBeVisible();
        console.log(`Element '${locator}}' is VISIBLE and ENABLED`);
        return true;
    }

    async scrollIfElementNotVisible(locator: Locator, maxRetries = 3): Promise<void> {
        let retries = maxRetries;
        while (retries > 0) {
            try {
                await expect(locator).toBeVisible({ timeout: 10000 });
                console.log(`Element: '${locator}' is VISIBLE`);
                return;
            } catch (e) {
                retries--;
                if (retries === 0) throw e;
            }
        }
    }

    async fillTextField(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    async isElementCentered(locator: Locator): Promise<boolean> {
        const isCentered = await locator.evaluate(element => {
            const computedStyle = window.getComputedStyle(element).textAlign;
            return computedStyle === 'center';
        });
        console.log('Element centered: ', isCentered);
        return isCentered;
    }
}
