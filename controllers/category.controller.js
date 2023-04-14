const Category = require('../models/category');
const commodity = require('../models/commodity');
const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');

const formatCategory = category => ({
  id: category._id,
  name: category.name,
  desc: category.desc,
  create_at: moment(category.create_at).format('YYYY-MM-DD HH:MM:SS'),
  update_at: moment(category.update_at).format('YYYY-MM-DD HH:MM:SS')
});

/**
 * 获取所有分类
 */
const findAll = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({ deleted: false });
    console.log('categories', categories);
  } catch (err) {
    const error = new HttpError('获取分类列表失败，请稍后再试。', 500);
    return next(error);
  }

  res.json(categories.map(formatCategory));
};

/**
 * 根据分类 ID 获取分类
 */
const findById = async (req, res, next) => {
  const categoryId = req.params.id;
  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!category) {
    const error = new HttpError('未找到对应分类的信息。', 404);
    return next(error);
  }
  res.json(formatCategory(category));
};

/**
 * 新建分类
 */
const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let category;
  try {
    category = await Category.findOne({ name });
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (category) {
    const error = new HttpError('分类名称已存在。', 500);
    return next(error);
  }
  category = new Category({
    name,
    desc,
    deleted: false
  });
  try {
    await Category.create(category);
  } catch (err) {
    const error = new HttpError('创建分类失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatCategory(category));
};

/**
 * 更新分类信息
 */
const updateById = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name, desc } = req.body;
  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!category) {
    const error = new HttpError('未找到对应分类的信息。', 404);
    return next(error);
  }
  category.name = name;
  category.desc = desc;
  category.update_at = Date.now();
  try {
    await category.save();
  } catch (err) {
    const error = new HttpError('更新分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatCategory(category));
};

/**
 * 根据分类 ID 删除分类
 */
const deleteById = async (req, res, next) => {
  const categoryId = req.params.id;
  let category;
  let commodity;
  try {
    category = await Category.findOne({ _id: categoryId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!category) {
    const error = new HttpError('未找到对应分类的信息。', 404);
    return next(error);
  }

  try {
    commodity = await Commodity.findOne({ category: categoryId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取商品信息失败，请稍后再试。', 500);
    return next(error);
  }

  if (commodity) {
    const error = new HttpError('该分类下存在商品，无法删除。', 500);
    return next(error);
  }

  category.deleted = true;
  category.update_at = Date.now();

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError('删除分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json({ message: '分类信息删除成功' });
};

module.exports = {
  formatCategory,
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
