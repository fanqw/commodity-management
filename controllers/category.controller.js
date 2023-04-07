const { Category } = require('../models');
const HttpError = require('../utils/HttpError');

/**
 * 获取所有分类
 */
const findAll = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({ deleted: false });
        console.log('categories', categories);
    } catch (err) {
        const error = new HttpError(
            '获取分类列表失败，请稍后再试。',
            500
        );
        return next(error);
    }

    res.json(categories.map(category => category.toObject({ getters: true })));
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
        const error = new HttpError(
            '获取分类信息失败，请稍后再试。',
            500
        );
        return next(error);
    }

    if (!category) {
        const error = new HttpError(
            '未找到对应分类的信息。',
            404
        );
        return next(error);
    }

    res.json(category.toObject({ getters: true }));
};

/**
 * 新建分类
 */
const create = async (req, res, next) => {
    const { name, description } = req.body;

    const newCategory = new Category({
        name,
        description,
        deleted: false,
        create_at: Date.now()
    });

    try {
        await newCategory.save();
    } catch (err) {
        const error = new HttpError(
            '创建分类失败，请稍后再试。',
            500
        );
        return next(error);
    }

    res.status(201).json(newCategory);
};

/**
 * 更新分类信息
 */
const updateById = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    let category;
    try {
        category = await Category.findById(categoryId);
    } catch (err) {
        const error = new HttpError(
            '获取分类信息失败，请稍后再试。',
            500
        );
        return next(error);
    }

    if (!category) {
        const error = new HttpError(
            '未找到对应分类的信息。',
            404
        );
        return next(error);
    }

    category.name = name;
    category.description = description;

    try {
        await category.save();
    } catch (err) {
        const error = new HttpError(
            '更新分类信息失败，请稍后再试。',
            500
        );
        return next(error);
    }

    res.json(category.toObject({ getters: true }));
};

/**
 * 根据分类 ID 删除分类
 */
const deleteById = async (req, res, next) => {
    const categoryId = req.params.id;

    let category;
    try {
        category = await Category.findById(categoryId);
    } catch (err) {
        const error = new HttpError(
            '获取分类信息失败，请稍后再试。',
            500
        );
        return next(error);
    }

    if (!category) {
        const error = new HttpError(
            '未找到对应分类的信息。',
            404
        );
        return next(error);
    }

    category.isDeleted = true;

    try {
        await category.save();
    } catch (err) {
        const error = new HttpError(
            '删除分类信息失败，请稍后再试。',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: '分类信息删除成功' });
};

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById
}
