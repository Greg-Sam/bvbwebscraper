const { model, Schema } = require('mongoose')

const Player = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  name: String,
  gender: String,
  nationality: String,
  playerId: {
    type: String,
    required: true},
  // store birthDate as YYYYMMDD
  birthDate: {
    year: Number,
    month: Number,
    day: Number
  },
  tournaments: [
    {
      tournamentName: String,
      tournamentId: String,
      tournamentCountry: String,
      // season Number refers to year (sometimes first tournament of a season is in the previous calender year)
      season: Number,
      date: {
        year: Number,
        startMonth: Number,
        startDay: Number,
        endMonth: Number,
        endDay: Number
      },
      finish: Number,
      seed: String,
      partnerName: String,
      partnerFirstName: String,
      partnerLastName: String,
      partnerBVId: String,
    }
  ],
  matches: [
    {
      matchDate: Number,
      tournament: String,
      tournamentId: String,
      season: Number,
      date: {
        year: Number,
        month: Number,
        day: Number
      },
      partner: String,
      partnerId: String,
      opponents: {
        opponentA: String,
        opponentAId: String,
        opponentB: String,
        opponentBId: String,
        opponentNationality: String,
        opponentNationalityCode: String
      },
      result: {
        type: String,
        enum: ['Win', 'Loss']
      },
      set1Score: {
        score: Number,
        opponentScore: Number
      },
      set2Score: {
        score: Number,
        opponentScore: Number
      },
      set3Score: {
        score: Number,
        opponentScore: Number
      },
      matchLength: Number,
      tournamentRound: String,
    }
  ]
}, { timestamps: true })

module.exports = model('Player', Player)