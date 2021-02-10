const puppeteer = require('puppeteer');
const axios = require('axios');
const { all } = require('./routes/beachRoutes');
const router = require('express').Router();

(async () => {
  console.log('start')
  let bviIdArray = []
  let tournamentId = []
  let allTournamentData = []

  let season = 2020
  for (let s = season; s >= 2019; s--) {
    await getTourneyData(s)
  }


  // push all tournament id's from beach_db into bviIdArray
  async function getTourneyData(s) {
    await axios.get(`http://localhost:3000/api/tournaments/season/${s}`)
      .then(({ data }) => {
        allTournamentData = data
        for (let info of data) {
          bviIdArray.push(info.bviId)
        }
      })
  }

  // itterate through each tournament and launch the scraper for each one.
  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}&Process=Matches`
    await scrape(url)
  }

  // web scrape one tournament
  async function scrape(url) {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })
    let tourneyData = await page.evaluate(() => {
      let roundInfo = []
      // find tournament part (Q, round, knockout...)
      let tournamentParts = document.querySelectorAll('u').length
      // extract data from each part of tournament
      for (let i = 0; i < tournamentParts; i++) {
        let tournamentSection = document.querySelectorAll('u')[i].innerText
        roundInfo.push(tournamentSection)
      }
      return[tournamentParts, roundInfo]
    })
    console.log(tourneyData)
  }
})
  ()