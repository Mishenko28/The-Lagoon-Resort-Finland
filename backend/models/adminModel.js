const mongoose = require('mongoose')

module.exports = mongoose.model('Admin', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    personalData: {
        type: {
            name: {
                type: String
            },
            sex: {
                type: String
            },
            birthday: {
                type: Date
            },
            contactNumber: {
                type: String
            }
        },
        required: true
    }
}, { timestamps: true }), 'admins')