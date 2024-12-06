const User = require('../models/userModel')
const UserPersonalData = require('../models/userPersonalDataModel')

const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const createToken = (id) => {
    return jwt.sign({ id }, process.env.PASSWORD, { expiresIn: '1d' })
}

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = await req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            throw Error("Email is not registered")
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw Error("Incorrect password")
        }

        const token = createToken(user._id)

        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// SIGNUP
const signUpUser = async (req, res) => {
    const { email, password } = await req.body

    try {
        const exist = await User.findOne({ email })

        if (exist) {
            throw Error("Email already exist")
        }
        if (!validator.isEmail(email)) {
            throw Error("email is not valid")
        }
        if (!validator.isStrongPassword(password, { minUppercase: 0, minNumbers: 0, minSymbols: 0 })) {
            throw Error("password must atleast 8 characters")
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await User.create({ email, password: hash })

        const token = createToken(user._id)

        res.status(200).json({ email, token })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL USERS BY PAGE
const getUsers = async (req, res) => {
    const page = await req.query.page

    try {
        const totalUsers = await User.countDocuments({})

        const users = await User.find({})
            .sort({ email: -1 })
            .skip((page - 1) * 30)
            .limit(30)

        res.status(200).json({ users, totalUsers })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


// SEARCH USER
const searchUser = async (req, res) => {
    const user = await req.query.user
    const page = await req.query.page

    try {
        const match = await User.find({ email: { $regex: `${user}`, $options: 'i' } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * 10)
            .limit(10)

        const totalUsers = await User.countDocuments({ email: { $regex: `${user}`, $options: 'i' } })

        res.status(200).json({ match, totalUsers })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD USER PERSONAL DATA
const addUserData = async (req, res) => {
    const { email, name, age, sex, address, contact } = await req.body

    try {
        const exist = await UserPersonalData.findOne({ email })

        if (exist) {
            throw Error("user already has data")
        }

        await User.findOneAndUpdate({ email }, { personalData: true })
        const personalData = await UserPersonalData.create({ email, name, age, sex, address, contact })

        res.status(200).json(personalData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET USER PERSONAL DATA
const getUserData = async (req, res) => {
    const email = await req.query.email

    try {
        const personalData = await UserPersonalData.findOne({ email })

        res.status(200).json(personalData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE USER PERSONAL DATA
const updateUserData = async (req, res) => {
    const { email, name, age, sex, address, contact } = await req.body

    try {
        const personalData = await UserPersonalData.findOneAndUpdate({ email }, { name, age, sex, address, contact }, { new: true })

        res.status(200).json(personalData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginUser,
    signUpUser,
    searchUser,
    getUsers,
    addUserData,
    getUserData,
    updateUserData
}
