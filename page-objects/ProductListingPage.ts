import { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CommonPage } from './CommonPage';
import { getIndexThatIncludesFirstMatch } from '../lib/functions';

export class ProductListingPage {
    private page: Page;

    readonly changeSelectedStoreLink: Locator;
    readonly selectStoreZipField: Locator;
    readonly selectStoreSearchButton: Locator;
    readonly selectStoreNames: Locator;
    readonly selectStoreButtons: Locator;
    readonly pickupFilterButtonReact: Locator;
    readonly pickupFilterButtonAngular: Locator;
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
    readonly quickviewColorAttribute2: Locator;
    readonly quickviewSizeAttribute: Locator;
    readonly quickviewModalATCButton: Locator;
    readonly quickviewKeepShoppingButton: Locator;
    readonly quickviewViewCartButton: Locator;
    readonly favorites: Locator;
    readonly favoritesToastMsg: Locator;
    readonly myAccount: Locator;
    readonly myAccountListSection: Locator;
    readonly myAccountListSectionFavorite: Locator;
    readonly myAccountListSectionFavoriteProductName: Locator;
    readonly myAccountListSectionFavoriteProductPrice: Locator;
    readonly myAccountCloseListPopPu:Locator;
    readonly myAccountListSelectionFavoriteItemMesg:Locator
    readonly myAccountRemoveFavorites:Locator
    readonly quickViewCloseButton:Locator
    readonly quickViewColorStocked:Locator
    readonly quickViewSizeStocked:Locator
    readonly quickViewColorGroup:Locator
    readonly quickViewSizeGroup:Locator
    readonly quickViewFavorites:Locator
    readonly breadCrumbLinkReact:Locator;
    readonly breadCrumbLinkAngular:Locator;

