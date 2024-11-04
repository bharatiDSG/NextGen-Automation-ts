import { test } from '@playwright/test';

import { CommonPage } from '../../page-objects/CommonPage';
import { MALoginPage } from '../../page-objects/MALoginPage';
import { HomePage } from '../../page-objects/HomePage.ts';


import { getBaseUrl } from '../../globalSetup';
import { testData_MAWM_DC6 } from '../../test-data/MAsignInTestData';
import { homedir } from 'os';
import { MAHomePage } from '../../page-objects/MAHomePage.ts';

test.describe('Sign in to MAWM', () => {
    test.beforeEach(async ({ page, context }) => {
        const homePage = new HomePage(page);
        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl());
        console.log('URL: ' + getBaseUrl());
    });

    test('1: sign in', async ({ page }) => {
        const loginPage = new MALoginPage(page);
        const homePage = new MAHomePage(page);

        // Sign In
        await test.step('Sign in With valid credentials and verify the sign in is successful', async () => {
        await loginPage.signIn(testData_MAWM_DC6.email, testData_MAWM_DC6.password);
      //  await page.pause();
            
        });

        await test.step('Sign out', async () => {
            await homePage.clickSignOut();
            await page.pause();
                
            });
    });

    

});
