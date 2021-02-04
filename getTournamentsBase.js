const db = require('mongojs')('beach_db', ['tournaments'])
const puppeteer = require('puppeteer');


(async () => {

  let allTournaments = []
  let year = 2020
  for (let y = year; y >= 2000; y--) {
    let activeYear = y
    let yearUrl = `http://bvbinfo.com/Season.asp?AssocID=3&Year=${y}`
    let browser = await puppeteer.launch()
    let page = await browser.newPage()


    await page.goto(yearUrl, { waitUntil: 'networkidle2' })


    let tourneyData = await page.evaluate(() => {
      let url = window.location.href
      let year = url.substring(url.length - 4)
      let yearsTournaments = []
      let locator = document.querySelectorAll('tr').length
      for (let i = 10; i < locator - 4; i++) {

        let tournamentDetails = {
          name: '',
          country: '',
          id: ''
        }
        tournamentDetails.id = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.substring(document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 3, document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 7)

        let str = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.substring(document.querySelectorAll('tr')[i])

        let commaLocation = str.indexOf(',')
        let closeLocation = str.indexOf('>')
        tournamentDetails.country = str.substring(commaLocation + 2)

        tournamentDetails.name = str.substring(closeLocation + 1, commaLocation - 4)

        yearsTournaments.push(tournamentDetails)


      }
      let numberOfTournaments = locator - 14
      return [
        year,
        numberOfTournaments,
        yearsTournaments
      ]

    })
    allTournaments.push(tourneyData)

    await browser.close()
  }
  console.log(allTournaments[0][2][5].name)

  allTournaments.map(season)

  function season(season) {
    console.log('tournament year...............................' + season[0])
    season[2].map(tournament)

    function tournament(tournament) {
      console.log(tournament.name)
      console.log(tournament.id)
      console.log(tournament.country)
      console.log(season[0])
      db.tournaments.insert({
        name: tournament.name,
        country: tournament.country,
        bviId: tournament.id,
        tournamentYear: season[0]
      })
    }
  }



})()