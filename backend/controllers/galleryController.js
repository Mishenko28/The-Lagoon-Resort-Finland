const Picture = require('../models/photoModel')
const Archive = require('../models/archiveModel')
const ActivityLog = require('../models/activityLogModel')

// GET ALL PICTURES
const getAllPictures = async (_, res) => {
    try {
        const pictures = await Picture.find({})

        res.status(200).json({ pictures })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD PICTURE
const addPicture = async (req, res) => {
    const { img, caption, adminEmail } = await req.body

    try {
        const picture = await Picture.create({ img, caption })

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Added a new picture. (${caption})` })

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE PICTURE
const updatePicture = async (req, res) => {
    const { _id, img, caption, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldPicture = await Amenity.findOne({ _id })

        const picture = await Picture.findOneAndUpdate({ _id }, { img, caption }, { new: true })

        // activity log
        oldPicture.img != img && editedParts.push("img")
        oldPicture.caption != caption && editedParts.push("caption")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                activity: `Changed information. ${editedParts.map(part => {
                    switch (part) {
                        case "img":
                            return `(image)`
                        case "caption":
                            return `(caption: from ${oldPicture.caption} to ${caption})`
                    }
                })}`
            })
        }

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE PICTURE
const deletePicture = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const picture = await Picture.findOneAndDelete({ _id })

        // archive
        if (picture) {
            await Archive.create({ adminEmail, type: "picture", data: picture })
        }

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Deleted a picture. (${picture.caption})` })

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE PICTURE
const restorePicture = async (req, res) => {
    const { _id, data, adminEmail } = await req.body

    try {
        const picture = await Picture.create({ ...data })

        // archive
        if (picture) {
            await Archive.findOneAndDelete({ _id })
        }

        // activity log
        await ActivityLog.create({ adminEmail, activity: `Restored a picture. (${picture.caption})` })

        res.status(200).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllPictures,
    addPicture,
    updatePicture,
    deletePicture,
    restorePicture
}