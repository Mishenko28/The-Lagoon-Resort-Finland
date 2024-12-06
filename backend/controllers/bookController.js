const moment = require('moment-timezone')
const Book = require('../models/bookModel')
const AdminSetting = require('../models/adminSettingsModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const User = require('../models/userModel')

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
    const { email, from, to, note, room, total, deposit } = await req.body
    const { downPayment } = await AdminSetting.findOne({})

    try {
        const user = await User.findOne({ email })

        const book = await Book.create({ userId: user._id, from, to, note, room, total, deposit, balance: total, downPayment })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & EXPIRED & CANCELLED & NOSHOW => CONFIRMED
const setConfirmed = async (req, res) => {
    const { _id, from, to, room, total, deposit, balance, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "confirmed", from, to, room, total, deposit, balance, reasonToCancel: "not cancelled" }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirmed a book. (${email})` })

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
    const { _id, balance, payed, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "completed", balance, payed }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirm a book as completed. (${email})` })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & CONFIRMED & ONGOING => CANCELLED
const setCancelled = async (req, res) => {
    const { _id, reasonToCancel, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "cancelled", reasonToCancel }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Cancelled a book. (${email})` })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ONGOING => NOSHOW
const setNoshow = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "noshow" }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Set a book as noshow. (${email})` })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// EDIT BOOK
const editBook = async (req, res) => {
    const { _id, from, to, room, total, deposit, balance, payed, adminEmail } = await req.body
    let editedParts = []

    try {
        const oldBook = await Amenity.findOne({ _id })

        const book = await Book.findOneAndUpdate({ _id }, { _id, from, to, room, total, deposit, balance, payed }, { new: true })

        // activity log
        oldBook.from != from && editedParts.push("from")
        oldBook.to != to && editedParts.push("to")
        oldBook.room != room && editedParts.push("room")
        oldBook.total != total && editedParts.push("total")
        oldBook.deposit != deposit && editedParts.push("deposit")
        oldBook.balance != balance && editedParts.push("balance")
        oldBook.payed != payed && editedParts.push("payed")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.BOOKING, Actions.UPDATED],
                activity: `Changed information. ${editedParts.map(part => {
                    switch (part) {
                        case "from":
                            return `(start: from ${oldBook.from} to ${from})`
                        case "to":
                            return `(end: from ${oldBook.to} to ${to})`
                        case "room":
                            return `(room)`
                        case "total":
                            return `(total: from ${oldBook.total} to ${total})`
                        case "deposit":
                            return `(deposit: from ${oldBook.deposit} to ${deposit})`
                        case "balance":
                            return `(balance: from ${oldBook.balance} to ${balance})`
                        case "payed":
                            return `(payed: from ${oldBook.payed} to ${payed})`
                    }
                })}`
            })
        }

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL USER BOOKING
const getUserBooks = async (req, res) => {
    const email = req.query.email

    try {
        const { _id } = await User.findOne({ email })

        const books = await Book.find({ userId: _id })

        res.status(200).json({ books })
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
    editBook,
    getUserBooks
}