const User = require('../models/userModel')
const UserPersonalData = require('../models/userPersonalDataModel')

const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const { Actions, ActivityLog } = require("../models/activityLogModel")

const createToken = (id) => {
    return jwt.sign({ id }, process.env.PASSWORD, { expiresIn: '1d' })
}

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = await req.body

    try {
        const user = await User.findOne({ email }).populate('details', 'img').select('email password').lean()

        if (!user) {
            throw Error("Email is not registered")
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw Error("Incorrect password")
        }

        let img = null

        if (user.personalData) {
            img = user.details.img
        }

        const token = createToken(user._id)

        res.status(200).json({ email, token, img })
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
    const { page, search } = await req.query

    try {
        const totalUsers = await User.countDocuments({})

        const users = await User.find(search ? { email: { $regex: `${search}`, $options: 'i' } } : {})
            .sort({ createdAt: -1 })
            .skip((page - 1) * 30)
            .limit(30)
            .populate('details')

        res.status(200).json({ users, totalUsers })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD USER PERSONAL DATA
const addUserData = async (req, res) => {
    const { email, name, birthDate, sex, contact, img } = await req.body

    try {
        const exist = await UserPersonalData.findOne({ email })

        if (exist) {
            throw Error("user already has data")
        }

        const personalData = await UserPersonalData.create({ email, name, birthDate, sex, contact, img })
        await User.findOneAndUpdate({ email }, { personalData: true, details: personalData._id })

        res.status(200).json(personalData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET USER PERSONAL DATA
const getUserData = async (req, res) => {
    const email = await req.query.email

    try {
        const { details } = await User.findOne({ email }).populate('details') || null

        res.status(200).json(details)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE USER PERSONAL DATA
const updateUserData = async (req, res) => {
    const { email, name, birthDate, sex, contact, img } = await req.body

    try {
        const personalData = await UserPersonalData.findOneAndUpdate({ email }, { name, birthDate, sex, contact, img }, { new: true })

        res.status(200).json(personalData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const addUser = async (req, res) => {
    const { email, password, birthDate, contact, img, name, sex, adminEmail } = await req.body

    try {
        if (!validator.isStrongPassword(password, { minUppercase: 0, minNumbers: 0, minSymbols: 0 })) {
            throw Error("password must atleast 8 characters")
        }

        const personalData = await UserPersonalData.create({ email, birthDate, contact, img, name, sex, })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        await User.create({ email, password: hash, personalData: true, details: personalData._id })

        const user = await User.findOne({ email }).populate('details')

        await ActivityLog.create({ adminEmail, action: [Actions.CREATED], activity: `added a user named ${name}` })

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const populateUser = async (req, res) => {
    const { email, password, createdAt, userPersonalData: { name, birthDate, contact, img, sex } } = req.body

    try {

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const exist = await User.findOne({ email })

        if (exist) {
            throw Error("Email already exist")
        }

        let personalData = null

        if (name) {
            personalData = await UserPersonalData.create({ email, name, birthDate, contact, img, sex, createdAt })
        }

        await User.create({ email, password: hash, personalData: personalData ? true : false, details: personalData ? personalData._id : null, createdAt })

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginUser,
    signUpUser,
    getUsers,
    addUserData,
    getUserData,
    updateUserData,
    addUser,
    populateUser
}