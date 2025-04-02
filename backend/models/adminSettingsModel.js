const mongoose = require('mongoose')

const phoneNumberSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    sim: {
        type: String,
        required: true,
    }
})

const socialSchema = new mongoose.Schema({
    app: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})

const emailSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    }
})

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
        type: [emailSchema],
        default: []
    },
    phoneNumbers: {
        type: [phoneNumberSchema],
        default: []
    },
    socials: {
        type: [socialSchema],
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