const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    const { authorization } = req.headers

    try {
        if (!authorization) {
            throw Error("authorization required")
        }

        const token = authorization.split(' ')[1]

        jwt.verify(token, process.env.PASSWORD)

        next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = auth