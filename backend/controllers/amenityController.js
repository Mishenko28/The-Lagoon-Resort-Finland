const Amenity = require('../models/amenityModel')
const Archive = require('../models/archiveModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')

// GET ALL AMENITIES
const getAllAmenities = async (_, res) => {
    try {
        const amenities = await Amenity.find({})

        res.status(200).json({ amenities })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD AMENITY
const addAmenity = async (req, res) => {
    const { name, img, rate, caption, active, adminEmail } = await req.body

    try {
        const existingAmenity = await Amenity.findOne({ name })

        if (existingAmenity) throw Error("Amenity already exists.")

        const amenity = await Amenity.create({ name, img, rate, caption, active })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.AMENITY, Actions.CREATED], activity: `Added a new amenity. (${name})` })

        res.status(200).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE AMENITY
const updateAmenity = async (req, res) => {
    const { _id, name, img, rate, caption, active, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldAmenity = await Amenity.findOne({ _id })

        const amenity = await Amenity.findOneAndUpdate({ _id }, { name, img, rate, caption, active }, { new: true })

        // activity log
        oldAmenity.name != name && editedParts.push("name")
        oldAmenity.img != img && editedParts.push("img")
        oldAmenity.rate != rate && editedParts.push("rate")
        oldAmenity.caption != caption && editedParts.push("caption")
        oldAmenity.active != active && editedParts.push("active")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.AMENITY, Actions.UPDATED],
                activity: `Changed information. ${editedParts.map(part => {
                    switch (part) {
                        case "name":
                            return `(name: from ${oldAmenity.name} to ${name})`
                        case "img":
                            return `(image)`
                        case "rate":
                            return `(rate: from ${oldAmenity.rate} to ${rate})`
                        case "caption":
                            return `(caption: from ${oldAmenity.caption} to ${caption})`
                        case "active":
                            return `(${active ? "activated" : "deactivated"})`
                    }
                })}`
            })
        }

        res.status(200).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE AMENITY
const deleteAmenity = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const amenity = await Amenity.findOneAndDelete({ _id })

        // archive
        if (amenity) {
            await Archive.create({ adminEmail, type: "amenity", data: amenity })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.AMENITY, Actions.DELETED], activity: `Deleted an amenity. (${amenity.name})` })

        res.status(200).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE AMENITY
const restoreAmenity = async (req, res) => {
    const { _id, data } = await req.body

    try {
        const amenity = await Amenity.create({ ...data })

        // archive
        if (amenity) {
            await Archive.findOneAndDelete({ _id })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.AMENITY, Actions.RESTORED], activity: `Restored an amenity. (${amenity.name})` })

        res.status(200).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllAmenities,
    addAmenity,
    updateAmenity,
    deleteAmenity,
    restoreAmenity
}