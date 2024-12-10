const Room = require('../models/roomModel')
const Archive = require('../models/archiveModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')

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
    const { roomNo, img, roomType, rate, addFeePerPerson, maxPerson, caption, active, adminEmail } = await req.body

    try {
        const existingRoomNo = await Room.findOne({ roomType, roomNo })

        if (existingRoomNo) throw new Error("Room number already exists.")

        const room = await Room.create({ roomNo, img, roomType, rate, addFeePerPerson, maxPerson, caption, active })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOM, Actions.CREATED], activity: `Added a new room with a room number of ${roomNo} in ${roomType} room type` })

        res.status(200).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE ROOM
const updateRoom = async (req, res) => {
    const { _id, roomNo, img, rate, addFeePerPerson, maxPerson, caption, active, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldRoom = await Room.findOne({ _id })

        const room = await Room.findOneAndUpdate({ _id }, { roomNo, img, rate, addFeePerPerson, maxPerson, caption, active }, { new: true })

        // activity log
        oldRoom.roomNo != roomNo && editedParts.push("roomNo")
        oldRoom.img != img && editedParts.push("img")
        oldRoom.rate != rate && editedParts.push("rate")
        oldRoom.addFeePerPerson != addFeePerPerson && editedParts.push("addFeePerPerson")
        oldRoom.maxPerson != maxPerson && editedParts.push("maxPerson")
        oldRoom.caption != caption && editedParts.push("caption")
        oldRoom.active != active && editedParts.push("active")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.ROOM, Actions.UPDATED],
                activity: `Changed properties of room ${oldRoom.roomNo} in ${oldRoom.roomType}. ${editedParts.map(part => {
                    switch (part) {
                        case "roomNo":
                            return ` changed room number from ${oldRoom.roomNo} to ${roomNo}`
                        case "img":
                            return ` changed image`
                        case "rate":
                            return ` changed rate from ${oldRoom.rate} to ${rate}`
                        case "addFeePerPerson":
                            return ` changed additional fee per person from ${oldRoom.addFeePerPerson} to ${addFeePerPerson}`
                        case "maxPerson":
                            return ` changed maximum person from ${oldRoom.maxPerson} to ${maxPerson}`
                        case "caption":
                            return ` changed caption from ${oldRoom.caption} to ${caption}`
                        case "active":
                            return ` changed active status to ${active ? "active" : "inactive"}`
                    }
                })}`
            })
        }

        res.status(200).json({ room })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE ROOM
const deleteRoom = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const room = await Room.findOneAndDelete({ _id }, { new: true })

        // archive
        if (room) {
            await Archive.create({ adminEmail, type: "room", data: room })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOM, Actions.DELETED], activity: `Deleted a room with a room number of ${room.roomNo} in ${room.roomType} room type` })

        res.status(200).json({ room })
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
        await ActivityLog.create({ adminEmail, action: [Actions.ROOM, Actions.RESTORED], activity: `Restored a room with a room number of ${room.roomNo} in ${room.roomType} roomtype` })

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