const jwt = require('jsonwebtoken')
const { Admin } = require('../models/adminModel')

const auth = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        if (!authorization) {
            throw Error("authorization required")
        }

        const token = authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.PASSWORD)

        const { email } = await Admin.findOne({ _id: decoded.id })
        req.body.adminEmail = email

        next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = auth