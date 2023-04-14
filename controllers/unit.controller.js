const Unit = require('../models/unit');
const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');

const formatUnit = unit => ({
  id: unit._id,
  name: unit.name,
  desc: unit.desc,
  create_at: moment(unit.create_at).format('YYYY-MM-DD HH:MM:SS'),
  update_at: moment(unit.update_at).format('YYYY-MM-DD HH:MM:SS')
});

/**
 * 获取所有单位
 */
const findAll = async (req, res, next) => {
  let units;
  try {
    units = await Unit.find({ deleted: false });
  } catch (err) {
    const error = new HttpError('获取单位列表失败，请稍后再试。', 500);
    return next(error);
  }

  res.json(units.map(formatUnit));
};

/**
 * 根据单位 ID 获取单位
 */
const findById = async (req, res, next) => {
  const unitId = req.params.id;
  let unit;
  try {
    unit = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取单位信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!unit) {
    const error = new HttpError('未找到对应单位的信息。', 404);
    return next(error);
  }
  res.json(formatUnit(unit));
};

/**
 * 新建单位
 */
const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let unit;
  try {
    unit = await Unit.findOne({ name, deleted: false });
  } catch (err) {
    const error = new HttpError('获取单位信息失败，请稍后再试。', 500);
    return next(error);
  }

  if (unit) {
    const error = new HttpError('单位名称已存在。', 500);
    return next(error);
  }

  unit = new Unit({
    name,
    desc,
    deleted: false
  });
  try {
    await unit.save();
  } catch (err) {
    const error = new HttpError('创建单位失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatUnit(unit));
};

/**
 * 更新单位
 */
const updateById = async (req, res, next) => {
  const unitId = req.params.id;
  const { name, desc } = req.body;
  let unit;
  try {
    unit = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (err) {
    const error = new HttpError('更新单位失败，请稍后再试。', 500);
    return next(error);
  }
  if (!unit) {
    const error = new HttpError('未找到对应单位的信息。', 404);
    return next(error);
  }
  unit.name = name;
  unit.desc = desc;
  unit.update_at = Date.now;
  try {
    await unit.save();
  } catch (err) {
    const error = new HttpError('更新单位失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatUnit(unit));
};

/**
 *  根据单位 ID 删除单位
 */
const deleteById = async (req, res, next) => {
  const unitId = req.params.id;
  let unit;
  let commodity;
  try {
    unit = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取单位信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!unit) {
    const error = new HttpError('未找到对应单位的信息。', 404);
    return next(error);
  }
  try {
    commodity = await Commodity.findOne({ unit_id: unitId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (commodity) {
    const error = new HttpError('该单位下存在商品，无法删除。', 500);
    return next(error);
  }

  unit.deleted = true;
  unit.update_at = Date.now();
  try {
    await unit.save();
  } catch (err) {
    const error = new HttpError('删除单位失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json({ message: '删除成功' });
};

module.exports = {
  formatUnit,
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
