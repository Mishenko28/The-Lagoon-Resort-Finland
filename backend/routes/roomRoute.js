const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllRooms,
    addRoom,
    updateRoom,
    deleteRoom,
} = require('../controllers/roomController')

router.get('/all', getAllRooms)

router.use(auth)

router.post('/add', addRoom)
router.patch('/update', updateRoom)
router.delete('/delete', deleteRoom)

module.exports = router