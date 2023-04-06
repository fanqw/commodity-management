const mongoose = require('mongoose')

const commodity = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    unit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
    },
    desc: String,
    create_time: Date,
    update_time: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Commodity', commodity)