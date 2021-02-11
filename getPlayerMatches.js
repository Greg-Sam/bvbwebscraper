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
      // get all p tags on page
      let matchContainer = ''
      let count = document.querySelectorAll('tr').length
      for (let i = 0; i < count; i++) {
        document.querySelectorAll('tr')[i].querySelectorAll('p').length > 10 ?
          matchContainer = document.querySelectorAll('tr')[i].innerHTML
          :
          console.log('continue does not work')
      }
      let tournamentParts = []
      const findParts = (string) => {
        let end = string.length
        let cleanData = string.slice(0 , end)
        tournamentParts.push(cleanData)
      }
      // const findParts = (string) => {
      //   let working = string
      //   while (working.indexOf('Header">') > 3) {
      //     let start = working.indexOf('Header">')
      //     let check = working.slice(start + 8)
      //     let end = check.indexOf('Header">')
      //     let part = check.slice(start, end - 38)
      //     tournamentParts.push(part)
      //     working = check.slice(end - 37)
      //   }
      // }
      findParts(matchContainer)
      return matchContainer
    })

    console.log(tourneyData)
  }

})()


let matchInfo = {
  superRound: '',
  subRound: '',
  playerAName: '',
  playerAId: '',
  playerBName: '',
  playerBId: '',
  playerCName: '',
  playerCId: '',
  playerDName: '',
  playerDId: '',
  playerANationality: '',
  playerBNationality: '',
  playerCNationality: '',
  playerDNationality: '',
  set1Team1Score: '',
  set1Team2Score: '',
  set2Team1Score: '',
  set2Team2Score: '',
  set3Team1Score: '',
  set3Team2Score: ''
}




// // information that must come from the page
// let allSuperRounds = []
// let subRound = []

// // find how many superRounds (Q, pool, knockout...) tournament has
// let superRoundFinder = document.querySelectorAll('div').length
// // get name of each superRound
// for (let i = 0; i < superRoundFinder; i++) {
  //   let superRounds = []
  //   superRounds = document.querySelectorAll('div')[i].innerText
  //   allSuperRounds.push(superRounds)
  //   allSuperRounds.forEach(superRound => {
    //     subRound.push(document.querySelectorAll('div')[i].nextElementSibling.nextElementSibling)
    //     // if (document.querySelectorAll('div')[i].nextElementSibling.innerText.indexOf('Round') === -1) { 
      //     //   subRound.push('none') 
      //     // } else {
        //     //   // while (document.querySelectorAll('div')[i].nextElementSibling !== '')
        //     // subRound.push(document.querySelectorAll('div')[i].nextElementSibling.innerText.slice(0, 7))
        //     // }
        //   })
        // }
        // return [allSuperRounds, subRound]
          // matchLenght: ''