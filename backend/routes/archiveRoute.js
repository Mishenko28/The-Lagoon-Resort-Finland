const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllArchives
} = require('../controllers/archiveController')

router.use(auth)

router.get('/all', getAllArchives)

module.exports = router