const puppeteer = require('puppeteer');
const axios = require('axios');
const { all } = require('./routes/beachRoutes');
const router = require('express').Router();



(async () => {
  let bviIdArray = []
  let tournamentId = []
  let allTournamentData = []


  // return all tournament id's from beach_db
  async function getTourneyData(s) {
    await axios.get(`http://localhost:3000/api/tournaments/season/${s}`)
      .then(({ data }) => {
        allTournamentData = data
        for (let info of data) {
          bviIdArray.push(info.bviId)
        }
      })
  }
  // puppeteer scraper
  async function scrape(url) {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle2' })
    let tourneyData = await page.evaluate(() => {
      // webpages have two different shapes. This helps orient puppeteer for each page
      let players = []
      let startRow = 0
      if (document.querySelectorAll('tr')[10].querySelector('td').innerText === 'News:') {
        startRow = 13
      } else {
        startRow = 12
      }

      let numOfTeams = document.querySelectorAll('tr').length - startRow - 4
      // getting tournament id from the url
      let url = window.location.href
      let equalLocation = url.indexOf('=')
      let tournamentId = url.substring(equalLocation + 1)

      for (let i = startRow; i < startRow + numOfTeams; i++) {
        let team = {
          name: '',
          playerId: '',
          partner: '',
          partnerId: '',
          finish: '',
          nationality: '',
          tournamentId: tournamentId,
          gender: ''
        }

        team.name = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerText
        let str = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML
        let closeLocation = str.indexOf('>')
        let idLocation = str.indexOf('ID')
        team.playerId = str.substring(idLocation + 3, closeLocation - 1)
        team.finish = document.querySelectorAll('tr')[i].querySelectorAll('td')[0].innerHTML
        team.partner = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerText
        let partnerStr = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerHTML
        let partnerCloseLocation = partnerStr.indexOf('>')
        let partnerIdLocation = partnerStr.indexOf('ID')
        team.partnerId = partnerStr.substring(partnerIdLocation + 3, partnerCloseLocation - 1)
        nationality = document.querySelectorAll('tr')[i].querySelectorAll('td')[3].innerText
        team.nationality = nationality
        team.seed = document.querySelectorAll('tr')[i].querySelectorAll('td')[4].innerText
        players.push(team)
      }
      return [players, tournamentId]
    })
    let rawPlayerData = tourneyData[0]
    // await playerDataPrep(rawPlayerData)

    // console.log(playerDataPrep(rawPlayerData))

    // console.log(tourneyData[1])
    playerDataPrep(rawPlayerData)
    // console.log(iso.whereAlpha2('vu'))
  }


  async function playerDataPrep(array) {
    let players = []
    let gender = ''
    let tournamentIdLookUp = parseInt(array[0].tournamentId)


    allTournamentData.forEach(tournament => {
      if (tournament.bviId === array[0].tournamentId) {
        gender = tournament.gender
        tournamentName = tournament.name
        tournamentCountry = tournament.country
        season = tournament.season
      }
    })

    for (let i = 0; i < array.length; i++) {
console.log(array)
      let playerA = {
        name: '',
        firstName: '',
        lastName: '',
        gender: '',
        nationality: '',
        playerId: '',
        tournaments: {
          tournamentName: '',
          tournamentCountry: '',
          tournamentId: '',
          season: '',
          finish: '',
          seed: '',
          partnerName: '',
          partnerFirstName: '',
          partnerLastName: '',
          partnerBVId: ''
        }
      }
      let playerB = {
        name: '',
        firstName: '',
        lastName: '',
        gender: '',
        nationality: '',
        playerId: '',
        tournaments: {
          tournamentName: '',
          tournamentCountry: '',
          tournamentId: '',
          season: '',
          finish: '',
          seed: '',
          partnerName: '',
          partnerFirstName: '',
          partnerLastName: '',
          partnerBVId: ''
        }
      }
      finish = parseInt(array[i].finish)
      seed = array[i].seed
      playerA.tournaments.seed = seed
      playerA.name = array[i].name
      let findSpaceA = playerA.name.indexOf(' ')
      playerA.firstName = playerA.name.substring(0, findSpaceA)
      playerA.lastName = playerA.name.substring(findSpaceA + 1)
      playerA.playerId = array[i].playerId
      playerA.tournaments.partnerName = array[i].partner
      let findSpaceB = array[i].partner.indexOf(' ')
      playerA.tournaments.partnerFirstName = array[i].partner.substring(0, findSpaceB)
      playerA.tournaments.partnerLastName = array[i].partner.substring(findSpaceB + 1)
      playerA.tournaments.partnerBVId = array[i].partnerId
      playerA.tournaments.finish = finish
      playerA.nationality = array[i].nationality
      playerA.tournaments.tournamentId = tournamentIdLookUp
      playerA.tournaments.tournamentName = tournamentName
      playerA.tournaments.tournamentCountry = tournamentCountry
      playerA.tournaments.season = season
      playerA.gender = gender
      playerB.tournaments.seed = seed
      playerB.name = array[i].partner
      playerB.firstName = playerB.name.substring(0, findSpaceB)
      playerB.lastName = playerB.name.substring(findSpaceB + 1)
      playerB.playerId = array[i].partnerId
      playerB.tournaments.partnerName = playerA.name
      playerB.tournaments.partnerFirstName = playerA.firstName
      playerB.tournaments.partnerLastName = playerA.lastName
      playerB.tournaments.partnerBVId = playerA.playerId
      playerB.tournaments.finish = finish
      playerB.nationality = array[i].nationality
      playerB.tournaments.tournamentId = tournamentIdLookUp
      playerB.tournaments.tournamentName = tournamentName
      playerB.tournaments.tournamentCountry = tournamentCountry
      playerB.tournaments.season = season
      playerB.gender = gender


      axios.get(`http://localhost:3000/api/player/find/${playerA.playerId}`)
        .then((res) => {
          if (res.data[0] === undefined) {
            axios.post(`http://localhost:3000/api/player/tournamentfirst`, playerA)
              .then(console.log(`${playerA.name} created in ${playerA.tournaments.tournamentName}`))
          }
          else {
            axios.put(`http://localhost:3000/api/player/tournamentpush`, playerA)
              .then(console.log(`${playerA.name} updated in ${playerA.tournaments.tournamentName}`))
          }
        }
        )

      axios.get(`http://localhost:3000/api/player/find/${playerB.playerId}`)
        .then((res) => {
          if (res.data[0] === undefined) {
            axios.post(`http://localhost:3000/api/player/tournamentfirst`, playerB)
              .then(console.log(`${playerB.name} created in ${playerA.tournaments.tournamentName}`))
          }
          else {
            axios.put(`http://localhost:3000/api/player/tournamentpush`, playerB)
              .then(console.log(`${playerB.name} updated in ${playerA.tournaments.tournamentName}`))
          }
        }
        )
    }
  }

  let season = 2019
  for (let s = season; s >= 2019; s--) {
    await getTourneyData(s)
  }
  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}`
    await scrape(url)
  }

})()