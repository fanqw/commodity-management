const mongoose = require('mongoose');

const category = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    collection: 'category'
})

module.exports = mongoose.model('Category', category)