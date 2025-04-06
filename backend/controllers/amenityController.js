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
    const { name, img, caption, active, adminEmail } = await req.body

    try {
        const existingAmenity = await Amenity.findOne({ name })

        if (existingAmenity) throw Error("Amenity already exists.")

        const amenity = await Amenity.create({ name, img, caption, active })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.AMENITY, Actions.CREATED], activity: `Added a new amenity with a name of ${name}` })

        res.status(200).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE AMENITY
const updateAmenity = async (req, res) => {
    const { _id, name, img, caption, active, adminEmail } = await req.body
    let editedParts = []

    try {
        const existingAmenity = await Amenity.findOne({ _id: { $ne: _id }, name })
        if (existingAmenity) throw Error("Amenity already exists.")

        const oldAmenity = await Amenity.findOne({ _id })

        const amenity = await Amenity.findOneAndUpdate({ _id }, { name, img, caption, active }, { new: true })

        // activity log
        oldAmenity.name != name && editedParts.push("name")
        oldAmenity.img != img && editedParts.push("img")
        oldAmenity.caption != caption && editedParts.push("caption")
        oldAmenity.active != active && editedParts.push("active")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.AMENITY, Actions.UPDATED],
                activity: `Changed amenity information of ${oldAmenity.name}. ${editedParts.map(part => {
                    switch (part) {
                        case "name":
                            return ` changed name from ${oldAmenity.name} to ${name}`
                        case "img":
                            return ` changed image`
                        case "caption":
                            return ` changed caption from "${oldAmenity.caption}" to "${caption}"`
                        case "active":
                            return ` changed active status to ${active ? "active" : "inactive"}`
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
            await Archive.create({ adminEmail, type: "amenity", model: "Amenity", value: amenity.name, data: amenity })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.AMENITY, Actions.DELETED], activity: `Deleted an amenity with a name of ${amenity.name}` })

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
}