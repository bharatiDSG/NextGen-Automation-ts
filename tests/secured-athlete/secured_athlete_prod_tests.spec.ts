import { test } from '@playwright/test';

import { AccountSignInPage } from '../../page-objects/AccountSignInPage';
import { CommonPage } from '../../page-objects/CommonPage';
import { HomePage } from '../../page-objects/HomePage';
import { getBaseUrl } from '../../globalSetup';
import { testData_DSG_PL_GG } from '../../test-data/securedAthleteTestData';

test.describe('Secured Athlete Prod Tests', () => {
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

        // Click the My Account link.
        await test.step('Click my account link', async() => {
        await homePage.myAccountLink.click();
    });
    });

    test('1: sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Sign In
        await test.step('Sign in With valid credentails and verify the sign in is successful or not', async() => {
        await accountSignInPage.signIn(testData_DSG_PL_GG.email, testData_DSG_PL_GG.password);
    });
    });

    test('2: reset password and sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const commonPage = new CommonPage(page);
        const resetEmail = testData_DSG_PL_GG.resetEmail;
        const emailServerId = testData_DSG_PL_GG.emailServerId;

        let dateSent: Date;
        let resetLink: string;
        let newPassword: string;

        // Forgot password
        await test.step('Click Forgot password', async() => {
        dateSent = new Date();
        await accountSignInPage.forgotPassword(resetEmail);
        await commonPage.sleep(5);
    });
        // get password reset link
        await test.step('Get password reset link', async() => {
        resetLink = await accountSignInPage.extractChangeEmailPasswordLink(emailServerId, resetEmail, dateSent);
    });
        // Change password
        await test.step('Change Password', async() => {
        newPassword = dateSent.toISOString();
        console.log('Email: ' + resetEmail);
        console.log('New pw: ' + newPassword);
        await page.goto(resetLink);
        await accountSignInPage.changePassword(newPassword);
    });
        // Verify password reset
        await test.step('Verify Password Reset', async() => {
        // await expect(accountSignInPage.passwordChangedHeader).toBeVisible();
        await accountSignInPage.backToSignInLink.click();
    });
        // Sign In
        await test.step('Sign in with new password. Verify Sign in is successful or not', async() => {
        await accountSignInPage.signIn(resetEmail, newPassword);
    });
    });

});
