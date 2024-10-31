const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllPictures,
    addPicture,
    updatePicture,
    deletePicture,
    restorePicture
} = require('../controllers/galleryController')

router.get('/all', getAllPictures)

router.use(auth)

router.post('/add', addPicture)
router.patch('/update', updatePicture)
router.delete('/delete', deletePicture)
router.post('/restore', restorePicture)

module.exports = router