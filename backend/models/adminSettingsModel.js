const mongoose = require('mongoose')

module.exports = mongoose.model('AdminSetting', new mongoose.Schema({
    downPayment: {
        type: Number,
        default: 0.5
    },
    roomTypes: {
        type: Array,
        default: []
    },
    roomStart: {
        type: Number,
        default: 8
    }
}, { timestamps: true }), 'adminSettings')