const mongoose = require('mongoose')

module.exports = mongoose.model('AdminSetting', new mongoose.Schema({
    downPayment: {
        type: Number,
        required: true,
    }
}, { timestamps: true }), 'adminSettings')