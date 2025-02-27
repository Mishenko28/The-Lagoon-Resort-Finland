const mongoose = require('mongoose')

module.exports = mongoose.model('InviteLink', new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: Array,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
}), 'inviteLinks')