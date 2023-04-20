const moment = require('moment');
const OrderCommodity = require('../models/order_commodity');
const { formatOrder } = require('./order.controller');
const { formatCommodity } = require('./commodity.controller');

const formatOrderCommodity = orderCommodity => ({
  id: orderCommodity._id,
  count: orderCommodity.count,
  price: orderCommodity.price,
  desc: orderCommodity.desc,
  order: orderCommodity.order_id ? formatOrder(orderCommodity.order_id) : {},
  commodity: orderCommodity.commodity_id ? formatCommodity(orderCommodity.commodity_id) : {},
  create_at: orderCommodity.create_at ? moment(orderCommodity.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: orderCommodity.update_at ? moment(orderCommodity.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  const orderId = req.params.id;
  let orderCommodities = [];
  try {
    orderCommodities = await OrderCommodity.find({ order_id: orderId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc unit_id category_id');
  } catch (error) {
    error.message = '获取订单商品列表失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(orderCommodities.map(formatOrderCommodity));
};

const findById = async (req, res, next) => {
  const orderCommodityId = req.params.id;
  let orderCommodity = {};
  try {
    orderCommodity = await OrderCommodity.findOne({ _id: orderCommodityId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc unit_id category_id');
  } catch (error) {
    error.message = '获取订单商品信息失败，请稍后再试';
    return next(error);
  }
  if (!orderCommodity) {
    const error = new Error('未找到对应订单商品的信息');
    error.code = 404;
    return next(error);
  }
  res.sendResponse(formatOrderCommodity(orderCommodity));
};

const create = async (req, res, next) => {
  const { order_id, commodity_id, count, price, desc } = req.body;
  let fidOrderCommodityById;
  try {
    // eslint-disable-next-line max-len
    fidOrderCommodityById = await OrderCommodity.findOne({ order_id, commodity_id, deleted: false });
  } catch (error) {
    error.message = '获取订单商品信息失败，请稍后再试';
    return next(error);
  }
  if (fidOrderCommodityById) {
    return next(new Error('该订单商品已存在'));
  }
  const orderCommodity = new OrderCommodity({
    order_id,
    commodity_id,
    count,
    price,
    desc,
    deleted: false
  });
  try {
    await orderCommodity.save();
  } catch (error) {
    error.message = '创建订单商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatOrderCommodity(orderCommodity), 200, '创建订单商品成功');
};

const updateById = async (req, res, next) => {
  const orderCommodityId = req.params.id;
  const { commodity_id, count, price, desc } = req.body;
  let findOrderCommodityById;
  let findOrderCommodityByCommodityId;
  try {
    findOrderCommodityById = await OrderCommodity.findOne({ _id: orderCommodityId, deleted: false })
      .populate('order_id', 'name desc')
      .populate('commodity_id', 'name desc unit_id category_id');
  } catch (error) {
    error.message = '获取订单商品信息失败，请稍后再试';
    return next(error);
  }
  if (!findOrderCommodityById) {
    const error = new Error('未找到对应订单商品的信息');
    error.code = 404;
    return next(error);
  }

  if (commodity_id) {
    try {
      findOrderCommodityByCommodityId = await OrderCommodity.findOne({
        order_id: findOrderCommodityById.order_id._id,
        commodity_id,
        deleted: false
      });
    } catch (error) {
      error.message = '获取订单商品信息失败，请稍后再试';
      return next(error);
    }
    // eslint-disable-next-line max-len
    if (findOrderCommodityByCommodityId && findOrderCommodityByCommodityId._id.toString() !== orderCommodityId) {
      return next(new Error('该订单商品已存在'));
    }
    findOrderCommodityById.commodity_id = commodity_id;
  }
  findOrderCommodityById.count = count || findOrderCommodityById.count;
  findOrderCommodityById.price = price || findOrderCommodityById.price;
  findOrderCommodityById.desc = desc || findOrderCommodityById.desc;
  findOrderCommodityById.update_at = Date.now();
  try {
    await findOrderCommodityById.save();
  } catch (error) {
    error.message = '更新订单商品信息失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatOrderCommodity(findOrderCommodityById), 200, '更新订单商品信息成功');
};

const removeOrderCommodityById = async id => {
  let orderCommodity = null;
  orderCommodity = await OrderCommodity.findOne({ _id: id, deleted: false });
  if (!orderCommodity) {
    const error = new Error('未找到对应订单商品的信息');
    error.code = 404;
    throw error;
  }
  orderCommodity.deleted = true;
  orderCommodity.update_at = Date.now();
  try {
    await orderCommodity.save();
  } catch (error) {
    error.message = '删除订单商品失败，请稍后再试';
    throw error;
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    ids.forEach(async id => {
      await removeOrderCommodityById(id);
    });
  } catch (error) {
    error.message = '删除订单商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '删除订单商品成功');
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  remove
};
