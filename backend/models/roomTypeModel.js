const mongoose = require('mongoose')

module.exports = mongoose.model('RoomType', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    caption: {
        type: String,
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
}, { timestamps: true }), 'roomTypes')