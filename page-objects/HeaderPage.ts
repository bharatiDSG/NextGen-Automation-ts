import { Page } from '@playwright/test';

export class HeaderPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}