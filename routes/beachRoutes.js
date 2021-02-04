const router = require('express').Router()
const { Tournament } = require('../models')

router.get('/tournaments/year/:year', (req, res) => {
  Tournament.find({ 'tournamentYear': req.params.year })
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})

router.get('/tournaments', (req, res) => {
  Tournament.find()
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})




module.exports = router