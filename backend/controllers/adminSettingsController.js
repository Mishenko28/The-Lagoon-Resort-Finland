const AdminSetting = require('../models/adminSettingsModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const Room = require('../models/roomModel')

const getSettings = async (_, res) => {
    try {
        let adminSetting = await AdminSetting.findOne({})

        while (!adminSetting) {
            await AdminSetting.create({})

            adminSetting = await AdminSetting.findOne({})
        }
        res.status(200).json({ adminSetting })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateSettings = async (req, res) => {
    const { downPayment, roomTypes, roomStart, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldSettings = await AdminSetting.findOne({})

        const adminSetting = await AdminSetting.findOneAndUpdate({}, { downPayment, roomTypes, roomStart }, { new: true })

        // activity log
        oldSettings.downPayment != downPayment && editedParts.push("downPayment")
        oldSettings.roomStart != roomStart && editedParts.push("roomStart")
        if (oldSettings.roomTypes != roomTypes) {
            editedParts.push("roomTypes")

            if (oldSettings.roomTypes.length > roomTypes.length) {
                let deletedRoomType = oldSettings.roomTypes.filter(roomType => !roomTypes.includes(roomType))

                await Room.deleteMany({ roomType: deletedRoomType[0] })
            }
        }


        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.ADMIN, Actions.UPDATED],
                activity: `Changed settings. ${editedParts.map(part => {
                    switch (part) {
                        case "downPayment":
                            return `(down payment: from ${oldSettings.downPayment} to ${downPayment})`
                        case "roomTypes":
                            return `(room types: from ${oldSettings.roomTypes} to ${roomTypes})`
                        case "roomStart":
                            return `(room start: from ${oldSettings.roomStart} to ${roomStart})`
                    }
                })}`
            })
        }

        res.status(200).json({ adminSetting })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getSettings,
    updateSettings
}