const puppeteer = require('puppeteer');
const axios = require('axios');
const router = require('express').Router();


(async () => {


  let bviIdArray = []
  let tournamentId = []
  async function getTourneyData(y) {
    await axios.get(`http://localhost:3000/api/tournaments/year/${y}`)
      .then(({ data }) => {
        for (let info of data) {
          bviIdArray.push(info.bviId)
        }
      })
  }
  async function scrape(url) {
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle2' })
    let tourneyData = await page.evaluate(() => {
      let startRow = 0
      if (document.querySelectorAll('tr')[10].querySelector('td').innerText === 'News:') {
        startRow = 13
      } else {
        startRow = 12
      }
      let numOfTeams = document.querySelectorAll('tr').length - startRow - 4
      let players = []
      let url = window.location.href
      let equalLocation = url.indexOf('=')
      let tournamentId = url.substring(equalLocation + 1)

      for (let i = startRow; i < startRow + numOfTeams; i++) {
        let indvPlayer = {
          name: '',
          playerId: '',
          partner: '',
          partnerId: '',
          finish: '',
          nationality: ''
        }
        indvPlayer.name = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerText
        let str = document.querySelectorAll('tr')[i].querySelectorAll('td')[1].innerHTML
        let closeLocation = str.indexOf('>')
        let idLocation = str.indexOf('ID')
        indvPlayer.playerId = str.substring(idLocation + 3, closeLocation - 1)
        indvPlayer.finish = i - startRow + 1
        indvPlayer.partner = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerText
        let partnerStr = document.querySelectorAll('tr')[i].querySelectorAll('td')[2].innerHTML
        let partnerCloseLocation = partnerStr.indexOf('>')
        let partnerIdLocation = partnerStr.indexOf('ID')
        indvPlayer.partnerId = partnerStr.substring(partnerIdLocation + 3, partnerCloseLocation - 1)
        indvPlayer.nationality = document.querySelectorAll('tr')[i].querySelectorAll('td')[3].innerText
        players.push(indvPlayer)
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
        nationality: ''
      }
      let playerB = {
        name: '',
        playerId: '',
        finish: '',
        nationality: ''
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
      playerB.name = array[i].partner
      playerB.Id = array[i].partnerId
      playerB.finish = finish
      playerB.nationality = array[i].nationality

      players.push(playerA)
      players.push(playerB)
    }
    return players
  }
  let year = 2020
  for (let y = year; y >= 2000; y--) {
  await getTourneyData(y)
  }

  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}`
    await scrape(url)
  }



})()