const mongoose = require("mongoose");
const crypto = require("crypto");

const secretKey = crypto.createHash("sha256").update(process.env.PASSWORD).digest()
const iv = Buffer.alloc(16, 0)
const zlib = require("zlib")

const { Actions, ActivityLog } = require("../models/activityLogModel")

function reviveDates(obj) {
    if (Array.isArray(obj)) {
        return obj.map(reviveDates)
    } else if (obj && typeof obj === 'object') {
        const result = {}
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
                result[key] = new Date(value)
            } else {
                result[key] = reviveDates(value)
            }
        }
        return result
    }
    return obj
}

function encryptJSON(jsonData) {
    const compressed = zlib.gzipSync(JSON.stringify(jsonData))
    const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv)
    let encrypted = Buffer.concat([cipher.update(compressed), cipher.final()])
    return {
        iv: iv.toString("base64"),
        data: encrypted.toString("base64"),
    }
}

function decryptJSON(encryptedData) {
    try {
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            secretKey,
            Buffer.from(encryptedData.iv, "base64")
        )
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedData.data, "base64")),
            decipher.final(),
        ])
        return JSON.parse(zlib.gunzipSync(decrypted).toString())
    } catch (error) {
        throw new Error("Invalid decryption data")
    }
}

const getAllCollectionNames = async (_, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray()
        const collectionNames = collections.map(collection => collection.name)

        res.status(200).json(collectionNames)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllCollections = async (req, res) => {
    const { adminEmail } = req.body

    try {
        const collections = await mongoose.connection.db.listCollections().toArray()
        let backupData = {}

        for (let collection of collections) {
            const collectionName = collection.name
            const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
            const encrypt = encryptJSON(await Model.find({}))
            backupData[collectionName] = encrypt
        }

        await ActivityLog.create({
            adminEmail,
            action: [Actions.EXPORT, Actions.DATABASE],
            activity: `Export of all collections`,
        })

        res.status(200).json(backupData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getOneCollection = async (req, res) => {
    const { adminEmail } = req.body
    const { collectionName } = req.query

    try {
        const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
        const data = await Model.find({})
        const encrypt = encryptJSON(data)

        await ActivityLog.create({
            adminEmail,
            action: [Actions.EXPORT, Actions.DATABASE],
            activity: `Export collection of ${collectionName}`,
        })

        res.status(200).json({ [collectionName]: encrypt })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const restoreCollection = async (req, res) => {
    const { collections, adminEmail } = req.body

    try {
        for (const collectionName of Object.keys(collections)) {
            const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName)
            const decryptedData = decryptJSON(collections[collectionName])
            await Model.deleteMany({})
            const reviveData = reviveDates(decryptedData)
            await Model.insertMany(reviveData)
        }

        await ActivityLog.create({
            adminEmail,
            action: [Actions.RESTORED, Actions.DATABASE],
            activity: `Restored a collection/s`,
        })

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const importCollection = async (req, res) => {
    const { collections, adminEmail } = req.body

    try {
        for (const collectionName of Object.keys(collections)) {
            const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName)
            const decryptedData = decryptJSON(collections[collectionName])
            const reviveData = reviveDates(decryptedData)
            await Promise.all(reviveData.map(async data => {
                if (await Model.findOne({ _id: data._id })) {
                    return Model.updateOne({ _id: data._id }, data)
                } else {
                    return Model.create(data)
                }
            }))
        }

        await ActivityLog.create({
            adminEmail,
            action: [Actions.IMPORT, Actions.DATABASE],
            activity: `Import a collection/s`,
        })

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    getAllCollections,
    getAllCollectionNames,
    getOneCollection,
    restoreCollection,
    importCollection
}