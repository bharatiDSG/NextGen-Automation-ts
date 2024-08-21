import { APIRequestContext, Locator, Page, expect } from '@playwright/test';

import { testData_smokeCheckout_prod } from '../test-data/smokeCheckoutProdTestData';

export class OrderConfirmationPage {
    private page: Page;

    public orderNumberText: Locator;
    public thankYouForYourOrderHeader: Locator;
    public continueShoppingLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.orderNumberText = page.getByText('Order#');
        this.thankYouForYourOrderHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' }).or(page.getByLabel('Continue Shopping'));
    }

    async apiProdCancelOrderSolePanel(orderNumber: string, apiContext: APIRequestContext): Promise<void> {
        const newIssue = await apiContext.put(`/api/v1/orders/${orderNumber}/cancel`, {
            data: {
                'athleteOrderCancelRequest': {
                    'agent': testData_smokeCheckout_prod.usernameOrderAPI,
                    'cancelDate': new Date().toISOString(), // Use current date and time
                    'cancelSource': 'CallCenter',
                    'reason': 'CANCEL_ATHLETE_REQUEST'
                },
                'orderNumber': orderNumber,
                'wcsCancelRequest': {
                    'storeId': '15108'
                }
            }
        });
        //console.log(newIssue);
        expect(newIssue.ok()).toBeTruthy();
        console.log('Order Cancelled: ' + orderNumber);
    }
}
