module.exports = require('mongoose').connect("mongodb://localhost/beach_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})