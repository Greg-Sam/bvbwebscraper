const puppeteer = require('puppeteer');
const axios = require('axios');
const router = require('express').Router();


(async () => {
  let bviIdArray = []
  let tournamentId = []
  // return all tournament id's from beach_db
  async function getTourneyData(s) {
    await axios.get(`http://localhost:3000/api/tournaments/season/${s}`)
      .then(({ data }) => {
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
          tournamentId: tournamentId
        }
        team.name = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerText
        let str = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML
        let closeLocation = str.indexOf('>')
        let idLocation = str.indexOf('ID')
        team.playerId = str.substring(idLocation + 3, closeLocation - 1)
        team.finish = i - startRow + 1
        team.partner = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerText
        let partnerStr = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerHTML 
        let partnerCloseLocation = partnerStr.indexOf('>')
        let partnerIdLocation = partnerStr.indexOf('ID')
        team.partnerId = partnerStr.substring(partnerIdLocation + 3, partnerCloseLocation - 1)
        team.nationality = document.querySelectorAll('tr')[i].querySelectorAll('td')[3].innerText
        players.push(team)
      }
      return [players, tournamentId]
    })
    let rawPlayerData = tourneyData[0]
    // await playerDataPrep(rawPlayerData)
    console.log(playerDataPrep(rawPlayerData))
    console.log(tourneyData[1])
  }

  async function playerDataPrep(array) {
    let players = []
    for (let i = 0; i < array.length; i++) {
      let playerA = {
        name: '',
        playerId: '',
        finish: '',
        nationality: '',
        tournamentId: ''
      }
      let playerB = {
        name: '',
        playerId: '',
        finish: '',
        nationality: '',
        tournamentId: ''
      }
      let finish= parseInt(array[i].finish)
      if (finish <= 4) {
        finish = finish
      } else if (finish <= 8) {
        finish = 5
      }
      else if (finish <= 16) {
        finish = 9
      } else if (finish <= 24) {
        finish = 17
      }
      else if (finish <= 32) {
        finish = 25
      } else if (finish <= 40) {
        finish = 33
      } else if (41 <= finish) {
        finish = 41
      }
      playerA.name = array[i].name
      playerA.Id = array[i].playerId
      playerA.finish = finish
      playerA.nationality = array[i].nationality
      playerA.tournamentId = array[i].tournamentId
      playerB.name = array[i].partner
      playerB.Id = array[i].partnerId
      playerB.finish = finish
      playerB.nationality = array[i].nationality
      playerB.tournamentId = array[i].tournamentId

      players.push(playerA)
      players.push(playerB)
    }
    return players
  }
  let season = 2020
  for (let s = season; s >= 2017; s--) {
  await getTourneyData(s)
  }

  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}`
    await scrape(url)
  }



})()