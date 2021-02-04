const puppeteer = require('puppeteer');
const axios = require('axios')
const router = require('express').Router()


axios.get('http://localhost:3000/api/tournaments/year/2020')
.then(data => data.data.forEach(element => {console.log(element.bviId)
  
}))

