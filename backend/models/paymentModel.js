const mongoose = require('mongoose')

module.exports = mongoose.model('Payment', new mongoose.Schema({
    amount: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['down payment', 'check-out payment', 'partial payment'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true }), 'payments')