const OrderCommodity = require('../models/order_commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');
const { formatOrder } = require('./order.controller');
const { formatCommodity } = require('./commodity.controller');

const formatOrderCommodity = orderCommodity => ({
  id: orderCommodity._id,
  count: commodity.count,
  price: commodity.price,
  desc: commodity.desc,
  order: formatOrder(orderCommodity.order_id),
  commodity: formatCommodity(orderCommodity.commodity_id),
  create_at: commodity.create_at ? moment(commodity.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: commodity.update_at ? moment(commodity.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  const orderId = req.params.id;
  let orderCommodities;
  try {
    orderCommodities = await OrderCommodity.find({ _id: orderId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取订单商品列表失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(orderCommodities.map(formatOrderCommodity));
};

const findById = async (req, res, next) => {
  const orderCommodityId = req.params.id;
  let orderCommodity;
  try {
    orderCommodity = await OrderCommodity.findOne({ _id: orderCommodityId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取订单商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!orderCommodity) {
    const error = new HttpError('未找到对应订单商品的信息。', 404);
    return next(error);
  }
  res.status(200).json(formatOrderCommodity(orderCommodity));
};

const create = async (req, res, next) => {
  const { order_id, commodity_id, count, price, desc } = req.body;
  let orderCommodity;
  try {
    orderCommodity = await OrderCommodity.findOne({ order_id, commodity_id, deleted: false });
  } catch (err) {
    const error = new HttpError('获取订单商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (orderCommodity) {
    const error = new HttpError('该订单商品已存在。', 500);
    return next(error);
  }
  const newOrderCommodity = new OrderCommodity({
    order_id,
    commodity_id,
    count,
    price,
    desc,
    deleted: false
  });
  try {
    await newOrderCommodity.save();
  } catch (err) {
    const error = new HttpError('创建订单商品失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatOrderCommodity(newOrderCommodity));
};

const updateById = async (req, res, next) => {
  const orderCommodityId = req.params.id;
  const { commodity_id, count, price, desc } = req.body;
  let orderCommodityById;
  let orderCommodityByCommodityId;
  try {
    orderCommodityById = await OrderCommodity.findOne({ _id: orderCommodityId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取订单商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!orderCommodityById) {
    const error = new HttpError('未找到对应订单商品的信息。', 404);
    return next(error);
  }

  if (commodity_id) {
    try {
      orderCommodityByCommodityId = await OrderCommodity.findOne({
        order_id: orderCommodityById.order_id._id,
        commodity_id,
        deleted: false
      });
    } catch (err) {
      const error = new HttpError('获取订单商品信息失败，请稍后再试。', 500);
      return next(error);
    }
    if (orderCommodityByCommodityId && orderCommodityByCommodityId._id.toString() !== orderCommodityId) {
      const error = new HttpError('该订单商品已存在。', 500);
      return next(error);
    }
    orderCommodityById.commodity_id = commodity_id;
  }
  orderCommodityById.count = count || orderCommodityById.count;
  orderCommodityById.price = price || orderCommodityById.price;
  orderCommodityById.desc = desc || orderCommodityById.desc;
  orderCommodityById.update_at = Date.now();
  try {
    await orderCommodityById.save();
  } catch (err) {
    const error = new HttpError('更新订单商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatOrderCommodity(orderCommodityById));
};

const removeOrderCommodityById = async id => {
  const orderCommodity = await OrderCommodity.findOne({ _id: id, deleted: false });
  if (!orderCommodity) {
    throw new Error('未找到对应订单商品的信息。');
  }
  orderCommodity.deleted = true;
  orderCommodity.update_at = Date.now();
  try {
    await orderCommodity.save();
  } catch (err) {
    throw new Error('删除订单商品失败，请稍后再试。');
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await removeOrderCommodityById(id);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: '删除订单商品成功。' });
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  remove
};
