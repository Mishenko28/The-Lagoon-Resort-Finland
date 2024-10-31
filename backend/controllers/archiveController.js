const Archive = require('../models/archiveModel')

const getAllArchives = async (_, res) => {
    try {
        const archives = await Archive.find({})

        res.status(200).json({ archives })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllArchives
}