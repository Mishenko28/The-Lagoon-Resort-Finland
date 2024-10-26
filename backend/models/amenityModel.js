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
    }
}, { timestamps: true }), 'amenities')