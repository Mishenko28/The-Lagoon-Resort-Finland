const mongoose = require('mongoose')

module.exports = mongoose.model('AdminSetting', new mongoose.Schema({
    downPayment: {
        type: Number,
        default: 0.5
    },
    roomStart: {
        type: Number,
        default: 8
    },
    emails: {
        type: Array,
        default: []
    },
    phoneNumbers: {
        type: Array,
        default: []
    },
    socials: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        default: ''
    },
    aboutUs: {
        type: String,
        default: ''
    }
}, { timestamps: true }), 'adminSettings')