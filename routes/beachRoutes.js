const router = require('express').Router()
const { Tournament } = require('../models')

router.get('/tournaments/season/:season', (req, res) => {
  Tournament.find({ 'season': req.params.season })
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})

router.get('/tournaments', (req, res) => {
  Tournament.find()
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})

router.get('/tournaments/getOne/:bviId', (req, res) => {
  Tournament.findOne({ bviId: req.params.bviId })
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})




module.exports = router