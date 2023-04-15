const mongoose = require('mongoose');

const order = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    desc: String,
    create_at: {
      type: Date,
      default: Date.now
    },
    update_at: {
      type: Date,
      default: Date.now
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'order'
  }
);

module.exports = mongoose.model('Order', order);
