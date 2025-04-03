const Book = require('../models/bookModel')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
const UserPersonalData = require('../models/userPersonalDataModel')

const now = new Date()
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

const getTotalBookPerMonth = async (year) => {
    const books = await Book.find({
        createdAt: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) },
        status: { $nin: ['pending', 'cancelled'] }
    })

    const bookings = Array(12).fill(0)
    books.forEach(book => {
        const month = book.createdAt.getMonth()
        bookings[month] += 1
    })

    return bookings
}

const randomArrayofNumber = () => {
    const array = []

    for (let i = 0; i < 12; i++) {
        array.push(Math.floor(Math.random() * (30 - 10) + 10))
    }

    return array
}

const getAllData = async (_, res) => {
    try {
        const payments = await Payment.find({ createdAt: { $gte: startOfMonth } })

        const revenue = payments.reduce((acc, payment) => {
            return acc + parseFloat(payment.amount)
        }, 0)

        const totalBook = await Book.countDocuments({ status: { $nin: ['pending', 'cancelled'] }, createdAt: { $gte: startOfMonth } })
        const newUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth } })
        let recentSales = await Payment.find({}).populate('userId').sort({ createdAt: -1 }).limit(10)

        recentSales = await Promise.all(recentSales.map(async payment => {
            payment.toObject()
            const { name, img } = await UserPersonalData.findOne({ email: payment.userId.email })

            return {
                _id: payment._id,
                name,
                img,
                email: payment.userId.email,
                payed: payment.amount
            }
        }))

        const bookings = {
            previousYear: {
                year: now.getFullYear() - 1,
                value: await getTotalBookPerMonth(now.getFullYear() - 1)
            },
            currentYear: {
                year: now.getFullYear(),
                value: await getTotalBookPerMonth(now.getFullYear())
            }
        }

        res.status(200).json({ revenue, totalBook, newUsers, recentSales, bookings })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getAllData
}