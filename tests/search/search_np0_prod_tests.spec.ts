import { expect, test } from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';
import { ProductListingPage } from '../../page-objects/ProductListingPage';
import { getBaseUrl } from '../../globalSetup';
import { CommonPage } from '../../page-objects/CommonPage';


test.describe("Search Tests - GG NP0 Prod", () => {

    test.beforeEach(async ({ page, context }) => {
        const commonPage = new CommonPage(page);
        const homePage = new HomePage(page);

        // grant permission for location
        await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
        console.log("geolocation granted for: " + getBaseUrl())

        // handle iframe popup  
        commonPage.handleIframePopupSignUpViaTextForOffers()

        // Go to baseUrl set in .env or defaults to dsg_prod
        await test.step('Navigate to homepage', async () => {
            await homePage.goToHomePage(getBaseUrl() + "homr");
            console.log("URL: " + getBaseUrl() + "homr");
        });
        
    });


    test('01: Search - Top 3 Searches', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)

        const searchTerms: string[] = ["push cart", "grip", "scotty cameron"]//, "golf shoes", "range finder", "putter grip", "golf shoe"]

        for (var searchTerm of searchTerms) {

            await test.step('Search for a product: ' + searchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(searchTerm);
            });

            await test.step("Validate search results: " + searchTerm, async () => {
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(searchTerm)
                let text = await productListingPage.breadcrumbSearchTerm.allTextContents()
                console.log("text: " + text)

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(searchTerm)
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.")
                let title = await productListingPage.searchCountTitle.innerText()
                console.log("title: " + title)

                // Validate a product?
                await productListingPage.productNames.last().waitFor();
            });
        };
    });


    test('02: Search - Top 3 Search Suggestions', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)

        const searchTerms: string[] = ["push cart", "grip", "golf shoe"]//, "rangefinder", "putter grip", "scotty cameron"]

        for (var searchTerm of searchTerms) {

            await test.step('Search for a product: ' + searchTerm, async () => {
                await homePage.searchForProductWithSlowTypingNoEnter(searchTerm);
            });
    
            await test.step("Validate suggested search term: " + searchTerm, async () => {
                await expect(productListingPage.saytSuggestedKeywords.first()).toContainText(searchTerm)
                let saytText = await productListingPage.saytSuggestedKeywords.first().innerText()
                console.log("sayt: " + saytText)
            });

            await test.step("Click on first sayt suggestion for: " + searchTerm, async () => {
                await page.getByRole('button', { name: searchTerm, exact: true }).click()
            });
           
            await test.step("Validate search results: " + searchTerm, async () => {
                await productListingPage.productNames.last().waitFor();
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(searchTerm)
                let text = await productListingPage.breadcrumbSearchTerm.allTextContents()
                console.log("text: " + text)

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(searchTerm)
                let title = await productListingPage.searchCountTitle.innerText()
                console.log("title: " + title)
            });
        };
    });


    test('03: Search - No Search Results', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)

        const noResultsSearchTerm: string = "TESTENGINEERQA1111"

        await test.step('Search for a product: ' + noResultsSearchTerm, async () => {
            await homePage.searchForProductWithSlowTyping(noResultsSearchTerm);
        });

        await test.step("Validate no search results: " + noResultsSearchTerm, async () => {
            await page.waitForLoadState("domcontentloaded");

            // validate search term
            await expect(productListingPage.breadcrumbSearchTerm).toContainText(noResultsSearchTerm)
            let text = await productListingPage.breadcrumbSearchTerm.allTextContents()
            console.log("text: " + text)

            // validate no results title
            await expect(productListingPage.searchCountTitle).toContainText(noResultsSearchTerm)
            await expect(productListingPage.searchCountTitle).toContainText("No results for")
            await expect(productListingPage.searchCountTitle).toContainText("We're sorry, we did not find any matches.")
            await expect(productListingPage.searchCountTitle).toContainText("Please check for any spelling errors or try more general keywords.")
            let title = await productListingPage.searchCountTitle.innerText()
            console.log("title: " + title)

        });
    });


    test('04: Search - Corrected Search', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)

        const incorrectSearchTerm: string = "weihgt"
        const correctedSearchTerm: string = "weight"

        await test.step('Search for a product: ' + incorrectSearchTerm, async () => {
            await homePage.searchForProductWithSlowTyping(incorrectSearchTerm);
        });

        await test.step("Validate corrected search results: " + correctedSearchTerm, async () => {
            await productListingPage.productNames.last().waitFor();

            // validate search term
            await expect(productListingPage.breadcrumbSearchTerm).toContainText(correctedSearchTerm)
            let text = await productListingPage.breadcrumbSearchTerm.allTextContents()
            console.log("text: " + text)

            // validate no results title
            await expect(productListingPage.searchCountTitle).toContainText(correctedSearchTerm)
            let title = await productListingPage.searchCountTitle.innerText()
            console.log("title: " + title)

            // validate alternate search title - does not exist in np0_prod but does exist in Prod
            // await expect(productListingPage.alternateSearchTitle).toContainText(incorrectSearchTerm)
            // let alternateTitle = await productListingPage.alternateSearchTitle.innerText()
            // console.log("alternateTitle: " + alternateTitle)
        });
    });


    // Trending search links do not display in np0_prod
    test.skip('05: Search - Trending Search Links', async ({ page }) => {
        const homePage = new HomePage(page);
        const productListingPage = new ProductListingPage(page)

        await page.pause()
    });
});