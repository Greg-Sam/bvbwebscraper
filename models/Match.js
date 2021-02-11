const { model, Schema } = require('mongoose')

const Match = new Schema({
  tournament: String,
  tournamentId: String,
  season: Number,
  round: String,
  partner: String,
  partnerId: String,
  opponents: {
    opponentA: String,
    opponentAId: String,
    opponentB: String,
    opponentBId: String,
    opponentNationality: String
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
}, { timestamps: true })
module.exports = model('Match', Match)