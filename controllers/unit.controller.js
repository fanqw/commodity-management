const Unit = require('../models/unit');
const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');

const formatUnit = unit => ({
  id: unit._id,
  name: unit.name,
  desc: unit.desc,
  create_at: unit.create_at ? moment(unit.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: unit.update_at ? moment(unit.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let units = [];
  try {
    units = await Unit.find({ deleted: false });
  } catch (err) {
    err.code = 500;
    err.message = '获取单位列表失败，请稍后再试。';
    return next(err);
  }
  res.sendResponse(units.map(formatUnit));
};

const findById = async (req, res, next) => {
  const unitId = req.params.id;
  let unit = {};
  try {
    unit = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (err) {
    const error = new Error('获取单位信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!unit) {
    const error = new HttpError('未找到对应单位的信息。', 404);
    return next(error);
  }
  res.status(200).json({ code: 200, data: formatUnit(unit) });
};

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
  const newUnit = new Unit({
    name,
    desc,
    deleted: false
  });
  try {
    await newUnit.save();
  } catch (err) {
    const error = new HttpError('创建单位失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatUnit(newUnit));
};

const updateById = async (req, res, next) => {
  const unitId = req.params.id;
  const { name, desc } = req.body;
  let unitById;
  let unitByName;
  try {
    unitById = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (err) {
    const error = new HttpError('更新单位失败，请稍后再试。', 500);
    return next(error);
  }
  if (!unitById) {
    const error = new HttpError('未找到对应单位的信息。', 404);
    return next(error);
  }
  if (name) {
    try {
      unitByName = await Unit.findOne({ name, deleted: false });
    } catch (err) {
      const error = new HttpError('获取单位信息失败，请稍后再试。', 500);
      return next(error);
    }
    if (unitByName && unitByName._id.toString() !== unitId) {
      const error = new HttpError('单位名称已存在。', 500);
      return next(error);
    }
    unitById.name = name;
  }
  unitById.desc = desc || unitById.desc;
  unitById.update_at = Date.now();
  try {
    await unitById.save();
  } catch (err) {
    const error = new HttpError('更新单位失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatUnit(unitById));
};

const removeUnitById = async unitId => {
  const unit = await Unit.findOne({ _id: unitId, deleted: false });
  if (!unit) {
    throw new Error('未找到对应单位的信息。');
  }
  const commodity = await Commodity.findOne({ unit_id: unitId, deleted: false });
  if (commodity) {
    throw new Error('该单位下存在商品，无法删除。');
  }
  unit.deleted = true;
  unit.update_at = Date.now();
  try {
    await unit.save();
  } catch (err) {
    throw new Error('删除单位失败，请稍后再试。');
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await removeUnitById(id);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: '单位删除成功' });
};

module.exports = {
  formatUnit,
  findAll,
  findById,
  create,
  updateById,
  remove
};
