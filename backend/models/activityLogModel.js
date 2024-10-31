const mongoose = require('mongoose')

module.exports = mongoose.model('ActivityLog', new mongoose.Schema({
    adminEmail: {
        type: String,
        required: true,
    },
    activity: {
        type: String,
        required: true
    }
}, { timestamps: true }), 'activityLogs')