const { model, Schema } = require('mongoose')

const Tournament = new Schema({
  name: {
    type: String,
    required: true
  },
  bviId: {
    type: String,
    required: true
  }
})