const nodemailer = require('nodemailer')
const AdminSetting = require('../models/adminSettingsModel')


const sendMail = async ({ to, subject, html }, callback) => {
    const { systemEmail } = await AdminSetting.findOne({})

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: systemEmail.email, pass: systemEmail.appPassword },
    })

    const mailOptions = {
        from: "johnthomasalog@gmail.com",
        to,
        subject,
        html,
    }

    transporter.sendMail(mailOptions, callback)
}

module.exports = sendMail