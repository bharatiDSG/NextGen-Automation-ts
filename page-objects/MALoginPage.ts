import { Locator, Page, expect } from '@playwright/test';

import MailosaurClient from 'mailosaur';
import { getBaseUrl } from '../globalSetup.js';
import { CommonPage } from './CommonPage.js';

export class MALoginPage {
    private page: Page;

    // Sign In Page
    private signInPageHeader: Locator;
    private signInEmailField: Locator;
    private signInPasswordField: Locator;
    private signInButton: Locator;
    public passwordChangedHeader: Locator;
    public backToSignInLink: Locator;
    private continueWithAppleButton: Locator;
    private continueWithGoogleButton: Locator;
    private passwordError: Locator;
    public continueButtonModern: Locator;
    public continueWithoutPasskey: Locator;

    // Account Page
    private accountUserInfo: Locator;
    private summaryLink: Locator;
    public recentOrderText: Locator;
    public scoreMoreRewardsText: Locator;
    public hiUserNameText: Locator;

    private verifyHuman: Locator;
    private verifyHumanSuccessMsg: Locator;


    constructor(page: Page) {
        this.page = page;
  

        // Sign In Page
        this.signInPageHeader = page.getByRole('heading', { name: 'Welcome! Please log in.' });
        this.signInEmailField = page.getByPlaceholder('Username or Email')
        this.signInPasswordField = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Log In' });
      
    }
    

    async signIn(email: string, password: string): Promise<void> {
        await this.page.waitForTimeout(5000);

        await expect(this.signInPageHeader).toBeVisible();
        await expect(this.signInEmailField).toBeVisible();
        await this.signInEmailField.fill(email);
        await this.signInPasswordField.press('Tab');


        await this.signInPasswordField.fill(password);
        await this.signInPasswordField.press('Tab');
        

       // await this.page.waitForTimeout(5000);
        //await expect(this.verifyHumanSuccessMsg).toBeVisible();
        await this.signInButton.click();

        
}
}

