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
        required: true
    },
    unit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    desc: String,
    create_at: Date,
    update_at: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'commodity'
})

module.exports = mongoose.model('Commodity', commodity)