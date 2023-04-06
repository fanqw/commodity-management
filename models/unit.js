const mongoose = require('mongoose')

const unit = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    desc: String,
    create_time: Date,
    update_time: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Unit', unit)