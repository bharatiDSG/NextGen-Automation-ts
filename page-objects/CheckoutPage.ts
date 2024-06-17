import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
    private page: Page;
    readonly shippingTitle: Locator;
    readonly shippingTitleAnchor: Locator;
    readonly shippingHeader: Locator;
    readonly shippingCompletedCheckMark: Locator;
    readonly placeOrderButton: Locator;
    readonly checkoutContinueButton: Locator;
    readonly standardFreeShippingRadioButton: Locator;
    readonly contactInfoFirstName: Locator;
    readonly contactInfoLastName: Locator;
    readonly contactInfoEmail: Locator;
    readonly contactInfoPhoneNumber: Locator;
    readonly contactInfoCompletedCheckmarkImg: Locator;
    readonly billingShippingAddress: Locator;
    readonly billingShippingAddress2: Locator;
    readonly billingShippingZipcode: Locator;
    readonly billingShippingCompletedCheckmarkImg: Locator;
    readonly creditCardNumberField: Locator;
    readonly creditCardExpiryDateField: Locator;
    readonly creditCardSecurityCodeField: Locator;

    constructor(page: Page) {
        this.page = page;

        this.shippingTitle = page.locator('[class="shipping-title"]');
        this.shippingTitleAnchor = page.locator('[id="shipping-anchor"]');
        this.shippingHeader = page.getByRole('heading', { name: 'Shipping completed' });
        this.shippingCompletedCheckMark = page.getByLabel('completed').getByRole('img');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.checkoutContinueButton = page.getByRole('button', { name: 'Continue' });
        this.standardFreeShippingRadioButton = page.getByLabel('Standard Shipping – FREE');
        
        this.contactInfoFirstName = page.locator('[id="contact-first-name"]');
        this.contactInfoLastName = page.locator('[id="contact-last-name"]');
        this.contactInfoEmail = page.locator('[id="contact-email"]');
        this.contactInfoPhoneNumber = page.locator('[id="contact-phone"]');
        this.contactInfoCompletedCheckmarkImg = page.locator('#contact-info-card-form').getByLabel('completed').getByRole('img');
        
        this.billingShippingAddress = page.locator('[id="address"]');
        this.billingShippingAddress2 = page.locator('[id="address2"]');
        this.billingShippingZipcode = page.locator('[id="zipcode"]');
        this.billingShippingCompletedCheckmarkImg = page.locator('#billing-form-card').getByLabel('completed').getByRole('img');
        
        this.creditCardNumberField = page.frameLocator('iframe[title="Iframe for card number"] >> visible=true').locator('input[id="encryptedCardNumber"]');
        this.creditCardExpiryDateField = page.frameLocator('iframe[title="Iframe for expiry date"] >> visible=true').locator('input[id="encryptedExpiryDate"]');
        this.creditCardSecurityCodeField = page.frameLocator('iframe[title="Iframe for security code"] >> visible=true').locator('input[id="encryptedSecurityCode"]');
    }

    async enterContactInfo(firstName: string, lastName: string, email: string, phoneNumber: string): Promise<void> {
        await this.contactInfoFirstName.click();
        await this.contactInfoFirstName.fill(firstName);
        await this.contactInfoFirstName.press('Tab');
        await this.contactInfoLastName.fill(lastName);
        await this.contactInfoLastName.press('Tab');
        await this.contactInfoEmail.fill(email);
        await this.contactInfoEmail.press('Tab');
        await this.contactInfoPhoneNumber.fill(phoneNumber);

        await this.checkoutContinueButton.click();

        await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
    }

    async enterBillingShippingInfo(address: string, address2: string, zipCode: string): Promise<void> {
        await this.billingShippingAddress.click();
        await this.billingShippingAddress.fill(address);
        await this.billingShippingAddress.press('Tab');
        await this.billingShippingAddress2.fill(address2);
        await this.billingShippingAddress2.press('Tab');
        await this.billingShippingZipcode.fill(zipCode);
        await this.billingShippingZipcode.press('Tab');

        await this.checkoutContinueButton.click();

        await expect(this.billingShippingCompletedCheckmarkImg).toBeVisible();
    }

    async enterCreditCardInfo(creditCardNumber: string, expiryDate: string, securityCode: string): Promise<void> {
        await this.creditCardNumberField.scrollIntoViewIfNeeded();
        await this.creditCardNumberField.click();
        await this.creditCardNumberField.fill(creditCardNumber);
        await this.creditCardNumberField.press('Tab');
        await this.creditCardExpiryDateField.fill(expiryDate);
        await this.creditCardSecurityCodeField.press('Tab');
        await this.creditCardSecurityCodeField.fill(securityCode);
        await this.creditCardSecurityCodeField.press('Tab');
    }
}