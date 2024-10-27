const Picture = require('../models/photoModel')

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
    const _id = await req.query._id

    try {
        const picture = await Picture.findOneAndDelete({ _id })

        res.status(400).json({ picture })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllPictures,
    addPicture,
    updatePicture,
    deletePicture
}