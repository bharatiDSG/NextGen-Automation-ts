import { test, expect } from '@playwright/test';
import { getBaseUrl } from '../globalSetup.js';
import { DoorDashPage } from '../page-objects/DoorDashPage.js'
import { CommonPage } from '../page-objects/CommonPage.js'

test.describe("Door Dash", () => {
    test.beforeEach(async ({ page }) => {
        const doorDashPage = new DoorDashPage(page)

        // Go to baseUrl set in .env or defaults to dsg_prod
        await doorDashPage.goToLoginPage(getBaseUrl());
        console.log("URL: " + getBaseUrl());
    });

    test.only('1: sign in', async ({ page }) => {
        const doorDashPage = new DoorDashPage(page)
        const commonPage = new CommonPage(page)

        // Sign in
        await doorDashPage.login()
        await commonPage.sleep(5)

        // If login worked, end test, else enter code
        if (expect(page.getByRole('button', { name: 'DS Dick\'s Sporting Goods' })).toBeVisible()) {
            console.log("Signed in without sixDigitCode")

        } else {
            console.log("Let's get the sixDigitCode")

            // Get 6-digit code
            const sixDigitCode = await doorDashPage.extractSixDigitCodeFromMailosaur()

            // Enter 6-digit code
            await doorDashPage.enterSixDigitCode(sixDigitCode)

            // Verify home screen
            expect(page.getByRole('button', { name: 'DS Dick\'s Sporting Goods' })).toBeVisible()
        }

        // Click on a few things
        //const context = await browser.newContext();
        await page.getByLabel('Close Tooltip').click();
        await page.getByRole('link', { name: 'Overview' }).click();
        await page.getByRole('link', { name: 'Organization' }).click();
        await page.getByRole('link', { name: 'Simulator' }).click();
    });
});