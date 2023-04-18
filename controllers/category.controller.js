const Category = require('../models/category');
const Commodity = require('../models/commodity');
const moment = require('moment');

const formatCategory = category => ({
  id: category._id,
  name: category.name,
  desc: category.desc,
  create_at: category.create_at ? moment(category.create_at).format('YYYY-MM-DD HH:mm:ss') : undefined,
  update_at: category.update_at ? moment(category.update_at).format('YYYY-MM-DD HH:mm:ss') : undefined
});

const findAll = async (req, res, next) => {
  let categories = [];
  try {
    categories = await Category.find({ deleted: false });
  } catch (err) {
    err.message = '获取分类列表失败，请稍后再试';
    return next(err);
  }
  res.sendResponse(categories.map(formatCategory));
};

const findById = async (req, res, next) => {
  const categoryId = req.params.id;
  let category;
  try {
    category = await Category.findOne({ _id: categoryId, deleted: false });
  } catch (err) {
    err.message = '获取分类信息失败，请稍后再试';
    return next(err);
  }
  if (!category) {
    const error = new Error('未找到对应分类的信息');
    error.code = 404;
    return next(err);
  }
  res.sendResponse(formatCategory(category));
};

const create = async (req, res, next) => {
  const { name, desc } = req.body;
  let findCategory;
  try {
    findCategory = await Category.findOne({ name, deleted: false });
  } catch (err) {
    err.message = '获取分类信息失败，请稍后再试';
    return next(err);
  }
  if (findCategory) {
    return next(new Error('分类名称已存在'));
  }
  const category = new Category({
    name,
    desc,
    deleted: false
  });
  try {
    await category.save();
  } catch (err) {
    err.message = '创建失败，请稍后再试';
    return next(err);
  }
  res.sendResponse(category, 200, '创建成功');
};

const updateById = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name, desc } = req.body;
  let findCategoryById;
  let findCategoryByName;
  try {
    findCategoryById = await Category.findOne({ _id: categoryId, deleted: false });
  } catch (err) {
    err.message = '获取分类信息失败，请稍后再试';
    return next(err);
  }
  if (!findCategoryById) {
    const error = new Error('未找到对应分类的信息');
    error.code = 404;
    return next(error);
  }
  if (name) {
    try {
      findCategoryByName = await Category.findOne({ name, deleted: false });
    } catch (err) {
      err.message = '获取分类信息失败，请稍后再试';
      return next(err);
    }
    if (findCategoryByName && findCategoryByName._id.toString() !== categoryId) {
      return next(new Error('分类名称已存在'));
    }
    findCategoryById.name = name;
  }
  findCategoryById.desc = desc || findCategoryById.desc;
  findCategoryById.update_at = Date.now();
  try {
    await findCategoryById.save();
  } catch (err) {
    err.message = '更新分类信息失败，请稍后再试';
    return next(err);
  }
  res.sendResponse(formatCategory(findCategoryById), 200, '更新成功');
};

const removeCategoryById = async categoryId => {
  let category = null;
  try {
    category = await Category.findOne({ _id: categoryId, deleted: false });
  } catch (error) {
    // error.message = '获取分类信息失败，请稍后再试';
    throw error;
  }
  if (!category) {
    const error = new Error('未找到对应分类的信息');
    error.code = 404;
    throw error;
  }
  const commodity = await Commodity.findOne({ category_id: categoryId, deleted: false });
  if (commodity) {
    throw new Error('该分类下存在商品，无法删除');
  }
  category.deleted = true;
  category.update_at = Date.now();
  try {
    await category.save();
  } catch (err) {
    throw new Error('删除分类信息失败，请稍后再试');
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
    return next(err);
  }
  res.sendResponse(null, 200, '分类信息删除成功');
};

module.exports = {
  formatCategory,
  findAll,
  findById,
  create,
  updateById,
  remove
};
