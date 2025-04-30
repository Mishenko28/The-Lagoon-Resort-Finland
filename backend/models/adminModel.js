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
    img: {
        type: String,
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
        contact: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        }
    }
}, { timestamps: true }), 'admins')

module.exports.Roles = Roles = [
    {
        page: 'Dashboard',
        section: ['booking', 'reports']
    },
    {
        page: 'Configuration',
        section: ['room', 'amenity', 'gallery', 'aboutUs']
    },
    {
        page: 'Utilities',
        section: ['archive', 'activityLogs', 'database', 'users', 'admins']
    }
]
