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
            default: ""
        },
        appPassword: {
            type: String,
            default: ""
        },
    },
    address: {
        type: String,
        default: ""
    },
    coordinates: {
        type: Array,
        default: [0, 0]
    }
}, { timestamps: true }), 'adminSettings')