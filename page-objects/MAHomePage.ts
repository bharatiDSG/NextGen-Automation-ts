import { Locator, Page, expect } from '@playwright/test';



export class MAHomePage {
  private page: Page;

  // Sign In Page
  private homePageTitle: Locator;
  signOut: Locator;
  signoutLink: Locator;
  confirmSignOut: Locator;


  constructor(page: Page) {
    this.page = page;

    this.homePageTitle = page.getByTitle('Home').locator('span');
    //this.signoutLink= page.getByTitle('bgupta@dsgi').getByRole('button');
    this.signoutLink = page.locator('[data-component-id ="user-profile"]').getByRole('button');
    this.signOut = page.locator('a').filter({ hasText: 'Sign out' });
    this.confirmSignOut = page.getByRole('button', { name: 'Yes' });
  }


  async clickSignOut(): Promise<void> {

    await expect(this.homePageTitle).toBeVisible();
    await expect(this.signoutLink).toBeVisible();

    await this.signoutLink.click();
    await this.signOut.click();
    await this.confirmSignOut.click();



  }
}

