const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllAmenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
    restoreAmenity
} = require('../controllers/amenityController')

router.get('/all', getAllAmenities)

router.use(auth)

router.post('/add', addAmenity)
router.patch('/update', updateAmenity)
router.delete('/delete', deleteAmenity)
router.post('/restore', restoreAmenity)

module.exports = router