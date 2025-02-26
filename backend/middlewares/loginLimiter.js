const rateLimit = require("express-rate-limit")

const attempts = {}

const loginLimiter = rateLimit({
    windowMs: (60 * 1000) * 30,
    max: 8,
    handler: (_, res) => {
        res.status(429).json({ error: "Too many login attempts. Try again after 30 minutes" })
    }
})

module.exports = loginLimiter