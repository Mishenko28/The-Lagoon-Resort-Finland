const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    loginAdmin,
    addNewAdmin,
    deleteAdmin,
    restoreAdmin,
    updateAdmin,
    getAllAdmin,
    updatePassword,
    getAllRoles,
    getRole
} = require('../controllers/adminController')

router.post('/login', loginAdmin)

router.use(auth)

router.post('/add', addNewAdmin)
router.delete('/delete', deleteAdmin)
router.post('/restore', restoreAdmin)
router.patch('/update', updateAdmin)
router.get('/all', getAllAdmin)
router.get('/roles', getAllRoles)
router.post('/password', updatePassword)
router.get('/role', getRole)

module.exports = router