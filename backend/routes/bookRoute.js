const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { setOngoingBooks, setExpiredBooks } = require('../middlewares/setBooks')

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
    getUserBooks,
    getTotalBooks
} = require('../controllers/bookController')

router.use(auth)

router.post('/add-pending', addBook)
router.post('/add-confirmed', setConfirmed)
router.post('/add-completed', setCompleted)
router.post('/add-cancelled', setCancelled)
router.post('/add-noshow', setNoshow)

router.get('/total-book', setOngoingBooks, setExpiredBooks, getTotalBooks)
router.get('/pending', setExpiredBooks, getPending)
router.get('/expired', setExpiredBooks, getExpired)
router.get('/confirmed', setOngoingBooks, getConfirmed)
router.get('/ongoing', setOngoingBooks, getOngoing)
router.get('/cancelled', getCancelled)
router.get('/noshow', getNoshow)
router.get('/completed', getCompleted)
router.get('/user', setOngoingBooks, setExpiredBooks, getUserBooks)

router.patch('/edit', editBook)
module.exports = router