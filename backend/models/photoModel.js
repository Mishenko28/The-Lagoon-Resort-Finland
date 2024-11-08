const mongoose = require('mongoose')

module.exports = mongoose.model('Picture', new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    hide: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }), 'gallery')