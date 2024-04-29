import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../globalSetup.js';
import { BatGeniePage } from '../page-objects/BatGeniePage.js';
// import { AccountSignInPage } from '../page-objects/AccountSignInPage.js';
// import { CommonPage } from '../page-objects/CommonPage.js';
// import { signInUser, forgotPasswordUser } from '../test-data/securedAthleteTestData.js';


test.describe("Bat Genie", () => {
    test.beforeEach(async ({ page }) => {
        const batGeniePage = new BatGeniePage(page);

        // Go to baseUrl set in .env
        await batGeniePage.goToHomePage(getBaseUrl());
        console.log("URL: " + getBaseUrl());

        // Click the My Account link.
        // await BatGeniePage.myAccountLink.click();
    });

    test('1: sign in', async ({ page }) => {
        const batGeniePage = new BatGeniePage(page);

        // Sign In
        // await batGeniePage.signIn(signInUser.email, signInUser.password)
    });
});