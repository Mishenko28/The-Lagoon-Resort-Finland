const Book = require('../models/bookModel')
const AdminSetting = require('../models/adminSettingsModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const User = require('../models/userModel')
const sendMail = require('../Utility/nodeMailer')
const { Admin } = require('../models/adminModel')
const Payment = require('../models/paymentModel')
const { format, isFuture } = require('date-fns')
const moment = require('moment-timezone')
const TIMEZONE = 'Asia/Manila'

// STATUS
// pending
// confirmed
// ongoing
// cancelled
// noshow
// expired
// completed

// GET TOTAL BOOKS
const getTotalBooks = async (_, res) => {
    try {
        const pending = await Book.countDocuments({ status: "pending" })
        const confirmed = await Book.countDocuments({ status: "confirmed" })
        const ongoing = await Book.countDocuments({ status: "ongoing" })
        const completed = await Book.countDocuments({ status: "completed" })
        const noshow = await Book.countDocuments({ status: "noshow" })
        const cancelled = await Book.countDocuments({ status: "cancelled" })
        const expired = await Book.countDocuments({ status: "expired" })

        res.status(200).json({ pending, confirmed, completed, ongoing, cancelled, noshow, expired })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET TOTAL BOOKS BY USER
const getTotalBooksByUser = async (req, res) => {
    const { email } = req.query

    try {
        const { _id } = await User.findOne({ email })

        const pending = await Book.countDocuments({ status: "pending", user: _id })
        const confirm = await Book.countDocuments({ status: "confirmed", user: _id })
        const ongoing = await Book.countDocuments({ status: "ongoing", user: _id })
        const complete = await Book.countDocuments({ status: "completed", user: _id })
        const cancel = await Book.countDocuments({ status: "cancelled", user: _id })

        res.status(200).json({ pending, confirm, ongoing, complete, cancel })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL PENDING
const getPending = async (_, res) => {
    try {
        let books = await Book.find({ status: "pending" }).populate({ path: 'user', populate: 'details' })

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL EXPIRED
const getExpired = async (req, res) => {
    const { month } = req.query

    const start = moment(month).tz(TIMEZONE).startOf('month')
    const end = moment(month).tz(TIMEZONE).endOf('month')

    try {
        let books = await Book.find({ status: "expired", from: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' }).lean()

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CONFIRMED
const getConfirmed = async (_, res) => {
    try {
        let books = await Book.find({ status: "confirmed" }).populate({ path: 'user', populate: 'details' })

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ONGOING
const getOngoing = async (_, res) => {
    try {
        let books = await Book.find({ status: "ongoing" }).populate({ path: 'user', populate: 'details' })

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL CANCELLED
const getCancelled = async (req, res) => {
    const { month } = req.query

    const start = moment(month).tz(TIMEZONE).startOf('month')
    const end = moment(month).tz(TIMEZONE).endOf('month')

    try {
        let books = await Book.find({ status: "cancelled", from: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' }).lean()

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL NOSHOW
const getNoshow = async (req, res) => {
    const { month } = req.query

    const start = moment(month).tz(TIMEZONE).startOf('month')
    const end = moment(month).tz(TIMEZONE).endOf('month')

    try {
        let books = await Book.find({ status: "noshow", from: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' }).lean()

        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL COMPLETED
const getCompleted = async (req, res) => {
    const { month } = req.query

    const start = moment(month).tz(TIMEZONE).startOf('month')
    const end = moment(month).tz(TIMEZONE).endOf('month')

    try {
        let books = await Book.find({ status: "completed", from: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' }).lean()

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
        const admins = await Admin.find({ role: { $in: ["booking"] } })
        const user = await User.findOne({ email }).populate('details')

        const { _id } = await Book.create({ user: user._id, from, to, note, room, total, deposit, balance: total, downPayment })

        const book = await Book.findOne({ _id }).populate({ path: 'user', populate: 'details' })

        admins.forEach(admin => {
            sendMail({
                subject: "New Reservation Received!",
                to: admin.email,
                html: `<h3>Dear ${admin.personalData.name},</h3>
                    <p>You have received a new reservation request through the website. Below are the details:</p>
                    <hr />
                    <h4>Guest Information:</h4>
                    <ul>
                        <li>Name: ${book.user.details.name}</li>
                        <li>Email: ${book.user.details.email}</li>
                        <li>Contact: ${book.user.details.contact}</li>
                    </ul>
                    <hr />
                    <h4>Reservation Details:</h4>
                    <ul>
                        <li>Check-in Date: ${format(book.from, "MMM d, yyyy")}</li>
                        <li>Check-out Date: ${format(book.to, "MMM d, yyyy")}</li>
                        <li>Room Type: ${book.room.map(r => r.roomType).join(", ")}</li>
                        <li>Special Request: ${book.note !== "" ? book.note : "none"}</li>
                    </ul>
                    <hr />
                    <p>Please review the details and process the reservation accordingly.<p>
                    <p>Thank you.</p>
                    <p>Best Regards,</p>
                    <p><b>The Lagoon Resort Finland Inc.<b></p>`
            })
        })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING  => CONFIRMED
const setConfirmed = async (req, res) => {
    const { _id, from, to, room, total, deposit, payed, adminEmail } = await req.body

    try {
        const newRoom = room.map(r => {
            delete r._id
            return r
        })

        const balance = total - payed
        const book = await Book.findOneAndUpdate({ _id }, { status: "confirmed", from, to, room: newRoom, total, deposit, balance, payed, confirmedDate: new Date() }, { new: true }).populate({ path: 'user', populate: 'details' })

        book.user.totalBookings++
        await book.user.save()

        sendMail({
            subject: "Reservation Confirmation! - The Lagoon Resort Finland Inc.",
            to: book.user.email,
            html: `<h3>Hi ${book.user.details.name},</h3>
                    <p>We’re happy to let you know that your reservation at The Lagoon Resort Finland Inc. has been successfully confirmed!</p>
                    <hr />
                    <h4>Reservation Details:</h4>
                    <ul>
                        <li>Reservation ID: ${book._id}</li>
                        <li>Check-in Date: ${format(book.from, "MMM d, yyyy h:mm a")}</li>
                        <li>Check-out Date: ${format(book.to, "MMM d, yyyy h:mm a")}</li>
                        <li>Room Type: ${book.room.map(r => r.roomType).join(", ")}</li>
                        <li>Number of Guest: ${book.room.reduce((persons, current) => current.maxPerson + current.addedPerson + persons, 0)}</li>
                        <li>Amount Total: ₱${book.total}</li>
                        <li>Down payment: ₱${book.payed}</li>
                    </ul>
                    <hr />
                    <p>Kindly present a valid ID upon check-in for verification purposes. This helps us ensure a smooth and secure check-in process.</p>
                    <hr />
                    <p>If you have any questions or special requests, feel free to reply to this email or contact us directly. We look forward to welcoming you and making your stay with us memorable! Thank you for choosing The Lagoon Resort Finland Inc!<p>
                    <p>Best Regards,</p>
                    <p><b>The Lagoon Resort Finland Inc.<b></p>`
        })

        await Payment.create({ amount: payed, type: "down payment", userId: book.user })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirmed a book of ${book.user.email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ONGOING => COMPLETED
const setCompleted = async (req, res) => {
    const { _id, total, addCharges, adminEmail } = await req.body

    try {
        const oldBook = await Book.findOne({ _id })

        if (total - oldBook.balance > 0) {
            await Payment.create({ amount: total - oldBook.payed, type: "check-out payment", userId: oldBook.user })
        }

        const book = await Book.findOneAndUpdate({ _id }, { status: "completed", balance: 0, total, payed: total, addCharges }, { new: true }).populate('user')

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Confirm a book as completed of ${book.user.email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// PENDING & CONFIRMED => CANCELLED
const setCancelled = async (req, res) => {
    const { _id, reasonToCancel, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "cancelled", reasonToCancel, cancelledDate: new Date() }, { new: true }).populate('user')

        // activity log
        await ActivityLog.create({ adminEmail: adminEmail || "(guest)", action: [Actions.BOOKING, Actions.UPDATED], activity: `Cancelled a book of ${book.user.email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ONGOING => NOSHOW
const setNoshow = async (req, res) => {
    const { _id, adminEmail } = await req.body

    try {
        const book = await Book.findOneAndUpdate({ _id }, { status: "noshow" }, { new: true }).populate('user')

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.BOOKING, Actions.UPDATED], activity: `Set a book as noshow of ${book.user.email}` })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// EDIT BOOK
const editBook = async (req, res) => {
    const { _id, from, to, room, total, payed, showed, adminEmail } = await req.body
    let editedParts = []

    try {
        const balance = total - payed

        const newRoom = room.map(r => {
            delete r._id
            return r
        })

        const oldBook = await Book.findOne({ _id })

        if (payed - oldBook.payed > 0) {
            await Payment.create({ amount: payed - oldBook.payed, type: 'partial payment', userId: oldBook.user })
        }

        const book = await Book.findOneAndUpdate({ _id }, { _id, from, to, room: newRoom, total, balance, payed, showed }, { new: true }).populate({ path: 'user', populate: 'details' })

        // activity log
        from && format(oldBook.from, "MMM d, yyyy") !== format(from, "MMM d, yyyy") && editedParts.push("from")
        to && format(oldBook.to, "MMM d, yyyy") !== format(to, "MMM d, yyyy") && editedParts.push("to")
        room && JSON.stringify(oldBook.room) !== JSON.stringify(room) && editedParts.push("room")
        total && oldBook.total !== total && editedParts.push("total")
        payed && oldBook.payed !== payed && editedParts.push("payed")
        showed && oldBook.showed !== showed && editedParts.push("showed")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.BOOKING, Actions.UPDATED],
                activity: `Changed the book information of ${book.user.email}. ${editedParts.map(part => {
                    switch (part) {
                        case "from":
                            return ` changed start date from ${format(oldBook.to, "MMM d, yyyy")} to ${format(from, "MMM d, yyyy")}`
                        case "to":
                            return ` changed end date from ${format(oldBook.to, "MMM d, yyyy")} to ${format(to, "MMM d, yyyy")}`
                        case "room":
                            return ` changed room`
                        case "total":
                            return ` changed total from ${oldBook.total} to ${total}`
                        case "payed":
                            return ` changed payed balance from ${oldBook.payed} to ${payed}`
                        case "showed":
                            return ` marked as showed`
                    }
                })}`
            })
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL USER BOOKING
const getUserBooks = async (req, res) => {
    const { status, email } = req.query

    try {
        const { _id } = await User.findOne({ email })

        let books = []

        if (status === "all") {
            books = await Book.find({ user: _id }).populate("feedback")
        } else {
            books = await Book.find({ status, user: _id }).populate("feedback")
        }

        res.status(200).json(books.reverse())
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const populateCompleted = async (_, res) => {
    try {
        const { roomStart } = await AdminSetting.findOne({})
        const { roomEnd } = await AdminSetting.findOne({})
        const { downPayment } = await AdminSetting.findOne({})

        let room = []
        if (Math.random() < 0.5) {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "STANDARD",
                    roomNo: Math.floor(Math.random() * 6) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1000,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "SUPERIOR",
                    roomNo: Math.floor(Math.random() * 4) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1400,
                    addedPersonRate: 200
                })
            }
        } else {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "FAMILY",
                    roomNo: Math.floor(Math.random() * 5) + 1,
                    maxPerson: 5,
                    addedPerson: 0,
                    rate: 1800,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "APARTMENT",
                    roomNo: Math.floor(Math.random() * 2) + 1,
                    maxPerson: 6,
                    addedPerson: 0,
                    rate: 2000,
                    addedPersonRate: 300
                })
            }
        }
        const roomTotal = room.reduce((total, current) => current.rate + total, 0)

        const totalCount = await User.countDocuments({ personalData: true })
        const allUser = await User.find({ personalData: true })

        let user
        let date
        do {
            user = allUser[Math.floor(Math.random() * totalCount)];
            date = new Date(user.createdAt)
            date.setDate(date.getDate() + 5)
        } while (isFuture(date))

        await User.findOneAndUpdate({ _id: user._id }, { $inc: { totalBookings: 1 } })

        const from = new Date(user.createdAt.setHours(roomStart, 0, 0, 0))
        let to
        let randomDays

        do {
            randomDays = Math.floor(Math.random() * 7) + 1
            to = new Date(user.createdAt)
            to.setDate(to.getDate() + randomDays)
        } while (isFuture(to))

        to.setHours(roomEnd, 0, 0, 0)

        const totalDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24))

        const total = roomTotal * totalDays

        const book = await Book.create({
            user: user._id,
            status: "completed",
            showed: true,
            downPayment,
            from,
            to,
            room,
            total,
            deposit: total * downPayment,
            balance: 0,
            payed: total,
            confirmedDate: from,
            createdAt: user.createdAt
        })

        await Payment.create({
            amount: total * downPayment,
            userId: user._id,
            type: "down payment",
            createdAt: from
        })

        await Payment.create({
            amount: total * downPayment,
            userId: user._id,
            type: "check-out payment",
            createdAt: to
        })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const populateNoShow = async (_, res) => {
    try {
        const { roomStart } = await AdminSetting.findOne({})
        const { roomEnd } = await AdminSetting.findOne({})
        const { downPayment } = await AdminSetting.findOne({})

        let room = []
        if (Math.random() < 0.5) {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "STANDARD",
                    roomNo: Math.floor(Math.random() * 6) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1000,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "SUPERIOR",
                    roomNo: Math.floor(Math.random() * 4) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1400,
                    addedPersonRate: 200
                })
            }
        } else {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "FAMILY",
                    roomNo: Math.floor(Math.random() * 5) + 1,
                    maxPerson: 5,
                    addedPerson: 0,
                    rate: 1800,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "APARTMENT",
                    roomNo: Math.floor(Math.random() * 2) + 1,
                    maxPerson: 6,
                    addedPerson: 0,
                    rate: 2000,
                    addedPersonRate: 300
                })
            }
        }
        const roomTotal = room.reduce((total, current) => current.rate + total, 0)

        const totalCount = await User.countDocuments({ personalData: true })
        const allUser = await User.find({ personalData: true })

        let user
        let date
        do {
            user = allUser[Math.floor(Math.random() * totalCount)];
            date = new Date(user.createdAt)
            date.setDate(date.getDate() + 5)
        } while (isFuture(date))

        await User.findOneAndUpdate({ _id: user._id }, { $inc: { totalBookings: 1 } })

        const from = new Date(user.createdAt.setHours(roomStart, 0, 0, 0))
        let to
        let randomDays

        do {
            randomDays = Math.floor(Math.random() * 7) + 1
            to = new Date(user.createdAt)
            to.setDate(to.getDate() + randomDays)
        } while (isFuture(to))

        to.setHours(roomEnd, 0, 0, 0)

        const totalDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24))
        const total = roomTotal * totalDays

        const book = await Book.create({
            user: user._id,
            status: "noshow",
            downPayment,
            from,
            to,
            room,
            total,
            deposit: total * downPayment,
            balance: total - (total * downPayment),
            payed: total * downPayment,
            confirmedDate: from,
            createdAt: user.createdAt
        })

        await Payment.create({
            amount: total * downPayment,
            userId: user._id,
            type: "down payment",
            createdAt: from
        })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const populateCancelled = async (_, res) => {
    try {
        const { roomStart } = await AdminSetting.findOne({})
        const { roomEnd } = await AdminSetting.findOne({})
        const { downPayment } = await AdminSetting.findOne({})

        let room = []
        if (Math.random() < 0.5) {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "STANDARD",
                    roomNo: Math.floor(Math.random() * 6) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1000,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "SUPERIOR",
                    roomNo: Math.floor(Math.random() * 4) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1400,
                    addedPersonRate: 200
                })
            }
        } else {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "FAMILY",
                    roomNo: Math.floor(Math.random() * 5) + 1,
                    maxPerson: 5,
                    addedPerson: 0,
                    rate: 1800,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "APARTMENT",
                    roomNo: Math.floor(Math.random() * 2) + 1,
                    maxPerson: 6,
                    addedPerson: 0,
                    rate: 2000,
                    addedPersonRate: 300
                })
            }
        }
        const roomTotal = room.reduce((total, current) => current.rate + total, 0)

        const totalCount = await User.countDocuments({ personalData: true })
        const allUser = await User.find({ personalData: true })

        let user
        let date
        do {
            user = allUser[Math.floor(Math.random() * totalCount)];
            date = new Date(user.createdAt)
            date.setDate(date.getDate() + 5)
        } while (isFuture(date))

        const from = new Date(user.createdAt.setHours(roomStart, 0, 0, 0))
        let to
        let randomDays

        do {
            randomDays = Math.floor(Math.random() * 7) + 1
            to = new Date(user.createdAt)
            to.setDate(to.getDate() + randomDays)
        } while (isFuture(to))

        to.setHours(roomEnd, 0, 0, 0)

        const totalDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24))
        const total = roomTotal * totalDays

        const book = await Book.create({
            user: user._id,
            status: "cancelled",
            downPayment,
            from,
            to,
            room,
            total,
            deposit: total * downPayment,
            balance: total,
            payed: 0,
            reasonToCancel: "Cancelled by admin",
            cancelledDate: user.createdAt,
            createdAt: user.createdAt
        })

        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const populateExpired = async (_, res) => {
    try {
        const { roomStart } = await AdminSetting.findOne({})
        const { roomEnd } = await AdminSetting.findOne({})
        const { downPayment } = await AdminSetting.findOne({})

        let room = []
        if (Math.random() < 0.5) {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "STANDARD",
                    roomNo: Math.floor(Math.random() * 6) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1000,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "SUPERIOR",
                    roomNo: Math.floor(Math.random() * 4) + 1,
                    maxPerson: 2,
                    addedPerson: 0,
                    rate: 1400,
                    addedPersonRate: 200
                })
            }
        } else {
            if (Math.random() < 0.5) {
                room.push({
                    roomType: "FAMILY",
                    roomNo: Math.floor(Math.random() * 5) + 1,
                    maxPerson: 5,
                    addedPerson: 0,
                    rate: 1800,
                    addedPersonRate: 100
                })
            } else {
                room.push({
                    roomType: "APARTMENT",
                    roomNo: Math.floor(Math.random() * 2) + 1,
                    maxPerson: 6,
                    addedPerson: 0,
                    rate: 2000,
                    addedPersonRate: 300
                })
            }
        }
        const roomTotal = room.reduce((total, current) => current.rate + total, 0)

        const totalCount = await User.countDocuments({ personalData: true })
        const allUser = await User.find({ personalData: true })

        let user
        let date
        do {
            user = allUser[Math.floor(Math.random() * totalCount)];
            date = new Date(user.createdAt)
            date.setDate(date.getDate() + 5)
        } while (isFuture(date))

        const from = new Date(user.createdAt.setHours(roomStart, 0, 0, 0))
        let to
        let randomDays

        do {
            randomDays = Math.floor(Math.random() * 7) + 1
            to = new Date(user.createdAt)
            to.setDate(to.getDate() + randomDays)
        } while (isFuture(to))

        to.setHours(roomEnd, 0, 0, 0)

        const totalDays = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24))
        const total = roomTotal * totalDays

        const book = await Book.create({
            user: user._id,
            status: "expired",
            downPayment,
            from,
            to,
            room,
            total,
            deposit: total * downPayment,
            balance: total,
            payed: 0,
            createdAt: user.createdAt
        })

        res.status(200).json(book)
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
    getTotalBooksByUser,
    getTotalBooks,
    populateCompleted,
    populateNoShow,
    populateCancelled,
    populateExpired
}