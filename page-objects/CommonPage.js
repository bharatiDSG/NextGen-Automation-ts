export class CommonPage {

    constructor(page) {
        this.page = page;
    }

    async sleep(seconds) {
        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
        await sleep(seconds * 1000)
        console.log("Sleep: " + seconds + " seconds")
    }


    async addCookieToBlockMedallia() {
        await this.page.evaluate(() => {
            document.cookie = "BlockedTags=Medallia"
        })
    }
}