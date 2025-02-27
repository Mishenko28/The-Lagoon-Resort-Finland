const nodemailer = require('nodemailer')

const user = "johnthomasalog@gmail.com"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: "fyem mpzq rgxb uati" },
})

const sendMail = ({ to, subject, html }, callback) => {
    const mailOptions = {
        from: user,
        to,
        subject,
        html,
    }

    transporter.sendMail(mailOptions, callback)
}

module.exports = sendMail