const Room = require('../models/roomModel')
const Archive = require('../models/archiveModel')
const ActivityLog = require('../models/activityLogModel')

// GET ALL ROOMS
const getAllRooms = async (_, res) => {
    try {
        const rooms = await Room.find({})

        res.status(200).json({ rooms })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD ROOM
const addRoom = async (req, res) => {
    const { img, roomType, rate, addFeePerPerson, maxPerson, caption, adminEmail } = await req.body

    try {
        const room = await Room.create({ img, roomType, rate, addFeePerPerson, maxPerson, caption })

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Added a new room. (${roomType})` })

        res.status(400).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE ROOM
const updateRoom = async (req, res) => {
    const { _id, img, roomType, rate, addFeePerPerson, maxPerson, caption, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldRoom = await Amenity.findOne({ _id })

        const room = await Room.findOneAndUpdate({ _id }, { img, roomType, rate, addFeePerPerson, maxPerson, caption }, { new: true })

        // activity log
        oldRoom.img != img && editedParts.push("img")
        oldRoom.roomType != roomType && editedParts.push("roomType")
        oldRoom.rate != rate && editedParts.push("rate")
        oldRoom.addFeePerPerson != addFeePerPerson && editedParts.push("addFeePerPerson")
        oldRoom.maxPerson != maxPerson && editedParts.push("maxPerson")
        oldRoom.caption != caption && editedParts.push("caption")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                activity: `Changed properties. ${editedParts.map(part => {
                    switch (part) {
                        case "img":
                            return `(image)`
                        case "roomType":
                            return `(room type: from ${oldRoom.roomType} to ${roomType})`
                        case "rate":
                            return `(rate: from ${oldRoom.rate} to ${rate})`
                        case "addFeePerPerson":
                            return `(additional fee per person: from ${oldRoom.addFeePerPerson} to ${addFeePerPerson})`
                        case "maxPerson":
                            return `(max person: from ${oldRoom.maxPerson} to ${maxPerson})`
                        case "caption":
                            return `(caption: from ${oldRoom.caption} to ${caption})`
                    }
                })}`
            })
        }

        res.status(400).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE ROOM
const deleteRoom = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const room = await Room.findOneAndDelete({ _id })

        // archive
        if (room) {
            await Archive.create({ adminEmail, type: "room", data: room })
        }

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Deleted a room. (${room.roomType})` })

        res.status(400).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE ROOM
const restoreRoom = async (req, res) => {
    const { _id, data, adminEmail } = await req.body

    try {
        const room = await Room.create({ ...data })

        // archive
        if (room) {
            await Archive.findOneAndDelete({ _id })
        }

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Restored a room. (${room.roomType})` })

        res.status(200).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    restoreRoom
}