const AdminSetting = require('../models/adminSettingsModel')

const updateSettings = async (req, res) => {
    const { downPayment, roomTypes, roomStart } = await req.body

    try {
        let adminSetting = await AdminSetting.findOne({})

        while (!adminSetting) {
            await AdminSetting.create({})

            adminSetting = await AdminSetting.findOne({})
        }

        adminSetting = await AdminSetting.findOneAndUpdate({}, { downPayment, roomTypes, roomStart }, { new: true })

        res.status(200).json({ adminSetting })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    updateSettings
}