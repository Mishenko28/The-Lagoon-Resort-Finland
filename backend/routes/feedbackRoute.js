const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    createFeedback,
    getNewFeedback,
    approvedFeedback,
    rejectFeedback,
    getFeedback
} = require('../controllers/feedbackController')

router.get('/all', getFeedback)

router.use(auth)

router.post('/create', createFeedback)
router.post('/approve', approvedFeedback)
router.post('/reject', rejectFeedback)
router.get('/new', getNewFeedback)



module.exports = router