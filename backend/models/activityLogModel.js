const mongoose = require('mongoose')

module.exports.ActivityLog = mongoose.model('ActivityLog', new mongoose.Schema({
    adminEmail: {
        type: String,
        required: true,
    },
    activity: {
        type: String,
        required: true
    },
    action: {
        type: Array,
        required: true
    }
}, { timestamps: true }), 'activityLogs')

module.exports.Actions = Actions = {
    LOGGED_IN: 'logged in',
    CREATED: 'created',
    UPDATED: 'updated',
    DELETED: 'deleted',
    RESTORED: 'restored',
    IMPORT: 'import',
    EXPORT: 'export',

    ROOM: 'room',
    AMENITY: 'amenity',
    GALLERY: 'gallery',
    BOOKING: 'booking',
    ROOMTYPE: 'roomtype',
    FEEDBACK: 'feedback',
    DATABASE: 'database',
    ARCHIVE: 'archive',

    ADMIN: 'admin'
}