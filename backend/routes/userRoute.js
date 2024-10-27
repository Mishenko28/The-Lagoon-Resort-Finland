const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    loginUser,
    signUpUser,
    getUsers,
    searchUser,
    addUserData,
    getUserData,
    updateUserData
} = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signUpUser)

router.use(auth)

router.get('/search', searchUser)
router.get('/all', getUsers)

router.get('/data', getUserData)
router.post('/data', addUserData)
router.patch('/data', updateUserData)

module.exports = router