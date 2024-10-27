const Amenity = require('../models/amenityModel')

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
    const { name, img, rate, caption } = await req.body

    try {
        const amenity = await Amenity.create({ name, img, rate, caption })

        res.status(400).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE AMENITY
const updateAmenity = async (req, res) => {
    const { _id, name, img, rate, caption } = await req.body

    try {
        const amenity = await Amenity.findOneAndUpdate({ _id }, { name, img, rate, caption }, { new: true })

        res.status(400).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE AMENITY
const deleteAmenity = async (req, res) => {
    const _id = await req.query._id

    try {
        const amenity = await Amenity.findOneAndDelete({ _id })

        res.status(400).json({ amenity })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllAmenities,
    addAmenity,
    updateAmenity,
    deleteAmenity
}