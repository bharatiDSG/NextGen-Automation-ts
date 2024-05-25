import { expect } from "@playwright/test";

export class HomePage {
    constructor(page) {
        this.page = page;

        this.searchField = page.locator('[id="searchInput"]').first()
        this.myAccountLink = page.getByRole('link', { name: 'My Account Sign In to Earn' });
    }

    async goToHomePage(url) {
        await this.page.goto(url);
    }

    async searchForProduct(searchInput) {
        await this.searchField.waitFor()
        await this.searchField.click()
        await this.searchField.fill(searchInput)
        await this.searchField.press('Enter')
    }


}