const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllPictures,
    addPicture,
    updatePicture,
    deletePicture,
} = require('../controllers/galleryController')

router.get('/all', getAllPictures)

router.use(auth)

router.post('/add', addPicture)
router.patch('/update', updatePicture)
router.delete('/delete', deletePicture)

module.exports = router