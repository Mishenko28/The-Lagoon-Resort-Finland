const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const { getAllData } = require("../controllers/dashboardController")

router.use(auth)

router.get('/all', getAllData)

module.exports = router