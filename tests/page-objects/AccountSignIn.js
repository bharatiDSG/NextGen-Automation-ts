const { expect } = require("@playwright/test");

exports.AccountSignIn = class AccountSignIn {
    constructor(page) {
        this.page = page;
        // Home Page
        this.myAccountLink = page.getByRole('link', { name: 'My Account Sign In to Earn' });
  
        // Sign In Page
        this.signInPageHeader = page.getByRole('heading', { name: 'Sign in' });
        this.signInEmailField = page.getByLabel('Email address');
        this.signInPasswordField = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', {name: 'Sign In'});
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
        this.forgotPasswordHeader = page.getByRole('heading', { name: 'Forgot Your Password?' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.checkYourEmailHeader = page.getByRole('heading', { name: 'Check Your Email' });

        // Account Page
        this.hiTitle = page.getByText('Hi, ');
        this.summaryLink = page.getByRole('link', { name: 'Summary' });
    }

    async goToHomePage(url) {
        await this.page.goto(url);
    }

    async pageTitle(app) {

        if (app.includes("dickssportinggoods")) {
            await expect(this.page).toHaveTitle(/DICK'S Sporting Goods - Official Site - Every Season Starts at DICK'S/);
        } else if (app.includes("publiclands")) {
            await expect(this.page).toHaveTitle(/Public Lands | Your Hub For The Outdoors/);
        } else if (app.includes("golfgalaxy")) {
            await expect(this.page).toHaveTitle(/Golf Galaxy/);
        }
    }

    async signIn(email, password) {
        await expect(this.signInPageHeader).toBeVisible();

        await expect(this.signInEmailField).toBeVisible();
        await this.signInEmailField.click();
        await this.signInEmailField.fill(email);
        await this.signInEmailField.press('Tab');

        await this.signInPasswordField.fill(password);
        await this.signInPasswordField.press('Tab');

        await this.signInButton.click();

        // Verify account page
        await expect(this.hiTitle).toBeVisible();
        await expect(this.summaryLink).toBeVisible();
    }

    async forgotPassword(email) {
        await expect(this.forgotPasswordLink).toBeVisible();
        await this.forgotPasswordLink.click();

        await expect(this.forgotPasswordHeader).toBeVisible();
        await expect(this.signInEmailField).toBeVisible();

        await this.signInEmailField.click();
        await this.signInEmailField.fill(email);
    }

};