const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');

/**
 * 获取所有订单信息
 */
router.get('/', orderCtrl.findAll);

/**
 * 获取单个订单信息
 */
router.get('/:id', orderCtrl.findById);

/**
 * 创建新的订单信息
 */
router.post('/', orderCtrl.create);

/**
 * 更新订单信息
 */
router.put('/:id', orderCtrl.updateById);

/**
 * 删除订单信息
 */
router.delete('/remove', orderCtrl.remove);

module.exports = router;
