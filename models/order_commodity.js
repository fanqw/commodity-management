const mongoose = require('mongoose');

const orderCommodity = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    commodity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commodity',
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
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
    collection: 'order_commodity'
  }
);

module.exports = mongoose.model('OrderCommodity', orderCommodity);
