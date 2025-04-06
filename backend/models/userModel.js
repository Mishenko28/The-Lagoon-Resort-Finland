const mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    personalData: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }), 'users')