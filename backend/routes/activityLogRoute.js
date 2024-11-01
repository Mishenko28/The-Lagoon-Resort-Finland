const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllActivityLogs
} = require('../controllers/activityLogController')

router.use(auth)

router.get('/all', getAllActivityLogs)

module.exports = router