export class OrderConfirmationPage {
    constructor(page) {
        this.page = page;

        this.orderNumberText = page.getByText('Order#')
        this.thankYouForYourOrderHeader = page.getByRole('heading', { name: 'Thank you for your order!' })
        this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' })
    }
}