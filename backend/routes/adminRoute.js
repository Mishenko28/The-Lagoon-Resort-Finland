const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const loginLimiter = require('../middlewares/loginLimiter')

const {
    loginAdmin,
    addNewAdmin,
    deleteAdmin,
    updateAdmin,
    getAllAdmin,
    updatePassword,
    getAllRoles,
    getRole,
    getSingleAdmin,
    createInviteLink,
    getAllInviteLink,
    verifyInviteLink,
    deleteInviteLink,
    resendInviteLink,
    addNewAdminLink
} = require('../controllers/adminController')

router.post('/login', loginLimiter, loginAdmin)
router.post('/verify', verifyInviteLink)
router.post('/addLink', addNewAdminLink)

router.use(auth)

router.post('/add', addNewAdmin)
router.delete('/delete', deleteAdmin)
router.patch('/update', updateAdmin)
router.get('/all', getAllAdmin)
router.get('/roles', getAllRoles)
router.post('/password', updatePassword)
router.get('/role', getRole)
router.get('/profile', getSingleAdmin)

router.get('/invite', getAllInviteLink)
router.post('/reinvite', resendInviteLink)
router.post('/invite', createInviteLink)
router.delete('/invite', deleteInviteLink)

module.exports = router