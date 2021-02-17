const db = require('mongojs')('beach_db', ['tournaments'])

db.tournaments.insert({
  name: 'Olympic Qualification Tournament, Haiyang',
  country: 'China',
  bviId: '3668',
  gender: 'W',
  season: 2019
})


