const Book = require('../models/bookModel')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
const { startOfMonth, startOfYear, endOfYear } = require('date-fns')
const moment = require('moment-timezone')

const now = moment().tz('Asia/Manila')
const prev = moment().subtract(1, 'year').tz('Asia/Manila')

const getTotalBookPerMonth = async (year) => {
    console.log("🚀 ~ getTotalBookPerMonth ~ year:", year)
    const books = await Book.find({
        createdAt: { $gte: startOfYear(year), $lt: endOfYear(year) },
        status: { $nin: ['pending', 'cancelled', 'expired'] }
    })

    const bookings = Array(12).fill(0)
    books.forEach(book => {
        const month = book.createdAt.getMonth()
        bookings[month] += 1
    })

    return bookings
}

const getAllData = async (_, res) => {
    try {
        const payments = await Payment.find({ createdAt: { $gte: startOfMonth(now) } })

        const revenue = payments.reduce((acc, payment) => {
            return acc + parseFloat(payment.amount)
        }, 0)

        const totalBook = await Book.countDocuments({ status: { $nin: ['pending', 'cancelled', "expired"] }, createdAt: { $gte: startOfMonth(now) } })
        const newUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth(now) } })
        const recentSales = await Payment.find({}).populate({ path: 'userId', populate: 'details' }).sort({ createdAt: -1 }).limit(20)

        const bookings = {
            previousYear: {
                year: new Date(prev).getFullYear(),
                value: await getTotalBookPerMonth(prev)
            },
            currentYear: {
                year: new Date(now).getFullYear(),
                value: await getTotalBookPerMonth(now)
            }
        }

        res.status(200).json({ revenue, totalBook, newUsers, recentSales, bookings })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


module.exports = {
    getAllData
}