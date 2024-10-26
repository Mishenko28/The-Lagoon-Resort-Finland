const mongoose = require('mongoose')

module.exports = mongoose.model('Archive', new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Object,
        required: true
    }
}, { timestamps: true }), 'archives')