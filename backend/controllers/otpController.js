const OTP = require('../models/otpModel')
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "johnthomasalog@gmail.com",
        pass: "fyem mpzq rgxb uati",
    },
})


// CREATE OTP
const createOTP = async (req, res) => {
    const { email } = await req.body
    const otp = Math.floor(100000 + Math.random() * 900000)

    try {
        const mailOptions = {
            from: "johnthomasalog@gmail.com",
            to: email,
            subject: "Hello from The Lagoon Resort Finland Inc.!",
            text: "Your OTP is " + otp,
        }

        transporter.sendMail(mailOptions, (error) => {
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