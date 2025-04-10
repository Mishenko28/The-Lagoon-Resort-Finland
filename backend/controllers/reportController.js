const Book = require('../models/bookModel')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
const UserPersonalData = require('../models/userPersonalDataModel')
const { Actions, ActivityLog } = require('../models/activityLogModel')

const status = [
    "pending",
    "confirmed",
    "ongoing",
    "completed",
    "cancelled",
    "noshow",
    "expired"
]

const getDailyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { day } = req.query

    const start = new Date(day)
    start.setHours(0, 0, 0, 0)

    const end = new Date(day)
    end.setHours(23, 59, 59, 999)


    try {
        const newBooksTotal = await Book.countDocuments({ confirmedDate: { $gte: start, $lte: end } })
        const revenue = (await Payment.find({ createdAt: { $gte: start, $lte: end } })).reduce((acc, payment) => {
            return acc + parseInt(payment.amount)
        }, 0)

        let checkIn = await Book.find({ status: "confirmed", from: { $gte: start, $lte: end } }).lean()
        let checkOut = await Book.find({ status: "ongoing", to: { $gte: start, $lte: end } }).lean()

        for (const book of checkIn) {
            const { email } = await User.findOne({ _id: book.userId }).lean()
            const user = await UserPersonalData.findOne({ email }).lean()

            book.user = user
        }

        for (const book of checkOut) {
            const { email } = await User.findOne({ _id: book.userId }).lean()
            const user = await UserPersonalData.findOne({ email }).lean()

            book.user = user
        }

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Daily Report",
        })

        res.status(200).json({ newBooksTotal, revenue, checkIn, checkOut })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getWeeklyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { start, end } = req.query

    try {
        const totalBookings = await Book.countDocuments({ confirmedDate: { $gte: new Date(start).setHours(0, 0, 0, 0), $lte: new Date(end).setHours(23, 59, 59, 999) } })
        const revenue = (await Payment.find({ createdAt: { $gte: new Date(start).setHours(0, 0, 0, 0), $lte: new Date(end).setHours(23, 59, 59, 999) } })).reduce((acc, payment) => {
            return acc + parseInt(payment.amount)
        }, 0)

        const totalPerStatus = await Promise.all(status.map(async (status) => {
            const total = await Book.countDocuments({ status, from: { $gte: new Date(start).setHours(0, 0, 0, 0), $lte: new Date(end).setHours(23, 59, 59, 999) } })
            return { status, total }
        }))

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Weekly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getMonthlyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { month } = req.query

    const start = new Date(month)
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(month)
    end.setMonth(end.getMonth() + 1)
    end.setHours(23, 59, 59, 999)

    try {
        const totalBookings = await Book.countDocuments({ confirmedDate: { $gte: start, $lte: end } })
        const revenue = (await Payment.find({ createdAt: { $gte: start, $lte: end } })).reduce((acc, payment) => {
            return acc + parseInt(payment.amount)
        }, 0)

        const totalPerStatus = await Promise.all(status.map(async (status) => {
            const total = await Book.countDocuments({ status, from: { $gte: start, $lte: end } })
            return { status, total }
        }))

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Monthly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getYearlyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { year } = req.query

    const start = new Date(year)
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(year)
    end.setMonth(11, 31)
    end.setHours(23, 59, 59, 999)

    try {
        const totalBookings = await Book.countDocuments({ confirmedDate: { $gte: start, $lte: end } })
        const revenue = (await Payment.find({ createdAt: { $gte: start, $lte: end } })).reduce((acc, payment) => {
            return acc + parseInt(payment.amount)
        }, 0)

        const totalPerStatus = await Promise.all(status.map(async (status) => {
            const total = await Book.countDocuments({ status, from: { $gte: start, $lte: end } })
            return { status, total }
        }))

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Yearly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getYearlyReport
}