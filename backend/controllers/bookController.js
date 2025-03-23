const Book = require('../models/bookModel')
const AdminSetting = require('../models/adminSettingsModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const User = require('../models/userModel')
const UserPersonalData = require('../models/userPersonalDataModel')
const mongoose = require('mongoose')

// STATUS
// pending
// confirmed
// ongoing
// cancelled
// noshow
// expired
// completed


// GET TOTAL BOOKS PER USER
const getTotalBooks = async (req, res) => {
    const { email } = req.query

    try {
        const { _id: userId } = await User.findOne({ email })

        const pending = await Book.countDocuments({ status: "pending", userId })
        const confirm = await Book.countDocuments({ status: "confirmed", userId })
        const ongoing = await Book.countDocuments({ status: "ongoing", userId })
        const complete = await Book.countDocuments({ status: "completed", userId })
        const cancel = await Book.countDocuments({ status: "cancelled", userId })

        res.status(200).json({ pending, confirm, ongoing, complete, cancel })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getBook = async (status) => {
    const book = await Book.find({ status })
    return book
}

// GET ALL PENDING
const getPending = async (_, res) => {
    try {
        let books = await getBook("pending")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL EXPIRED
const getExpired = async (_, res) => {
    try {
        let books = await getBook("expired")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CONFIRMED
const getConfirmed = async (_, res) => {
    try {
        let books = await getBook("confirmed")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ONGOING
const getOngoing = async (_, res) => {
    try {
        let books = await getBook("ongoing")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CANCELLED
const getCancelled = async (_, res) => {
    try {
        let books = await getBook("cancelled")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL NOSHOW
const getNoshow = async (_, res) => {
    try {
        let books = await getBook("noshow")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL COMPLETED
const getCompleted = async (_, res) => {
    try {
        let books = await getBook("completed")

        books = await Promise.all(books.map(async (book) => {
            const { email } = await User.findOne({ _id: book.userId })
            const user = await UserPersonalData.findOne({ email: email })
            const newBook = book.toObject()

            newBook.user = user

            return newBook
        }))

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD NEW PENDING BOOK
const addBook = async (req, res) => {
    const { email, from, to, note, selectedRoomTypes, total, deposit } = await req.body
    const { downPayment } = await AdminSetting.findOne({})

    const room = selectedRoomTypes.map(roomType => ({ roomType: roomType.name, maxPerson: roomType.maxPerson, addedPerson: roomType.addedPerson, rate: roomType.rate, addedPersonRate: roomType.addFeePerPerson }))


    try {
        const user = await User.findOne({ email })

        const book = await Book.create({ userId: user._id, from, to, note, room, total, deposit, balance: total, downPayment })

        res.status(200).json({ book })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & CANCELLED => CONFIRMED
const setConfirmed = async (req, res) => {
    const { _id, from, to, room, total, deposit, payed, adminEmail } = await req.body

    try {
        const newRoom = room.map(r => {
            delete r._id
            return r
        })

        const balance = total - payed
        const book = await Book.findOneAndUpdate({ _id }, { status: "confirmed", from, to, room: newRoom, total, deposit, balance, payed, reasonToCancel: "not cancelled" }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirmed a book of ${email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ONGOING => COMPLETED
const setCompleted = async (req, res) => {
    const { _id, balance, payed, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "completed", balance, payed }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirm a book as completed of ${email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & CONFIRMED => CANCELLED
const setCancelled = async (req, res) => {
    const { _id, reasonToCancel, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "cancelled", reasonToCancel }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })

        // activity log
        await ActivityLog.create({ adminEmail: adminEmail || email + "(guest)", action: [Actions.BOOKING, Actions.UPDATED], activity: `Cancelled a book of ${email}` })

        res.status(200).json(book)
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
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Set a book as noshow of ${email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// EDIT BOOK
const editBook = async (req, res) => {
    const { _id, from, to, room, total, payed, adminEmail } = await req.body
    let editedParts = []
    console.log(payed)
    try {
        const balance = total - payed

        const newRoom = room.map(r => {
            delete r._id
            return r
        })

        const oldBook = await Book.findOne({ _id })

        const book = await Book.findOneAndUpdate({ _id }, { _id, from, to, room: newRoom, total, balance, payed }, { new: true })

        const { email } = await User.findOne({ _id: book.userId })
        const user = await UserPersonalData.findOne({ email: email })

        const newBook = book.toObject()
        newBook.user = user

        // activity log
        oldBook.from != from && editedParts.push("from")
        oldBook.to != to && editedParts.push("to")
        oldBook.room != room && editedParts.push("room")
        oldBook.total != total && editedParts.push("total")
        oldBook.payed != payed && editedParts.push("payed")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.BOOKING, Actions.UPDATED],
                activity: `Changed the book information of ${email}. ${editedParts.map(part => {
                    switch (part) {
                        case "from":
                            return ` changed start date from ${oldBook.from} to ${from}`
                        case "to":
                            return ` changed end date from ${oldBook.to} to ${to}`
                        case "room":
                            return ` changed room`
                        case "total":
                            return ` changed total from ${oldBook.total} to ${total}`
                        case "payed":
                            return ` changed payed balance from ${oldBook.payed} to ${payed}`
                    }
                })}`
            })
        }

        res.status(200).json(newBook)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL USER BOOKING
const getUserBooks = async (req, res) => {
    const { status, email } = req.query

    try {
        const { _id } = await User.findOne({ email })

        const books = await Book.find({ status, userId: _id })

        res.status(200).json(books.reverse())
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
    getUserBooks,
    getTotalBooks
}