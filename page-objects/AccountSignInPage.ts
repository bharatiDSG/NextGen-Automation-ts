import { Locator, Page, expect } from '@playwright/test';

import MailosaurClient from 'mailosaur';
import { getBaseUrl } from '../globalSetup.js';
import { CommonPage } from './CommonPage.js';

export class AccountSignInPage {
    private page: Page;

    // Sign In Page
    private signInPageHeader: Locator;
    private signInEmailField: Locator;
    private signInPasswordField: Locator;
    private signInButton: Locator;
    private forgotPasswordLink: Locator;
    private forgotPasswordEmailField: Locator;
    private forgotPasswordHeader: Locator;
    private continueButton: Locator;
    private checkYourEmailHeader: Locator;
    private changeYourPasswordHeader: Locator;
    private newPasswordField: Locator;
    private reEnterNewPasswordField: Locator;
    private resetPasswordButton: Locator;
    public passwordChangedHeader: Locator;
    public backToSignInLink: Locator;
    private continueWithAppleButton: Locator;
    private continueWithGoogleButton: Locator;
    private passwordError: Locator;
    private continueButtonModern: Locator;
    private continueWithoutPasskey: Locator;

    // Account Page
    private accountUserInfo: Locator;
    private summaryLink: Locator;
    public recentOrderText: Locator;
    public scoreMoreRewardsText: Locator;

    private verifyHuman: Locator;
    private verifyHumanSuccessMsg: Locator;


