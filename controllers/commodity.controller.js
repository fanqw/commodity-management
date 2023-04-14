const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');
const { formatCategory } = require('./category.controller');
const { formatUnit } = require('./unit.controller');

const formatCommodity = commodity => ({
  id: commodity._id,
  name: commodity.name,
  count: commodity.count,
  price: commodity.price,
  desc: commodity.desc,
  category: formatCategory(commodity.category_id),
  unit: formatUnit(commodity.unit_id),
  create_at: moment(commodity.create_at).format('YYYY-MM-DD HH:MM:SS'),
  update_at: moment(commodity.update_at).format('YYYY-MM-DD HH:MM:SS')
});

/**
 * 获取所有商品
 */
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
  res.json(commodities.map(formatCommodity));
};

/**
 * 根据商品 ID 获取商品
 */
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
  res.json(formatCommodity(commodity));
};

/**
 * 新建商品
 */
const create = async (req, res, next) => {
  const { name, count, price, unit_id, category_id, desc } = req.body;
  const commodity = new Commodity({
    name,
    count,
    price,
    category_id,
    unit_id,
    desc,
    deleted: false
  });
  try {
    const result = await commodity.save();
  } catch (err) {
    const error = new HttpError('创建商品失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatCommodity(commodity));
};

/**
 * 更新商品
 */
const updateById = async (req, res, next) => {
  const commodityId = req.params.id;
  const { name, count, price, unit_id, category_id, desc } = req.body;
  let commodity;
  try {
    commodity = await Commodity.findById(commodityId)
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
  commodity.name = name || commodity.name;
  commodity.count = count || commodity.count;
  commodity.price = price || commodity.price;
  commodity.unit_id = unit_id || commodity.unit_id;
  commodity.category_id = category_id || commodity.category_id;
  commodity.desc = desc || commodity.desc;
  commodity.update_at = Date.now();
  try {
    await commodity.save();
  } catch (err) {
    const error = new HttpError('更新商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatCommodity(commodity));
};

/**
 * 删除商品
 */
const deleteById = async (req, res, next) => {
  const commodityId = req.params.id;
  let commodity;
  try {
    commodity = await Commodity.findOne({ _id: commodityId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!commodity) {
    const error = new HttpError('未找到对应商品的信息。', 404);
    return next(error);
  }
  commodity.deleted = true;
  commodity.update_at = Date.now();
  try {
    await commodity.save();
  } catch (err) {
    const error = new HttpError('删除商品失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json({ message: '删除商品成功。' });
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
