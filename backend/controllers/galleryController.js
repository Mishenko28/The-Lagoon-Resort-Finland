const Picture = require('../models/photoModel')
const Archive = require('../models/archiveModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')

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
    const { img, caption, adminEmail, hide } = await req.body

    try {
        const existingPicture = await Picture.findOne({ img })

        if (existingPicture) throw new Error("This picture already exists.")

        const picture = await Picture.create({ img, caption, hide })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.GALLERY, Actions.CREATED], activity: `Added a new picture with a caption of "${caption}"` })

        res.status(200).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE PICTURE
const updatePicture = async (req, res) => {
    const { _id, img, caption, hide, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldPicture = await Picture.findOne({ _id })

        const picture = await Picture.findOneAndUpdate({ _id }, { img, caption, hide }, { new: true })

        // activity log
        oldPicture.img != img && editedParts.push("img")
        oldPicture.caption != caption && editedParts.push("caption")
        oldPicture.hide != hide && editedParts.push("hide")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.GALLERY, Actions.UPDATED],
                activity: `Changed properties of image with a caption of ${caption}. ${editedParts.map(part => {
                    switch (part) {
                        case "img":
                            return ` changed the image`
                        case "caption":
                            return ` changed caption from "${oldPicture.caption}" to "${caption}"`
                        case "hide":
                            return ` changed visibility to "${hide ? "hidden" : "visible"}"`
                    }
                })}`
            })
        }

        res.status(200).json({ picture })
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
        await ActivityLog.create({ adminEmail, action: [Actions.GALLERY, Actions.DELETED], activity: `Deleted a picture with a caption of "${picture.caption}"` })

        res.status(200).json({ picture })
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
        await ActivityLog.create({ adminEmail, action: [Actions.GALLERY, Actions.RESTORED], activity: `Restored a picture with a caption of "${picture.caption}"` })

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