    constructor(page: Page) {
        this.page = page;

        // Select Store and delivery zip
        this.changeSelectedStoreLink = page.getByLabel('Change selected store from');
        this.selectStoreZipField = page.getByPlaceholder('Enter Zip code');
        this.selectStoreSearchButton = page.getByLabel('SEARCH', { exact: true });
        this.selectStoreNames = page.locator('[class="hmf-text-transform-capitalize"]');
        this.selectStoreButtons = page.getByLabel('select store');

        // zip delivery location
        this.zipDeliveryLocationButton = page.getByLabel(new RegExp('.*Zip Code for Same Day Delivery.*'));
        this.zipDeliveryInputField = page.locator('//input[@type="number"]');
        this.zipDeliveryUpdateButton = page.getByLabel('Update');


        //Favorites
        this.favorites = page.locator('div.dsg-react-product-card button.plp-add-favorite-button');
        this.favoritesToastMsg = page.locator('span.toasty-inline-message span');
        this.favoritesToastMsg = page.locator('span.toasty-inline-message span');
        this.myAccount = page.locator('p.account-main-text');
        this.myAccountListSection = page.locator('ul.hmf-pl-0.hmf-mb-s li:nth-of-type(4) a');
        this.myAccountListSectionFavorite = page.locator('p.list-card-title');
        this.myAccountListSectionFavoriteProductName = page.locator('a.product-title-link');
        this.myAccountListSectionFavoriteProductPrice = page.locator('div.price-text');
        this.myAccountCloseListPopPu = page.locator("div[aria-label='Close']")
        this.myAccountListSelectionFavoriteItemMesg = page.locator("span.hmf-subheader-l");
        this.myAccountRemoveFavorites = page.locator("div[aria-label*='Remove']")


        // shipping filters
        this.pickupFilterButtonReact = page.getByRole('button', { name: 'Pickup filter' });
        this.pickupFilterButtonAngular = page.locator('[id="shipping-button"]');
        this.shipFilterButtonReact = page.getByRole('button', { name: 'Ship filter' });
        this.shipFilterButtonAngular = page.locator('[id="shipping-button"]');
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
        this.productNames = page.locator('[class="rs_product_description d-block"]');
        this.productNamesAngular = page.locator('[class="product-title-link hmf-subheader-m hmf-header-m-xs hmf-mb-xxs hmf-mb-m-0"]');
        this.productPromotionsReact = page.locator('[class="rs-promotions"]');
        this.productPromotionsAngular = page.locator('[class="hmf-mb-xxs promo-message"]');
        this.productAvailabilityReact = page.locator('[class="rs_circle_icon_hw"]');
        this.productAvailabilityAngular = page.locator('[class="availability hmf-display-flex hmf-flex-wrap hmf-justify-content-between hmf-align-items-center hmf-align-content-center"]');
        this.productPriceReact = page.locator('[class="rs_product_price"]');
        this.productPriceAngular = page.locator('[class="price-text ng-star-inserted"]');

        // pagination and breadcrumbs
        this.rightChevronNextButtonReact = page.locator('[class="rs-size-chevron"]');
        this.rightChevronNextButtonAngular = page.locator('[name="chevron-right"]');
        this.highlightedPageNumberReact = page.locator('[class="active rs-page-item"]');
        this.highlightedPageNumberAngular = page.locator('[class="bottom-pagination-number homefield-text-link ng-star-inserted selected"]');
        this.breadCrumbLinkReact = page.locator('[class="breadcrumb-item"]');
        this.breadCrumbLinkAngular = page.locator('[itemprop="name"]', {hasText: 'Men\'s Shirts & Tops'});

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
        this.quickviewColorAttribute2 = page.getByTitle('Black');
        this.quickviewSizeAttribute = page.getByTestId('quickViewModalL');
        this.quickviewModalATCButton = page.getByLabel('Add To Cart');
        this.quickviewKeepShoppingButton = page.getByLabel('Keep Shopping');
        this.quickviewViewCartButton = page.getByLabel('View Cart');
        this.quickViewColorStocked = page.locator("div[class*='false false quickview-swatch']");
        this.quickViewSizeStocked = page.locator("div.qv-size div[class*='value false false']");
        this.quickViewColorGroup = page.locator("p#ColorGroup-Color");
        this.quickViewSizeGroup = page.locator("p#AttributeGroup-Size");
        this.quickViewFavorites = page.locator("button.favorite-button svg");
        this.quickViewCloseButton = page.locator("div.close");

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

    async setDeliveryZipPLP(zip: string){
        await this.page.waitForTimeout(4000); // waits for 4 seconds
        await this.zipDeliveryLocationButton.first().click()
        await this.page.waitForTimeout(4000); // waits for 4 seconds
        await this.zipDeliveryInputField.click()
        await this.zipDeliveryInputField.fill(zip)
        await this.zipDeliveryUpdateButton.click()
    }

    async verifyFavoritesPresentInMyAccounts(itemVal: string){
         const commonPage = new CommonPage(this.page);
         const plpProductStyle =  this.page.locator("div.dsg-react-product-card:nth-of-type(" + itemVal + ")  div.rs-fswatch li");
         await plpProductStyle.nth(1).click();
         const index = +itemVal
         const eleFvrt = this.favorites.nth(index);
         await expect(eleFvrt).toBeVisible();
         await expect(eleFvrt).toHaveAttribute('aria-label', /Remove/);
         const indexUpdated = index +1;
         const namePlp =  await this.page.locator('div.dsg-react-product-card:nth-of-type('+ indexUpdated +')  .rs_product_description').textContent();
         console.log("Product name in PLP page is: "+namePlp)
         const pricePlp =  await this.page.locator('div.dsg-react-product-card:nth-of-type('+ indexUpdated +')  p.offer-price').textContent();
         console.log("Product price in PLP page is: "+pricePlp)
         await this.myAccount.click();
         await this.myAccountListSection.click();
         await this.myAccountCloseListPopPu.click();
         await this.myAccountListSectionFavorite.click();

        const itemTxt = await this.myAccountListSelectionFavoriteItemMesg.nth(0).textContent();
        console.log("The message is: "+itemTxt)
        expect(itemTxt?.trim()).not.toContain(String("0 items"));
        const myAccountItemName = await this.myAccountListSectionFavoriteProductName.nth(0).textContent();
        const myAccountItemPrice = await this.myAccountListSectionFavoriteProductPrice.nth(0).textContent();

        console.log("Product name in my account favorite page is: "+myAccountItemName)
        console.log("Product price in my account favorite page is: "+myAccountItemPrice)
        expect(myAccountItemName?.trim()).toContain(String(namePlp));
        expect(myAccountItemPrice?.trim()).toContain(String(pricePlp));
    }

    async removeAllFavoritesInMyAccounts(){
        const commonPage = new CommonPage(this.page);
        await this.myAccount.click();
        await this.myAccountListSection.click();
        await this.myAccountCloseListPopPu.click();
        await this.myAccountListSectionFavorite.click();
        await commonPage.sleep(5);
        const count = await this.myAccountRemoveFavorites.count();
        console.log("Total favorites to be removed from my account page are: "+count)
        for (let i = 0; i < count; i++) {
          const fvrtRemoveIcon =   this.myAccountRemoveFavorites.nth(0);
          await fvrtRemoveIcon.click();
          await commonPage.sleep(10);
        } 
        const itemTxt = await this.myAccountListSelectionFavoriteItemMesg.nth(0).textContent();
        console.log("The message is: "+itemTxt)
        expect(itemTxt?.trim()).toContain(String("0 items"));
        console.log("All favorites removed from MyAccount List");
    }

    async unselectAllFavorites() {
        const commonPage = new CommonPage(this.page);
        await commonPage.sleep(10);
        const fvrtSelected =  this.page.locator('div.dsg-react-product-card button.plp-add-favorite-button[aria-label *="Remove"]');
        const count = await fvrtSelected.count();
        console.log("Total favorites selected is: "+count);
        if (count === 0) {
          console.log('No action required');
        } else {
          for (let i = 0; i < count; i++) {
            const favoriteSlctedSngl =  fvrtSelected.nth(0);
            console.log("Unselected "+i+" time");
            await favoriteSlctedSngl.click();
            await expect( this.favoritesToastMsg).toBeVisible();
            const toastText = await this.favoritesToastMsg.textContent();
            expect(toastText?.trim()).toContain(String("Removed")); 
            console.log("Favorites removed successfully");
            await commonPage.sleep(10);
          }
        }
      }



    async selectAProduct() {
        await this.productNames.last().waitFor();
        const productNames = await this.productNames.allInnerTexts();
        console.log("product count: " + productNames.length);
        await this.productNames.nth(Math.floor(Math.random() * productNames.length)).click();


    }
}