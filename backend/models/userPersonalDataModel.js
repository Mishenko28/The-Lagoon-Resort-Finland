const mongoose = require('mongoose')

module.exports = mongoose.model('UserPersonalData', new mongoose.Schema({
    email: {
        type: String,
        required: true,
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
    contact: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, { timestamps: true }), 'usersPersonalData')