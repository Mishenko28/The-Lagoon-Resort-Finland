const Book = require('../models/bookModel')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
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

    const start = new Date(day)
    start.setHours(0, 0, 0, 0)

    const end = new Date(day)
    end.setHours(23, 59, 59, 999)


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
    let start = startDate
    let end = endDate

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

    const start = new Date(month)
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(month)
    end.setMonth(end.getMonth() + 1)
    end.setHours(23, 59, 59, 999)

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

    const start = new Date(year)
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(year)
    end.setMonth(11, 31)
    end.setHours(23, 59, 59, 999)

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