const mongoose = require('mongoose')

module.exports = mongoose.model('Feedback', new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    anonymous: {
        type: Boolean,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    new: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }), 'feedback')