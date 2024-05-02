import { expect } from '@playwright/test'
import MailosaurClient from 'mailosaur'
import { getBaseUrl } from '../globalSetup.js';

export class AccountSignInPage {
    constructor(page) {
        this.page = page;
        // Home Page
        this.myAccountLink = page.getByRole('link', { name: 'My Account Sign In to Earn' });
  
        // Sign In Page
        this.signInPageHeader = page.getByRole('heading', { name: 'Sign in' });
        this.signInEmailField = page.locator('[id = "username"]') //page.getByLabel('Email address');
        this.signInPasswordField = page.locator('[id = "password"]') //page.getByLabel('Password');
        this.signInButton = page.getByRole('button', {name: 'Sign In'});
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
        this.forgotPasswordEmailField = page.locator('[id = "email"]')
        this.forgotPasswordHeader = page.getByRole('heading', { name: 'Forgot Your Password?' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.checkYourEmailHeader = page.getByRole('heading', { name: 'Check Your Email' });
        this.changeYourPasswordHeader = page.getByRole('heading', { name: 'Change Your Password' });
        this.newPasswordField = page.locator('[id="password-reset"]')
        this.reEnterNewPasswordField = page.locator('[id="re-enter-password"]')
        this.resetPasswordButton = page.getByRole('button', { name: 'Reset password' });
        this.passwordChangedHeader = page.getByRole('heading', { name: 'Password Changed!' });
        this.backToSignInLink = page.getByRole('link', { name: 'Back to Sign In' });
        this.continueWithAppleButton = page.getByRole('button', { name: 'Continue with Apple' })
        this.continueWithGoogleButton = page.getByRole('button', { name: 'Continue with Google' })
        this.passwordError = page.locator('[id="error-element-password"]')

        // Account Page
        this.accountUserInfo = page.locator('[class="user-info"]');
        this.summaryLink = page.getByRole('link', { name: 'Summary' });
    }

    async goToHomePage(url) {
        await this.page.goto(url);
    }

    async signIn(email, password) {
        await this.page.waitForURL("https://sso.dickssportinggoods.com/u/login**")

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

        // Verify account page and links
        await this.page.waitForURL(getBaseUrl() + "MyAccount/AccountSummary")
        await expect(this.accountUserInfo).toBeVisible();
        await expect(this.summaryLink).toBeVisible();

        console.log("Sign In Successful for: " + email)
    }


    async signInBatGenie(email, password) {
        await this.page.waitForURL("https://sso.dickssportinggoods.com/u/login**")

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

        console.log("Sign In Successful for: " + email)

    }


    async forgotPassword(email) {
        await expect(this.forgotPasswordLink).toBeVisible();
        await this.forgotPasswordLink.click();

        await expect(this.forgotPasswordHeader).toBeVisible();
        await expect(this.forgotPasswordEmailField).toBeVisible();

        await this.forgotPasswordEmailField.click();
        await this.forgotPasswordEmailField.fill(email);

        await this.continueButton.click();
    }

    async extractChangeEmailPasswordLink(emailServerId, resetEmail, dateSent) {
        const mailosaur = new MailosaurClient("Yllvkk64VJxnA9L");

        // Connect to Mailosaur, and wait for that email to arrive
        const email = await mailosaur.messages.get(emailServerId, {
            sentTo: resetEmail,
        });

        // console.log(email);
  
        // Validate email is recent and correct subject
        expect(dateSent < email.received).toBeTruthy();
        expect(email.subject).toBe("Reset your password");
        
        // Get the reset link (TODO: use text instead of index in the future)
        const passwordResetLink = email.html.links[5].href;
        console.log("Reset Link: " + passwordResetLink);

        return passwordResetLink;
    }

    async changePassword(newPassword) {

        await expect(this.changeYourPasswordHeader).toBeVisible();
        await this.newPasswordField.click();
        await this.newPasswordField.fill(newPassword);
        await this.reEnterNewPasswordField.click();
        await this.reEnterNewPasswordField.fill(newPassword);
        await this.resetPasswordButton.click();

    }
};