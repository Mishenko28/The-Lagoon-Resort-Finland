const RoomType = require('../models/roomTypeModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const Room = require('../models/roomModel')
const Archive = require('../models/archiveModel')

// GET ALL ROOMTYPE
const getRoomTypes = async (_, res) => {
    try {
        const roomTypes = await RoomType.find({})

        res.status(200).json({ roomTypes })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET AVAILABLE ROOMS
const getAvailableRooms = async (req, res) => {
    const { from, to } = req.body

    try {
        if (!from || !to) throw Error("Please provide a date range.")
        let roomTypes = await RoomType.find({}).lean()

        roomTypes = roomTypes.map(roomType => ({
            ...roomType,
            numberOfAvailableRooms: 2
        }))

        res.status(200).json({ roomTypes })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD ROOMTYPE
const addRoomTypes = async (req, res) => {
    const { name, img, rate, caption, addFeePerPerson, maxPerson, adminEmail } = await req.body

    try {
        const existingRoomType = await RoomType.findOne({ name })

        if (existingRoomType) throw Error("Roomtype already exists.")

        const roomType = await RoomType.create({ name, img, rate, caption, addFeePerPerson, maxPerson })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.CREATED], activity: `Added a new roomtype with a name of ${name}` })

        res.status(200).json({ roomType })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE ROOMTYPE
const updateRoomTypes = async (req, res) => {
    const { _id, name, img, rate, caption, addFeePerPerson, maxPerson, adminEmail } = await req.body
    let editedParts = []

    try {
        const existingRoomType = await RoomType.findOne({ _id: { $ne: _id }, name })
        if (existingRoomType) throw Error("Roomtype already exists.")

        const oldRoomType = await RoomType.findOne({ _id })

        const roomType = await RoomType.findOneAndUpdate({ _id }, { name, img, rate, caption, addFeePerPerson, maxPerson }, { new: true })

        // activity log
        name && oldRoomType.name != name && editedParts.push("name")
        img && oldRoomType.img != img && editedParts.push("img")
        rate && oldRoomType.img != rate && editedParts.push("rate")
        caption && oldRoomType.caption != caption && editedParts.push("caption")
        addFeePerPerson && oldRoomType.addFeePerPerson != addFeePerPerson && editedParts.push("addFeePerPerson")
        maxPerson && oldRoomType.maxPerson != maxPerson && editedParts.push("maxPerson")

        if (editedParts.includes("name")) {
            await Room.updateMany({ roomType: oldRoomType.name }, { roomType: name })
        }

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.ROOMTYPE, Actions.UPDATED],
                activity: `Changed roomtype information of ${oldRoomType.name}. ${editedParts.map(part => {
                    switch (part) {
                        case "name":
                            return ` changed name from ${oldRoomType.name} to ${name}`
                        case "img":
                            return ` changed the image`
                        case "rate":
                            return ` changed rate from "${oldRoomType.rate}" to "${rate}"`
                        case "caption":
                            return ` changed caption from "${oldRoomType.caption}" to "${caption}"`
                        case "addFeePerPerson":
                            return ` changed additional fee for extra persons from "${oldRoomType.addFeePerPerson}" to "${addFeePerPerson}"`
                        case "maxPerson":
                            return ` changed maximum persons from "${oldRoomType.maxPerson}" to "${maxPerson}"`
                    }
                })}`
            })
        }
        res.status(200).json({ roomType })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE ROOMTYPE
const deleteRoomType = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const roomType = await RoomType.findOneAndDelete({ _id })

        await Room.deleteMany({ roomType: roomType.name })

        // archive
        if (roomType) {
            await Archive.create({ adminEmail, type: "roomtype", data: roomType })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.DELETED], activity: `Deleted roomtype with a name of ${roomType.name}` })

        res.status(200).json({ roomType })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE ROOMTYPE
const restoreRoomType = async (req, res) => {
    const { _id, data } = await req.body

    try {
        const roomType = await RoomType.create({ ...data })

        // archive
        if (roomType) {
            await Archive.findOneAndDelete({ _id })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.RESTORED], activity: `Restored an roomtype with a name of ${roomType.name}` })

        res.status(200).json({ roomType })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD SUB IMAGE
const addSubImage = async (req, res) => {
    const { _id, img, adminEmail } = await req.body

    try {
        const roomType = await RoomType.findOneAndUpdate({ _id }, { $push: { subImg: { url: img } } }, { new: true })

        // Activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.CREATED], activity: `Added a sub image to ${roomType.name} roomtype` })

        res.status(200).json({ roomType })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// EDIT SUB IMAGE
const editSubImage = async (req, res) => {
    const { _id, img, index, adminEmail } = await req.body

    try {
        const roomType = await RoomType.findOneAndUpdate({ _id }, { $set: { [`subImg.${index}.url`]: img } }, { new: true })

        // Activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.UPDATED], activity: `Edited a sub image in ${roomType.name} roomtype` })

        res.status(200).json({ roomType })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE SUB IMAGE
const deleteSubImage = async (req, res) => {
    const { _id, index, adminEmail } = await req.body

    try {
        await RoomType.findOneAndUpdate({ _id }, { $unset: { [`subImg.${index}`]: 1 } })

        const roomType = await RoomType.findOneAndUpdate({ _id }, { $pull: { subImg: null } }, { new: true })

        // Activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.DELETED], activity: `Deleted a sub image in ${roomType.name} roomtype` })

        res.status(200).json({ roomType })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getRoomTypes,
    addRoomTypes,
    updateRoomTypes,
    deleteRoomType,
    restoreRoomType,
    addSubImage,
    editSubImage,
    deleteSubImage,
    getAvailableRooms
}