// @SecuredAthleteProd
const {test, expect} = require('@playwright/test');
const {AccountSignIn} = require("./page-objects/AccountSignIn");
const testData = JSON.parse(JSON.stringify(require('../test-data/SecuredAthleteTestData.json')));
const url = testData.urls.dicksSportingGoods;

test.describe("Secured Athlete Prod Tests", () => {
    test.beforeEach(async ({page}) => {
        const accountSignIn = new AccountSignIn(page);
        await accountSignIn.goToHomePage(url);
    });

    test('has title', async ({page}) => {
        const accountSignIn = new AccountSignIn(page);
        await accountSignIn.pageTitle(url);
    });

    test('sign in', async ({page}) => {
        const accountSignIn = new AccountSignIn(page);

        // Click the My Account link.
        await accountSignIn.myAccountLink.click();

        // Sign In
        await accountSignIn.signIn(testData.signedInUser.email, testData.signedInUser.password);
        console.log("Sign in successful")
    });

    test('forgot password', async ({page}) => {
        const accountSignIn = new AccountSignIn(page);

        // Click the My Account link.
        await accountSignIn.myAccountLink.click();

        // Forgot password
        await accountSignIn.forgotPassword(testData.passwordResetUser.email);

    });
});
