export class BatGeniePage {

    constructor(page) {
        this.page = page;
    }

    async goToHomePage(url) {
        await this.page.goto(url);
    }
}