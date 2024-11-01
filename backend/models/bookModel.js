const mongoose = require('mongoose')

module.exports = mongoose.model('Book', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        default: "none"
    },
    room: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    deposit: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    payed: {
        type: Number,
        default: 0
    },
    downPayment: {
        type: Number,
        required: true
    },
    reasonToCancel: {
        type: String,
        default: "not cancelled"
    }
}, { timestamps: true }), 'books')