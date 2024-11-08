const mongoose = require('mongoose')

module.exports = mongoose.model('Room', new mongoose.Schema({
    roomNo: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true,
    },
    roomType: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    addFeePerPerson: {
        type: Number,
        required: true
    },
    maxPerson: {
        type: Number,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }), 'rooms')