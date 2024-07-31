import { Locator, Page, expect } from '@playwright/test';
import { AccountSignInPage } from './AccountSignInPage';
import { CommonPage } from './CommonPage';
import { assert, error } from 'console';

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
    readonly giftCardErrroMessage: any;
    readonly removeGClink: Locator;
    readonly appliedGCMessage: any;
    readonly orderSubTotal: Locator;
    readonly estimatedShipping: Locator;
    readonly estimatedTax: Locator;
    readonly changeBillingShippingAddress: any;
    readonly shippingPromotion: Locator;
    readonly largeItemShippingDetails: any;
    commonPage: CommonPage;
    readonly largeItemShippingMethods: Locator;
    readonly creditCardErrormessage: Locator;
    readonly sameShippingAndBillingCheckbox: Locator;
    readonly shippingBillingFirstName: Locator;
    readonly shippingBillingLastName: Locator;
    readonly shippingFirstName: Locator;
    readonly shippingLastName: Locator;
    readonly shippingAddress: Locator;
    readonly shippingAddressLine2: Locator;
    readonly shippingZipcode: Locator;
    readonly miniCartIcon:Locator;
    readonly billingFirstName: Locator;
    readonly billingLastName: Locator;
    readonly billingAddress: Locator;
    readonly billingAddressLine2: Locator;
    readonly billingZipcode: Locator;
    readonly editBillingShippingInfo: Locator;
    readonly expeditedShippingRadioBtn: Locator;
    readonly expressShippingRadioBtn: Locator;
    

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

        this.sameShippingAndBillingCheckbox= page.locator('//chk-billing-shipping-checkbox');
        this.shippingBillingFirstName= page.getByRole('textbox', { name: 'First Name' })
        this.shippingBillingLastName= page.getByRole('textbox', { name: 'Last Name' })
        this.billingShippingAddress = page.locator('[id="address"]');
        this.billingShippingAddress2 = page.locator('[id="address2"]');
        this.billingShippingZipcode = page.locator('[id="zipcode"]');
        this.billingShippingCompletedCheckmarkImg = page.locator('#billing-form-card').or(page.locator('#shipping-form-card')).getByLabel('completed').getByRole('img');
        
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
        this.giftCardErrroMessage=page.getByText('There is no remaining balance on this card', { exact: true })
        this.removeGClink=page.getByRole('button', { name: 'Remove' })
        this.appliedGCMessage=page.getByText('Applied Gift Card', { exact: true })

        this.orderSubTotal= page.locator("//p[contains(text(),'Order Subtotal')]//following-sibling::p")
        this.estimatedShipping= page.locator("//p[contains(text(),'Estimated Shipping')]//following-sibling::p")
        this.shippingPromotion= page.locator("//p[contains(text(),'Shipping Credit') and contains(@class,'promotion')]//following-sibling::p")
        this.estimatedTax= page.locator("//p[contains(text(),'Estimated Tax')]//following-sibling::p")
        this.changeBillingShippingAddress=page.locator('#billing-form-card').getByRole('button', { name: 'Change' })

        this.largeItemShippingDetails=page.getByRole('link', { name: 'Large Item Shipping Details' })
        this.largeItemShippingMethods=page.getByText('Large Item Shipping Methods:')
        this.creditCardErrormessage=page.locator("//div[@class='credit-card-form-errors' and @style='']")

        this.shippingFirstName= page.locator('#shipping-form-card #shipFirstName')
        this.shippingLastName= page.locator('#shipping-form-card #shipLastName')
        this.shippingAddress= page.locator('#shipping-form-card #address')
        this.shippingAddressLine2= page.locator('#shipping-form-card #address2')
        this.shippingZipcode= page.locator('#shipping-form-card #zipcode')

        this.billingFirstName= page.locator('#billing-form-card #shipFirstName')
        this.billingLastName= page.locator('#billing-form-card #shipLastName')
        this.billingAddress= page.locator('#billing-form-card #address')
        this.billingAddressLine2= page.locator('#billing-form-card #address2')
        this.billingZipcode= page.locator('#billing-form-card #zipcode')
        this.editBillingShippingInfo= page.getByRole('button', { name: 'Edit', exact: true });
    
        
        this.miniCartIcon= page.locator("//homefield-icon[@id='mini-cart-icon']")

        this.expeditedShippingRadioBtn= page.getByLabel('Expedited Shipping – $')
        this.expressShippingRadioBtn=page.getByLabel('Express Shipping – $')

        this.commonPage= new CommonPage(page);
        
    }

    async enterContactInfo(firstName: string, lastName: string, email: string, phoneNumber: string): Promise<void> {
        if(await this.contactInfoFirstName.isVisible())
        {
        await this.contactInfoFirstName.click();
        await this.contactInfoFirstName.fill(firstName);
        await this.contactInfoFirstName.press('Tab');
        await this.contactInfoLastName.fill(lastName);
        await this.contactInfoLastName.press('Tab');
        }
        await this.contactInfoEmail.click();          
        await this.contactInfoEmail.fill(email);
        await this.contactInfoEmail.press('Tab');
        await this.contactInfoPhoneNumber.fill(phoneNumber);

        await this.checkoutContinueButton.click();

        await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
    }

    async enterBillingShippingInfo(firstName:string, lastName:string, address: string, address2: string, zipCode: string): Promise<void> {
        if(await this.editBillingShippingInfo.isVisible())
        {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState("domcontentloaded");
        }
        if(await this.shippingBillingFirstName.isVisible())
        {
        await this.shippingBillingFirstName.click();
        await this.shippingBillingFirstName.fill(firstName);
        await this.shippingBillingFirstName.press('Tab');
        await this.shippingBillingLastName.fill(lastName);
        await this.shippingBillingLastName.press('Tab');
        }
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
    async enterShippingInfo(firstName:string, lastname:string, address: string, address2: string, zipCode: string): Promise<void> {
        
        if(await this.shippingFirstName.isVisible())
            {
            await this.shippingFirstName.click();
            await this.shippingFirstName.click();
            await this.shippingFirstName.fill(firstName);
            await this.shippingFirstName.press('Tab');
            await this.shippingLastName.fill(lastname);
            await this.shippingLastName.press('Tab');
            await this.shippingAddress.fill(address);
            await this.shippingAddress.press('Tab');
            await this.shippingAddressLine2.fill(address2);
            await this.shippingAddressLine2.press('Tab');
            await this.shippingZipcode.fill(zipCode);
            await this.shippingZipcode.press('Tab');
            }
            else{
            await this.billingFirstName.click();
            await this.billingFirstName.fill(firstName);
            await this.billingFirstName.press('Tab');
            await this.billingLastName.fill(lastname);
            await this.billingLastName.press('Tab');
            await this.billingAddress.fill(address);
            await this.billingAddress.press('Tab');
            await this.billingAddressLine2.fill(address2);
            await this.billingAddressLine2.press('Tab');
            await this.billingZipcode.fill(zipCode);
            await this.billingZipcode.press('Tab');
            }
        await this.checkoutContinueButton.click();

        await expect(this.billingShippingCompletedCheckmarkImg).toBeVisible();
    }
    async enterBillingShippingWithInValidInfo(address: string, address2: string, zipCode: string, errorMessage:string): Promise<void> {
        if(await this.editBillingShippingInfo.isVisible())
            {
                await this.editBillingShippingInfo.click();
                await this.page.waitForLoadState("domcontentloaded");
            }
        await this.billingShippingAddress.click();
        await this.billingShippingAddress.fill(address);
        await this.billingShippingAddress.press('Tab');
        await this.billingShippingAddress2.fill(address2);
        await this.billingShippingAddress2.press('Tab');
        await this.billingShippingZipcode.fill(zipCode);
        await this.billingShippingZipcode.press('Tab');
        await this.checkoutContinueButton.click();

        await expect(this.page.locator("//*[text()='"+errorMessage+"']")).toBeVisible();
    }
    async enterShippingWithInvalidInfo(firstName:string,lastName:string,address: string, address2: string, zipCode: string, errorMessage:string): Promise<void> {
        if(await this.shippingFirstName.isVisible())
        {
        await this.shippingFirstName.click();
        await this.shippingFirstName.fill(firstName);
        await this.shippingFirstName.press('Tab');
        await this.shippingLastName.fill(lastName);
        await this.shippingLastName.press('Tab');
        await this.shippingAddress.fill(address);
        await this.shippingAddress.press('Tab');
        await this.shippingAddressLine2.fill(address2);
        await this.shippingAddressLine2.press('Tab');
        await this.shippingZipcode.fill(zipCode);
        await this.shippingZipcode.press('Tab');
        }
        else{
        await this.billingFirstName.click();
        await this.billingFirstName.fill(firstName);
        await this.billingFirstName.press('Tab');
        await this.billingLastName.fill(lastName);
        await this.billingLastName.press('Tab');
        await this.billingAddress.fill(address);
        await this.billingAddress.press('Tab');
        await this.billingAddressLine2.fill(address2);
        await this.billingAddressLine2.press('Tab');
        await this.billingZipcode.fill(zipCode);
        await this.billingZipcode.press('Tab');
        }
        await this.checkoutContinueButton.click();

        await expect(this.page.locator("//*[text()='"+errorMessage+"']")).toBeVisible();
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
    async verifyInvalidGiftCardFunctionality(giftCardNumber:string, giftCardPin:string):Promise<void>
    {
        await this.page.waitForLoadState("load");
        //await this.page.waitForLoadState("networkidle");
        await this.giftCardLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.giftCardNumber.fill(giftCardNumber);
        await this.giftCardPin.fill(giftCardPin);
        await expect(this.applyGiftCard).toBeVisible();
        await this.applyGiftCard.click();
        await expect(this.giftCardErrroMessage).toBeVisible();
        await this.closeGiftCard.click();
        await expect(this.appliedGCMessage).not.toBeVisible();

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
    async verifyInvalidPromoCodeFunctionality(promocode:string):Promise<void>
    {
        const commonPage= new CommonPage(this.page);
        await this.page.waitForLoadState("load");
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.page.locator("//div[(contains(text(),'Promo code "+promocode +" does not match an active promotion.'))]")).toBeVisible();
        await this.closePromoCodeBtn.click();
        await commonPage.sleep(3);
    }
    async verifyInvalidPromoCodeWithErrorMessageFunctionality(promocode:string, errorMessage:string):Promise<void>
    {
        const commonPage= new CommonPage(this.page);
        await this.page.waitForLoadState("load");
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.page.locator("//div[contains(@class,'rewards-sign-in-error') and (contains(string(),'"+errorMessage+"'))]")).toBeVisible();
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
    async verifyEstimatedTax(taxNumber:number)
    {
        let subTotal=await this.getOrderSubTotal();
        let estimatedShipping= await this.getEstimatedShipping();
        let orderTotal=subTotal+estimatedShipping
        console.log(orderTotal);
        let expectedTax:number = orderTotal*taxNumber
        let actualTax= await this.getEstimatedTax();
        expect(actualTax.toFixed(2)).toEqual(expectedTax.toFixed(2));

    }
    async getOrderSubTotal():Promise<number>
    {
        let subTotal:any= await this.orderSubTotal.innerText();
        console.log(Number.parseFloat(subTotal.toString().replace('$','')))
        return Number.parseFloat(subTotal.toString().replace('$',''));
        
    }
    async getEstimatedShipping():Promise<number>
    {
        if((await this.estimatedShipping.innerText()).includes("Free"))
        {
            return 0.00;
        }
        else{
        let estimatedShippingCharges:any= await this.estimatedShipping.innerText();
        let estShipping= Number.parseFloat(estimatedShippingCharges.toString().replace('$',''));
        if(await this.shippingPromotion.isVisible())
        {
            let shippingPromotion:any= await this.shippingPromotion.innerText();
            let numericShippingPromotion= Number.parseFloat(shippingPromotion.toString().replace('-$',''))
            estShipping= estShipping-numericShippingPromotion;
        }
        console.log(estShipping)
        return estShipping;
    }
    }
    async getEstimatedTax():Promise<number>
    {
        let estimatedTaxCharges:any= await this.estimatedTax.innerText();
        console.log(Number.parseFloat(estimatedTaxCharges.toString().replace('$','')))
        return Number.parseFloat(estimatedTaxCharges.toString().replace('$',''));
    }
    async clickEditBillingShippingInfo(): Promise<void>
    {
        await this.changeBillingShippingAddress.click();
    }
    async clickLargeItemShippingDetailsLink()
    {
        await this.largeItemShippingDetails.click();
        await this.page.waitForLoadState("load");

    }
    async verifyLargeItemShippingDetails(expectedString:string)
    {
        expect(await this.largeItemShippingMethods.innerText()).toContain(expectedString);
    }
    async validateErrorMessage(expectedErrorMessage:string)
    {
        expect(await this.creditCardErrormessage.innerText()).toContain(expectedErrorMessage);
    }
    async unCheckSameShippingAndBillingAddress()
    {
        await this.sameShippingAndBillingCheckbox.click();
    }
    async goBackToCart()
    {
        await this.miniCartIcon.click();
    }
    async changeShippingMethodAndVerifyShippingCharges(shippingMethod:string, shippingCharges:string)
    {
        await this.changeShippingMethod(shippingMethod);
        await this.page.waitForLoadState('domcontentloaded')
        expect((await this.getEstimatedShipping()).toString()).toEqual(shippingCharges);

    }
    async changeShippingMethod(shippingMethod:string)
    {
        if(shippingMethod.includes('Expedite'))
        {
            await this.expeditedShippingRadioBtn.click();
            await this.shippingTitleAnchor.click();
            await this.page.waitForTimeout(2000)
            await this.page.waitForLoadState('domcontentloaded')
            
        }
        else if(shippingMethod.includes('Express'))
        {
            await this.expressShippingRadioBtn.click();
            await this.shippingTitleAnchor.click();
            await this.page.waitForTimeout(2000)
            await this.page.waitForLoadState('domcontentloaded')
        }
        else
        {

        }
        
    }

}
