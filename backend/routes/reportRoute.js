const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getYearlyReport
} = require('../controllers/reportController')

router.use(auth)

router.get('/daily', getDailyReport)
router.get('/weekly', getWeeklyReport)
router.get('/monthly', getMonthlyReport)
router.get('/yearly', getYearlyReport)

module.exports = router