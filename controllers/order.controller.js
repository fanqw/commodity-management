const Order = require('../models/order');
const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');

const formatOrder = order => ({
  id: order._id,
  name: order.name,
  desc: order.desc,
  create_at: order.create_at ? moment(order.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: order.update_at ? moment(order.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find({ deleted: false });
  } catch (err) {
    const error = new HttpError('获取订单列表失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(orders.map(formatOrder));
};

const findById = async (req, res, next) => {
  const orderId = req.params.id;
  let order;
  try {
    order = await Order.findOne({ _id: orderId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取订单信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!order) {
    const error = new HttpError('未找到对应订单的信息。', 404);
    return next(error);
  }
  res.status(200).json(formatOrder(order));
};

const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let order;
  try {
    order = await Order.findOne({ name, deleted: false });
  } catch (err) {
    const error = new HttpError('获取订单信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (order) {
    const error = new HttpError('订单名称已存在。', 500);
    return next(error);
  }
  const newOrder = new Order({
    name,
    desc,
    deleted: false
  });
  try {
    await newOrder.save();
  } catch (err) {
    const error = new HttpError('新建订单失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatOrder(newOrder));
};

const updateById = async (req, res, next) => {
  const orderId = req.params.id;
  const { name, desc } = req.body;
  let orderById;
  let orderByName;
  try {
    orderById = await Order.findOne({ _id: orderId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取订单信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!orderById) {
    const error = new HttpError('未找到对应订单的信息。', 404);
    return next(error);
  }
  if (name) {
    try {
      orderByName = await Order.findOne({ name, deleted: false });
    } catch (err) {
      const error = new HttpError('获取订单信息失败，请稍后再试。', 500);
      return next(error);
    }

    if (orderByName && orderByName._id != orderId) {
      const error = new HttpError('订单名称已存在。', 500);
      return next(error);
    }
    orderById.name = name;
  }
  orderById.desc = desc || orderById.desc;
  orderById.update_at = Date.now();
  try {
    await orderById.save();
  } catch (err) {
    const error = new HttpError('更新订单失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatOrder(orderById));
};

const removeOrderById = async orderId => {
  const order = await Order.findOne({ _id: orderId, deleted: false });
  if (!order) {
    throw new Error('未找到对应订单的信息。');
  }
  const commodity = await Commodity.findOne({ order_id: orderId, deleted: false });
  if (commodity) {
    throw new Error('该订单下存在商品，无法删除。');
  }
  order.deleted = true;
  order.update_at = Date.now();
  try {
    await order.save();
  } catch (err) {
    throw new Error('删除订单失败，请稍后再试。');
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await removeOrderById(id);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: '订单删除成功' });
};

module.exports = {
  formatOrder,
  findAll,
  findById,
  create,
  updateById,
  remove
};
