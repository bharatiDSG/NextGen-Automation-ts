import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../globalSetup.js';
import { AccountSignInPage } from '../page-objects/AccountSignInPage.js';
import { CommonPage } from '../page-objects/CommonPage.js';
import { signInUser, forgotPasswordUser } from '../test-data/securedAthleteTestData.js';


test.describe("Secured Athlete Prod Tests", () => {
    test.beforeEach(async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Go to baseUrl set in .env or defaults to dsg_prod
        await accountSignInPage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());

        // Click the My Account link.
        await accountSignInPage.myAccountLink.click();
    });

    test('1: sign in', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);

        // Sign In
        await accountSignInPage.signIn(signInUser.email, signInUser.password)
    });

    test('2: forgot password', async ({ page }) => {
        const accountSignInPage = new AccountSignInPage(page);
        const commonPage = new CommonPage(page)
        const resetEmail = forgotPasswordUser.email

        // Forgot password
        const dateSent = new Date();
        await accountSignInPage.forgotPassword(resetEmail);
        await commonPage.sleep(5);

        // get password reset link
        const resetLink = await accountSignInPage.extractChangeEmailPasswordLink(resetEmail, dateSent);

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
