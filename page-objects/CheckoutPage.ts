import { Locator, Page, expect } from '@playwright/test';
import { AccountSignInPage } from './AccountSignInPage';
import { CommonPage } from './CommonPage';

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
    readonly giftCardLink: Locator;
    readonly promoCodeLink: Locator;
    readonly giftCardNumber: Locator;
    readonly giftCardPin: Locator;
    readonly applyGiftCard: Locator;
    readonly closeGiftCard: Locator;
    readonly promoCodeInput: Locator;
    readonly applyPromoCodeBtn: Locator;
    readonly promoAppliedMessage: Locator;
    readonly closePromoCodeBtn: Locator;
    readonly signInButton: Locator;
    readonly paypalIframe: any;
    readonly paypalCheckoutButton: any;
    readonly affirmCheckoutButton: any;
    readonly paypalRadioButton: Locator;
    readonly payWithPayPalLabel: Locator;
    readonly affirmRadioButton: Locator;
    readonly afterPayRadioButton:Locator;
    readonly afterpayCheckoutButton: Locator;
    readonly creditCardRadioButton: Locator;
    readonly appliedGiftCardMessage: any;
    readonly removeGClink: Locator;
    readonly appliedGCMessage: any;

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
        
        this.giftCardLink=page.getByRole('button', { name: 'Add Gift Card' })
        this.promoCodeLink= page.getByRole('button', { name: 'Apply Promo Code' })
        this.giftCardNumber= page.getByLabel('Gift Card Code')
        this.giftCardPin= page.getByLabel('Pin', { exact: true })
        this.applyGiftCard = page.getByRole('button', { name: 'Apply Gift Card' })
        this.closeGiftCard= page.getByRole('button', { name: 'CLOSE' })
        this.promoCodeInput=page.getByLabel('Promo Codes')
        this.applyPromoCodeBtn=page.locator('#paymentPageContainer button').filter({ hasText: /^Apply Promo Code$/ })
        this.promoAppliedMessage= page.locator("xpath=//div[(@class='promo-code-applied') and (contains(text(),'successfully applied.'))]")
        this.closePromoCodeBtn= page.locator("xpath=//div[text()='Apply Promo Code']/following-sibling::button//i[contains(@class,'mdi-close')]")

        this.signInButton= page.getByRole('link', { name: 'Sign In' })
        this.paypalRadioButton= page.locator('#paypalLabel')
        this.affirmRadioButton= page.locator("xpath=//img[contains(@src,'affirmLogo')]")
        this.afterPayRadioButton= page.locator("xpath=//img[contains(@src,'afterpayLogo')]")
        this.creditCardRadioButton= page.locator("xpath=//label[text()='Credit/Debit Card']")
        this.paypalIframe= page.frameLocator("xpath=//iframe[@title='PayPal' and contains(@name,'paypal')]")
        this.paypalCheckoutButton= this.paypalIframe.locator("xpath=//div[@aria-label='PayPal Checkout']")

        this.affirmCheckoutButton= page.locator("xpath=//a[@id='affirmButton']")
        this.afterpayCheckoutButton= page.locator("xpath=//afterpay-button[@id='afterpayButton']")
        this.appliedGiftCardMessage=page.getByText('See Order Totals Section for applied Gift Cards.', { exact: true })
        this.removeGClink=page.getByRole('button', { name: 'Remove' })
        this.appliedGCMessage=page.getByText('Applied Gift Card', { exact: true })
        
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
    async continueWithContactInformation():Promise<void>
    {
        await expect(this.contactInfoFirstName).toBeVisible();
        await this.checkoutContinueButton.click();
        await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible()
    }
    async verifyContactInfoIsEmpty():Promise<void>
    {
        await expect(this.contactInfoFirstName).toHaveText("")
        await expect(this.contactInfoLastName).toHaveText("")
        await expect(this.contactInfoEmail).toHaveText("")
        await expect(this.contactInfoPhoneNumber).toHaveText("")
    }

    async verifyContactInfoIsNotEmpty():Promise<void>
    {
        await expect(this.contactInfoFirstName).toBeVisible();
        await expect(this.contactInfoFirstName).toHaveText("");
        await expect(this.contactInfoLastName).not.toHaveText("")
        await expect(this.contactInfoEmail).not.toHaveText("")
        await expect(this.contactInfoPhoneNumber).not.toHaveText("")
    }

    async verifyGiftCardFunctionality(giftCardNumber:string, giftCardPin:string):Promise<void>
    {
        await this.page.waitForLoadState("load");
        //await this.page.waitForLoadState("networkidle");
        await this.giftCardLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.giftCardNumber.fill(giftCardNumber);
        await this.giftCardPin.fill(giftCardPin);
        await expect(this.applyGiftCard).toBeVisible();
        await this.applyGiftCard.click();
        await expect(this.appliedGiftCardMessage).toBeVisible();
        await this.closeGiftCard.click();
        await expect(this.appliedGCMessage).toBeVisible();
        await this.removeGClink.click();

    }

    async verifyPromoCodeFunctionality(promocode:string):Promise<void>
    {
        const commonPage= new CommonPage(this.page);
        await this.page.waitForLoadState("load");
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.promoAppliedMessage).toBeVisible();
        await this.closePromoCodeBtn.click();
        await commonPage.sleep(3);
    }

    async signInAsRegisteredUser(username:string, password:string):Promise<void>
    {
        const accountSignInPage= new AccountSignInPage(this.page);
        await this.signInButton.click();
        await accountSignInPage.accountSignInModern(username, password);

    }
    async verifyPayPalCheckout() : Promise<void>
    {   
        const pagePromise = this.page.context().waitForEvent('page');
        await this.paypalCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h1[text()='Pay with PayPal']")).toBeVisible();
        console.log("Paypal checkout page loaded")
        newPage.close();

    }
    async verifyAffirmCheckout():Promise<void>
    {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.affirmCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h1[text()='Pay over time with Affirm']")).toBeVisible();
        console.log("Affirm checkout page loaded")
        newPage.close();

    }
    async verifyAfterPayCheckout():Promise<void>
    {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.afterpayCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h2[contains(text(),'get started!')]")).toBeVisible();
        console.log("Afterpay checkout page loaded")
        newPage.close();

    }
    async selectAPaymentOption(paymentOption:string):Promise<void>
    {
        if(paymentOption=="Paypal")
            {
                await this.paypalRadioButton.click();
            }
            else if(paymentOption=="Creditcard")
                {
                    await this.creditCardRadioButton.click();
                }
                else if(paymentOption=="Affirm")
                    {
                        await this.affirmRadioButton.click();
                    }
                    else if(paymentOption=="AfterPay")
                        {
                            await this.afterPayRadioButton.click();
                        }
                        else if(paymentOption=="ApplePay")
                            {

                            }
                        else{
                            console.log("Given payment option is not present in the Checkout page")
                        }
    }
}
