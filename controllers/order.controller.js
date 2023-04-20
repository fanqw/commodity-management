const moment = require('moment');
const Order = require('../models/order');
const OrderCommodity = require('../models/order_commodity');

const formatOrder = order => ({
  id: order._id,
  name: order.name,
  desc: order.desc,
  create_at: order.create_at ? moment(order.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: order.update_at ? moment(order.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let orders = [];
  try {
    orders = await Order.find({ deleted: false });
  } catch (error) {
    error.message = '获取订单列表失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(orders.map(formatOrder));
};

const findById = async (req, res, next) => {
  const orderId = req.params.id;
  let order = {};
  try {
    order = await Order.findOne({ _id: orderId, deleted: false });
  } catch (error) {
    error.message = '获取订单信息失败，请稍后再试';
    return next(error);
  }
  if (!order) {
    const error = new Error('未找到对应订单的信息');
    error.code = 404;
    return next(error);
  }
  res.sendResponse(formatOrder(order));
};

const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let findOrderById;
  try {
    findOrderById = await Order.findOne({ name, deleted: false });
  } catch (error) {
    error.message = '获取订单信息失败，请稍后再试';
    return next(error);
  }
  if (findOrderById) {
    return next(new Error('订单名称已存在'));
  }
  const order = new Order({
    name,
    desc,
    deleted: false
  });
  try {
    await order.save();
  } catch (error) {
    error.message = '新建订单失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatOrder(order), 200, '新建订单成功');
};

const updateById = async (req, res, next) => {
  const orderId = req.params.id;
  const { name, desc } = req.body;
  let findOrderById;
  let findOrderByName;
  try {
    findOrderById = await Order.findOne({ _id: orderId, deleted: false });
  } catch (error) {
    error.message = '获取订单信息失败，请稍后再试';
    return next(error);
  }
  if (!findOrderById) {
    const error = new Error('未找到对应订单的信息');
    error.code = 404;
    return next(error);
  }
  if (name) {
    try {
      findOrderByName = await Order.findOne({ name, deleted: false });
    } catch (error) {
      error.message = '获取订单信息失败，请稍后再试';
      return next(error);
    }

    if (findOrderByName && findOrderByName._id.toString() !== orderId) {
      return next(new Error('订单名称已存在'));
    }
    findOrderById.name = name;
  }
  findOrderById.desc = desc || findOrderById.desc;
  findOrderById.update_at = Date.now();
  try {
    await findOrderById.save();
  } catch (error) {
    error.message = '更新订单失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatOrder(findOrderById), 200, '更新订单成功');
};

const removeOrderById = async orderId => {
  let order = null;
  order = await Order.findOne({ _id: orderId, deleted: false });
  if (!order) {
    const error = new Error('未找到对应订单的信息');
    error.code = 404;
    throw error;
  }
  const orderCommodity = await OrderCommodity.findOne({ order_id: orderId, deleted: false });
  if (orderCommodity) {
    throw new Error('该订单下存在商品，无法删除。');
  }
  order.deleted = true;
  order.update_at = Date.now();
  try {
    await order.save();
  } catch (error) {
    error.message = '删除订单失败，请稍后再试';
    throw error;
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    ids.forEach(async id => {
      await removeOrderById(id);
    });
  } catch (error) {
    error.message = '删除订单失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '订单删除成功');
};

module.exports = {
  formatOrder,
  findAll,
  findById,
  create,
  updateById,
  remove
};
