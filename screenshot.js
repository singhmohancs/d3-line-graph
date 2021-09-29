const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true, defaultViewport: {
    width: 1680,
    height: 900
  }});
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8125');

  await page.screenshot({ path: 'screenshot.jpg',fullPage : true, quality: 100 });
  await browser.close();
})();