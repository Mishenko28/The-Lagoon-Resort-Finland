const mongoose = require('mongoose')

module.exports.Admin = mongoose.model('Admin', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
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

module.exports.Roles = Roles = {
    DASHBOARD: {
        BOOKING: 'booking',
        REPORTS: 'reports'
    },
    CONFIGURATION: {
        ROOM: 'room',
        AMENITY: 'amenity',
        GALLERY: 'gallery',
        ABOUT_US: 'aboutUs'
    },
    UTILITIES: {
        ARCHIVE: 'archive',
        ACTIVITY_LOGS: 'activityLogs',
        DATABASE: 'database',
        USERS: 'users',
        ADMINS: 'admins'
    }
}
