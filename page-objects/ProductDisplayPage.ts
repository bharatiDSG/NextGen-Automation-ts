import { type Locator, type Page } from '@playwright/test';
import { getIndexThatIncludesFirstMatch } from '../lib/functions';
import { CommonPage } from './CommonPage';

export class ProductDisplayPage {
    private page: Page;

    readonly storePickupEnabledButton: Locator;
    readonly shipToMeButton: Locator;
    readonly storePickupSubText: Locator;
    readonly addToCartButton: Locator;
    readonly addToCartButtonRewrite: Locator;
    readonly goToCartButton: Locator;
    readonly pleaseSelectColor: Locator;
    readonly addedToCartMessage: Locator;
    readonly continueShoppingButton: Locator;
    readonly shipToMeFullfilmentButton: Locator;
    readonly freeStorePickupButton: Locator;
    readonly changeStoreButton: Locator;
    readonly availableWheelSize: Locator;
    readonly storesWithAvailabilityCheckbox: Locator;
    readonly zipCodeTextField: Locator;
    readonly storesNearMe: Locator;
    readonly selectStoreModalCloseButton: Locator;
    readonly productQuantityTextFieldRewrite: Locator;
    
    // PDP attributes
    readonly flexAttribute: Locator;
    readonly handAttribute: Locator;
    readonly shaftAttribute: Locator;
    readonly loftAttribute: Locator;
    readonly availableProductColorRewrite: Locator;
    readonly availableProductColor: Locator;
    readonly availableBikeFrameSize: Locator;
    readonly changeStoreLink: Locator;
    readonly selectStoreZipField: Locator;
    readonly selectStoreSearchButton: Locator;
    readonly selectStoreNames: Locator;
    readonly selectStoreButons: Locator;
    readonly changeSelectedStoreLink: Locator;
    readonly selectStoreButtons: Locator;
    readonly goToCartButtonProd: Locator;

    constructor(page: Page) {
        this.page = page;

        this.storePickupEnabledButton = page.getByRole('button', { name: 'Free Store Pickup In stock at' });
        this.shipToMeButton = page.getByRole('button', { name: 'Ship' });
        this.storePickupSubText = page.locator('#pdp-in-store-pickup-subtext div');
        this.addToCartButton = page.locator("xpath=//button[@id='pdp-add-to-cart-button']|//button[@id='add-to-cart']");
        this.addToCartButtonRewrite = page.locator('#pdp-add-to-cart-button');
        this.goToCartButton = page.getByRole('link', { name: 'Go To Cart' });
        this.goToCartButtonProd = page.getByRole('link', { name: 'GO TO CART' });
        this.pleaseSelectColor = page.getByText('Please Select Color');
        this.addedToCartMessage = page.getByText('ADDED TO CART');
        this.continueShoppingButton = page.getByText('Continue Shopping');
        this.goToCartButton = page.getByText('GO TO CART');
        this.shipToMeFullfilmentButton = page.getByRole('button', { name: 'Ship' }).getByText('Available');
        this.freeStorePickupButton = page.locator('#pdp-in-store-pickup-button');
        this.changeStoreButton = page.getByRole('button', { name: 'Change Store' });
        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability');
        this.zipCodeTextField = page.getByPlaceholder('Enter Zip code');
        this.storesNearMe = page.locator('.store-details-container > .hmf-button');
        this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true });
        this.productQuantityTextFieldRewrite = page.getByLabel('Quantity');

        // PDP attributes
        this.flexAttribute = page.getByRole('button', { name: 'Tour Flex' });
        this.handAttribute = page.getByRole('button', { name: 'Right Hand' });
        this.shaftAttribute = page.getByRole('button', { name: 'Fujikura Ventus TR 6 Graphite' });
        this.loftAttribute = page.getByRole('button', { name: '9.0' });
        this.availableProductColorRewrite = page.locator("//button[contains(@class, 'pdp-color-swatch-selected') and not(contains(@class, 'disabled'))]");
        this.availableProductColor = page.locator("//img[contains(@class, 'img-color-swatch') and not(contains(@class, 'disabled'))]");
        this.availableBikeFrameSize = page.locator("//button[(contains(@aria-label,'S') or contains(@aria-label,'M') or contains(@aria-label,'L')) and not(contains(@class,'unavailable'))]");
        this.availableWheelSize = page.locator("//button[(contains(@aria-label,'27.5 IN.') or contains(@aria-label,'29 IN.')) and not(contains(@class,'unavailable'))]");
    
        this.changeStoreLink= page.locator("xpath=//div[contains(@class,'find-a-store')]")
        this.selectStoreZipField = page.getByPlaceholder('Enter Zip code')
        this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true })
        this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]')
        this.selectStoreButons = page.getByLabel('select store')
    }

    async setStoreFromPDP(zipcode: string,store: string): Promise<string> {
        const commonPage = new CommonPage(this.page);

        await this.changeSelectedStoreLink.click();
        await this.selectStoreZipField.click();
        await this.selectStoreZipField.fill(zipcode);
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
}