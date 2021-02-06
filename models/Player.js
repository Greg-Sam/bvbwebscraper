const { model, Schema } = require('mongoose')

const Tournament = new Schema({
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
  nationalityCode: String,
  // store birthDate as YYYYMMDD
  birthDate: {
    year: Number,
    month: Number,
    day: Number
  },
  tournaments: [
    {
      name: String,
      tournamentId: String,
      // season Number refers to year (sometimes first tournament of a season is in the previous calender year)
      season: Number,
      date: {
        year: Number,
        startMonth: Number,
        startDay: Number,
        endMonth: Number,
        endDay: Number
      }
      finish: Number,
      seed: Number,
      partner: String,
      partnerId: String,
    }
  ]
  matches: [
    {
      matchDate: Number
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
      }
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
    }
  ]

  

}, { timestamps: true })

module.exports = model('Tournament', Tournament)