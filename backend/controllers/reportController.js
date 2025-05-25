const Book = require('../models/bookModel')
const Payment = require('../models/paymentModel')
const { Actions, ActivityLog } = require('../models/activityLogModel')
const moment = require('moment-timezone')

const TIMEZONE = 'Asia/Manila'

const status = [
    "pending",
    "confirmed",
    "ongoing",
    "completed",
    "cancelled",
    "noshow",
    "expired"
]

const getReport = async (start, end) => {
    const payments = await Payment.find({ createdAt: { $gte: start, $lte: end } }).populate({ path: "userId", populate: 'details' })
    const revenue = payments.reduce((acc, payment) => {
        return acc + parseInt(payment.amount)
    }, 0)

    const totalPerStatus = await Promise.all(status.map(async (status) => {
        let totalBooks

        if (status === "pending") {
            totalBooks = await Book.countDocuments({ status, createdAt: { $gte: start, $lte: end } })
        }

        if (status === "confirmed") {
            totalBooks = await Book.countDocuments({ status, confirmedDate: { $gte: start, $lte: end } })
        }

        if (status === "ongoing") {
            totalBooks = await Book.countDocuments({ status, from: { $gte: start, $lte: end } })
        }

        if (status === "completed") {
            totalBooks = await Book.countDocuments({ status, to: { $gte: start, $lte: end } })
        }

        if (status === "cancelled") {
            totalBooks = await Book.countDocuments({ status, cancelledDate: { $gte: start, $lte: end } })
        }

        if (status === "noshow") {
            totalBooks = await Book.countDocuments({ status, to: { $gte: start, $lte: end } })
        }

        if (status === "expired") {
            totalBooks = await Book.countDocuments({ status, from: { $gte: start, $lte: end } })
        }

        const totalAmount = (await Book.find({ status, to: { $gte: start, $lte: end } })).reduce((acc, book) => acc + parseInt(book.payed), 0)

        return { status, totalBooks, totalAmount }
    }))

    return { payments, revenue, totalPerStatus }
}

const getDailyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { day } = req.query

    const start = moment(day).tz(TIMEZONE).startOf('day')
    const end = moment(day).tz(TIMEZONE).endOf('day')

    try {
        const { payments, revenue, totalPerStatus } = await getReport(start, end)
        const newBooksTotal = await Book.countDocuments({ confirmedDate: { $gte: start, $lte: end } })

        const checkIn = await Book.find({ status: "ongoing", from: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' })
        const checkOut = await Book.find({ status: "ongoing", to: { $gte: start, $lte: end } }).populate({ path: 'user', populate: 'details' })

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Generate a daily Report",
        })

        res.status(200).json({ newBooksTotal, revenue, checkIn, checkOut, totalPerStatus, payments })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getWeeklyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { start: startDate, end: endDate } = req.query

    const start = moment(startDate).tz(TIMEZONE).startOf('week')
    const end = moment(endDate).tz(TIMEZONE).endOf('week')

    try {
        const { payments, revenue, totalPerStatus } = await getReport(start, end)

        const totalBookings = totalPerStatus.reduce((acc, status) => {
            return acc + status.totalBooks
        }, 0)

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Generate a weekly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus, payments })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getMonthlyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { month } = req.query

    const start = moment(month).tz(TIMEZONE).startOf('month')
    const end = moment(month).tz(TIMEZONE).endOf('month')

    try {
        const { payments, revenue, totalPerStatus } = await getReport(start, end)

        const totalBookings = totalPerStatus.reduce((acc, status) => {
            return acc + status.totalBooks
        }, 0)

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Generate a monthly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus, payments })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getYearlyReport = async (req, res) => {
    const { adminEmail } = req.body
    const { year } = req.query

    const start = moment(year).tz(TIMEZONE).startOf('year')
    const end = moment(year).tz(TIMEZONE).endOf('year')

    try {
        const { payments, revenue, totalPerStatus } = await getReport(start, end)

        const totalBookings = totalPerStatus.reduce((acc, status) => {
            return acc + status.totalBooks
        }, 0)

        await ActivityLog.create({
            adminEmail,
            action: [Actions.CREATED, Actions.REPORT],
            activity: "Generate a yearly Report",
        })

        res.status(200).json({ totalBookings, revenue, totalPerStatus, payments })
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