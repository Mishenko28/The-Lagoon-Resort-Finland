const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    updateSettings
} = require('../controllers/adminSettingsController')

router.use(auth)

router.patch('/update', updateSettings)

module.exports = router