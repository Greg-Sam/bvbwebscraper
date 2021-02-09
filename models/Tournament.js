const { model, Schema } = require('mongoose')

const Tournament = new Schema({
  name: {
    type: String,
    required: true
  },
  bviId: {
    type: String,
    required: true
  },
  // season refers to year (sometimes first tournament of a season is in the previous calender year)
  season: Number,
  date: {
    year: Number,
    startMonth: Number,
    startDay: Number,
    endMonth: Number,
    endDay: Number
  },
  country: String,
  gender: String,
  // players: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Player'
  // }],
  // matches: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Match'
  // }]
}, { timestamps: true })
module.exports = model('Tournament', Tournament)