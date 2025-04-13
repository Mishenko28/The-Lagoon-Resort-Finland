const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const {
    loginUser,
    signUpUser,
    getUsers,
    addUserData,
    getUserData,
    updateUserData,
    addUser,
    populateUser
} = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/signup', signUpUser)

router.use(auth)

router.get('/all', getUsers)

router.get('/data', getUserData)
router.post('/add', addUser)
router.post('/data', addUserData)
router.patch('/data', updateUserData)


router.post('/populate', populateUser)

module.exports = router