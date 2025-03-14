const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getRoomTypes,
    addRoomTypes,
    updateRoomTypes,
    deleteRoomType,
    restoreRoomType
} = require('../controllers/roomTypeController')

router.get('/all', getRoomTypes)

router.use(auth)

router.post('/add', addRoomTypes)
router.patch('/update', updateRoomTypes)
router.delete('/delete', deleteRoomType)
router.post('/restore', restoreRoomType)

module.exports = router