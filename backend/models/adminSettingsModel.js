const mongoose = require('mongoose')

module.exports = mongoose.model('AdminSetting', new mongoose.Schema({
    downPayment: {
        type: Number,
        default: 0.5
    },
    roomStart: {
        type: Number,
        default: 14
    },
    roomEnd: {
        type: Number,
        default: 12
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
    },
    systemEmail: {
        email: {
            type: String,
            required: true,
            default: ""
        },
        appPassword: {
            type: String,
            required: true,
            default: ""
        },
    }
}, { timestamps: true }), 'adminSettings')