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
    console.log(tourneyData)
  }

  await getTourneyData(2018)

  for (let tournamentId of bviIdArray) {
    let url = `http://bvbinfo.com/Tournament.asp?ID=${tournamentId}`
    await scrape(url)
  }



})()