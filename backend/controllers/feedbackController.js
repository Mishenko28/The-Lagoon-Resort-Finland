const Feedback = require('../models/feedbackModel')
const User = require('../models/userModel')
const Book = require('../models/bookModel')
const { Actions, ActivityLog } = require('../models/activityLogModel')

const createFeedback = async (req, res) => {
    const { email, star, feedback, anonymous, bookId } = req.body

    try {
        const { _id } = await User.findOne({ email })

        const feedbackData = await Feedback.create({ user: _id, star, feedback, anonymous })
        await Book.findOneAndUpdate({ _id: bookId }, { feedback: feedbackData._id })

        res.status(200).json(feedbackData)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getNewFeedback = async (_, res) => {
    try {
        const feedbacks = await Feedback.find({ new: true }).populate({ path: 'user', populate: 'details' })

        res.status(200).json(feedbacks)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const approvedFeedback = async (req, res) => {
    const { _id, adminEmail } = req.body

    try {
        const feedback = await Feedback.findOneAndUpdate({ _id }, { new: false, approved: true }, { new: true }).populate('user', 'email')

        await ActivityLog.create({ adminEmail, action: [Actions.FEEDBACK], activity: `Approved feedback of ${feedback.user.email}` })

        res.status(200).json(feedback)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const rejectFeedback = async (req, res) => {
    const { _id, adminEmail } = req.body

    try {
        const feedback = await Feedback.findOneAndUpdate({ _id }, { new: false }, { new: true }).populate('user', 'email')

        await ActivityLog.create({ adminEmail, action: [Actions.FEEDBACK], activity: `Approved feedback of ${feedback.user.email}` })

        res.status(200).json(feedback)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getFeedback = async (_, res) => {
    try {
        const feedbacks = await Feedback.find({ approved: true }).populate({ path: 'user', populate: 'details' }).sort({ createdAt: -1 }).limit(10)

        res.status(200).json(feedbacks)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


module.exports = {
    createFeedback,
    getNewFeedback,
    approvedFeedback,
    rejectFeedback,
    getFeedback
}