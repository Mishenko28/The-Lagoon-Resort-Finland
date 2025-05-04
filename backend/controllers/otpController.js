const OTP = require('../models/otpModel')
const sendMail = require('../Utility/nodeMailer')
const User = require('../models/userModel')


// CREATE OTP
const createOTP = async (req, res) => {
    const { email } = await req.body
    const otp = Math.floor(100000 + Math.random() * 900000)

    try {
        if (!email) throw Error("Email is required")
        const exist = await User.findOne({ email })
        if (exist) throw Error("This email is already registered")

        sendMail({
            to: email,
            subject: "Hello from The Lagoon Resort Finland Inc.!",
            html: `<h3>Dear ${email},<h3>
                <p>Your One-Time Password (OTP) for verification is: <h1>${otp}</h2></p>
                <p>This code is valid for 5 minutes. Please do not share this code with anyone for security reasons.</p>
                <p>Best Regards,</p>
                <p>The Lagoon Resort Finland Inc.</p>`
        }, (error) => {
            if (error) {
                throw Error(error)
            }
        })

        await OTP.create({ email, otp })

        res.status(200).json({ message: "OTP Sent" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// VERIFY OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = await req.body

    try {
        const match = await OTP.findOne({ email, otp })

        if (!match) {
            throw Error("Invalid OTP")
        }
        await OTP.findOneAndDelete({ email })

        res.status(200).json({ message: "OTP Verified" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createOTP,
    verifyOTP
}