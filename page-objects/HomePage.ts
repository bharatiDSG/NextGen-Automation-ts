import { Locator, Page } from '@playwright/test';

export class HomePage {
    private page: Page;
    readonly searchField: Locator;
    readonly myAccountLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchField = page.locator('[id="searchInput"]').nth(1);
        this.myAccountLink = page.getByRole('link', { name: 'My Account Sign In to Earn' });
    }

    async goToHomePage(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async searchForProduct(searchInput: string): Promise<void> {
        await this.searchField.click();
        await this.searchField.fill(searchInput);
        await this.searchField.press('Enter');
    }

    async searchForProductWithSlowTyping(searchInput: string): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        await this.searchField.scrollIntoViewIfNeeded()
        await this.searchField.click();
        await this.searchField.clear()
        await this.page.keyboard.type(searchInput, { delay: 100 })
        await this.page.keyboard.press('Enter');
    }

    async searchForProductWithSlowTypingNoEnter(searchInput: string): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
        await this.searchField.scrollIntoViewIfNeeded()
        await this.searchField.click();
        await this.searchField.clear()
        await this.page.keyboard.type(searchInput, { delay: 100 })
    }
}