const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    getAllCollections,
    getAllCollectionNames,
    getOneCollection,
    restoreCollection,
    importCollection
} = require('../controllers/databaseController')

router.use(auth)

router.get('/collections', getAllCollectionNames)
router.get('/all', getAllCollections)
router.get('/single', getOneCollection)

router.post('/restore', restoreCollection)
router.post('/import', importCollection)

module.exports = router