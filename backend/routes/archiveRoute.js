const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllArchives,
    restore
} = require('../controllers/archiveController')

router.use(auth)

router.get('/all', getAllArchives)
router.post('/restore', restore)

module.exports = router