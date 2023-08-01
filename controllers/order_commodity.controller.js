const moment = require('moment');
const mongoose = require('mongoose');
const OrderCommodity = require('../models/order_commodity');
const { formatCommodity } = require('./commodity.controller');
const { formatCategory } = require('./category.controller');
const { formatUnit } = require('./unit.controller');

const formatOrderCommodity = orderCommodity => ({
  id: orderCommodity._id,
  count: Number(orderCommodity.count),
  price: Number(orderCommodity.price),
  origin_total_price: Number(orderCommodity.origin_total_price),
  total_price: Number(orderCommodity.total_price),
  total_category_price: Number(orderCommodity.total_category_price),
  total_order_price: Number(orderCommodity.total_order_price),
  desc: orderCommodity.desc,
  unit: orderCommodity.unit && orderCommodity.unit._id ? formatUnit(orderCommodity.unit) : {},
  // eslint-disable-next-line max-len
  category: orderCommodity.category && orderCommodity.category._id ? formatCategory(orderCommodity.category) : {},
  // eslint-disable-next-line max-len
  commodity: orderCommodity.commodity && orderCommodity.commodity._id ? formatCommodity(orderCommodity.commodity) : {},
  create_at: orderCommodity.create_at ? moment(orderCommodity.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: orderCommodity.update_at ? moment(orderCommodity.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  const { orderId } = req.params;
  let orderCommodities = [];
  try {
    orderCommodities = await OrderCommodity.aggregate([
      {
        $match: { order_id: new mongoose.Types.ObjectId(orderId), deleted: false }
      }, {
        $lookup: {
          from: 'commodity',
          localField: 'commodity_id',
          foreignField: '_id',
          as: 'commodity'
        }
      }, {
        $unwind: '$commodity'
      }, {
        $lookup: {
          from: 'category',
          localField: 'commodity.category_id',
          foreignField: '_id',
          as: 'category'
        }
      }, {
        $unwind: '$category'
      }, {
        $lookup: {
          from: 'unit',
          localField: 'commodity.unit_id',
          foreignField: '_id',
          as: 'unit'
        }
      }, {
        $unwind: '$unit'
      }, {
        $addFields: {
          total_price: {
            $round: {
              $multiply: [
                '$price',
                '$count'
              ]
            }
          }
        }
      }, {
        $group: {
          _id: '$order_id',
          total_order_price: { $sum: '$total_price' },
          orderCommodities: { $push: '$$ROOT' }
        }
      }, {
        $unwind: '$orderCommodities'
      },
      {
        $group: {
          _id: '$orderCommodities.category._id',
          total_category_price: { $sum: '$orderCommodities.total_price' },
          categoryResult: { $push: '$$ROOT' }
        }
      }, {
        $unwind: '$categoryResult'
      },
      {
        $addFields: {
          total_category_price: '$total_category_price',
          total_order_price: '$categoryResult.total_order_price',
          _id: '$categoryResult.orderCommodities._id',
          order_id: '$categoryResult.orderCommodities.order_id',
          count: '$categoryResult.orderCommodities.count',
          price: '$categoryResult.orderCommodities.price',
          total_price: '$categoryResult.orderCommodities.total_price',
          origin_total_price: '$categoryResult.orderCommodities.origin.total_price',
          desc: '$categoryResult.orderCommodities.desc',
          create_at: '$categoryResult.orderCommodities.create_at',
          update_at: '$categoryResult.orderCommodities.update_at',
          commodity: '$categoryResult.orderCommodities.commodity',
          category: '$categoryResult.orderCommodities.category',
          unit: '$categoryResult.orderCommodities.unit'
        }
      }, {
        $project: {
          categoryResult: 0
        }
      }, {
        $addFields: {
          origin_total_price: {
            $multiply: [
              '$price',
              '$count'
            ]
          }
        }
      }, {
        $sort: { 'category.name': 1 }
      }
    ]);
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
  // let fidOrderCommodityById;
  // try {
  // eslint-disable-next-line max-len, max-len
  //   fidOrderCommodityById = await OrderCommodity.findOne({ order_id, commodity_id, deleted: false });
  // } catch (error) {
  //   error.message = '获取订单商品信息失败，请稍后再试';
  //   return next(error);
  // }
  // if (fidOrderCommodityById && fidOrderCommodityById.id) {
  //   return next(new Error('该订单商品已存在'));
  // }
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
  // let findOrderCommodityByCommodityId;
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

  // if (commodity_id) {
  //   try {
  //     findOrderCommodityByCommodityId = await OrderCommodity.findOne({
  //       order_id: findOrderCommodityById.order_id._id,
  //       commodity_id,
  //       deleted: false
  //     });
  //   } catch (error) {
  //     error.message = '获取订单商品信息失败，请稍后再试';
  //     return next(error);
  //   }
  //   // eslint-disable-next-line max-len
  //   if (findOrderCommodityByCommodityId && findOrderCommodityByCommodityId.id !== orderCommodityId) {
  //     return next(new Error('该订单商品已存在'));
  //   }
  //   findOrderCommodityById.commodity_id = commodity_id;
  // }
  findOrderCommodityById.commodity_id = commodity_id || findOrderCommodityById.commodity_id;
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

const removeOrderCommodityById = async (req, res, next) => {
  const { id } = req.params;
  let orderCommodity = null;
  orderCommodity = await OrderCommodity.findOne({ _id: id, deleted: false });
  if (!orderCommodity) {
    const error = new Error('未找到对应订单商品的信息');
    error.code = 404;
    return next(error);
  }
  orderCommodity.deleted = true;
  orderCommodity.update_at = Date.now();
  try {
    await orderCommodity.save();
  } catch (error) {
    error.message = '删除订单商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '删除订单商品成功');
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
  removeOrderCommodityById,
  remove
};