    constructor(page: Page) {
        this.page = page;

        // Sign In Page
        this.signInPageHeader = page.getByRole('heading', { name: 'Sign in' });
        this.signInEmailField = page.locator('[id="username"]');
        this.signInPasswordField = page.locator('[id="password"]');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
        this.forgotPasswordEmailField = page.locator('[id="email"]');
        this.forgotPasswordHeader = page.getByRole('heading', { name: 'Forgot Your Password?' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.checkYourEmailHeader = page.getByRole('heading', { name: 'Check Your Email' });
        this.changeYourPasswordHeader = page.getByRole('heading', { name: 'Change Your Password' });
        this.newPasswordField = page.locator('[id="password-reset"]');
        this.reEnterNewPasswordField = page.locator('[id="re-enter-password"]');
        this.resetPasswordButton = page.getByRole('button', { name: 'Reset password' });
        this.passwordChangedHeader = page.getByRole('heading', { name: 'Password Changed!' });
        this.backToSignInLink = page.getByRole('link', { name: 'Back to Sign In' });
        this.continueWithAppleButton = page.getByRole('button', { name: 'Continue with Apple' });
        this.continueWithGoogleButton = page.getByRole('button', { name: 'Continue with Google' });
        this.passwordError = page.locator('[id="error-element-password"]');
        this.continueWithGoogleButton = page.getByRole('button', { name: 'Continue with Google' });
        this.continueWithoutPasskey = page.getByRole('button', { name: 'Continue without passkeys' });


        // Account Page
        this.accountUserInfo = page.locator('[class="user-info"]');
        this.summaryLink = page.getByRole('link', { name: 'Summary' });
        this.recentOrderText = page.getByText('Recent Order')
        this.scoreMoreRewardsText = page.getByText('Score More Rewards')
        this.continueButtonModern = page.getByRole('button', { name: 'Continue', exact: true });
        this.verifyHuman= page.locator('#ulp-auth0-v2-captcha #shadow-root #cf-chl-widget-wcuyd html body #shadow-root').locator('//span[text()="Verify you are human"]');
        this.verifyHumanSuccessMsg= page.locator('#ulp-auth0-v2-captcha #shadow-root #cf-chl-widget-wcuyd html body #shadow-root').locator('//span[text()="Success!"]');
    }

    async signIn(email: string, password: string): Promise<void> {
        await this.page.waitForURL('https://sso.dickssportinggoods.com/u/login**');
        await this.page.waitForTimeout(5000);

        await expect(this.signInPageHeader).toBeVisible();
        await expect(this.signInEmailField).toBeVisible();

        await expect(this.continueWithAppleButton).toBeVisible();
        await expect(this.continueWithGoogleButton).toBeVisible();

        await this.signInEmailField.click();
        await this.signInEmailField.fill(email);
        await this.signInEmailField.press('Tab');

        await this.signInPasswordField.fill(password);
        await this.signInPasswordField.press('Tab');
        await this.page.keyboard.press('Tab');
        await this.page.keyboard.press('Space');

        await this.page.waitForTimeout(5000);
        //await expect(this.verifyHumanSuccessMsg).toBeVisible();
        await this.signInButton.click();

        // Verify account page and links
        await this.page.waitForURL(getBaseUrl() + 'MyAccount/AccountSummary');
        await expect(this.accountUserInfo).toBeVisible();
        await expect(this.summaryLink).toBeVisible();

        console.log('Sign In Successful for: ' + email);
    }

    async signInBatGenie(email: string, password: string): Promise<void> {
        await this.page.waitForURL('https://sso.dickssportinggoods.com/u/login**');

        await expect(this.signInPageHeader).toBeVisible();
        await expect(this.signInEmailField).toBeVisible();

        await expect(this.continueWithGoogleButton).not.toBeVisible();
        await expect(this.continueWithAppleButton).not.toBeVisible();

        await this.signInEmailField.click();
        await this.signInEmailField.fill(email);
        await this.signInEmailField.press('Tab');

        await this.signInPasswordField.fill(password);
        await this.signInPasswordField.press('Tab');

        await this.signInButton.click();

        // Verify no error since we can't validate bat genie page
        await expect(this.passwordError).not.toBeVisible();

        console.log('Sign In Successful for: ' + email);
    }

    async forgotPassword(email: string): Promise<void> {
        await expect(this.forgotPasswordLink).toBeVisible();
        await this.forgotPasswordLink.click();

        await expect(this.forgotPasswordHeader).toBeVisible();
        await expect(this.forgotPasswordEmailField).toBeVisible();

        await this.forgotPasswordEmailField.click();
        await this.forgotPasswordEmailField.fill(email);

        await this.continueButton.click();
    }

    async extractChangeEmailPasswordLink(emailServerId: string, resetEmail: string, dateSent: Date): Promise<string> {
        const mailosaur = new MailosaurClient('Yllvkk64VJxnA9L');

        // Connect to Mailosaur, and wait for that email to arrive
        const email = await mailosaur.messages.get(emailServerId, {
            sentTo: resetEmail,
        });

        // Validate email is recent and correct subject
        if (email.received && dateSent < email.received) {
            expect(email.subject).toBe('Reset your password');

            // Get the reset link (TODO: use text instead of index in the future)
            if (email.html && email.html.links && email.html.links[4]) {
                const passwordResetLink = email.html.links[4].href as string;
                console.log('Reset Link: ' + passwordResetLink);
                return passwordResetLink;
            } else {
                throw new Error('Email content is missing or invalid.');
            }
        } else {
            throw new Error('Email not received or received date is invalid.');
        }
    }


    async validateOrderConfirmationEmail(emailServerId: string, emailAddress: string): Promise<string> {
        const mailosaur = new MailosaurClient('Yllvkk64VJxnA9L');

        // Connect to Mailosaur, and wait for that email to arrive
        const email = await mailosaur.messages.get(emailServerId, {
            sentTo: emailAddress,
        });

        // Ensure email.html and email.html.codes are defined
        if (email.html && email.html.codes && email.html.codes[0]) {
            const orderNumber = email.html.codes[0].value as string;
            console.log('orderNumberFromEmail: ' + orderNumber);

            expect(email.subject).toBe('Thank you for your order!');

            return orderNumber;
        } else {
            throw new Error('Order number not found in email.');
        }
    }

    async changePassword(newPassword: string): Promise<void> {
        await expect(this.changeYourPasswordHeader).toBeVisible();
        await this.newPasswordField.click();
        await this.newPasswordField.fill(newPassword);
        await this.reEnterNewPasswordField.click();
        await this.reEnterNewPasswordField.fill(newPassword);
        await this.resetPasswordButton.click();
    }

    async accountSignInModern(username: string, password: string): Promise<void> {
        const commonPage = new CommonPage(this.page);
        await commonPage.waitUntilPageLoads();
        await this.signInEmailField.fill(username);
        await this.continueButtonModern.click();
        await commonPage.waitUntilPageLoads();
        await this.signInPasswordField.fill(password);
        await this.continueButtonModern.click();
        await commonPage.waitUntilPageLoads();
        await this.continueWithoutPasskey.click();

    }

    async signInFromPDP(email, password) {
        await this.page.waitForURL('https://sso.dickssportinggoods.com/u/login**');

        await expect(this.signInPageHeader).toBeVisible();
        await expect(this.signInEmailField).toBeVisible();

        await expect(this.continueWithAppleButton).toBeVisible();
        await expect(this.continueWithGoogleButton).toBeVisible();

        await this.signInEmailField.click();
        await this.signInEmailField.fill(email);
        await this.signInEmailField.press('Tab');

        await this.signInPasswordField.fill(password);
        await this.signInPasswordField.press('Tab');

        await this.signInButton.click();

        console.log('Sign In Successful for: ' + email);
    }
}
