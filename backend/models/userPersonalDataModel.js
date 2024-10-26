const mongoose = require('mongoose')

module.exports = mongoose.model('UserPersonalData', new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        default: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    }
}, { timestamps: true }), 'usersPersonalData')