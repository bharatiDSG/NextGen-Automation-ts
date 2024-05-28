export class HeaderPage {
    constructor(page) {
        this.page = page;

        this.storesWithAvailabilityCheckbox = page.getByText('All Stores w/ Availability');
        this.zipCodeTextField = page.getByPlaceholder('Enter Zip code');
        this.storesNearMe = page.locator('.store-details-container > .hmf-button');
        this.selectStoreModalCloseButton = page.getByLabel('Close', { exact: true });
    }
}

