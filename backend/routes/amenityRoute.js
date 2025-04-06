const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    getAllAmenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
} = require('../controllers/amenityController')

router.get('/all', getAllAmenities)

router.use(auth)

router.post('/add', addAmenity)
router.patch('/update', updateAmenity)
router.delete('/delete', deleteAmenity)

module.exports = router