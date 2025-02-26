const mongoose = require('mongoose')

module.exports = mongoose.model('OTP', new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
}), 'otp')