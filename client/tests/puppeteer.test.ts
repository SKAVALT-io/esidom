/// <reference types='jest' />
import puppeteer from 'puppeteer';

const appUrlBase = 'http://localhost:8080/#';
const routes = {
    home: `${appUrlBase}`,
    devices: `${appUrlBase}/devices`,
};

describe('Test de Tests', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(routes.home);
    });

    it('should display "ESIDOM" as app title', async () => {
        const title = await page.title();
        console.log(title);
        expect(title).toEqual('ESIDOM');
    });

    it('should redirect to a devices link', async () => {
        await Promise.all([page.waitForNavigation(), page.click('a.devices-link')]);
        const url = page.url();
        console.log(url);
        expect(url).toEqual(routes.devices);
    });

    afterAll(() => {
        browser.close();
    });
});
