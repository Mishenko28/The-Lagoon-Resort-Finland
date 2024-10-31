const Picture = require('../models/photoModel')
const Archive = require('../models/archiveModel')

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
    const { img, caption } = await req.body

    try {
        const picture = await Picture.create({ img, caption })

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE PICTURE
const updatePicture = async (req, res) => {
    const { _id, img, caption } = await req.body

    try {
        const picture = await Picture.findOneAndUpdate({ _id }, { img, caption }, { new: true })

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE PICTURE
const deletePicture = async (req, res) => {
    const { _id, adminName } = await req.body

    try {
        const picture = await Picture.findOneAndDelete({ _id })

        if (picture) {
            await Archive.create({ adminName, type: "picture", data: picture })
        }

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE PICTURE
const restorePicture = async (req, res) => {
    const { _id, data } = await req.body

    try {
        const picture = await Picture.create({ ...data })

        if (picture) {
            await Archive.findOneAndDelete({ _id })
        }

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