import { FrameLocator, Locator, Page, expect } from '@playwright/test';
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
    readonly paypalIframe: FrameLocator;
    readonly paypalCheckoutButton: Locator;
    readonly affirmCheckoutButton: Locator;
    readonly paypalRadioButton: Locator;
    readonly payWithPayPalLabel: Locator;
    readonly affirmRadioButton: Locator;
    readonly afterPayRadioButton: Locator;
    readonly afterpayCheckoutButton: Locator;
    readonly creditCardRadioButton: Locator;
    readonly appliedGiftCardMessage: Locator;
    readonly giftCardErrroMessage: Locator;
    readonly removeGClink: Locator;
    readonly appliedGCMessage: Locator;
    readonly orderSubTotal: Locator;
    readonly estimatedShipping: Locator;
    readonly estimatedTax: Locator;
    readonly changeBillingShippingAddress: Locator;
    readonly shippingPromotion: Locator;
    readonly largeItemShippingDetails: Locator;
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
    readonly miniCartIcon: Locator;
    readonly billingFirstName: Locator;
    readonly billingLastName: Locator;
    readonly billingAddress: Locator;
    readonly billingAddressLine2: Locator;
    readonly billingZipcode: Locator;
    readonly editBillingShippingInfo: Locator;
    readonly expeditedShippingRadioBtn: Locator;
    readonly expressShippingRadioBtn: Locator;
    readonly orderTotal: Locator;
    readonly storePickUpCharge: Locator;
    readonly individualProductPrice: Locator;
    readonly individualProductQuantity: Locator;
    readonly estDeliveryDates: Locator;
    readonly individualProductName: Locator;
    readonly storeDetails: Locator;
    readonly freeStorePickup: Locator;
    readonly storename: Locator;
    readonly changeContactInfo: Locator;
    readonly changeBillingShippingInfo: Locator;
    readonly dsgLogo: Locator;
    readonly textMeOrderUpdates: Locator;
    readonly addPickupPersonLink: Locator;
    readonly pickupFirstname: Locator;
    readonly pickupLastname: Locator;
    readonly pickupEmail: Locator;
    readonly pickUpContinue: Locator;
    readonly giftReceipientEmail: Locator;
    readonly giftReceipientFirstName: Locator;
    readonly giftReceipientDescription: Locator;
    readonly sameDayDeliveryTip: Locator;
    readonly sameDayDevlieryTipAmount: Locator;
    readonly tipAmount: Locator;
    readonly otherTipLink: Locator;
    readonly tipAmountInput: Locator;
    readonly applyTipAmount: Locator;
    readonly billingShippingLabel: Locator;
    readonly tipChangeLink: Locator;
    readonly commonProgressSpinner: Locator;


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
        this.changeContactInfo = page.locator('#contact-info-card-form').getByRole('button', { name: 'Change' });

        this.sameShippingAndBillingCheckbox = page.locator('//chk-billing-shipping-checkbox');
        this.shippingBillingFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.shippingBillingLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.billingShippingAddress = page.locator('[id="address"]');
        this.billingShippingAddress2 = page.locator('[id="address2"]');
        this.billingShippingZipcode = page.locator('[id="zipcode"]');
        this.billingShippingCompletedCheckmarkImg = page.locator('#billing-form-card').or(page.locator('#shipping-form-card')).getByLabel('completed').getByRole('img');
        this.changeBillingShippingInfo = page.locator('#billing-form-card').or(page.locator('#shipping-form-card')).getByRole('button', { name: 'Change' });
        this.billingShippingLabel = page.locator("//h2[contains(text(),'Address')]");

        this.creditCardNumberField = page.frameLocator('iframe[title="Iframe for card number"] >> visible=true').locator('input[id="encryptedCardNumber"]');
        this.creditCardExpiryDateField = page.frameLocator('iframe[title="Iframe for expiry date"] >> visible=true').locator('input[id="encryptedExpiryDate"]');
        this.creditCardSecurityCodeField = page.frameLocator('iframe[title="Iframe for security code"] >> visible=true').locator('input[id="encryptedSecurityCode"]');

        this.giftCardLink = page.getByRole('button', { name: 'Add Gift Card' });
        this.promoCodeLink = page.getByRole('button', { name: 'Apply Promo Code' });
        this.giftCardNumber = page.getByLabel('Gift Card Code');
        this.giftCardPin = page.getByLabel('Pin', { exact: true });
        this.applyGiftCard = page.getByRole('button', { name: 'Apply Gift Card' });
        this.closeGiftCard = page.getByRole('button', { name: 'CLOSE' });
        this.promoCodeInput = page.getByLabel('Promo Codes');
        this.applyPromoCodeBtn = page.locator('#paymentPageContainer button').filter({ hasText: /^Apply Promo Code$/ });
        this.promoAppliedMessage = page.locator("xpath=//div[(@class='promo-code-applied') and (contains(text(),'successfully applied.'))]");
        this.closePromoCodeBtn = page.locator("xpath=//div[text()='Apply Promo Code']/following-sibling::button//i[contains(@class,'mdi-close')]");

        this.signInButton = page.getByRole('link', { name: 'Sign In' });
        this.paypalRadioButton = page.locator('#paypalLabel');
        this.affirmRadioButton = page.locator("xpath=//img[contains(@src,'affirmLogo')]");
        this.afterPayRadioButton = page.locator("xpath=//img[contains(@src,'afterpayLogo')]");
        this.creditCardRadioButton = page.locator("xpath=//label[text()='Credit/Debit Card']");
        this.paypalIframe = page.frameLocator("xpath=//iframe[@title='PayPal' and contains(@name,'paypal')]");
        this.paypalCheckoutButton = this.paypalIframe.locator("xpath=//div[@aria-label='PayPal Checkout']");

        this.affirmCheckoutButton = page.locator("xpath=//a[@id='affirmButton']");
        this.afterpayCheckoutButton = page.locator("xpath=//afterpay-button[@id='afterpayButton']");
        this.appliedGiftCardMessage = page.getByText('See Order Totals Section for applied Gift Cards.', { exact: true });
        this.giftCardErrroMessage = page.getByText('There is no remaining balance on this card', { exact: true });
        this.removeGClink = page.getByRole('button', { name: 'Remove' });
        this.appliedGCMessage = page.getByText('Applied Gift Card', { exact: true });

        this.orderSubTotal = page.locator("//p[contains(text(),'Order Subtotal')]//following-sibling::p");
        this.estimatedShipping = page.locator("//p[contains(text(),'Estimated Shipping')]//following-sibling::p");
        this.shippingPromotion = page.locator("//p[contains(text(),'Shipping Credit') and contains(@class,'promotion')]//following-sibling::p");
        this.estimatedTax = page.locator("//p[contains(text(),'Estimated Tax')]//following-sibling::p");
        this.changeBillingShippingAddress = page.locator('#billing-form-card').getByRole('button', { name: 'Change' });
        this.orderTotal = page.locator("//p[contains(text(),'Estimated Order Total')]//following-sibling::p");
        this.storePickUpCharge = page.locator("//p[contains(text(),'Store Pickup')]//following-sibling::p");
        this.individualProductPrice = page.locator("//p[@class='product-price']");
        this.individualProductQuantity = page.locator("//p[@class='product-price']/../following-sibling::p[contains(@class,'d-flex')]");
        this.tipAmount = page.locator("//p[contains(text(),'Tip')]//following-sibling::p");

        this.largeItemShippingDetails = page.getByRole('link', { name: 'Large Item Shipping Details' });
        this.largeItemShippingMethods = page.getByText('Large Item Shipping Methods:');
        this.creditCardErrormessage = page.locator("//div[@class='credit-card-form-errors' and @style='']");

        this.shippingFirstName = page.locator('#shipping-form-card #shipFirstName');
        this.shippingLastName = page.locator('#shipping-form-card #shipLastName');
        this.shippingAddress = page.locator('#shipping-form-card #address');
        this.shippingAddressLine2 = page.locator('#shipping-form-card #address2');
        this.shippingZipcode = page.locator('#shipping-form-card #zipcode');

        this.billingFirstName = page.locator('#billing-form-card #shipFirstName');
        this.billingLastName = page.locator('#billing-form-card #shipLastName');
        this.billingAddress = page.locator('#billing-form-card #address');
        this.billingAddressLine2 = page.locator('#billing-form-card #address2');
        this.billingZipcode = page.locator('#billing-form-card #zipcode');
        this.editBillingShippingInfo = page.getByRole('button', { name: 'Edit', exact: true });


        this.miniCartIcon = page.locator("//homefield-icon[@id='mini-cart-icon']");

        this.expeditedShippingRadioBtn = page.getByLabel('Expedited Shipping – $');
        this.expressShippingRadioBtn = page.getByLabel('Express Shipping – $');

        this.estDeliveryDates = page.locator("//span[contains(text(),' Est. Delivery: ')]");
        this.individualProductName = page.locator("//p[contains(@class,'product-name')]/span");
        this.storeDetails = page.locator('//chk-store-details');
        this.storename = page.locator('//chk-store-details/div/div');
        this.freeStorePickup = page.getByText('Free Store Pickup');
        this.dsgLogo = page.getByRole('link', { name: 'DICK\'S Sporting Goods' });

        this.textMeOrderUpdates = page.getByText('Text me order updates');
        this.addPickupPersonLink = page.locator("//span[@actiontype='AddAdditionalPickupPersonClick']");
        this.pickupFirstname = page.locator('#proxy-first-name');
        this.pickupLastname = page.locator('#proxy-last-name');
        this.pickupEmail = page.locator('#proxy-email');
        this.pickUpContinue = page.getByRole('button', { name: 'Continue' }).first();

        this.giftReceipientEmail = page.getByLabel('gift recipient', { exact: true });
        this.giftReceipientFirstName = page.getByLabel('gift recipient name');
        this.giftReceipientDescription = page.getByLabel('Gift Message (optional)');
        this.sameDayDeliveryTip = page.locator("//h2[contains(text(),'Same Day Delivery Tip')]");

        this.sameDayDevlieryTipAmount = page.locator("//button[@aria-pressed='true']/span");
        this.otherTipLink = page.getByLabel('Custom tip selection');
        this.tipAmountInput = page.getByPlaceholder('Enter tip amount');
        this.applyTipAmount = page.getByRole('button', { name: 'Apply', exact: true });
        this.tipChangeLink = page.locator('#same-day-card').getByRole('button', { name: 'Change' });

        this.commonProgressSpinner= page.locator('//common-loading-overlay/div');
    }

    async enterContactInfo(firstName: string, lastName: string, email: string, phoneNumber: string): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        if (await this.contactInfoFirstName.isVisible()) {
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
    async enterContactInfoWithOutContinue(firstName: string, lastName: string, email: string, phoneNumber: string): Promise<void> {
        if (await this.contactInfoFirstName.isVisible()) {
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

    }

    async enterBillingShippingInfo(firstName: string, lastName: string, address: string, address2: string, zipCode: string): Promise<void> {
        if (await this.editBillingShippingInfo.isVisible()) {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        if (await this.shippingBillingFirstName.isVisible()) {
            await this.shippingBillingFirstName.click();
            await this.shippingBillingFirstName.fill(firstName);
            await this.shippingBillingFirstName.press('Tab');
            await this.shippingBillingLastName.fill(lastName);
            await this.shippingBillingLastName.press('Tab');
        }
        await this.billingShippingAddress.first().click();
        await this.billingShippingAddress.first().fill(address);
        await this.billingShippingAddress.first().press('Tab');
        await this.billingShippingAddress2.first().fill(address2);
        await this.billingShippingAddress2.first().press('Tab');
        await this.billingShippingZipcode.first().fill(zipCode);
        await this.billingShippingZipcode.first().press('Tab');

        await this.checkoutContinueButton.click();

        await expect(this.billingShippingCompletedCheckmarkImg).toBeVisible();
        await expect(this.commonProgressSpinner).toHaveCount(0);
    }
    async enterBillingShippingInfoForSameDayDelivery(firstName: string, lastName: string, address: string, address2: string, zipCode: string): Promise<void> {
        if (await this.editBillingShippingInfo.isVisible()) {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        if (await this.shippingBillingFirstName.isVisible()) {
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

        await this.checkoutContinueButton.click();

        await expect(this.billingShippingCompletedCheckmarkImg).toBeVisible();
    }
    async enterShippingInfo(firstName: string, lastname: string, address: string, address2: string, zipCode: string): Promise<void> {
        if (await this.editBillingShippingInfo.isVisible()) {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        if (await this.shippingFirstName.isVisible()) {
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
        } else {
            if (await this.billingFirstName.isVisible()) {
                await this.billingFirstName.click();
                await this.billingFirstName.fill(firstName);
                await this.billingFirstName.press('Tab');
                await this.billingLastName.fill(lastname);
                await this.billingLastName.press('Tab');
            }
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
    async enterBillingShippingWithInValidInfo(firstName: string, lastName: string, address: string, address2: string, zipCode: string, errorMessage: string): Promise<void> {
        if (await this.editBillingShippingInfo.isVisible()) {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        if (await this.shippingBillingFirstName.isVisible()) {
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

        await expect(this.page.locator("//*[text()='" + errorMessage + "']")).toBeVisible();
    }
    async enterShippingWithInvalidInfo(firstName: string, lastName: string, address: string, address2: string, zipCode: string, errorMessage: string): Promise<void> {
        if (await this.editBillingShippingInfo.isVisible()) {
            await this.editBillingShippingInfo.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        if (await this.shippingFirstName.isVisible()) {
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
        } else {
            if (await this.billingFirstName.isVisible()) {
                await this.billingFirstName.click();
                await this.billingFirstName.fill(firstName);
                await this.billingFirstName.press('Tab');
                await this.billingLastName.fill(lastName);
                await this.billingLastName.press('Tab');
            }
            await this.billingAddress.fill(address);
            await this.billingAddress.press('Tab');
            await this.billingAddressLine2.fill(address2);
            await this.billingAddressLine2.press('Tab');
            await this.billingZipcode.fill(zipCode);
            await this.billingZipcode.press('Tab');
        }
        await this.checkoutContinueButton.click();

        await expect(this.page.locator("//*[text()='" + errorMessage + "']")).toBeVisible();
    }

    async enterCreditCardInfo(creditCardNumber: string, expiryDate: string, securityCode: string): Promise<void> {
        //await this.creditCardNumberField.scrollIntoViewIfNeeded();
        await this.creditCardNumberField.click();
        await this.creditCardNumberField.fill(creditCardNumber);
        await this.creditCardNumberField.press('Tab');
        await this.creditCardExpiryDateField.fill(expiryDate);
        await this.creditCardSecurityCodeField.press('Tab');
        await this.creditCardSecurityCodeField.fill(securityCode);
        await this.creditCardSecurityCodeField.press('Tab');
    }
    async continueWithContactInformation(): Promise<void> {
        await expect(this.contactInfoFirstName).toBeVisible();
        await this.checkoutContinueButton.click();
        await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
    }
    async verifyContactInfoIsEmpty(): Promise<void> {
        await expect(this.contactInfoFirstName).toHaveText('');
        await expect(this.contactInfoLastName).toHaveText('');
        await expect(this.contactInfoEmail).toHaveText('');
        await expect(this.contactInfoPhoneNumber).toHaveText('');
    }

    async verifyContactInfoIsNotEmpty(): Promise<void> {
        await expect(this.contactInfoFirstName).toBeVisible();
        await expect(this.contactInfoFirstName).toHaveText('');
        await expect(this.contactInfoLastName).not.toHaveText('');
        await expect(this.contactInfoEmail).not.toHaveText('');
        await expect(this.contactInfoPhoneNumber).not.toHaveText('');
    }

    async verifyGiftCardFunctionality(giftCardNumber: string, giftCardPin: string): Promise<void> {
        await this.page.waitForLoadState('load');
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
    async verifyInvalidGiftCardFunctionality(giftCardNumber: string, giftCardPin: string): Promise<void> {
        await this.page.waitForLoadState('load');
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

    async verifyPromoCodeFunctionality(promocode: string): Promise<void> {
        const commonPage = new CommonPage(this.page);
        await this.page.waitForLoadState('load');
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
    async verifyInvalidPromoCodeFunctionality(promocode: string): Promise<void> {
        const commonPage = new CommonPage(this.page);
        await this.page.waitForLoadState('load');
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.page.locator("//div[(contains(text(),'Promo code " + promocode + " does not match an active promotion.'))]")).toBeVisible();
        await this.closePromoCodeBtn.click();
        await commonPage.sleep(3);
    }
    async verifyInvalidPromoCodeFunctionalityForSignedInUser(promocode: string): Promise<void> {
        const commonPage = new CommonPage(this.page);
        await this.page.waitForLoadState('load');
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.page.locator("//div[(contains(text(),'Promo code " + promocode + " is not valid.'))]")).toBeVisible();
        //await expect(this.page.locator("//div[(contains(text(),'Get a $10 Reward When You Earn 300 Points!))]")).toBeVisible();
        await this.closePromoCodeBtn.click();
        await commonPage.sleep(3);
    }
    async verifyInvalidPromoCodeWithErrorMessageFunctionality(promocode: string, errorMessage: string): Promise<void> {
        const commonPage = new CommonPage(this.page);
        await this.page.waitForLoadState('load');
        //await this.page.waitForLoadState("networkidle");
        await this.promoCodeLink.click();
        //await commonPage.waitUntilPageLoads();
        await this.promoCodeInput.fill(promocode);
        await expect(this.applyPromoCodeBtn).toBeVisible();
        await this.applyPromoCodeBtn.click();
        await expect(this.page.locator("//div[contains(@class,'rewards-sign-in-error') and (contains(string(),'" + errorMessage + "'))]")).toBeVisible();
        await this.closePromoCodeBtn.click();
        await commonPage.sleep(3);
    }

    async signInAsRegisteredUser(username: string, password: string): Promise<void> {
        const accountSignInPage = new AccountSignInPage(this.page);
        await this.signInButton.click();
        await accountSignInPage.accountSignInModern(username, password);

    }
    async verifyPayPalCheckout(): Promise<void> {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.paypalCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h1[text()='Pay with PayPal']")).toBeVisible();
        console.log('Paypal checkout page loaded');
        newPage.close();

    }
    async verifyAffirmCheckout(): Promise<void> {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.affirmCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h1[text()='Pay over time with Affirm']")).toBeVisible();
        console.log('Affirm checkout page loaded');
        newPage.close();

    }
    async verifyAfterPayCheckout(): Promise<void> {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.afterpayCheckoutButton.click();
        const newPage = await pagePromise;
        console.log(await newPage.title());
        await expect(newPage.locator("//h2[contains(text(),'get started!')]")).toBeVisible();
        console.log('Afterpay checkout page loaded');
        newPage.close();

    }
    async selectAPaymentOption(paymentOption: string): Promise<void> {
        if (paymentOption == 'Paypal') {
            await this.paypalRadioButton.click();
        } else if (paymentOption == 'Creditcard') {
            await this.creditCardRadioButton.click();
        } else if (paymentOption == 'Affirm') {
            await this.affirmRadioButton.click();
        } else if (paymentOption == 'AfterPay') {
            await this.afterPayRadioButton.click();
        } else if (paymentOption == 'ApplePay') {

        } else {
            console.log('Given payment option is not present in the Checkout page');
        }
    }
    async verifyEstimatedTax(taxNumber: number) {
        const subTotal = await this.getOrderSubTotal();
        const estimatedShipping = await this.getEstimatedShipping();
        const orderTotal = subTotal + estimatedShipping;
        console.log(orderTotal);
        const expectedTax: number = orderTotal * taxNumber;
        const actualTax = await this.getEstimatedTax();
        expect(actualTax.toFixed(2)).toEqual(expectedTax.toFixed(2));

    }
    async getOrderSubTotal(): Promise<number> {
        const subTotal: string = await this.orderSubTotal.innerText();
        console.log(Number.parseFloat(subTotal.toString().replace('$', '')));
        return Number.parseFloat(subTotal.toString().replace('$', ''));

    }
    async verifyOrderTotal() {
        const subTotal = await this.getOrderSubTotal();
        const estimatedShipping = await this.getEstimatedShipping();
        const orderTotal = subTotal + estimatedShipping;
        expect((await this.getOrderTotal()).toString()).toEqual(orderTotal.toString());

    }
    async getOrderTotal(): Promise<number> {
        const orderTotal: string = await this.orderTotal.innerText();
        console.log(Number.parseFloat(orderTotal.toString().replace('$', '')));
        return Number.parseFloat(orderTotal.toString().replace('$', ''));

    }
    async getEstimatedShipping(): Promise<number> {
        if ((await this.estimatedShipping.innerText()).includes('Free')) {
            return 0.00;
        } else {
            const estimatedShippingCharges: string = await this.estimatedShipping.innerText();
            let estShipping = Number.parseFloat(estimatedShippingCharges.toString().replace('$', ''));
            if (await this.shippingPromotion.isVisible()) {
                const shippingPromotion: string = await this.shippingPromotion.innerText();
                const numericShippingPromotion = Number.parseFloat(shippingPromotion.toString().replace('-$', ''));
                estShipping = estShipping - numericShippingPromotion;
            }
            console.log(estShipping);
            return estShipping;
        }
    }
    async getEstimatedTax(): Promise<number> {
        const estimatedTaxCharges: string = await this.estimatedTax.innerText();
        console.log(Number.parseFloat(estimatedTaxCharges.toString().replace('$', '')));
        return Number.parseFloat(estimatedTaxCharges.toString().replace('$', ''));
    }
    async clickEditBillingShippingInfo(): Promise<void> {
        await this.changeBillingShippingAddress.click();
    }
    async clickLargeItemShippingDetailsLink() {
        await this.largeItemShippingDetails.click();
        await this.page.waitForLoadState('load');

    }
    async verifyLargeItemShippingDetails(expectedString: string) {
        expect(await this.largeItemShippingMethods.innerText()).toContain(expectedString);
    }
    async validateErrorMessage(expectedErrorMessage: string) {
        expect(await this.creditCardErrormessage.innerText()).toContain(expectedErrorMessage);
    }
    async unCheckSameShippingAndBillingAddress() {
        await this.sameShippingAndBillingCheckbox.click();
        await this.page.waitForTimeout(2000);
    }
    async goBackToCart() {
        await this.miniCartIcon.click();
    }
    async changeShippingMethodAndVerifyShippingCharges(shippingMethod: string, shippingCharges: string) {
        await this.changeShippingMethod(shippingMethod);
        await this.page.waitForLoadState('domcontentloaded');
        expect((await this.getEstimatedShipping()).toString()).toEqual(shippingCharges);

    }
    async changeShippingMethod(shippingMethod: string) {
        if (shippingMethod.includes('Expedite')) {
            await this.expeditedShippingRadioBtn.click();
            await this.shippingTitleAnchor.click();
            await this.page.waitForTimeout(2000);
            await this.page.waitForLoadState('domcontentloaded');

        } else if (shippingMethod.includes('Express')) {
            await this.expressShippingRadioBtn.click();
            await this.shippingTitleAnchor.click();
            await this.page.waitForTimeout(2000);
            await this.page.waitForLoadState('domcontentloaded');
        } else {

        }

    }
    async validateUserAndBillingDetails(details: string[]) {

        for (const element of details) {
            console.log(element);
            await expect((this.page.locator("//div[text()='" + element + "']")
                .or(this.page.locator("//p[text()='" + element + "']"))
                .or(this.page.locator("//span[text()='" + element + "']"))).first()).toBeVisible();
        }

        // for (let index = 0; index < details.length; index++) {
        //     const element = details[index];
        //     console.log(element);
        //     await expect((this.page.locator("//div[text()='" + element + "']").or(this.page.locator("//p[text()='" + element + "']")).or(this.page.locator("//span[text()='" + element + "']"))).first()).toBeVisible();
        // }

    }

    async firstNameValidationsWithInvalidNames(listOfFirstNames: string[]) {
        for (let index = 0; index < listOfFirstNames.length; index++) {
            const firstName = listOfFirstNames[index];
            console.log(firstName);
            if (await this.contactInfoFirstName.isVisible()) {
                await this.contactInfoFirstName.click();
                await this.contactInfoFirstName.fill(firstName);
                await this.contactInfoFirstName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your first name.')]")).toBeVisible();
            } else {
                await this.contactInfoEmail.click();
                await this.contactInfoEmail.fill('automation@dcsg.com');
                await this.contactInfoEmail.press('Tab');
                await this.contactInfoPhoneNumber.fill('7242733400');

                await this.checkoutContinueButton.click();
                await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
                await this.shippingBillingFirstName.click();
                await this.shippingBillingFirstName.fill(firstName);
                await this.shippingBillingFirstName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your first name.')]")).toBeVisible();

            }
        }

    }
    async firstNameValidationsWithValidNames(listOfFirstNames: string[]) {
        for (let index = 0; index < listOfFirstNames.length; index++) {
            const firstName = listOfFirstNames[index];
            console.log(firstName);
            if (await this.contactInfoFirstName.isVisible()) {
                await this.contactInfoFirstName.click();
                await this.contactInfoFirstName.fill(firstName);
                await this.contactInfoFirstName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your first name.')]")).not.toBeVisible();
            } else {
                await this.contactInfoEmail.click();
                await this.contactInfoEmail.fill('automation@dcsg.com');
                await this.contactInfoEmail.press('Tab');
                await this.contactInfoPhoneNumber.fill('7242733400');

                await this.checkoutContinueButton.click();
                await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
                await this.shippingBillingFirstName.click();
                await this.shippingBillingFirstName.fill(firstName);
                await this.shippingBillingFirstName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your first name.')]")).not.toBeVisible();

            }
        }

    }

    async lastNameValidationsWithInvalidNames(listOfFirstNames: string[]) {
        for (let index = 0; index < listOfFirstNames.length; index++) {
            const firstName = listOfFirstNames[index];
            console.log(firstName);
            if (await this.contactInfoFirstName.isVisible()) {
                await this.contactInfoLastName.click();
                await this.contactInfoLastName.fill(firstName);
                await this.contactInfoLastName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your last name.')]")).toBeVisible();
            } else {
                await this.contactInfoEmail.click();
                await this.contactInfoEmail.fill('automation@dcsg.com');
                await this.contactInfoEmail.press('Tab');
                await this.contactInfoPhoneNumber.fill('7242733400');

                await this.checkoutContinueButton.click();
                await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
                await this.shippingBillingLastName.click();
                await this.shippingBillingLastName.fill(firstName);
                await this.shippingBillingLastName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your last name.')]")).toBeVisible();

            }
        }

    }
    async lastNameValidationsWithValidNames(listOfFirstNames: string[]) {
        for (let index = 0; index < listOfFirstNames.length; index++) {
            const firstName = listOfFirstNames[index];
            console.log(firstName);
            if (await this.contactInfoFirstName.isVisible()) {
                await this.contactInfoLastName.click();
                await this.contactInfoLastName.fill(firstName);
                await this.contactInfoLastName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your last name.')]")).not.toBeVisible();
            } else {
                await this.contactInfoEmail.click();
                await this.contactInfoEmail.fill('automation@dcsg.com');
                await this.contactInfoEmail.press('Tab');
                await this.contactInfoPhoneNumber.fill('7242733400');

                await this.checkoutContinueButton.click();
                await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
                await this.shippingBillingLastName.click();
                await this.shippingBillingLastName.fill(firstName);
                await this.shippingBillingLastName.press('Tab');
                await expect(this.page.locator("//*[contains(text(),'Please enter your last name.')]")).not.toBeVisible();

            }
        }

    }

    async emailFieldValidationsWithInvalidDetails(listOfEmails: string[]) {
        for (let index = 0; index < listOfEmails.length; index++) {
            const email = listOfEmails[index];
            console.log(email);
            await this.contactInfoEmail.click();
            await this.contactInfoEmail.fill(email);
            await this.contactInfoEmail.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter a valid email address.')]")).toBeVisible();

        }

    }
    async emailFieldValidationsWithValidDetails(listOfEmails: string[]) {
        for (let index = 0; index < listOfEmails.length; index++) {
            const email = listOfEmails[index];
            console.log(email);
            await this.contactInfoEmail.click();
            await this.contactInfoEmail.fill(email);
            await this.contactInfoEmail.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter a valid email address.')]")).not.toBeVisible();

        }

    }
    async phoneNumberFieldValidationsWithInvalidDetails(listOfPhoneNumbers: string[]) {
        for (let index = 0; index < listOfPhoneNumbers.length; index++) {
            const phoneNumber = listOfPhoneNumbers[index];
            console.log(phoneNumber);
            await this.contactInfoPhoneNumber.click();
            await this.contactInfoPhoneNumber.fill(phoneNumber);
            await this.contactInfoPhoneNumber.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter a 10 digit phone number.')]")).toBeVisible();

        }

    }
    async phoneNumberFieldValidationsWithValidDetails(listOfPhoneNumbers: string[]) {
        for (let index = 0; index < listOfPhoneNumbers.length; index++) {
            const phoneNumber = listOfPhoneNumbers[index];
            console.log(phoneNumber);
            await this.contactInfoPhoneNumber.click();
            await this.contactInfoPhoneNumber.fill(phoneNumber);
            await this.contactInfoPhoneNumber.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter a 10 digit phone number.')]")).not.toBeVisible();

        }

    }
    async zipcodeFieldValidationsWithInvalidDetails(listOfZipCodes: string[]) {
        for (let index = 0; index < listOfZipCodes.length; index++) {
            const zipcode = listOfZipCodes[index];
            console.log(zipcode);
            await this.billingShippingZipcode.click();
            await this.billingShippingZipcode.fill(zipcode);
            await this.billingShippingZipcode.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter your billing zip code.')]").or(this.page.locator("//*[contains(text(),'Please enter your shipping zip code.')]"))).toBeVisible();

        }

    }
    async zipcodeFieldValidationsWithValidDetails(listOfZipCodes: string[]) {
        for (let index = 0; index < listOfZipCodes.length; index++) {
            const zipcode = listOfZipCodes[index];
            console.log(zipcode);
            await this.billingShippingZipcode.click();
            await this.billingShippingZipcode.fill(zipcode);
            await this.billingShippingZipcode.press('Tab');
            await expect(this.page.locator("//*[contains(text(),'Please enter your billing zip code.')]").or(this.page.locator("//*[contains(text(),'Please enter your shipping zip code.')]"))).not.toBeVisible();


        }

    }

    async verifyStorePickUpIsFree() {
        const estimatedTaxCharges: string = await this.storePickUpCharge.innerText();
        expect(estimatedTaxCharges).toEqual('Free');
    }

    async validateOrderSubtotal() {
        const calculatedOrderSubTotal = await this.calculateOrderSubTotal();
        const actualOrderSubTotalOnScreen = await this.getOrderSubTotal();
        expect(calculatedOrderSubTotal).toEqual(actualOrderSubTotalOnScreen);
    }
    async calculateOrderSubTotal(): Promise<number> {
        let orderSubTotal = 0;
        const productPrices: string[] = await this.individualProductPrice.allInnerTexts();
        const productQuantities: string[] = await this.individualProductQuantity.allInnerTexts();
        console.log(productPrices);
        console.log(productQuantities);

        for (let index = 0; index < productPrices.length; index++) {
            const price = productPrices.at(index)?.replace('$', '').split(' ')[0]!;
            const quantity = productQuantities.at(index)?.split('\n')[0].replace('Qty: ', '')!;
            console.log('Price: ' + price + '\n' + 'Quantity: ' + quantity + '\n');
            orderSubTotal = orderSubTotal + (Number.parseFloat(price) * Number.parseInt(quantity));

        }
        console.log(orderSubTotal);
        return orderSubTotal;
    }
    async verifyEstDeliveryDate(expectedCount: number) {
        await expect(this.estDeliveryDates.first()).toBeVisible();
        const estimatedDeliveryDates: string[] = await this.estDeliveryDates.allInnerTexts();
        expect(estimatedDeliveryDates.length).toEqual(expectedCount);
        console.log(estimatedDeliveryDates);
    }

    async verifyOversizedItem(expectedProduct: string) {
        let found = false;
        await expect(this.individualProductName.first()).toBeVisible();
        const productNames: string[] = await this.individualProductName.allInnerTexts();
        console.log(productNames);
        for (let index = 0; index < productNames.length; index++) {
            if (productNames.at(index)?.includes(expectedProduct)) {
                found = true;
                break;
            }

        }
        expect(found).toEqual(true);
    }

    async verifyProductInfo(expectedProduct: string) {
        let found = false;
        await expect(this.individualProductName.first()).toBeVisible();
        const productNames: string[] = await this.individualProductName.allInnerTexts();
        console.log(productNames);
        for (let index = 0; index < productNames.length; index++) {
            if (productNames.at(index)?.includes(expectedProduct)) {
                found = true;
                break;
            }

        }
        expect(found).toEqual(true);
    }
    async checkBOPISStoreDetails() {
        await expect(this.storeDetails).toBeVisible();
    }
    async checkBOPISStoreNameInDetails(expectedStoreName: string) {
        await expect(this.storename).toBeVisible();
        console.log(await this.storename.innerText());
        expect((await this.storeDetails.innerText()).includes(expectedStoreName)).toEqual(true);
    }

    async verifyFreeStorePickup() {
        await expect(this.freeStorePickup).toBeVisible();
    }
    async verifySingleProductQuantity(expectedQuantity: number) {
        let found = false;
        const productQuantities: string[] = await this.individualProductQuantity.allInnerTexts();
        console.log(productQuantities);
        for (let index = 0; index < productQuantities.length; index++) {
            const quantity = productQuantities.at(index)?.split('\n')[0].replace('Qty: ', '').trim()!;
            console.log(quantity)
            if (Number.parseInt(quantity) == expectedQuantity) {
                found = true;
                break;
            }

        }
        expect(found).toEqual(true);

    }
    async clickChangeContactInformation() {
        await expect(this.changeContactInfo).toBeVisible();
        await this.changeContactInfo.click();

    }
    async clickChangeBillingShippingformation() {
        await expect(this.changeBillingShippingInfo).toBeVisible();
        await this.changeBillingShippingInfo.click();

    }
    async verifyProductNamesWithCartPage(expectedProductNames: string[]) {
        await expect(this.individualProductName.first()).toBeVisible();
        const productNames: string[] = await this.individualProductName.allInnerTexts();
        expect(productNames.sort()).toEqual(expectedProductNames.sort());

    }
    async clickDSGLogo() {
        await this.dsgLogo.click();
    }

    async checkTextMeOrderUpdates() {
        await expect(this.textMeOrderUpdates).toBeVisible();
        await this.textMeOrderUpdates.click();
    }
    async clickAddPickUpPerson() {
        await expect(this.addPickupPersonLink).toBeVisible();
        await this.addPickupPersonLink.click();
    }

    async providePickUPPersonDetails(firstname: string, lastname: string, email: string) {
        await expect(this.pickupFirstname).toBeVisible();
        await this.pickupFirstname.fill(firstname);
        await this.pickupLastname.fill(lastname);
        await this.pickupEmail.fill(email);
        await this.pickUpContinue.click();
        await expect(this.commonProgressSpinner).toHaveCount(0);

    }
    async clickContinueOnContactInfo() {
        await expect(this.checkoutContinueButton).toBeVisible();
        await this.checkoutContinueButton.click();
        await expect(this.contactInfoCompletedCheckmarkImg).toBeVisible();
        await expect(this.commonProgressSpinner).toHaveCount(0);
    }
    async enterGiftReceipientDetails(email: string, firstname: string, desc: string) {
        await expect(this.giftReceipientEmail).toBeVisible();
        await this.giftReceipientEmail.fill(email);
        await this.giftReceipientFirstName.fill(firstname);
        await this.giftReceipientDescription.fill(desc);

    }
    async verifySameDayDevlieryTipIsVisibleOrNot() {
        await expect(this.sameDayDeliveryTip).toBeVisible();
    }

    async getSameDayDeliveryTipAmount(): Promise<string> {
        await expect(this.sameDayDevlieryTipAmount).toBeVisible();
        return this.sameDayDevlieryTipAmount.innerText();
    }
    async selectTipAmount(tipAmount: string) {

        if (await this.tipChangeLink.isVisible()) {
            await this.tipChangeLink.click();
        }
        await expect(this.sameDayDevlieryTipAmount).toBeVisible();
        await this.page.locator("//button/span[text()='" + tipAmount + "']").click();
        await this.checkoutContinueButton.click();
        await expect(this.commonProgressSpinner).toHaveCount(0);
        await expect(this.creditCardNumberField).toBeVisible();
    }
    async getTipAmountOrderTotal(): Promise<string> {
        const tipAMount: string = await this.tipAmount.innerText();
        return tipAMount;

    }
    async selectOtherTipAmount(tipAmount: string) {
        if (await this.tipChangeLink.isVisible()) {
            await this.tipChangeLink.click();
        }
        await expect(this.otherTipLink).toBeVisible();
        await this.otherTipLink.click();
        await expect(this.tipAmountInput).toBeVisible();
        await this.tipAmountInput.fill(tipAmount);
        await this.applyTipAmount.click();
        await expect(this.commonProgressSpinner).toHaveCount(0);
    }
}
