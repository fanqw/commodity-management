const Category = require('../models/category');
const Commodity = require('../models/commodity');
const HttpError = require('../utils/HttpError');
const moment = require('moment');

const formatCategory = category => ({
  id: category._id,
  name: category.name,
  desc: category.desc,
  create_at: category.create_at ? moment(category.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: category.update_at ? moment(category.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({ deleted: false });
  } catch (err) {
    const error = new HttpError('获取分类列表失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(categories.map(formatCategory));
};

const findById = async (req, res, next) => {
  const categoryId = req.params.id;
  let category;
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
  res.status(200).json(formatCategory(category));
};

const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let category;
  try {
    category = await Category.findOne({ name, deleted: false });
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (category) {
    const error = new HttpError('分类名称已存在。', 500);
    return next(error);
  }
  const newCategory = new Category({
    name,
    desc,
    deleted: false
  });
  try {
    await newCategory.save();
  } catch (err) {
    const error = new HttpError('创建分类失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(201).json(formatCategory(newCategory));
};

const updateById = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name, desc } = req.body;
  let categoryById;
  let categoryByName;
  try {
    categoryById = await Category.findOne({ _id: categoryId, deleted: false });
  } catch (err) {
    const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  if (!categoryById) {
    const error = new HttpError('未找到对应分类的信息。', 404);
    return next(error);
  }
  if (name) {
    try {
      categoryByName = await Category.findOne({ name, deleted: false });
    } catch (err) {
      const error = new HttpError('获取分类信息失败，请稍后再试。', 500);
      return next(error);
    }
    if (categoryByName && categoryByName._id.toString() !== categoryId) {
      const error = new HttpError('分类名称已存在。', 500);
      return next(error);
    }
    categoryById.name = name;
  }
  categoryById.desc = desc || categoryById.desc;
  categoryById.update_at = Date.now();
  try {
    await categoryById.save();
  } catch (err) {
    const error = new HttpError('更新分类信息失败，请稍后再试。', 500);
    return next(error);
  }
  res.status(200).json(formatCategory(categoryById));
};

const removeCategoryById = async categoryId => {
  const category = await Category.findOne({ _id: categoryId, deleted: false });
  if (!category) {
    throw new Error('未找到对应分类的信息。');
  }
  const commodity = await Commodity.findOne({ category_id: categoryId, deleted: false });
  if (commodity) {
    throw new Error('该分类下存在商品，无法删除。');
  }
  category.deleted = true;
  category.update_at = Date.now();
  try {
    await category.save();
  } catch (err) {
    throw new Error('删除分类信息失败，请稍后再试。');
  }
  return true;
};

/**
 * 根据分类 ID 删除分类
 */
const remove = async (req, res, next) => {
  const { ids } = req.body;
  try {
    for (const id of ids) {
      await removeCategoryById(id);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
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
  remove
};
