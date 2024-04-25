import { expect } from '@playwright/test'
import MailosaurClient from 'mailosaur'

export class DoorDashPage {
    constructor(page) {
        this.page = page;

        this.signUpLink = page.getByRole('button', { name: 'Sign Up' })
    }

    async goToLoginPage(url) {
        await this.page.goto(url)
    }


    async login() {
        await this.page.getByLabel('Email').click();
        await this.page.getByLabel('Email').fill(process.env.SRVUSER);
        await this.page.getByLabel('Password').click();
        await this.page.getByLabel('Password').click();
        await this.page.getByLabel('Password').fill(process.env.SRVPASS);
        await this.page.getByRole('button', { name: 'Log In' }).click();
    }


    async extractSixDigitCodeFromMailosaur() {
        const mailosaur = new MailosaurClient("Yllvkk64VJxnA9L");
        const serverId = "i3q6o2ko";

        // Connect to Mailosaur, and wait for that email to arrive
        const sms = await mailosaur.messages.get(serverId, {
            sentTo: "12675764534",
        });

        // console.log(sms);

        // Check that the SMS message contains some text
        expect(sms.text.body).toContain("DoorDash verification code");

        // Get the reset link (TODO: use text instead of index in the future)
        const sixDigitCode = sms.text.codes[0].value;
        console.log("sixDigitCode: " + sixDigitCode);

        return sixDigitCode;
    }


    async enterSixDigitCode(sixDigitCode) {
        await this.page.getByLabel('Enter 6-digit code').click();
        await this.page.getByLabel('Enter 6-digit code').fill(sixDigitCode);
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }


    async sleep(seconds) {
        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        await sleep(seconds * 1000)
        console.log("Sleep: " + seconds + " seconds")
    }
}