const router = require('express').Router()

router.use('/api', require('./beachRoutes.js'))

module.exports = router

