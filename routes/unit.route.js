const express = require('express');
const router = express.Router();
const unitCtrl = require('../controllers/unit.controller');

/**
 * 获取所有商品单位
 */
router.get('/', unitCtrl.findAll);

/**
 * 获取单个商品单位
 */
router.get('/:id', unitCtrl.findById);

/**
 * 创建新的商品单位
 */
router.post('/', unitCtrl.create);

/**
 * 更新商品单位
 */
router.put('/:id', unitCtrl.updateById);

/**
 * 删除商品单位
 */
router.delete('/remove', unitCtrl.remove);

module.exports = router;
