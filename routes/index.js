const express = require('express')
const router = express.Router()

const v1AllRouter = require('./v1')

router.use('/v1', v1AllRouter)

module.exports = router