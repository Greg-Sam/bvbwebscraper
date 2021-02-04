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
  startDate: Date,
  endDate: Date,
  country: String,
  gender: String,
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player'
  }],
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'Match'
  }]
}, { timestamps: true })
module.exports = model('Tournament', Tournament)