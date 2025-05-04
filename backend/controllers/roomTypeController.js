const RoomType = require('../models/roomTypeModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const Room = require('../models/roomModel')
const Archive = require('../models/archiveModel')
const Book = require('../models/bookModel')

// GET ALL ROOMTYPE
const getRoomTypes = async (_, res) => {
    try {
        const roomTypes = (await RoomType.find({})).reverse()

        res.status(200).json({ roomTypes })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET LIST OF ROOMTYPES WITH AVAILABLE ROOM NUMBERS
const getAvailableRoomNo = async (req, res) => {
    const { from, to, bookedRooms } = req.body

    try {
        const confirmedBooks = await Book.find({ status: "confirmed", from: { $lt: to }, to: { $gt: from } })
        const OngoingBooks = await Book.find({ status: "ongoing", from: { $lt: to }, to: { $gt: from } })

        const books = confirmedBooks.concat(OngoingBooks)

        let availableRooms = await RoomType.find({})

        availableRooms = await Promise.all(availableRooms.map(async roomType => {
            let rooms = await Room.find({ roomType: roomType.name, active: true })

            rooms = rooms.map(room => {
                let available = true

                books.forEach(book => {
                    book.room.forEach(r => {
                        if (r.roomNo == room.roomNo && r.roomType === roomType.name) {
                            available = false
                        }
                    })
                })

                bookedRooms && bookedRooms.forEach(r => {
                    if (r.roomNo == room.roomNo && r.roomType === roomType.name) {
                        available = true
                    }
                })

                return { roomNo: room.roomNo, available }
            })

            rooms.sort((a, b) => a.roomNo - b.roomNo)

            return { roomType: roomType.name, rooms }
        }))

        res.status(200).json(availableRooms)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET NUMBER OF AVAILABLE ROOMS PER ROOMTYPE
const getAvailableRooms = async (req, res) => {
    const { from, to } = req.body

    try {
        const confirmedBooks = await Book.find({ status: "confirmed", from: { $lt: to }, to: { $gt: from } })
        const OngoingBooks = await Book.find({ status: "ongoing", from: { $lt: to }, to: { $gt: from } })

        const books = confirmedBooks.concat(OngoingBooks)

        let roomTypes = await RoomType.find({}).lean()

        roomTypes = await Promise.all(roomTypes.map(async (roomType) => {
            let numberOfAvailableRooms = 0
            let rooms = await Room.find({ roomType: roomType.name, active: true })

            rooms.forEach(room => {
                let available = true

                books.forEach(book => {
                    book.room.forEach(r => {
                        if (r.roomNo == room.roomNo && r.roomType === roomType.name) {
                            available = false
                        }
                    })
                })

                if (available) {
                    numberOfAvailableRooms++
                }
            })
            return { ...roomType, numberOfAvailableRooms }
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
            await Book.updateMany({ "room.roomType": oldRoomType.name }, { $set: { "room.$[].roomType": name } })
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
        const books = await Book.find({ $or: [{ status: "confirmed" }, { status: "ongoing" }] })
        const { name } = await RoomType.findOne({ _id })

        if (books.some(book => book.room.some(room => room.roomType === name))) throw new Error("Cannot delete roomtype with active bookings.")

        const roomType = await RoomType.findOneAndDelete({ _id })
        const deletedRooms = await Room.find({ roomType: name })

        await Room.deleteMany({ roomType: name })

        // archive
        if (roomType) {
            await Archive.create({ adminEmail, type: "roomtype", model: "RoomType", value: name, data: roomType })
            await Promise.all(deletedRooms.map(async room => await Archive.create({ adminEmail, type: "room", model: "Room", value: `${room.roomType} - room ${room.roomNo}`, data: room })))
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ROOMTYPE, Actions.DELETED], activity: `Deleted roomtype with a name of ${roomType.name}` })

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
    addSubImage,
    editSubImage,
    deleteSubImage,
    getAvailableRooms,
    getAvailableRoomNo,
}