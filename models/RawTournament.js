const { model, Schema } = require('mongoose')

const RawTournament = new Schema({
  id: {
    type: String,
    required: true
  },
  name: String,
  country: String,
  season: Number,
  raw: String
}, { timestamps: true })
module.exports = model('RawTournament', RawTournament)