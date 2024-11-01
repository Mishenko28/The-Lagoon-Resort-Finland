const ActivityLog = require('../models/activityLogModel')
const Admin = require('../models/adminModel')

const getAllActivityLogs = async (_, res) => {
    try {
        let logs = await ActivityLog.find({})

        logs = await Promise.all(logs.map(async log => {
            const { personalData } = await Admin.findOne({ email: log.adminEmail })

            return {
                _id: log._id,
                name: personalData.name,
                activity: log.activity,
                createdAt: log.createdAt
            }
        }))

        res.status(200).json({ logs })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllActivityLogs
}