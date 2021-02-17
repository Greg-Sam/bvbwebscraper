const puppeteer = require('puppeteer');
const axios = require('axios');
const { all } = require('./routes/beachRoutes');
const router = require('express').Router();

(async () => {
  console.log('start')
  let bviIdArray = []
  let tournamentArray = []

  let season = 2019
  for (let s = season; s >= 2019; s--) {
    await getTourneyData(s)
  }


  // push all tournament id's from beach_db into bviIdArray
  async function getTourneyData(s) {
    await axios.get(`http://localhost:3000/api/tournaments/season/${s}`)
      .then(({ data }) => {
        for (let tournament of data) {
          bviIdArray.push(tournament.bviId)
          tournamentArray.push(tournament)
          tournament = null
        }
      })
  }

  // iterate through each tournament and launch the scraper for each one.
  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}&Process=Matches`
    await scrape(url)

  }

  // scrape one tournament
  async function scrape(url) {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()
    let Id = url.slice(37, url.indexOf('&'))
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
        let cleanData = string.slice(0, end)
        tournamentParts.push(cleanData)
        cleanData = null
      }
      return matchContainer
    })

    // split block of text into tournament parts

    // async function matchGenerator(tourneyData) {
    //   tourneyData.replace(/, Q/g, '')
    //   let everyMatch = []
    //   let matchArray = []
    //   let tournamentParts = []

    //   while (tourneyData.indexOf('Header">') > 10) {
    //     let start = tourneyData.indexOf('Header">')
    //     let check = tourneyData.slice(start + 8)
    //     // console.log(check)
    //     let end = check.indexOf('Header">')
    //     // console.log(end)
    //     let part = check.slice(0, end - 36)
    //     // console.log(`new part ----------------------------------------- ${part}`)
    //     tournamentParts.push(part)
    //     tourneyData = check.slice(end - 37)
    //     parts = null
    //     // console.log(working)
    //   }
    //   // console.log(tournamentParts)
    //   const getFinals = (round, roundNum, superRound) => {
    //     let matches = {
    //       superRound: superRound,
    //       subRound: roundNum,
    //       matchString: ''
    //     }
    //     if (superRound === 'Semifinals') {
    //       getMatches(round, roundNum, superRound)
    //     } else {
    //       matches.matchString = round
    //       matchArray.push(matches)
    //       matches = null
    //     }
    //   }

    //   const getMatches = (round, roundNum, superRound) => {
    //     // console.log(round)
    //     // matchArray.push(matches)
    //     let match = round.split('Match')
    //     match.forEach(element => {
    //       let matches = {
    //         superRound: superRound,
    //         subRound: roundNum,
    //         matchString: ''
    //       }
    //       if (element.indexOf('href') !== -1) {
    //         matches.matchString = element
    //         matchArray.push(matches)
    //         matches = null
    //       }
    //     });
    //   }

    //   const getRounds = (part) => {
    //     // console.log(part)
    //     if (part.indexOf('Round 1') === -1) {
    //       if (part.indexOf('Country Q') !== -1) {
    //         let end = part.indexOf('</div>')
    //         superRound = part.slice(0, end)
    //         getMatches(part, null, superRound)
    //       } else {
    //         let start = part.indexOf(`Header">`)
    //         let end = part.indexOf(`</div>`)
    //         let superRound = part.slice(start + 1, end)
    //         getFinals(part, null, superRound)
    //       }
    //     } else {
    //       if (part.indexOf('Round 3') === -1) {
    //         let end = part.indexOf('</div>')
    //         superRound = part.slice(0, end)
    //         let round1Start = part.indexOf('Round 1')
    //         let round1End = part.indexOf('</p><p>')
    //         let round1 = part.slice(round1Start, round1End)
    //         let roundNum = '9th Place Match'
    //         getMatches(round1, roundNum, superRound)
    //         let round2Start = part.indexOf('Round 2')
    //         let round2 = part.slice(round2Start)
    //         roundNum = '5th Place Match'
    //         getMatches(round2, roundNum, superRound)
    //       } else {
    //         let end = part.indexOf('</div>')
    //         superRound = part.slice(0, end)
    //         let round1Start = part.indexOf('Round 1')
    //         let round1End = part.indexOf('</p><p>')
    //         let round1 = part.slice(round1Start, round1End)
    //         let roundNum = '17th Place Match'
    //         getMatches(round1, roundNum, superRound)
    //         let round2Start = part.indexOf('Round 2')
    //         let round2 = part.slice(round2Start)
    //         roundNum = '9th Place Match'
    //         getMatches(round2, roundNum, superRound)
    //         let round3Start = part.indexOf('Round 3')
    //         let round3 = part.slice(round3Start)
    //         roundNum = '5th Place Match'
    //         // console.log(round3)
    //         getMatches(round3, roundNum, superRound)
    //       }
    //     }
    //   }

    //   tournamentParts.map(part => getRounds(part)
    //   )
    //   tournamentParts = null

    //   // console.log(matchArray)

    //   async function getMatchDetails(match) {
    //     // console.log(match.matchString)
    //     let matchInfo = {
    //       superRound: '',
    //       subRound: '',
    //       playerAName: '',
    //       playerAId: '',
    //       playerBName: '',
    //       playerBId: '',
    //       playerCName: '',
    //       playerCId: '',
    //       playerDName: '',
    //       playerDId: '',
    //       playerANationality: '',
    //       playerBNationality: '',
    //       playerCNationality: '',
    //       playerDNationality: '',
    //       set1Team1Score: '',
    //       set1Team2Score: '',
    //       set2Team1Score: '',
    //       set2Team2Score: '',
    //       set3Team1Score: '',
    //       set3Team2Score: '',
    //       playerAResult: 'Win',
    //       playerBResult: 'Win',
    //       playerCResult: 'Loss',
    //       playerDResult: 'Loss'
    //     }
    //     if (match.superRound === 'Country Quota Matches') {
    //       match.superRound = 'Country Quota'
    //     }
    //     if (match.superRound === 'Country Quota' && match.subRound === '5th Place Match') {
    //       match.subRound = '2nd Round'
    //     }
    //     if (match.superRound === 'Country Quota' && match.subRound === '9th Place Match') {
    //       match.subRound = '1st Round'
    //     }
    //     if (match.superRound === 'Qualifier Bracket' && match.subRound === '9th Place Match') {
    //       match.superRound = 'Qualification Round'
    //       match.subRound = '1st Round'
    //     }
    //     if (match.superRound === 'Qualifier Bracket' && match.subRound === '5th Place Match') {
    //       match.superRound = 'Qualification Round'
    //       match.subRound = '2nd Round'
    //     }
    //     if (match.superRound.indexOf('Pool') !== -1 && match.subRound === '9th Place Match') {
    //       match.superRound = 'Pool Play'
    //       match.subRound = '1st Round'
    //     }
    //     if (match.superRound.indexOf('Pool') !== -1 && match.subRound === '5th Place Match') {
    //       match.superRound = 'Pool Play'
    //       match.subRound = '2nd Round'
    //     }
    //     if (match.superRound === `Winner's Bracket`) {
    //       match.superRound = 'Knockout Stage'
    //     }
    //     match.matchString = match.matchString.replace(/\n/g, '')
    //     matchInfo.superRound = match.superRound
    //     matchInfo.subRound = match.subRound
    //     let shorterMatchString = match.matchString.slice(match.matchString.indexOf('ID=') + 3)
    //     matchInfo.playerAId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    //     matchInfo.playerAName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    //     shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    //     matchInfo.playerBId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    //     matchInfo.playerBName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    //     matchInfo.playerBNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf(' ('))
    //     if (matchInfo.superRound === 'Country Quota') { matchInfo.playerBNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf('</b>')) }
    //     matchInfo.playerANationality = matchInfo.playerBNationality
    //     shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    //     matchInfo.playerCId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    //     matchInfo.playerCName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    //     shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('ID=') + 3)
    //     matchInfo.playerDId = shorterMatchString.slice(0, shorterMatchString.indexOf('">'))
    //     matchInfo.playerDName = shorterMatchString.slice(shorterMatchString.indexOf('">') + 2, shorterMatchString.indexOf('</a>'))
    //     matchInfo.playerCNationality = shorterMatchString.slice(shorterMatchString.indexOf('</a>') + 5, shorterMatchString.indexOf(' ('))
    //     if (matchInfo.superRound === 'Country Quota') {
    //       matchInfo.playerCNationality = matchInfo.playerBNationality
    //     }
    //     matchInfo.playerDNationality = matchInfo.playerCNationality

    //     shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(') ') + 2)
    //     if (matchInfo.superRound === 'Country Quota') {
    //       shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('</a>'))
    //       var r = /\d+/
    //       let start = shorterMatchString.match(r)
    //       // console.log(start.index)

    //       shorterMatchString = shorterMatchString.slice((start.index))
    //     }
    //     if (shorterMatchString.indexOf(',') === -1) {
    //       matchInfo.set1Team1Score = shorterMatchString.slice(0, shorterMatchString.indexOf('<'))
    //       matchInfo.set1Team2Score = matchInfo.set1Team1Score
    //       shorterMatchString = ''
    //     } else {
    //       matchInfo.set1Team1Score = parseInt(shorterMatchString.slice(0, shorterMatchString.indexOf('-')))
    //     }
    //     matchInfo.set1Team2Score = parseInt(shorterMatchString.slice(shorterMatchString.indexOf('-') + 1, shorterMatchString.indexOf(',')))
    //     shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(',') + 1)
    //     if (shorterMatchString.indexOf('-') === -1) {
    //       matchInfo.set2Team1Score = shorterMatchString.slice(0, shorterMatchString.indexOf('<'))
    //       matchInfo.set2Team2Score = matchInfo.set2Team1Score
    //       shorterMatchString = ''
    //     } else {
    //       matchInfo.set2Team1Score = parseInt(shorterMatchString.slice(0, shorterMatchString.indexOf('-')))
    //     }
    //     matchInfo.set2Team2Score = parseInt(shorterMatchString.slice(shorterMatchString.indexOf('-') + 1, shorterMatchString.indexOf(',')))
    //     if (shorterMatchString.indexOf(',') === -1) {
    //       shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf('('))
    //       matchInfo.set3Team1Score = null
    //       matchInfo.set3Team2Score = null
    //     } else {
    //       shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(',') + 1)
    //       matchInfo.set3Team1Score = parseInt(shorterMatchString.slice(0, shorterMatchString.indexOf('-')))
    //       shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(',') + 1)
    //       matchInfo.set3Team2Score = parseInt(shorterMatchString.slice(shorterMatchString.indexOf('-') + 1, shorterMatchString.indexOf('(') - 1))
    //       shorterMatchString = shorterMatchString.slice(shorterMatchString.indexOf(',') + 1)
    //     }
    //     // console.log(shorterMatchString)
    //     everyMatch.push(matchInfo)
    //     matchInfo = null
    //   }
    //   // console.log(matchArray)
    //   await matchArray.map(match => getMatchDetails(match))
    //   matchArray = null

    //   console.log(everyMatch)
    //   everyMatch = null
    // }
    let rawTournament = {
      id: '',
      name: '',
      country: '',
      season: '',
      raw: ''
    }
    // console.log(bviIdArray)
    // console.log(tourneyData)
    // console.log(tournamentArray)

    rawTournament.id = Id
    let getRelevant = tournamentArray.filter(tournament => {
      return tournament.bviId === Id
    })
    rawTournament.country = getRelevant[0].country
    rawTournament.name = getRelevant[0].name
    rawTournament.raw = tourneyData
    rawTournament.season = getRelevant[0].season
    
    console.log(rawTournament)
    axios.post(`http://localhost:3000/api/rawtournament`, rawTournament)
  }

})()


// let matchInfo = {
//   superRound: '',
//   subRound: '',
//   playerAName: '',
//   playerAId: '',
//   playerBName: '',
//   playerBId: '',
//   playerCName: '',
//   playerCId: '',
//   playerDName: '',
//   playerDId: '',
//   playerANationality: '',
//   playerBNationality: '',
//   playerCNationality: '',
//   playerDNationality: '',
//   set1Team1Score: '',
//   set1Team2Score: '',
//   set2Team1Score: '',
//   set2Team2Score: '',
//   set3Team1Score: '',
//   set3Team2Score: ''
// }




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