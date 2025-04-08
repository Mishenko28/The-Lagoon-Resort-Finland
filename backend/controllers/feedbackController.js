const Feedback = require('../models/feedbackModel')
const User = require('../models/userModel')
const Book = require('../models/bookModel')
const UserPersonalData = require('../models/userPersonalDataModel')

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
        const feedbacks = await Feedback.find({ new: true }).populate('user', 'email').lean()

        for (const feedback of feedbacks) {
            const { name, img } = await UserPersonalData.findOne({ email: feedback.user.email }).lean()

            feedback.user.name = name
            feedback.user.img = img
        }

        res.status(200).json(feedbacks)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const approvedFeedback = async (req, res) => {
    const { _id } = req.body

    try {
        const feedback = await Feedback.findOneAndUpdate({ _id }, { new: false, approved: true }, { new: true })

        res.status(200).json(feedback)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const rejectFeedback = async (req, res) => {
    const { _id } = req.body

    try {
        const feedback = await Feedback.findOneAndUpdate({ _id }, { new: false }, { new: true })

        res.status(200).json(feedback)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


module.exports = {
    createFeedback,
    getNewFeedback,
    approvedFeedback,
    rejectFeedback
}