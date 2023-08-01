const moment = require('moment');
const Commodity = require('../models/commodity');
const OrderCommodity = require('../models/order_commodity');
const { formatCategory } = require('./category.controller');
const { formatUnit } = require('./unit.controller');

const formatCommodity = commodity => ({
  id: commodity._id,
  name: commodity.name,
  desc: commodity.desc,
  category: commodity.category_id ? formatCategory(commodity.category_id) : {},
  unit: commodity.unit_id ? formatUnit(commodity.unit_id) : {},
  create_at: commodity.create_at ? moment(commodity.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: commodity.update_at ? moment(commodity.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let commodities = [];
  try {
    commodities = await Commodity.find({ deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (error) {
    error.message = '获取商品列表失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(commodities.map(formatCommodity));
};

const findById = async (req, res, next) => {
  const commodityId = req.params.id;
  let commodity = {};
  try {
    commodity = await Commodity.findOne({ _id: commodityId, deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (error) {
    error.message = '获取商品信息失败，请稍后再试';
    return next(error);
  }
  if (!commodity) {
    const error = Error('未找到对应商品的信息');
    error.code = 404;
    return next(error);
  }
  res.sendResponse(formatCommodity(commodity));
};

const create = async (req, res, next) => {
  const { name, unit_id, category_id, desc } = req.body;
  // let findCommodityById;
  // try {
  //   findCommodityById = await Commodity.findOne({ name, deleted: false });
  // } catch (error) {
  //   error.message = '获取商品信息失败，请稍后再试';
  //   return next(error);
  // }
  // if (findCommodityById && findCommodityById.id) {
  //   const error = new Error('商品名称已存在');
  //   return next(error);
  // }
  const commodity = new Commodity({
    name,
    category_id,
    unit_id,
    desc,
    deleted: false
  });
  try {
    await commodity.save();
  } catch (error) {
    error.message = '创建商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatCommodity(commodity), 200, '创建商品成功');
};

const updateById = async (req, res, next) => {
  const commodityId = req.params.id;
  const { name, unit_id, category_id, desc } = req.body;
  let commodityById;
  // let commodityByName;
  try {
    commodityById = await Commodity.findOne({ _id: commodityId, deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (error) {
    error.message = '获取商品信息失败，请稍后再试';
    return next(error);
  }
  if (!commodityById) {
    const error = new Error('未找到对应商品的信息');
    error.code = 404;
    return next(error);
  }

  // if (name) {
  //   try {
  //     commodityByName = await Commodity.findOne({ name, deleted: false });
  //   } catch (error) {
  //     error.message = '获取商品信息失败，请稍后再试';
  //     return next(error);
  //   }
  //   if (commodityByName && commodityByName.id !== commodityId) {
  //     return next(new Error('商品名称已存在'));
  //   }
  //   commodityById.name = name;
  // }
  commodityById.name = name;
  commodityById.unit_id = unit_id || commodityById.unit_id;
  commodityById.category_id = category_id || commodityById.category_id;
  commodityById.desc = desc || commodityById.desc;
  commodityById.update_at = Date.now();
  try {
    await commodityById.save();
  } catch (error) {
    error.message = '更新商品信息失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatCommodity(commodityById), 200, '更新商品信息成功');
};

const removeCommodityById = async (req, res, next) => {
  const commodityId = req.params.id;
  let commodity = null;
  commodity = await Commodity.findOne({ _id: commodityId, deleted: false });
  if (!commodity) {
    const error = new Error('未找到对应商品的信息');
    error.code = 404;
    return next(error);
  }
  const orderCommodity = OrderCommodity.findOne({ commodity_id: commodityId, deleted: false });
  if (orderCommodity && orderCommodity.id) {
    return next(new Error('该商品已被订单使用，无法删除'));
  }
  commodity.deleted = true;
  commodity.update_at = Date.now();
  try {
    await commodity.save();
  } catch (error) {
    error.message = '删除商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '删除商品成功');
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    ids.forEach(async id => {
      await removeCommodityById(id);
    });
  } catch (error) {
    error.message = '删除商品失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '删除商品成功');
};

module.exports = {
  formatCommodity,
  findAll,
  findById,
  create,
  updateById,
  removeCommodityById,
  remove
};
