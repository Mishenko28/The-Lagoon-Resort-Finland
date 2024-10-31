const Admin = require('../models/adminModel')
const Archive = require('../models/archiveModel')

const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
    return jwt.sign({ id }, "LagoonThesis", { expiresIn: '1d' })
}


// LOGIN
const loginAdmin = async (req, res) => {
    const { email, password } = await req.body

    try {
        const admin = await Admin.findOne({ email })

        if (!admin) {
            throw Error("Admin not Found")
        }

        const match = await bcrypt.compare(password, admin.password)

        if (!match) {
            throw Error("Incorrect password")
        }

        const token = createToken(admin._id)

        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD NEW ADMIN
const addNewAdmin = async (req, res) => {
    const { email, password, position, name, sex, age, contact } = await req.body

    try {
        const match = await Admin.findOne({ email })

        if (match) {
            throw Error("Admin already exist")
        }
        if (email.length < 8) {
            throw Error("Admin must atleast 8 characters")
        }
        if (!validator.isStrongPassword(password, { minUppercase: 0, minNumbers: 0, minSymbols: 0 })) {
            throw Error("password must atleast 8 characters")
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = await Admin.create({ email, password: hash, position, personalData: { name, sex, age, contact } })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE ADMIN
const deleteAdmin = async (req, res) => {
    const { _id, adminName } = await req.body

    try {
        const admin = await Admin.findOneAndDelete({ _id })

        if (admin) {
            await Archive.create({ adminName, type: "admin", data: admin })
        }

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE ADMIN
const restoreAdmin = async (req, res) => {
    const { _id, data } = await req.body

    try {
        const admin = await Admin.create({ ...data })

        if (admin) {
            await Archive.findOneAndDelete({ _id })
        }

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE ADMIN
const updateAdmin = async (req, res) => {
    const { _id, email, password, position, name, sex, age, contact } = await req.body

    try {
        const admin = await Admin.findOneAndUpdate({ _id }, { email, password, position, personalData: { name, sex, age, contact } }, { new: true })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ADMIN
const getAllAdmin = async (_, res) => {
    try {
        const admins = await Admin.find({})

        res.status(200).json({ admins })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginAdmin,
    addNewAdmin,
    deleteAdmin,
    restoreAdmin,
    updateAdmin,
    getAllAdmin
}