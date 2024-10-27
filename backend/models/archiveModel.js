const mongoose = require('mongoose')

module.exports = mongoose.model('Archive', new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
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