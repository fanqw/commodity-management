const express = require('express');
const router = express.Router();
const commodityCtrl = require('../controllers/commodity.controller');

/**
 * 获取所有商品
 */
router.get('/', commodityCtrl.findAll);

/**
 * 获取单个商品
 */
router.get('/:id', commodityCtrl.findById);

/**
 * 创建新的商品
 */
router.post('/', commodityCtrl.create);

/**
 * 更新商品
 */
router.put('/:id', commodityCtrl.updateById);

/**
 * 删除商品
 */
router.delete('/:id', commodityCtrl.deleteById);

module.exports = router;
