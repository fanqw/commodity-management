const Commodity = require('../models/commodity');
const OrderCommodity = require('../models/order_commodity');
const HttpError = require('../utils/HttpError');
const { formatCategory } = require('./category.controller');
const { formatUnit } = require('./unit.controller');
const moment = require('moment');

const formatCommodity = commodity => ({
  id: commodity._id,
  name: commodity.name,
  desc: commodity.desc,
  category: formatCategory(commodity.category_id),
  unit: formatUnit(commodity.unit_id),
  create_at: commodity.create_at ? moment(commodity.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: commodity.update_at ? moment(commodity.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let commodities;
  try {
    commodities = await Commodity.find({ deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取商品列表失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(commodities.map(formatCommodity));
};

const findById = async (req, res, next) => {
  const commodityId = req.params.id;
  let commodity;
  try {
    commodity = await Commodity.findOne({ _id: commodityId, deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!commodity) {
    const error = new HttpError('未找到对应商品的信息。', 404);
    return next(error);
  }
  res.status(200).json(formatCommodity(commodity));
};

const create = async (req, res, next) => {
  const { name, unit_id, category_id, desc } = req.body;
  let commodity;
  try {
    commodity = await Commodity.findOne({ name, deleted: false });
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (commodity) {
    const error = new HttpError('商品名称已存在。', 500);
    return next(error);
  }
  const newCommodity = new Commodity({
    name,
    category_id,
    unit_id,
    desc,
    deleted: false
  });
  try {
    await newCommodity.save();
  } catch (err) {
    const error = new HttpError('创建商品失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatCommodity(newCommodity));
};

const updateById = async (req, res, next) => {
  const commodityId = req.params.id;
  const { name, unit_id, category_id, desc } = req.body;
  let commodityById;
  let commodityByName;
  try {
    commodityById = await Commodity.findOne({ _id: commodityId, deleted: false })
      .populate('category_id', 'name desc')
      .populate('unit_id', 'name desc');
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!commodityById) {
    const error = new HttpError('未找到对应商品的信息。', 404);
    return next(error);
  }

  if (name) {
    try {
      commodityByName = await Commodity.findOne({ name, deleted: false });
    } catch (err) {
      const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
      return next(error);
    }
    if (commodityByName && commodityByName._id !== commodityId) {
      const error = new HttpError('商品名称已存在。', 500);
      return next(error);
    }
    commodityById.name = name;
  }
  commodityById.unit_id = unit_id || commodityById.unit_id;
  commodityById.category_id = category_id || commodityById.category_id;
  commodityById.desc = desc || commodityById.desc;
  commodityById.update_at = Date.now();
  try {
    await commodityById.save();
  } catch (err) {
    const error = new HttpError('更新商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatCommodity(commodityById));
};

const removeCommodityById = async commodityId => {
  const commodity = await Commodity.findOne({ _id: commodityId, deleted: false });
  if (!commodity) {
    throw new Error('未找到对应商品的信息。');
  }
  const orderCommodity = OrderCommodity.findOne({ commodity_id: commodityId, deleted: false });
  if (orderCommodity) {
    throw new Error('该商品已被订单使用，无法删除。');
  }
  commodity.deleted = true;
  commodity.update_at = Date.now();
  try {
    await commodity.save();
  } catch (err) {
    throw new Error('删除商品失败，请稍后再试。');
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await removeCommodityById(id);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: '删除商品成功。' });
};

module.exports = {
  formatCommodity,
  findAll,
  findById,
  create,
  updateById,
  remove
};
