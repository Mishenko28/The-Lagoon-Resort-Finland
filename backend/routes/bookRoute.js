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
    getTotalBooksByUser,
    getTotalBooks,
    populateCompleted,
    populateNoShow,
    populateCancelled,
    populateExpired
} = require('../controllers/bookController')

router.use(auth)

router.post('/add-pending', addBook)
router.post('/add-confirmed', setConfirmed)
router.post('/add-completed', setCompleted)
router.post('/add-cancelled', setCancelled)
router.post('/add-noshow', setNoshow)

router.get('/total-book', setOngoingBooks, setExpiredBooks, getTotalBooks)
router.get('/total-book-user', setOngoingBooks, setExpiredBooks, getTotalBooksByUser)
router.get('/pending', setExpiredBooks, getPending)
router.get('/expired', setExpiredBooks, getExpired)
router.get('/confirmed', setOngoingBooks, getConfirmed)
router.get('/ongoing', setOngoingBooks, getOngoing)
router.get('/cancelled', getCancelled)
router.get('/noshow', getNoshow)
router.get('/completed', getCompleted)
router.get('/user', setOngoingBooks, setExpiredBooks, getUserBooks)

router.patch('/edit', editBook)

router.post('/populate-completed', populateCompleted)
router.post('/populate-no-show', populateNoShow)
router.post('/populate-cancelled', populateCancelled)
router.post('/populate-expired', populateExpired)

module.exports = router