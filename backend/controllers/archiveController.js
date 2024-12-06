const Archive = require('../models/archiveModel')
const { Admin } = require('../models/adminModel')

const getAllArchives = async (_, res) => {
    try {
        let archives = await Archive.find({})

        archives = await Promise.all(archives.map(async item => {
            const { personalData } = await Admin.findOne({ email: item.adminEmail })

            return {
                _id: item._id,
                name: personalData.name,
                type: item.type,
                data: item.data,
                createdAt: item.createdAt
            }
        }))

        res.status(200).json({ archives })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getAllArchives
}