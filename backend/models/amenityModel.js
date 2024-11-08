const mongoose = require('mongoose')

module.exports = mongoose.model('Amenity', new mongoose.Schema({
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
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }), 'amenities')