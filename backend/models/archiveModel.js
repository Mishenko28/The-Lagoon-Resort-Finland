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
    model: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d'
    }
}, { timestamps: true }), 'archives')