const mongoose = require('mongoose')

module.exports = mongoose.model('Archive', new mongoose.Schema({
    adminEmail: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true
    }
}, { timestamps: true }), 'archives')