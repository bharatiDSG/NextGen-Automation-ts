import { expect, test } from '@playwright/test';

import { AccountSignInPage } from '../page-objects/AccountSignInPage.ts';
import { CommonPage } from '../page-objects/CommonPage.ts';
import { HomePage } from '../page-objects/HomePage.ts';
import { getBaseUrl } from '../globalSetup.js';
import { testData_BatGenie } from '../test-data/securedAthleteTestData.js';

test.describe("Bat Genie", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
    });


    test('1: sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Sign In
        await accountSignInPage.signInBatGenie(testData_BatGenie.email, testData_BatGenie.password)
    });


    test('2: reset password and sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const commonPage = new CommonPage(page)
        const resetEmail = testData_BatGenie.resetEmail
        const emailServerId = testData_BatGenie.emailServerId

        // Forgot password
        const dateSent = new Date();
        await accountSignInPage.forgotPassword(resetEmail);
        await commonPage.sleep(5);

        // get password reset link
        const resetLink = await accountSignInPage.extractChangeEmailPasswordLink(emailServerId, resetEmail, dateSent);

        // Change password
        const newPassword = dateSent.toISOString();
        console.log("Email: " + resetEmail);
        console.log("New pw: " + newPassword);
        await page.goto(resetLink);
        await accountSignInPage.changePassword(newPassword);

        // Verify password reset
        await expect(accountSignInPage.passwordChangedHeader).toBeVisible();
        await accountSignInPage.backToSignInLink.click();

        // Sign In
        await accountSignInPage.signInBatGenie(resetEmail, newPassword);
    });
});