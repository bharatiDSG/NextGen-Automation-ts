import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
    private page: Page;
    readonly searchField: Locator;
    readonly myAccountLink: Locator;
    readonly navigateToHomePageLink: Locator;
    readonly trendingSearchesText: Locator;
    readonly trendingSearchesLinks: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchField = page.locator('[id="searchInput"]').nth(1);
        this.myAccountLink = page.getByLabel('My Account: My Account');
        this.navigateToHomePageLink = page.getByRole('link', { name: 'Navigate to homepage' });
        this.trendingSearchesText = page.getByText('Trending Searches');
        this.trendingSearchesLinks = page.locator('[class="button-navigation"]');
    }

    async goToHomePage(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async searchForProduct(searchInput: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.searchField).toBeAttached();
        await expect(this.searchField).toBeEnabled();
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchField.scrollIntoViewIfNeeded();
        await this.searchField.click();
        await this.searchField.fill(searchInput);
        await this.searchField.press('Enter');
        await this.page.waitForLoadState('load');
    }

    async searchForProductWithSlowTyping(searchInput: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchField.scrollIntoViewIfNeeded();
        await this.searchField.click();
        await this.searchField.clear();
        await this.page.keyboard.type(searchInput, { delay: 100 });
        await this.page.keyboard.press('Enter');
    }

    async searchForProductWithSlowTypingNoEnter(searchInput: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchField.scrollIntoViewIfNeeded();
        await this.searchField.click();
        await this.searchField.clear();
        await this.page.keyboard.type(searchInput, { delay: 100 });
    }
}