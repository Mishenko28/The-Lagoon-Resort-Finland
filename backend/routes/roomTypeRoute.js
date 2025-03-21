const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getRoomTypes,
    addRoomTypes,
    updateRoomTypes,
    deleteRoomType,
    restoreRoomType,
    addSubImage,
    editSubImage,
    deleteSubImage,
    getAvailableRooms,
    getAvailableRoomNo
} = require('../controllers/roomTypeController')

router.get('/all', getRoomTypes)
router.post('/searchRooms', getAvailableRooms)

router.use(auth)

router.post('/available-rooms', getAvailableRoomNo)
router.post('/add', addRoomTypes)
router.patch('/update', updateRoomTypes)
router.delete('/delete', deleteRoomType)
router.post('/restore', restoreRoomType)
router.post('/addSubImage', addSubImage)
router.post('/editSubImage', editSubImage)
router.delete('/deleteSubImage', deleteSubImage)

module.exports = router