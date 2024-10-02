import { expect, test } from '@playwright/test';

import { AccountSignInPage } from '../../../page-objects/AccountSignInPage';
import { CommonPage } from '../../../page-objects/CommonPage';
import { HomePage } from '../../../page-objects/HomePage';
import { ProductDisplayPage } from '../../../page-objects/ProductDisplayPage';
import { ProductListingPage } from '../../../page-objects/ProductListingPage';
import { getBaseUrl } from '../../../globalSetup';
import { testData_DSG_PL_GG } from '../../../test-data/securedAthleteTestData';

test.describe('Search Tests - GG NP0 Prod', () => {

    const firstSearchTerm = 'golf footwear';
    const secondSearchTerm = 'golf glove';

    test.beforeEach(async ({ page, context }) => {
        const commonPage = new CommonPage(page);
        const homePage = new HomePage(page);

        // grant permission for location
        await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
        console.log('geolocation granted for: ' + getBaseUrl());

        // handle iframe popup
        commonPage.handleIframePopupSignUpViaTextForOffers();

        // Go to baseUrl set in .env or defaults to dsg_prod
        await test.step('Navigate to homepage', async () => {
            if (process.env.ENV != 'gg_prod') {
                await homePage.goToHomePage(getBaseUrl() + 'homr');
                console.log('URL: ' + getBaseUrl() + 'homr');
            } else {
                await homePage.goToHomePage(getBaseUrl());
                console.log('URL: ' + getBaseUrl());
            }
        });
    });


    test('01: Search - Top 3 Searches',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            const searchTerms: string[] = ['push cart', 'grip', 'scotty cameron'];//, "golf shoes", "range finder", "putter grip", "golf shoe"]
            console.log({ searchTerms });

            for (const searchTerm of searchTerms) {

                await test.step('Search for a product: ' + searchTerm, async () => {
                    await homePage.searchForProductWithSlowTyping(searchTerm);
                });

                await test.step('Validate search results: ' + searchTerm, async () => {
                    // validate products display
                    await productListingPage.productNames.last().waitFor();

                    // validate search term
                    await expect(productListingPage.breadcrumbSearchTerm).toContainText(searchTerm);
                    const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                    console.log('text: ' + text);

                    // validate search count title
                    await expect(productListingPage.searchCountTitle).toContainText(searchTerm);
                    await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                    const title = await productListingPage.searchCountTitle.innerText();
                    console.log('title: ' + title);
                });
            };
        });


    test('02: Search - Top 3 Search Suggestions',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            const searchTerms: string[] = ['push cart', 'grip', 'golf shoe'];//, "rangefinder", "putter grip", "scotty cameron"]
            console.log({ searchTerms });

            for (const searchTerm of searchTerms) {

                await test.step('Search for a product: ' + searchTerm, async () => {
                    await homePage.searchForProductWithSlowTypingNoEnter(searchTerm);
                });

                await test.step('Validate suggested search term: ' + searchTerm, async () => {
                    await expect(productListingPage.saytSuggestedKeywords.first()).toContainText(searchTerm);
                    const saytText = await productListingPage.saytSuggestedKeywords.first().innerText();
                    console.log('sayt: ' + saytText);
                });

                await test.step('Click on first sayt suggestion for: ' + searchTerm, async () => {
                    await page.getByRole('button', { name: searchTerm, exact: true }).click();
                });

                await test.step('Validate search results: ' + searchTerm, async () => {
                    // validate products display
                    await productListingPage.productNames.last().waitFor();

                    // validate search term
                    await expect(productListingPage.breadcrumbSearchTerm).toContainText(searchTerm);
                    const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                    console.log('text: ' + text);

                    // validate search count title
                    await expect(productListingPage.searchCountTitle).toContainText(searchTerm);
                    const title = await productListingPage.searchCountTitle.innerText();
                    console.log('title: ' + title);
                });
            };
        });


    test('03: Search - No Search Results',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            const noResultsSearchTerm = 'TESTENGINEERQA1111';

            await test.step('Search for a product: ' + noResultsSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(noResultsSearchTerm);
            });

            await test.step('Validate no search results: ' + noResultsSearchTerm, async () => {
                await page.waitForLoadState('domcontentloaded');

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(noResultsSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate no results title
                await expect(productListingPage.searchCountTitle).toContainText(noResultsSearchTerm);
                await expect(productListingPage.searchCountTitle).toContainText('No results for');
                await expect(productListingPage.searchCountTitle).toContainText("We're sorry, we did not find any matches.");
                await expect(productListingPage.searchCountTitle).toContainText('Please check for any spelling errors or try more general keywords.');
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });
        });


    test('04: Search - Corrected Search',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            const incorrectSearchTerm = 'weihgt';
            const correctedSearchTerm = 'weight';

            await test.step('Search for a product: ' + incorrectSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(incorrectSearchTerm);
            });

            await test.step('Validate corrected search results: ' + correctedSearchTerm, async () => {
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(correctedSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate no results title
                await expect(productListingPage.searchCountTitle).toContainText(correctedSearchTerm);
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);

                // validate alternate search title if env is gg_prod - does not exist in np0_prod but does exist in Prod
                if (process.env.ENV == 'gg_prod') {
                    await expect(productListingPage.alternateSearchTitle).toContainText(incorrectSearchTerm);
                    const alternateTitle = await productListingPage.alternateSearchTitle.innerText();
                    console.log('alternateTitle: ' + alternateTitle);
                };
            });
        });


    test('05: Search from PDP',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);
            const productDisplayPage = new ProductDisplayPage(page);

            await test.step('Search for a product: ' + firstSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(firstSearchTerm);
            });

            await test.step('Validate search results: ' + firstSearchTerm, async () => {
                // validate products display
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(firstSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(firstSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

            await test.step('Select a product', async () => {
                await productListingPage.selectMatchingProduct('air');
            });

            await test.step('Verify PDP Page', async () => {
                await productDisplayPage.verifyProductDisplayPage();
            });

            await test.step('Search from PDP Page' + secondSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(secondSearchTerm);
            });

            await test.step('Validate search results from PDP: ' + secondSearchTerm, async () => {
                // validate products display
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(secondSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(secondSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

        });

    test('06: Search from SRLP',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            await test.step('Search for a product: ' + firstSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(firstSearchTerm);
            });

            await test.step('Validate search results: ' + firstSearchTerm, async () => {
                // validate products display
                await productListingPage.productNames.last().waitFor();

                // Validate SRLP URL
                expect(page.url()).toContain(getBaseUrl() + 'search/');

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(firstSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(firstSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

            await test.step('Search from SRLP Page' + secondSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(secondSearchTerm);
            });

            await test.step('Validate search results from SRLP: ' + secondSearchTerm, async () => {
                // validate products display
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(secondSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(secondSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

        });

    test('07: Search from PLP',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            const plpPage = "Men's Golf Shoes";

            await test.step('Navigate to PLP', async () => {
                await page.goto(getBaseUrl() + 'f/mens-golf-shoes');
            });

            await test.step('Validate search results: ' + plpPage, async () => {
                // Validate SRLP URL
                expect(page.url()).toContain(getBaseUrl() + 'f/');

                // validate products display
                await productListingPage.productNames.last().waitFor();

                // Page Title
                await expect(productListingPage.pageTitle).toContainText(plpPage);
                const text = await productListingPage.pageTitle.allTextContents();
                console.log('PLP title: ' + text);
            });

            await test.step('Search from PLP Page' + secondSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(secondSearchTerm);
            });

            await test.step('Validate search results from PLP: ' + secondSearchTerm, async () => {
                // validate products display
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(secondSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(secondSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

        });

    test('08: Search from My Account',
        { tag: ['@PLP', '@Search', '@GG', '@np0Prod', '@Prod', '@Preview'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);
            const accountSignInPage = new AccountSignInPage(page);
            const commonPage = new CommonPage(page);

            await test.step('Click my account link', async () => {
                await homePage.myAccountLink.click();
            });

            // Sign In
            await test.step('Sign in With valid credentails and verify the sign in is successful or not', async () => {
                if (process.env.ENV == 'gg_prod') {
                    await accountSignInPage.signIn(testData_DSG_PL_GG.email, testData_DSG_PL_GG.password);
                } else {
                    await accountSignInPage.accountSignInModern(testData_DSG_PL_GG.email, testData_DSG_PL_GG.password);
                }
            });

            await test.step('Search from My Account Page' + secondSearchTerm, async () => {
                await homePage.searchForProductWithSlowTyping(secondSearchTerm);
            });

            await test.step('Validate search results from My Account: ' + secondSearchTerm, async () => {
                // handle iframe popup
                commonPage.handleIframePopupSignUpViaTextForOffers();

                // validate products display
                await productListingPage.productNames.last().waitFor();

                // validate search term
                await expect(productListingPage.breadcrumbSearchTerm).toContainText(secondSearchTerm);
                const text = await productListingPage.breadcrumbSearchTerm.allTextContents();
                console.log('text: ' + text);

                // validate search count title
                await expect(productListingPage.searchCountTitle).toContainText(secondSearchTerm);
                await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                const title = await productListingPage.searchCountTitle.innerText();
                console.log('title: ' + title);
            });

        });


    // Trending search links do not display in np0_prod
    test('09: Search - Trending Search Links',
        { tag: ['@PLP', '@Search', '@GG', '@Prod'] },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const productListingPage = new ProductListingPage(page);

            await test.step('Validate trending searches text on home screen', async () => {
                await expect(homePage.trendingSearchesText).toBeVisible();
            });

            await test.step('Validate 3 trending searches links', async () => {
                const trendingSearches: string[] = await homePage.trendingSearchesLinks.allInnerTexts();
                console.log({ trendingSearches });

                // loop through trending searches to validate plp page after navigation
                let count = 0;
                for (let [index, trendingSearch] of trendingSearches.entries()) { // eslint-disable-line
                    await test.step('Validate trending searches links: ' + trendingSearch, async () => {
                        console.log(index + ': ' + trendingSearch);
                        await page.locator('[class="button-navigation"]').nth(index).click();
                        await productListingPage.productNames.last().waitFor();

                        // Update trending search name for validating the following page
                        if (trendingSearch.includes('Top Deals')) {
                            trendingSearch = "This Week's Deals";
                        }
                        if (trendingSearch.includes('Rangefinder')) {
                            trendingSearch = 'Golf Electronic Deals';
                        }

                        // validate search count title
                        await expect(productListingPage.searchCountTitle).toContainText(trendingSearch);
                        await expect(productListingPage.searchCountTitle).not.toContainText("We're sorry, we did not find any matches.");
                        const title = await productListingPage.searchCountTitle.innerText();
                        console.log('title: ' + title);

                        // Go back to home page
                        await homePage.navigateToHomePageLink.click();
                    });

                    // Testing first 3 trending searches only - break after 3
                    count++;
                    if (count > 2) {
                        break;
                    }
                };
            });
        });
});