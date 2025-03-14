const mongoose = require('mongoose')

module.exports = mongoose.model('Room', new mongoose.Schema({
    roomNo: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        default: '',
    },
    subImg: {
        type: [String],
        default: []
    },
    roomType: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: '',
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }), 'rooms')