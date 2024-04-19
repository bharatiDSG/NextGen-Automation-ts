import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../config.js';
import { AccountSignIn } from '../page-objects/AccountSignIn.js';
const testData = JSON.parse(JSON.stringify(require('../test-data/SecuredAthleteTestData.json')));

test.describe("Secured Athlete Prod Tests", () => {
    test.beforeEach(async ({ page }) => {
        const accountSignIn = new AccountSignIn(page);
        await accountSignIn.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
    });

    test('1: sign in', async ({ page }) => {
        const accountSignIn = new AccountSignIn(page);

        // Click the My Account link.
        await accountSignIn.myAccountLink.click();

        // Sign In
        await accountSignIn.signIn(testData.signedInUser.email, testData.signedInUser.password);
    });

    test('2: forgot password', async ({ page }) => {
        const accountSignIn = new AccountSignIn(page);
        const resetEmail = testData.passwordResetUser.email;

        // Click the My Account link.
        await accountSignIn.myAccountLink.click();

        // Forgot password
        const dateSent = new Date();
        await accountSignIn.forgotPassword(resetEmail);
        await accountSignIn.sleep(5);

        // get password reset link
        const resetLink = await accountSignIn.extractChangeEmailPasswordLink(resetEmail, dateSent);

        // Change password
        const newPassword = dateSent.toISOString();
        console.log("Email: " + resetEmail);
        console.log("New pw: " + newPassword);
        await page.goto(resetLink);
        await accountSignIn.changePassword(newPassword);

        // Verify password reset
        await expect(accountSignIn.passwordChangedHeader).toBeVisible();
        await accountSignIn.backToSignInLink.click();

        // Sign In
        await accountSignIn.signIn(resetEmail, newPassword);
    });

});
