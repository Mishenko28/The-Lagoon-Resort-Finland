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
    deleteSubImage
} = require('../controllers/roomTypeController')

router.get('/all', getRoomTypes)

router.use(auth)

router.post('/add', addRoomTypes)
router.patch('/update', updateRoomTypes)
router.delete('/delete', deleteRoomType)
router.post('/restore', restoreRoomType)
router.post('/addSubImage', addSubImage)
router.post('/editSubImage', editSubImage)
router.delete('/deleteSubImage', deleteSubImage)

module.exports = router