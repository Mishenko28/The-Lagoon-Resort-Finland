const mongoose = require('mongoose')
const User = require('./userModel')

module.exports = mongoose.model('Payment', new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true }), 'payments')