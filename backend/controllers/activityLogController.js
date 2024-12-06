const { ActivityLog, Actions } = require('../models/activityLogModel')
const { Admin } = require('../models/adminModel')

const getAllActivityLogs = async (req, res) => {
    const { page, email, action } = req.query
    const actions = Object.values(Actions).map(action => { return action })

    try {
        let logs = await ActivityLog.find(email === 'all' ? {} : { adminEmail: email }).find(action === 'all' ? {} : { action }).sort({ createdAt: -1 }).skip((page - 1) * 20).limit(20)

        logs = await Promise.all(logs.map(async log => {
            const { personalData } = await Admin.findOne({ email: log.adminEmail })

            return {
                _id: log._id,
                name: personalData.name,
                activity: log.activity,
                createdAt: log.createdAt
            }
        }))

        const admins = await Admin.find({}).select('email')

        res.status(200).json({ logs, admins, actions })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllActivityLogs
}