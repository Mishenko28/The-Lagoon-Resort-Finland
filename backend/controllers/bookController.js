const moment = require('moment-timezone')
const Book = require('../models/bookModel')
const AdminSetting = require('../models/adminSettingsModel')

// STATUS
// pending
// expired
// confirmed
// ongoing
// cancelled
// noshow
// completed

const getBook = async (status) => {
    const book = await Book.find({ status })
    return book
}

// GET ALL PENDING
const getPending = async (_, res) => {
    try {
        await setExpiredBooks()
        const books = await getBook("pending")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL EXPIRED
const getExpired = async (_, res) => {
    try {
        await setExpiredBooks()
        const books = await getBook("expired")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CONFIRMED
const getConfirmed = async (_, res) => {
    try {
        await setOngoingBooks()
        const books = await getBook("confirmed")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ONGOING
const getOngoing = async (_, res) => {
    try {
        await setOngoingBooks()
        const books = await getBook("ongoing")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CANCELLED
const getCancelled = async (_, res) => {
    try {
        const books = await getBook("cancelled")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL NOSHOW
const getNoshow = async (_, res) => {
    try {
        const books = await getBook("noshow")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL COMPLETED
const getCompleted = async (_, res) => {
    try {
        const books = await getBook("completed")

        res.status(200).json({ books })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD NEW PENDING BOOK
const addBook = async (req, res) => {
    const { userId, from, to, note, room, total, deposit } = await req.body
    const { downPayment } = await AdminSetting.findOne({})

    try {
        const book = await Book.create({ userId, from, to, note, room, total, deposit, balance: total, downPayment })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & EXPIRED & CANCELLED & NOSHOW => CONFIRMED
const setConfirmed = async (req, res) => {
    const { _id, from, to, room, total, deposit, balance } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "confirmed", from, to, room, total, deposit, balance, reasonToCancel: "not cancelled" }, { new: true })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING => EXPIRED
const setExpiredBooks = async () => {
    const dateNow = moment().tz('Asia/Manila')
    const books = await getBook("pending")
    const { roomStart } = await AdminSetting.findOne({})

    await Promise.all(books.map(async book => {
        book.from.setHours(roomStart)
        book.to.setHours(roomStart)

        const isExpired = dateNow.isSameOrAfter(book.from)

        if (isExpired) {
            await Book.findOneAndUpdate({ _id: book._id }, { status: "expired" })
        }
    }))
}

// CONFIRMED => ONGOING
const setOngoingBooks = async () => {
    const dateNow = moment().tz('Asia/Manila')
    const books = await getBook("confirmed")
    const { roomStart } = await AdminSetting.findOne({})

    await Promise.all(books.map(async book => {
        book.from.setHours(roomStart)
        book.to.setHours(roomStart)

        const isOnGoing = dateNow.isSameOrAfter(book.from)

        if (isOnGoing) {
            await Book.findOneAndUpdate({ _id: book._id }, { status: "ongoing" })
        }
    }))
}

// ONGOING => COMPLETED
const setCompleted = async (req, res) => {
    const _id = await req.query._id

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "completed" })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & CONFIRMED & ONGOING => CANCELLED
const setCancelled = async (req, res) => {
    const { _id, reasonToCancel } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "cancelled", reasonToCancel })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ONGOING => NOSHOW
const setNoshow = async (req, res) => {
    const _id = await req.query._id

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "noshow" })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// EDIT BOOK
const editBook = async (req, res) => {
    const { _id, from, to, room, total, deposit, balance } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { _id, from, to, room, total, deposit, balance }, { new: true })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    getPending,
    getExpired,
    getConfirmed,
    getOngoing,
    getCancelled,
    getNoshow,
    getCompleted,
    addBook,
    setConfirmed,
    setCompleted,
    setCancelled,
    setNoshow,
    editBook
}