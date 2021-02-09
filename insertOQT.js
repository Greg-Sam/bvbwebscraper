const db = require('mongojs')('beach_db', ['tournaments'])

db.tournaments.insert({
  name: 'Olympic Qualification Tournament, Haiyang',
  country: 'China',
  bviId: '3667',
  gender: 'M',
  season: 2019
})


