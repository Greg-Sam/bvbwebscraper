const db = require('mongojs')('beach_db', ['tournaments'])
const puppeteer = require('puppeteer');


(async () => {

  let allTournaments = []
  let season = 2020
  for (let s = season; s >= 2019; s--) {
    let activeseason = s
    let seasonUrl = `http://bvbinfo.com/Season.asp?AssocID=3&year=${s}`
    let browser = await puppeteer.launch()
    let page = await browser.newPage()


    await page.goto(seasonUrl, { waitUntil: 'networkidle2' })


    let tourneyData = await page.evaluate(() => {
      let url = window.location.href
      let season = url.substring(url.length - 4)
      let seasonsTournaments = []
      let locator = document.querySelectorAll('tr').length
      for (let i = 10; i < locator - 4; i++) {

        let tournamentDetails = {
          name: '',
          country: '',
          id: '',
          gender: ''
        }
        retrievedId = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.substring(document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 3, document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.indexOf('ID=') + 7)
        tournamentDetails.id = parseInt(retrievedId)

        let str = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML.substring(document.querySelectorAll('tr')[i])

        let commaLocation = str.indexOf(',')
        let closeLocation = str.indexOf('>')
        tournamentDetails.country = str.substring(commaLocation + 2)

        tournamentDetails.name = str.substring(closeLocation + 1, commaLocation - 4)
        tournamentDetails.gender = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerHTML

        seasonsTournaments.push(tournamentDetails)


      }
      let numberOfTournaments = locator - 14
      return [
        season,
        numberOfTournaments,
        seasonsTournaments
      ]

    })
    allTournaments.push(tourneyData)

    await browser.close()
  }
  console.log(allTournaments[0][2][5].name)

  allTournaments.map(getSeason)

  function getSeason(season) {
    console.log('season...............................' + season[0])
    season[2].map(tournament)

    function tournament(tournament) {
      let seasonYear = parseInt(season[0])
      console.log(tournament.name)
      console.log(tournament.id)
      console.log(tournament.country)
      console.log(tournament.gender)
      console.log(seasonYear)
      db.tournaments.insert({
        name: tournament.name,
        country: tournament.country,
        bviId: tournament.id,
        gender: tournament.gender,
        season: seasonYear
      })
    }
  }



})()