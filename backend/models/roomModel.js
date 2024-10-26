const mongoose = require('mongoose')

module.exports = mongoose.model('Room', new mongoose.Schema({
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
    }
}, { timestamps: true }), 'rooms')