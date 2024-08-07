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
    readonly shipFilterButtonReact: Locator;
    readonly shipFilterButtonAngular: Locator;
    readonly saleAccordionFilterButtonReact: Locator;
    readonly saleAccordionFilterButtonAngular: Locator;
    readonly saleFilterValueReact: Locator;
    readonly saleFilterValueAngular: Locator;
    readonly sizeAccordionFilterButtonReact: Locator;
    readonly sizeAccordionFilterButtonAngular: Locator;
    readonly sizeFilterValueReact: Locator;
    readonly sizeFilterValueAngular: Locator;
    readonly filterChipsReact: Locator;
    readonly filterChipsAngular: Locator;
    readonly productNames: Locator;
    readonly productNamesAngular: Locator;
    readonly productPromotionsReact: Locator;
    readonly productPromotionsAngular: Locator;
    readonly productAvailabilityReact: Locator;
    readonly productAvailabilityAngular: Locator;
    readonly productPriceReact: Locator;
    readonly productPriceAngular: Locator;
    readonly zipDeliveryLocationButton: Locator;
    readonly zipDeliveryInputField: Locator;
    readonly zipDeliveryUpdateButton: Locator;
    readonly rightChevronNextButtonReact: Locator;
    readonly rightChevronNextButtonAngular: Locator;
    readonly highlightedPageNumberReact: Locator;
    readonly highlightedPageNumberAngular: Locator;
    readonly sortOptionsAccordionButtonReact: Locator;
    readonly sortOptionsAccordionButtonAngular: Locator;
    readonly sortOptionsSelectionReact: Locator;
    readonly sortOptionsSelectionAngular: Locator;
    readonly sortSelectedReact: Locator;
    readonly sortSelectedAngular: Locator;
    readonly quickviewOpenATCButtonReact: Locator;
    readonly quickviewOpenATCButtonAngular: Locator;
    readonly quickviewColorAttribute: Locator;
    readonly quickviewSizeAttribute: Locator;
    readonly quickviewModalATCButton: Locator;
    readonly quickviewKeepShoppingButton: Locator;
    readonly quickviewViewCartButton: Locator;
    readonly sameDayDeliveryFilter: Locator;

    constructor(page: Page) {
        this.page = page;

        // Select Store
        this.changeSelectedStoreLink = page.locator('.header-my-store')
        this.selectStoreZipField = page.getByPlaceholder('Enter Zip code');
        this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true });
        this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]');
        this.selectStoreButtons = page.getByLabel('select store');

        // zip delivery location
        this.zipDeliveryLocationButton = page.getByLabel(new RegExp('.*Zip Code for Same Day Delivery.*'));
        this.zipDeliveryInputField = page.locator("//input[@type='number']")
        this.zipDeliveryUpdateButton = page.getByLabel('Update');

        // shipping filters
        this.pickupFilterButton = page.getByRole('button', { name: 'Pickup filter' });
        this.shipFilterButtonReact = page.getByRole('button', { name: 'Ship filter' });
        this.shipFilterButtonAngular = page.locator('[id="shipping-button"]');
        this.sameDayDeliveryFilter= page.getByRole('button', { name: 'Same Day Delivery filter' });
        this.filterChipsReact = page.locator('[class="filter-chip"]');
        this.filterChipsAngular = page.locator('[class="hmf-global-chips-container"]');

        // product attribute filters
        this.sizeAccordionFilterButtonReact = page.locator('[class="rs-multi-select-facet rs-facet-wrapper rs-facet-wrapper-size"]');
        this.sizeAccordionFilterButtonAngular = page.locator('[aria-controls="Size-accordion-panel"]');
        this.saleAccordionFilterButtonReact = page.locator('[class="rs-multi-select-facet rs-facet-wrapper rs-facet-wrapper-sale"]');
        this.saleAccordionFilterButtonAngular = page.locator('[aria-controls="Sale-accordion-panel"]');
        this.sizeFilterValueReact = page.getByLabel('L',{ exact: true });
        this.sizeFilterValueAngular = page.getByText('L', { exact: true });
        this.saleFilterValueReact = page.locator('[class="mdc-switch  mdc-switch--disabled"]');
        this.saleFilterValueAngular = page.locator('[class="checkbox-container]', {hasText: 'Sale'} );

        // product attributes
        this.productNames = page.locator('//a[@class="rs_product_description d-block"]');
        this.productNamesAngular = page.locator('[class="product-title-link hmf-subheader-m hmf-header-m-xs hmf-mb-xxs hmf-mb-m-0"]');
        this.productPromotionsReact = page.locator('[class="rs-promotions"]');
        this.productPromotionsAngular = page.locator('[class="hmf-mb-xxs promo-message"]');
        this.productAvailabilityReact = page.locator('[class="rs_circle_icon_hw"]');
        this.productAvailabilityAngular = page.locator('[class="availability hmf-display-flex hmf-flex-wrap hmf-justify-content-between hmf-align-items-center hmf-align-content-center"]');
        this.productPriceReact = page.locator('[class="rs_product_price"]');
        this.productPriceAngular = page.locator('[class="price-text ng-star-inserted"]');

        // pagination
        this.rightChevronNextButtonReact = page.locator('[class="rs-size-chevron"]');
        this.rightChevronNextButtonAngular = page.locator('[name="chevron-right"]');
        this.highlightedPageNumberReact = page.locator('[class="active rs-page-item"]');
        this.highlightedPageNumberAngular = page.locator('[class="bottom-pagination-number homefield-text-link ng-star-inserted selected"]');

        // sorting options
        this.sortOptionsAccordionButtonReact = page.locator('[class="rs-sort-opn-close-icon"]');
        this.sortOptionsAccordionButtonAngular = page.getByTitle('Select sort option');
        this.sortOptionsSelectionReact = page.locator('li');
        this.sortOptionsSelectionAngular = page.locator('option');
        this.sortSelectedReact = page.locator('[class="rs-selected-sort-text"]');
        this.sortSelectedAngular = page.locator('[class="ng-star-inserted"]').locator('[selected="true"]');

        // quickview
        this.quickviewOpenATCButtonReact = page.locator('[class="dsg-quickview-button-icon"]');
        this.quickviewOpenATCButtonAngular = page.locator('[id="add-to-cart-button"]');
        this.quickviewColorAttribute = page.getByTitle('Black/Steel');
        this.quickviewSizeAttribute = page.getByTestId('quickViewModalL');
        this.quickviewModalATCButton = page.getByLabel('Add To Cart');
        this.quickviewKeepShoppingButton = page.getByLabel('Keep Shopping');
        this.quickviewViewCartButton = page.getByLabel('View Cart');

    }

    async setStoreFromPLP(store: string): Promise<string> {
        const commonPage = new CommonPage(this.page);
        await this.changeSelectedStoreLink.isVisible();
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

    async setDeliveryZipPLP(zip: string){
        await this.page.waitForTimeout(4000); // waits for 4 seconds
        await this.zipDeliveryLocationButton.first().click()
        await this.zipDeliveryInputField.first().click()
        await this.zipDeliveryInputField.first().fill(zip)
        await this.zipDeliveryUpdateButton.click()
    }

    async selectAProduct() {
        await this.productNames.last().waitFor();
        const productNames = await this.productNames.allInnerTexts();
        console.log("product count: " + productNames.length);
        await this.productNames.nth(Math.floor(Math.random() * productNames.length)).click();


    }    
}