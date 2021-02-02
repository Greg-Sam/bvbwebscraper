const puppeteer = require('puppeteer');

(async () => {
  let year = 2020
  for (let y = year; y >= 2000; y--) {
    let yearUrl = `http://bvbinfo.com/Season.asp?AssocID=3&Year=${y}`

    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.goto(yearUrl, { waitUntil: 'networkidle2' })

    let allTournaments = []

    let tourneyData = await page.evaluate(() => {
      let url = window.location.href
      let year = url.substring(url.length - 4)
      let yearsTournaments = []
      let locator = document.querySelectorAll('tr').length
      for (let i = 10; i < locator - 4; i++) {
        let tournamentDetails = {
          name: '',
          id: ''
        }

        tournamentDetails.id = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.substring(document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 3, document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 7)
        tournamentDetails.name = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerText
        yearsTournaments.push(tournamentDetails)
      }
      let numberOfTournaments = locator - 14
      return {
        year,
        numberOfTournaments,
        yearsTournaments
      }

    })
    allTournaments.push(tourneyData)
    console.log(allTournaments)
    await browser.close()
  }
})()