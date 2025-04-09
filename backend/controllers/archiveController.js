const Archive = require('../models/archiveModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const mongoose = require('mongoose')
const { Admin } = require('../models/adminModel')
const Room = require('../models/roomModel')
const RoomType = require('../models/roomTypeModel')
const AdminSetting = require('../models/adminSettingsModel')

const getAllArchives = async (_, res) => {
    try {
        let archives = await Archive.find({}).lean()

        archives = await Promise.all(archives.map(async item => {
            const { personalData } = await Admin.findOne({ email: item.adminEmail })
            item.name = personalData.name

            return item
        }))

        res.status(200).json(archives)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const restore = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const archive = await Archive.findOne({ _id })
        const restored = []

        if (archive.type === "room") {
            const roomTypes = await RoomType.find({})

            const exist = roomTypes.some(roomType => {
                if (roomType.name === archive.data.roomType) {
                    return roomType
                }
            })

            if (!exist) throw new Error(`The Room Type(${archive.data.roomType}) of this room does not exist.`)
        }

        if (archive.type === "roomtype") {
            const rooms = await Archive.find({ type: "room", "data.roomType": archive.data.name })

            if (rooms.length > 0) {
                for (const room of rooms) {
                    await Room.create({ ...room.data })
                    restored.push(await Archive.findOneAndDelete({ _id: room._id }))
                }
            }
        }

        if (["number", "email", "social"].includes(archive.type)) {
            const { phoneNumbers, socials, emails } = await AdminSetting.findOne({})

            if (archive.type === "number") {
                restored.push(await Archive.findOneAndDelete({ _id }))
                await AdminSetting.findOneAndUpdate({}, { phoneNumbers: [...phoneNumbers, archive.data] })
            } else if (archive.type === "social") {
                restored.push(await Archive.findOneAndDelete({ _id }))
                await AdminSetting.findOneAndUpdate({}, { socials: [...socials, archive.data] })
            } else if (archive.type === "email") {
                restored.push(await Archive.findOneAndDelete({ _id }))
                await AdminSetting.findOneAndUpdate({}, { emails: [...emails, archive.data] })
            }

        } else {
            restored.push(await Archive.findOneAndDelete({ _id }))
            const Model = mongoose.model(archive.model)

            await Model.create({ ...archive.data })
        }

        await ActivityLog.create({ adminEmail, action: [Actions.ARCHIVE, Actions.RESTORED], activity: `Restored ${archive.type} "${archive.value}"` })

        res.status(200).json(restored)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllArchives,
    restore
}