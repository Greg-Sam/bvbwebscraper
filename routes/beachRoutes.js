const router = require('express').Router()
const { Tournament, Player } = require('../models')

router.get('/player/find/:playerId', (req, res) => {
  Player.find({ 'playerId': req.params.playerId })
    .then(player => res.json(player))
    .catch(err => console.log(err))
})
router.get('/tournaments/season/:season', (req, res) => {
  Tournament.find({ 'season': req.params.season })
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})

router.get('/tournaments/tournament/', (req, res) => {
  Tournament.findOne({ bviId: req.body.num })
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})

router.get('/tournaments', (req, res) => {
  Tournament.find()
    .then(tournaments => res.json(tournaments))
    .catch(err => console.log(err))
})



router.post("/player/tournamentfirst", (req, res) => {
  Player.create(req.body)
    .then(player => res.json(player))
    .catch(err => console.log(err))
})

router.put("/player/tournamentpush", (req, res) => {
    Player.findOneAndUpdate({ playerId: req.body.playerId }, {$upsert: true}, { $push: { tournaments: req.body.tournaments } }, )
      .then(player => res.json(player))
      .catch(err => console.log(err))
})



module.exports = router