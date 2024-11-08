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
    access: {
        type: Array,
        required: true
    },
    personalData: {
        name: {
            type: String,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        contact: {
            type: String,
            required: true
        }
    }
}, { timestamps: true }), 'admins')