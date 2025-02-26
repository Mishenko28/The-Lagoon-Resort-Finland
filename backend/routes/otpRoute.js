const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    createOTP,
    verifyOTP
} = require('../controllers/otpController')


router.use(auth)

router.post('/create', createOTP)
router.post('/verify', verifyOTP)

module.exports = router