import { expect, test } from '@playwright/test';

import { AccountSignInPage } from '../../page-objects/AccountSignInPage';
import { CommonPage } from '../../page-objects/CommonPage';
import { HomePage } from '../../page-objects/HomePage';
import { getBaseUrl } from '../../globalSetup';
import { testData_DSG_PL_GG } from '../../test-data/securedAthleteTestData';

test.describe('My Account Loyalty Prod Tests', () => {
    test.beforeEach(async ({ page, context }) => {
        const commonPage = new CommonPage(page);
        const homePage = new HomePage(page);

        // grant permission for location
        await context.grantPermissions(['geolocation'], { origin: getBaseUrl() });
        console.log('geolocation granted for: ' + getBaseUrl());

        // handle iframe popup  
        commonPage.handleIframePopupSignUpViaTextForOffers();

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl());
        console.log('URL: ' + getBaseUrl());


    });

    test.only('01: validate the account summary tab headers', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const homePage = new HomePage(page);

        // Click the My Account link.
        await test.step('Click my account link', async () => {
            await homePage.myAccountLink.click();
    
        });

        // Sign In
        await test.step('Sign in With valid credentails and verify the sign in is successful or not', async () => {
            await accountSignInPage.signIn('dcsgorgs+5@gmail.com', '345CourtStreet!');
        });

        await test.step('Verify recent order and score more rewards headers', async () => {
            await expect(accountSignInPage.recentOrderText).toBeVisible();
            await expect(accountSignInPage.scoreMoreRewardsText).toBeVisible();
            await page.pause()
            
        });
    });
    test('02: validate the account summary tab headers firstname lastname', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const homePage = new HomePage(page);

        // Click the My Account link.
        await test.step('Click my account link', async () => {
            await homePage.myAccountLink.click();
        });

        // Sign In
        await test.step('Sign in With valid credentails and verify the sign in is successful or not', async () => {
            await accountSignInPage.signIn('dcsgorgs+5@gmail.com', '345CourtStreet!');
        });


        await test.step('Verify fistname and lastname headers', async () => {
            await expect(accountSignInPage.hiUserNameText).toContainText('Hi, ');
            //await expect(accountSignInPage.recentOrderText).toBeVisible();
            //await expect(accountSignInPage.scoreMoreRewardsText).toBeVisible();
            await page.pause()
            
//getByText('Hi, garence!')
//"//span[contains(@class,'user-name')]



        });


    });


});