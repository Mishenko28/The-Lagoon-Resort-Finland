const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getSettings,
    updateSettings
} = require('../controllers/adminSettingsController')

router.get('/all', getSettings)

router.use(auth)
router.patch('/update', updateSettings)

module.exports = router