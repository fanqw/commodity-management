const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controllers/category.controller');

/**
 * 获取所有商品分类
 */
router.get('/', categoryCtrl.findAll);

/**
 * 获取单个商品分类
 */
router.get('/:id', categoryCtrl.findById);

/**
 * 创建新的商品分类
 */
router.post('/', categoryCtrl.create);

/**
 * 更新商品分类
 */
router.put('/:id', categoryCtrl.updateById);

/**
 * 删除商品分类
 */
router.delete('/remove', categoryCtrl.remove);

module.exports = router;
