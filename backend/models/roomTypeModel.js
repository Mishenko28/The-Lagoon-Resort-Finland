const mongoose = require('mongoose')

const subImgSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RoomType', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    addFeePerPerson: {
        type: Number,
        required: true
    },
    maxPerson: {
        type: Number,
        required: true
    },
    subImg: {
        type: [subImgSchema],
        default: []
    }
}, { timestamps: true }), 'roomTypes')