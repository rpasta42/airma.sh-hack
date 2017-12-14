t puppeteer = require('puppeteer');
var sleep = require('sleep');

(async () => {
  try {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  // Open page.
  await page.goto('https://airma.sh/');

  // // Show search form.
  // await page.click('.search-trigger');
  sleep.msleep(500)

  // // Focus input field.
  await page.waitFor('#playername');
  sleep.msleep(500)
  await page.focus('#playername');
  sleep.msleep(500)

  await page.keyboard.type('\u200B');
  // await page.keyboard.down('.');
  await page.keyboard.down('Enter');

  sleep.msleep(500)
  await page.waitFor('#open-menu');

  await page.evaluate('Games.switchGame("ctf1")')
  sleep.msleep(500)

  console.log('Waiting for how to play')
  await page.waitFor('#howtoplay');
  await page.click('#howtoplay.hide');
  sleep.msleep(500)
  // await page.keyboard.press('h');

  await page.waitFor('#selectaircraft-2')
  await page.click('#selectaircraft-2')

  // await page.focus('#howtoplay');
  // await page.keyboard.press('h');
  // await page.click()
  console.log('exited how to play')

  sleep.msleep(500)

  await page.click('#selectaircraft-4')

  await page.waitForSelector('div.line.sel');

  // sel = await page.$('div')
  // // console.log(sel)
  // // sel = sel[0]
  // // console.log(await sel.toString())
  // co // selClass = await sel.getProperty('class')
  teamNum = await page.evaluate(() => document.querySelector('div.line.sel .nick').className.substr(-1));
  console.log(teamNum)

  // browser.close();
  if (teamNum !== "2") {
    // browser.close();
  }

  // Type in query.
  while (true) {
    sleep.msleep(8000)

  // await page.click('#selectaircraft-4')

    console.log(new Date())
    // await page.keyboard.down('Shift');
    await page.keyboard.down(' ');
  }

  // // Submit the form.
  // const searchForm = await page.$('#search-form-top');
  // await searchForm.evaluate(searchForm => searchForm.submit());

  // Keep the browser open.
  // browser.close();


} catch(e) {
  console.error(e)
}
})();
