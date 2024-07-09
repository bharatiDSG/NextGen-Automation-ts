import { expect, test } from '@playwright/test';

import { AccountSignInPage } from '../page-objects/AccountSignInPage';
import { CommonPage } from '../page-objects/CommonPage';
import { HomePage } from '../page-objects/HomePage';
import { getBaseUrl } from '../globalSetup';
import { testData_BatGenie } from '../test-data/securedAthleteTestData';

test.describe("Bat Genie", () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to baseUrl set in .env
        await test.step('Navigate to Home page',async()=>{
        await homePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
    });
    });


    test('1: sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Sign In
        await test.step('Sign In',async()=>{
        await accountSignInPage.signInBatGenie(testData_BatGenie.email, testData_BatGenie.password)
    });
    });


    test('2: reset password and sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const commonPage = new CommonPage(page)
        const resetEmail = testData_BatGenie.resetEmail
        const emailServerId = testData_BatGenie.emailServerId

        // Forgot password
        await test.step('Forgot Password',async()=>{
        const dateSent = new Date();
        await accountSignInPage.forgotPassword(resetEmail);
        await commonPage.sleep(5);
    });

        // get password reset link
        await test.step('Get password reset link',async()=>{
        const resetLink = await accountSignInPage.extractChangeEmailPasswordLink(emailServerId, resetEmail, dateSent);
    });
        // Change password
        await test.step('Change password',async()=>{
        const newPassword = dateSent.toISOString();
        console.log("Email: " + resetEmail);
        console.log("New pw: " + newPassword);
        await page.goto(resetLink);
        await accountSignInPage.changePassword(newPassword);
    });
        // Verify password reset
        await test.step('Verify password reset',async()=>{
        await expect(accountSignInPage.passwordChangedHeader).toBeVisible();
        await accountSignInPage.backToSignInLink.click();
    });
        // Sign In
        await test.step('Sign in with new password',async()=>{
        await accountSignInPage.signInBatGenie(resetEmail, newPassword);
    });
    });
});