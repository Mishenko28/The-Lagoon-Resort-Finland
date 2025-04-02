const moment = require('moment-timezone')
const Book = require('../models/bookModel')
const AdminSetting = require('../models/adminSettingsModel')

// CONFIRMED => ONGOING
const setOngoingBooks = async (_, res, next) => {
    const dateNow = moment().tz('Asia/Manila')

    try {
        const books = await Book.find({ status: "confirmed" })
        const { roomStart, roomEnd } = await AdminSetting.findOne({})

        await Promise.all(books.map(async book => {
            book.from.setHours(roomStart, 0, 0, 0)
            book.to.setHours(roomEnd, 0, 0, 0)

            const isOnGoing = dateNow.isSameOrAfter(book.from)

            if (isOnGoing) {
                await Book.findOneAndUpdate({ _id: book._id }, { status: "ongoing" })
            }
        }))

        next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING => EXPIRED
const setExpiredBooks = async (_, res, next) => {
    const dateYesterday = moment().tz('Asia/Manila').add(-1, 'days')

    try {
        const books = await Book.find({ status: "pending" })
        const { roomStart, roomEnd } = await AdminSetting.findOne({})

        await Promise.all(books.map(async book => {
            book.from.setHours(roomStart, 0, 0, 0)
            book.to.setHours(roomEnd, 0, 0, 0)

            const isExpired = dateYesterday.isSameOrAfter(book.from)

            if (isExpired) {
                await Book.findOneAndUpdate({ _id: book._id }, { status: "expired" })
            }
        }))

        next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { setOngoingBooks, setExpiredBooks }