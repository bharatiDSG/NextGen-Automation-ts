import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../globalSetup.js';
import { HomePage } from '../page-objects/HomePage.js';
import { AccountSignInPage } from '../page-objects/AccountSignInPage.js';
import { CommonPage } from '../page-objects/CommonPage.js';
import { testData_DSG_PL_GG } from '../test-data/securedAthleteTestData.js';


test.describe("Secured Athlete Prod Tests", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());

        // Close popup if it displays
        if (await page.getByLabel('Close button').isVisible()) {
            await page.getByLabel('Close button').click()
        }

        // Click the My Account link.
        await homePage.myAccountLink.click();
    });

    test('1: sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Sign In
        await accountSignInPage.signIn(testData_DSG_PL_GG.email, testData_DSG_PL_GG.password)
    });

    test('2: reset password and sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const commonPage = new CommonPage(page)
        const resetEmail = testData_DSG_PL_GG.resetEmail
        const emailServerId = testData_DSG_PL_GG.emailServerId

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
        await accountSignInPage.signIn(resetEmail, newPassword);
    });

});
