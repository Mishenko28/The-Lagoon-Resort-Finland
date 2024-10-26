const mongoose = require('mongoose')

module.exports = mongoose.model('Book', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
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
    downPayment: {
        type: Number,
        required: true
    }
}, { timestamps: true }), 'books')