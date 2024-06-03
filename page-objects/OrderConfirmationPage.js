import { expect } from '@playwright/test';
import { testData_smokeCheckout_prod } from '../test-data/smokeCheckoutProdTestData';
import { timeStamp } from 'console';
export class OrderConfirmationPage {
    constructor(page, playwright, request) {
        this.page = page;
        this.playwright = playwright;
        this.reqContext = request;

        this.orderNumberText = page.getByText('Order#')
        this.thankYouForYourOrderHeader = page.getByRole('heading', { name: 'Thank you for your order!' })
        this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' })
    }

    async apiProdCancelOrderSolePanel(orderNumber, apiContext) {
        const newIssue = await apiContext.put(`/api/v1/orders/${orderNumber}/cancel`, {
            data: {
                "athleteOrderCancelRequest": {
                    "agent": testData_smokeCheckout_prod.usernameOrderAPI,
                    "cancelDate": timeStamp,
                    "cancelSource": "CallCenter",
                    "reason": "CANCEL_ATHLETE_REQUEST"
                },
                "orderNumber": orderNumber,
                "wcsCancelRequest": {
                    "storeId": "15108"
                }
            }
        });
        //console.log(newIssue);
        expect(newIssue.ok()).toBeTruthy();
    }
}