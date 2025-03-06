const express = require('express')
const router = express.Router()

const {
    createOTP,
    verifyOTP
} = require('../controllers/otpController')

router.post('/create', createOTP)
router.post('/verify', verifyOTP)

module.exports = router