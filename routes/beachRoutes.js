const router = require('express').Router()
const { Tournament, Player, Match, RawTournament } = require('../models')

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
    Player.findOneAndUpdate({ playerId: req.body.playerId }, { $push: { tournaments: req.body.tournaments } }, )
      .then(player => res.json(player))
      .catch(err => console.log(err))
})

router.delete('/player/delete/:playerId', (req, res) => {
  Player.findOneAndDelete({ 'playerId': req.params.playerId })
    .then(() => res.json('deleted'))
    .catch(err => console.log(err))
})

router.put("/player/matchpush", (req, res) => {
  Player.findOneAndUpdate({ playerId: req.body.playerId }, { $push: { matches: req.body.matches } },)
    .then(player => res.json(player))
    .catch(err => console.log(err))
})

router.post("/match", (req, res) => {
  Match.create(req.body)
    .then(match => res.json(match))
    .catch(err => console.log(err))
})


router.get('/rawtournaments/season/:season', (req, res) => {
  RawTournament.find({ 'season': req.params.season })
  .then(tournaments => res.json(tournaments))
  .catch(err => console.log(err))
})

router.post("/rawtournament", (req, res) => {
  RawTournament.create(req.body)
    .then(player => res.json(player))
    .catch(err => console.log(err))
})
module.exports = router