import { APIRequestContext, APIResponse, Locator, Page, expect } from '@playwright/test';

import { testData_smokeCheckout_prod } from '../test-data/smokeCheckoutProdTestData';

export class OrderConfirmationPage {
    private page: Page;
    private playwright: any;
    private reqContext: APIRequestContext;

    readonly orderNumberText: Locator;
    readonly thankYouForYourOrderHeader: Locator;
    readonly continueShoppingLink: Locator;

    constructor(page: Page, playwright: any, request: APIRequestContext) {
        this.page = page;
        this.playwright = playwright;
        this.reqContext = request;

        this.orderNumberText = page.getByText('Order#');
        this.thankYouForYourOrderHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
    }

    async apiProdCancelOrderSolePanel(orderNumber: string, apiContext: APIRequestContext): Promise<void> {
        const newIssue: APIResponse = await apiContext.put(`/api/v1/orders/${orderNumber}/cancel`, {
            data: {
                "athleteOrderCancelRequest": {
                    "agent": testData_smokeCheckout_prod.usernameOrderAPI,
                    "cancelDate": new Date().toISOString(), // Using current date timestamp in ISO format
                    "cancelSource": "CallCenter",
                    "reason": "CANCEL_ATHLETE_REQUEST"
                },
                "orderNumber": orderNumber,
                "wcsCancelRequest": {
                    "storeId": "15108"
                }
            }
        });

        expect(newIssue.ok()).toBeTruthy();
        console.log("Order Cancelled: " + orderNumber);
    }
}