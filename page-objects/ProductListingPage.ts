import { Locator, Page } from '@playwright/test';

import { CommonPage } from './CommonPage';
import { getIndexThatIncludesFirstMatch } from '../lib/functions';

export class ProductListingPage {
    private page: Page;
    
    readonly changeSelectedStoreLink: Locator;
    readonly selectStoreZipField: Locator;
    readonly selectStoreSearchButton: Locator;
    readonly selectStoreNames: Locator;
    readonly selectStoreButtons: Locator;
    readonly pickupFilterButton: Locator;
    readonly productNames: Locator;

    constructor(page: Page) {
        this.page = page;

        // Select Store
        this.changeSelectedStoreLink = page.getByLabel('Change selected store from');
        this.selectStoreZipField = page.getByPlaceholder('Enter Zip code');
        this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true });
        this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]');
        this.selectStoreButtons = page.getByLabel('select store');

        this.pickupFilterButton = page.getByRole('button', { name: 'Pickup filter' });
        this.productNames = page.locator('[class="rs_product_description d-block"]');
    }

    async setStoreFromPLP(store: string): Promise<string> {
        const commonPage = new CommonPage(this.page);

        await this.changeSelectedStoreLink.click();
        await this.selectStoreZipField.click();
        await this.selectStoreZipField.fill('15108');
        await this.selectStoreSearchButton.click();
        await commonPage.sleep(1);

        await this.selectStoreNames.last().waitFor();
        const storeNames = await this.selectStoreNames.allInnerTexts();

        console.log("store count: " + storeNames.length);

        const storeMatchValue = store;
        const indexOfStoreFirstMatch = getIndexThatIncludesFirstMatch(storeNames, storeMatchValue);
        const storeName = storeNames[indexOfStoreFirstMatch];

        console.log("storeName: " + storeName);
        console.log("storeIndex: " + indexOfStoreFirstMatch);

        await this.selectStoreButtons.nth(indexOfStoreFirstMatch).click();

        return storeName;
    }

    async selectMatchingProduct(product: string): Promise<string> {
        await this.productNames.last().waitFor();
        const productNames = await this.productNames.allInnerTexts();

        console.log("product count: " + productNames.length);

        const matchValue = product;
        const indexOfProductFirstMatch = getIndexThatIncludesFirstMatch(productNames, matchValue);
        const productName = productNames[indexOfProductFirstMatch];

        console.log("productName: " + productName);
        console.log("productIndex: " + indexOfProductFirstMatch);

        await this.productNames.nth(indexOfProductFirstMatch).click();

        return productName;
    }
}