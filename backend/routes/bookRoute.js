const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getPending,
    getExpired,
    getConfirmed,
    getOngoing,
    getCancelled,
    getNoshow,
    getCompleted,
    addBook,
    setConfirmed,
    setCompleted,
    setCancelled,
    setNoshow,
    editBook,
    getUserBooks
} = require('../controllers/bookController')

router.use(auth)

router.post('/add-pending', addBook)
router.post('/add-confirmed', setConfirmed)
router.post('/add-completed', setCompleted)
router.post('/add-cancelled', setCancelled)
router.post('/add-noshow', setNoshow)

router.get('/pending', getPending)
router.get('/expired', getExpired)
router.get('/confirmed', getConfirmed)
router.get('/ongoing', getOngoing)
router.get('/cancelled', getCancelled)
router.get('/noshow', getNoshow)
router.get('/completed', getCompleted)
router.get('/user', getUserBooks)

router.patch('/edit', editBook)
module.exports = router