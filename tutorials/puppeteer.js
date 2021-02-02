const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://bvbinfo.com/Season.asp?AssocID=3&Year=2020');
  await page.pdf({ path: 'hn.pdf', format: 'A4' })

  await browser.close();
})();