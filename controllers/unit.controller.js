const moment = require('moment');
const Unit = require('../models/unit');
const Commodity = require('../models/commodity');

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
  } catch (error) {
    error.message = '获取单位列表失败，请稍后再试。';
    return next(error);
  }
  res.sendResponse(units.map(formatUnit));
};

const findById = async (req, res, next) => {
  const unitId = req.params.id;
  let unit = {};
  try {
    unit = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (error) {
    error.message = '获取单位信息失败，请稍后再试。';
    return next(error);
  }
  if (!unit) {
    const error = new Error('未找到对应单位的信息。');
    error.code = 404;
    return next(error);
  }
  res.sendResponse(formatUnit(unit));
};

const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let findUnitById;
  try {
    findUnitById = await Unit.findOne({ name, deleted: false });
  } catch (error) {
    error.message = '获取单位信息失败，请稍后再试';
    return next(error);
  }
  if (findUnitById) {
    return next(new Error('单位名称已存在'));
  }
  const unit = new Unit({
    name,
    desc,
    deleted: false
  });
  try {
    await unit.save();
  } catch (error) {
    error.message = '创建单位失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(unit, 200, '创建单位成功');
};

const updateById = async (req, res, next) => {
  const unitId = req.params.id;
  const { name, desc } = req.body;
  let findUnitById;
  let findUnitByName;
  try {
    findUnitById = await Unit.findOne({ _id: unitId, deleted: false });
  } catch (error) {
    error.message = '获取单位信息失败，请稍后再试';
    return next(error);
  }
  if (!findUnitById) {
    const error = new Error('未找到对应单位的信息');
    error.code = 404;
    return next(error);
  }
  if (name) {
    try {
      findUnitByName = await Unit.findOne({ name, deleted: false });
    } catch (error) {
      error.message = '获取单位信息失败，请稍后再试';
      return next(error);
    }
    if (findUnitByName && findUnitByName._id.toString() !== unitId) {
      return next(new Error('单位名称已存在'));
    }
    findUnitById.name = name;
  }
  findUnitById.desc = desc || findUnitById.desc;
  findUnitById.update_at = Date.now();
  try {
    await findUnitById.save();
  } catch (error) {
    error.message = '更新单位失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(formatUnit(findUnitById), 200, '更新单位成功');
};

const removeUnitById = async unitId => {
  let unit = null;
  unit = await Unit.findOne({ _id: unitId, deleted: false });
  if (!unit) {
    const error = new Error('未找到对应单位的信息');
    error.code = 404;
    throw error;
  }
  const commodity = await Commodity.findOne({ unit_id: unitId, deleted: false });
  if (commodity) {
    throw new Error('该单位下存在商品，无法删除。');
  }
  unit.deleted = true;
  unit.update_at = Date.now();
  try {
    await unit.save();
  } catch (error) {
    error.message = '删除单位失败，请稍后再试。';
    throw error;
  }
  return true;
};

const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    ids.forEach(async id => {
      await removeUnitById(id);
    });
  } catch (error) {
    error.message = '删除单位失败，请稍后再试';
    return next(error);
  }
  res.sendResponse(null, 200, '单位删除成功');
};

module.exports = {
  formatUnit,
  findAll,
  findById,
  create,
  updateById,
  remove
};
