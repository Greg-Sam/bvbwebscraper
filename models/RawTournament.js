const { model, Schema } = require('mongoose')

const RawTournament = new Schema({
  id: {
    type: String,
    required: true
  },
  raw: String
}, { timestamps: true })
module.exports = model('RawTournament', RawTournament)